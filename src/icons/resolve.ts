import iconData from './data/icon-data.json'
import fileExtensions from './data/file-extensions.json'
import type { IconifyIcon } from '@iconify/vue'

export type NuistIconId = keyof typeof iconData

// 仅归并含义一致的旧名称；库入口、工具调用等歧义名称在使用位置明确指定。
const legacyGroups: Partial<Record<NuistIconId, string[]>> = {
  add: ['add', 'add-circle'],
  close: ['close', 'close-large'],
  check: ['check'],
  edit: ['edit', 'edit-2', 'edit-box', 'pencil'],
  delete: ['delete-bin', 'delete-bin-2', 'delete-bin-5', 'delete-bin-6'],
  copy: ['file-copy', 'file-copy-2', 'file-copy-3'],
  cut: ['scissors', 'scissors-2', 'scissors-cut'],
  paste: ['clipboard'],
  save: ['save', 'save-2', 'save-3'],
  search: ['search', 'search-2', 'search-eye'],
  'search-text': ['text-search'],
  refresh: ['refresh'],
  more: ['more', 'more-2'],
  upload: ['upload', 'upload-2'],
  download: ['download', 'download-2', 'file-download'],
  share: ['share', 'share-2', 'share-forward'],
  'external-link': ['external-link'],
  link: ['link', 'links'],
  unlink: ['link-unlink', 'link-unlink-m'],
  'arrow-left': ['arrow-left'],
  'arrow-right': ['arrow-right', 'arrow-right-circle'],
  'arrow-up': ['arrow-up'],
  'arrow-down': ['arrow-down'],
  'chevron-left': ['arrow-left-s', 'arrow-left-wide'],
  'chevron-right': ['arrow-right-s', 'arrow-right-wide'],
  'chevron-up': ['arrow-up-s', 'arrow-up-wide'],
  'chevron-down': ['arrow-down-s', 'arrow-down-wide'],
  'window-minimize': ['subtract'],
  'window-maximize': ['fullscreen'],
  'window-restore': ['fullscreen-exit'],
  pin: ['pushpin', 'pushpin-2'],
  unpin: ['unpin'],
  'sidebar-left': ['layout-left'],
  'sidebar-right': ['layout-right'],
  'list-view': ['list-check-2'],
  'grid-view': ['layout-grid', 'grid', 'apps', 'function'],
  menu: ['menu', 'menu-2', 'menu-3'],
  send: ['send-plane', 'send-plane-2'],
  stop: ['stop', 'stop-circle'],
  play: ['play', 'play-circle'],
  pause: ['pause', 'pause-circle'],
  loading: ['loader', 'loader-2', 'loader-3', 'loader-4', 'loader-5'],
  success: ['checkbox-circle', 'check-double'],
  warning: ['alert', 'error-warning'],
  error: ['close-circle'],
  info: ['information'],
  help: ['question'],
  blocked: ['forbid', 'forbid-2', 'prohibited'],
  folder: ['folder', 'folder-2', 'folder-3'],
  'folder-open': ['folder-open'],
  'folder-add': ['folder-add'],
  'file-add': ['file-add'],
  history: ['history'],
  undo: ['arrow-go-back'],
  redo: ['arrow-go-forward'],
  preview: ['eye'],
  'preview-hide': ['eye-off'],
  bookmark: ['bookmark'],
  favorite: ['star', 'heart-3'],
  filter: ['filter', 'filter-2', 'filter-3'],
  sort: ['sort-asc', 'sort-desc', 'arrow-up-down'],
  user: ['user', 'user-3'],
  'user-add': ['user-add'],
  group: ['group', 'team'],
  chat: ['chat-1', 'chat-3', 'message-2', 'message-3', 'question-answer'],
  logout: ['logout-box-r', 'logout-circle-r'],
  lock: ['lock', 'lock-2'],
  unlock: ['lock-unlock'],
  key: ['key', 'key-2'],
  notification: ['notification', 'notification-2', 'notification-3'],
  mail: ['mail'],
  phone: ['phone'],
  location: ['map-pin', 'map-pin-2'],
  'thumb-up': ['thumb-up'],
  'image-add': ['image-add'],
  camera: ['camera'],
  microphone: ['mic', 'mic-2'],
  video: ['video', 'vidicon', 'video-on'],
  audio: ['music-2', 'volume-down'],
  emoji: ['emotion', 'emotion-happy'],
  'theme-light': ['sun'],
  'theme-dark': ['moon'],
  translate: ['translate', 'translate-2'],
  time: ['time', 'timer'],
  command: ['slash-commands'],
  network: ['organization-chart'],
  database: ['database', 'database-2', 'database-off'],
  plug: ['plug', 'plug-2', 'plugin', 'puzzle'],
  assistant: ['robot', 'ai-generate'],
  subagent: ['robot-2'],
  thinking: ['atom'],
  memory: ['brain'],
  tools: ['tools'],
  workflow: ['node-tree', 'folder-tree', 'tree'],
  'task-list': ['list-check', 'list-check-3', 'checkbox-multiple'],
  'file-read': ['read'],
  'file-edit': ['file-edit', 'write', 'list-plus'],
  diagnostics: ['bug', 'bug-2'],
  settings: ['settings', 'settings-2', 'settings-3', 'settings-4', 'user-settings'],
  dashboard: ['dashboard', 'dashboard-2', 'layout'],
  appearance: ['layout-4', 'palette'],
  usage: ['bar-chart-grouped', 'bar-chart-box', 'coin'],
  'cpu-usage': ['cpu'],
  'memory-usage': ['memory'],
  'disk-usage': ['hard-drive', 'hard-drive-2', 'hard-drive-3'],
  server: ['server'],
  browser: ['global'],
  terminal: ['terminal-box', 'terminal-window'],
  review: ['file-search', 'git-pull-request'],
  file: ['file', 'file-3'],
  note: ['sticky-note'],
  'file-text': ['file-text', 'article', 'file-info'],
  'file-pdf': ['file-pdf', 'file-pdf-2'],
  'file-markdown': ['markdown'],
  'file-code': ['file-code', 'braces'],
  'file-json': ['file-json'],
  'file-image': ['file-image'],
  'file-video': ['file-video'],
  'file-audio': ['file-music'],
  'file-archive': ['file-zip'],
  'file-word': ['file-word', 'file-word-2'],
  'file-spreadsheet': ['file-excel', 'file-excel-2'],
  'file-presentation': ['file-ppt', 'file-ppt-2'],
  heading: ['heading'],
  bold: ['bold'],
  italic: ['italic'],
  strikethrough: ['strikethrough'],
  'font-family': ['font-family', 'font-size'],
  'text-color': ['font-color'],
  highlight: ['mark-pen'],
  'align-left': ['align-left'],
  'align-center': ['align-center'],
  'align-right': ['align-right'],
  'list-unordered': ['list-unordered'],
  'list-ordered': ['list-ordered'],
  quote: ['double-quotes-l', 'double-quotes-r'],
  'code-block': ['code-box', 'code-block'],
  'source-code': ['code', 'code-s-slash'],
  'horizontal-rule': ['separator'],
  image: ['image'],
  table: ['table', 'table-2'],
  formula: ['functions', 'formula'],
  'wrap-text': ['text-wrap', 'wrap-text'],
  pen: ['pen-nib', 'pencil-ruler'],
  highlighter: ['highlighter'],
  eraser: ['eraser'],
  'shape-rectangle': ['rectangle'],
  'shape-circle': ['circle', 'checkbox-blank-circle'],
  'shape-triangle': ['triangle'],
  'shape-polygon': ['pentagon'],
  selection: ['cursor'],
  hand: ['hand'],
  crop: ['crop'],
  move: ['drag-move', 'drag-move-2'],
  'zoom-in': ['zoom-in'],
  'zoom-out': ['zoom-out'],
  'fit-width': ['expand-left-right'],
  'conversation-branch': ['git-branch'],
  'remote-upload': ['upload-cloud-2'],
  'folder-lock': ['folder-lock'],
  'security-check': ['shield-check'],
  'security-error': ['shield-cross'],
  'process-signal': ['pulse'],
  restart: ['restart'],
  'runtime-log': ['file-list-3'],
}
const legacyAliases = new Map<string, NuistIconId>()
for (const [id, names] of Object.entries(legacyGroups)) {
  for (const name of names) legacyAliases.set(name, id as NuistIconId)
}

