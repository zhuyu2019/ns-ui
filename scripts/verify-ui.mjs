// 验证已构建的独立预览，不启动或操作桌面应用。
import { preview } from 'vite'
import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import assert from 'node:assert/strict'

const output = resolve('artifacts/verification')
const server = await preview({
  mode: 'playground',
  preview: { host: '127.0.0.1', port: 5195, strictPort: false },
})
let browser
try {
  await mkdir(output, { recursive: true })
  browser = await chromium.launch({
    channel: process.env.NUIST_BROWSER_CHANNEL || 'msedge',
    headless: true,
  })
  const page = await browser.newPage({ viewport: { width: 1280, height: 1100 } })
  const errors = []
  const externalRequests = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.text().includes('[Vue warn]')) errors.push(message.text())
  })
  await page.route('**/*', (route) => {
    const url = new URL(route.request().url())
    if (url.hostname === '127.0.0.1') return route.continue()
    externalRequests.push(url.origin)
    return route.abort()
  })
  await page.goto(server.resolvedUrls.local[0])
  const test = (id) => page.getByTestId(id)
  await test('matrix-solid-primary').waitFor()
  assert.equal(await page.locator('.matrix button').count(), 30)
  assert.equal(await page.locator('.icons svg').count(), 6)
  const themes = []
  for (const dark of [false, true]) {
    if (dark) await test('theme').click()
    await page.mouse.move(0, 0)
    await page.waitForTimeout(150)
    const styles = await test('matrix-solid-primary').evaluate((node) => {
      const css = getComputedStyle(node)
      const body = getComputedStyle(document.body)
      return { color: css.color, background: css.backgroundColor, body: body.backgroundColor }
    })
    assert.notEqual(styles.color, styles.background)
    assert.notEqual(styles.background, 'rgba(0, 0, 0, 0)')
    themes.push(styles)
    await page.screenshot({
      path: resolve(output, dark ? 'dark.png' : 'light.png'),
      fullPage: true,
    })
  }
  assert.notEqual(themes[0].body, themes[1].body)
  await test('count').focus()
  await page.keyboard.press('Enter')
  await page.keyboard.press('Space')
  assert.equal((await test('count').textContent()).trim(), '点击 2')
  const width = (await test('loading').boundingBox()).width
  await test('toggle-loading').click()
  assert.equal(await test('loading').isDisabled(), true)
  assert.equal(await test('loading').getAttribute('aria-busy'), 'true')
  assert.equal((await test('loading').boundingBox()).width, width)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const animation = await test('loading')
    .locator('svg')
    .evaluate((node) => getComputedStyle(node).animationName)
  assert.equal(animation, 'none')
  assert.deepEqual(errors, [])
  assert.deepEqual(externalRequests, [])
  await writeFile(
    resolve(output, 'result.json'),
    JSON.stringify(
      {
        passed: [
          '独立构建预览、30 种按钮与离线图标',
          '明暗回退主题',
          'Enter/Space、加载宽度和禁用',
          '减少动态效果、无宿主依赖与外部请求',
        ],
        errors,
        externalRequests,
      },
      null,
      2,
    ) + '\n',
  )
  console.log('独立组件库浏览器验证通过，截图位于 artifacts/verification。')
} finally {
  await browser?.close()
  await server.close()
}
