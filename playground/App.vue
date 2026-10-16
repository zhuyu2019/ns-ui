<script setup lang="ts">
import { NsButton, NsDialog, NsDropdown, NsDropdownItem, NsIcon, NsPopover } from '../src'
import type { ButtonTone, ButtonVariant } from '../src'

const dark = ref(false)
const loading = ref(false)
const pressed = ref(false)
const clicks = ref(0)
const dialogOpen = ref(false)
const dialogGuarded = ref(false)
const dropdownOpen = ref(false)
const popoverOpen = ref(false)
const selectedAction = ref('尚未选择')
const variants: ButtonVariant[] = ['solid', 'soft', 'outline', 'ghost', 'link']
const tones: ButtonTone[] = ['default', 'primary', 'success', 'warning', 'danger', 'info']

function toggleTheme(): void {
  dark.value = !dark.value
  document.documentElement.classList.toggle('dark', dark.value)
}

function selectAction(value: unknown): void {
  selectedAction.value = String(value)
}

function confirmClose(): boolean {
  return window.confirm('确认关闭这个弹框吗？')
}
</script>

<template>
  <main>
    <header>
      <div>
        <h1>NS UI</h1>
        <p>Vue 3 基础组件库 · 独立主题与离线图标</p>
      </div>
      <NsButton icon="nuist:theme-dark" data-testid="theme" @click="toggleTheme">
        {{ dark ? '切换浅色' : '切换深色' }}
      </NsButton>
    </header>
    <section class="demo-section">
      <h2>按钮外观与语义色</h2>
      <div v-for="variant in variants" :key="variant" class="row matrix">
        <code>{{ variant }}</code>
        <NsButton
          v-for="tone in tones"
          :key="tone"
          :variant="variant"
          :tone="tone"
          :data-testid="`matrix-${variant}-${tone}`"
          icon="nuist:save"
        >
          {{ tone }}
        </NsButton>
      </div>
    </section>
    <section class="demo-section">
      <h2>尺寸与内容</h2>
      <div class="row">
        <NsButton v-for="size in ['xs', 'sm', 'md', 'lg'] as const" :key="size" :size="size">
          {{ size }}
        </NsButton>
        <NsButton icon="nuist:add" shape="circle" aria-label="新增" />
        <NsButton icon="nuist:arrow-right" icon-position="end">下一步</NsButton>
      </div>
    </section>
    <section class="demo-section">
      <h2>交互与状态</h2>
      <div class="row">
        <NsButton data-testid="count" @click="clicks++">点击 {{ clicks }}</NsButton>
        <NsButton data-testid="loading" :loading="loading" tone="primary" variant="solid"
          >保存内容</NsButton
        >
        <NsButton data-testid="toggle-loading" @click="loading = !loading">切换加载</NsButton>
        <NsButton disabled>禁用操作</NsButton>
        <NsButton :pressed="pressed" @click="pressed = !pressed">显式切换</NsButton>
        <NsButton motion="press">按压动效</NsButton>
        <NsButton motion="none">关闭动效</NsButton>
      </div>
      <p>纯文字加载按钮需从初始 false 持续绑定 loading，预留图标空间。键盘 Tab 显示焦点。</p>
    </section>
    <section class="demo-section">
      <h2>离线图标</h2>
      <div class="row icons">
        <NsIcon
          v-for="icon in ['paper-library', 'copy', 'workflow', 'refresh', 'ssh', 'save']"
          :key="icon"
          :icon="`nuist:${icon}`"
          :size="28"
          :aria-label="icon"
        />
      </div>
      <p>本页使用组件库自身主题，不加载 Electron、Element Plus 或业务接口。</p>
    </section>
    <section class="demo-section">
      <h2>弹层组件</h2>
      <div class="row">
        <NsButton icon="nuist:add" variant="solid" tone="primary" @click="dialogOpen = true">
          打开弹框
        </NsButton>
        <NsButton variant="outline" @click="dialogGuarded = true">打开关闭拦截</NsButton>
        <NsDropdown v-model="dropdownOpen" @select="selectAction">
          <template #trigger>
            <NsButton icon="nuist:arrow-down">下拉菜单</NsButton>
          </template>
          <NsDropdownItem value="复制内容" shortcut="Ctrl+C">
            <template #icon><NsIcon icon="nuist:copy" /></template>
            复制内容
          </NsDropdownItem>
          <NsDropdownItem value="刷新数据" divided>
            <template #icon><NsIcon icon="nuist:refresh" /></template>
            刷新数据
          </NsDropdownItem>
          <NsDropdownItem value="删除记录" tone="danger">删除记录</NsDropdownItem>
        </NsDropdown>
        <NsPopover v-model="popoverOpen" placement="bottom-start" show-arrow>
          <template #reference>
            <NsButton icon="nuist:help">点击查看 Popover</NsButton>
          </template>
          <strong>这是 NsPopover</strong>
          <p class="popover-copy">支持定位、Escape 关闭和点击外部关闭。</p>
        </NsPopover>
      </div>
      <p class="selection-result">当前选择：{{ selectedAction }}</p>
    </section>

    <NsDialog v-model="dialogOpen" title="NsDialog 示例" description="这是一个可滚动的内容区域。">
      <p>弹框支持标题、描述、默认插槽和底部操作区。</p>
      <div class="dialog-fill">调整窗口大小或填充更多内容时，正文区域会独立滚动。</div>
      <template #footer>
        <NsButton @click="dialogOpen = false">取消</NsButton>
        <NsButton variant="solid" tone="primary" @click="dialogOpen = false">确认</NsButton>
      </template>
    </NsDialog>

    <NsDialog
      v-model="dialogGuarded"
      title="关闭前拦截"
      close-on-outside
      :before-close="confirmClose"
    >
      <p>点击右上角、Escape 或遮罩时会先触发 beforeClose。</p>
    </NsDialog>
  </main>
</template>

<style>
body {
  margin: 0;
  min-width: 320px;
  background: var(--ns-bg-color);
  color: var(--ns-text-color-primary);
  font:
    14px/1.6 'Microsoft YaHei',
    sans-serif;
}
main {
  max-width: 1100px;
  padding: 32px;
  margin: auto;
}
header,
.row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
header {
  justify-content: space-between;
}
h1 {
  font-size: 30px;
  margin: 0;
}
h2 {
  font-size: 18px;
}
p {
  color: var(--ns-text-color-regular);
}
.demo-section {
  margin-top: 28px;
  padding: 24px;
  border: 1px solid var(--ns-border-color);
  border-radius: 12px;
}
.selection-result {
  margin: 14px 0 0;
  padding: 10px 12px;
  border-radius: 6px;
  background: var(--ns-fill-color-light);
}
.popover-copy {
  margin: 6px 0 0;
  color: var(--ns-text-color-regular);
}
.dialog-fill {
  min-height: 180px;
  padding: 16px;
  margin-top: 16px;
  border: 1px dashed var(--ns-border-color-strong);
  border-radius: 6px;
  color: var(--ns-text-color-regular);
}
.matrix {
  margin: 16px 0;
}
code {
  width: 60px;
}
.icons {
  gap: 28px;
}
</style>
