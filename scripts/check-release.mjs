import { readFileSync } from 'node:fs'
const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
const notes = JSON.parse(readFileSync('release-notes.json', 'utf8'))
if (notes[0]?.version !== pkg.version) throw new Error('组件库版本与更新记录不一致')
console.log(`组件库版本与更新记录检查通过：${pkg.version}`)
