// 类型声明引用的 JSON 必须随包分发，不能依赖源码目录。
import { mkdirSync, copyFileSync } from 'node:fs'
mkdirSync('dist/types/icons/data', { recursive: true })
copyFileSync('src/icons/data/icon-data.json', 'dist/types/icons/data/icon-data.json')