export function isNuistIconId(value: string): value is NuistIconId {
  return Object.hasOwn(iconData, value)
}

export function getNuistIconId(value: string): NuistIconId | undefined {
  const name = value.trim()
  if (name.startsWith('nuist:') || name.startsWith('nuist-icon-')) {
    const id = name.startsWith('nuist:') ? name.slice(6) : name.slice(11)
    return isNuistIconId(id) ? id : undefined
  }
  if (name.startsWith('ri:') || name.startsWith('ri-')) {
    return legacyAliases.get(name.slice(3).replace(/-(line|fill)$/, ''))
  }
  if (name.includes(':')) return undefined
  if (isNuistIconId(name)) return name
  return legacyAliases.get(name.replace(/-(line|fill)$/, ''))
}

export function resolveNuistIcon(value: string): IconifyIcon | string {
  const id = getNuistIconId(value)
  if (id) return iconData[id]
  // 未知本地标识用本地帮助图标兜底，避免请求不存在的远程资源。
  if (value.startsWith('nuist:') || value.startsWith('nuist-icon-')) return iconData.help
  return value
}

export function normalizeNuistIconName(value: string, fallback = 'nuist:tools'): string {
  const id = getNuistIconId(value)
  if (id) return `nuist:${id}`
  return value.includes(':') && !value.startsWith('nuist:') ? value : fallback
}

export function resolveFileIcon(path: string): string {
  const basename = path.split(/[\\/]/).pop()?.split(/[?#]/)[0] || ''
  const dot = basename.lastIndexOf('.')
  const extension = dot > 0 ? basename.slice(dot + 1).toLowerCase() : ''
  const id = (fileExtensions as Record<string, string>)[extension] || 'file'
  return `nuist:${id}`
}
