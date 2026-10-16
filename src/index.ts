import type { App, Plugin } from 'vue'
import NsButton from './components/button/NsButton.vue'
import NsIcon from './components/icon/NsIcon.vue'
import NsDialog from './components/dialog/NsDialog.vue'
import NsDropdown from './components/dropdown/NsDropdown.vue'
import NsDropdownItem from './components/dropdown/NsDropdownItem.vue'
import NsPopover from './components/popover/NsPopover.vue'

export { NsButton, NsIcon, NsDialog, NsDropdown, NsDropdownItem, NsPopover }
export type { ButtonMotion, ButtonSize, ButtonTone, ButtonVariant } from './components/button/types'
export type { NsCloseReason, NsPlacement } from './components/overlay/types'
export type { NuistIconId } from './icons/resolve'
export {
  getNuistIconId,
  isNuistIconId,
  normalizeNuistIconName,
  resolveFileIcon,
  resolveNuistIcon,
} from './icons/resolve'

/** 可选的整库注册；默认推荐按需导入组件。 */
const NsUI: Plugin = {
  install(app: App) {
    app.component('NsButton', NsButton)
    app.component('NsIcon', NsIcon)
    app.component('NsDialog', NsDialog)
    app.component('NsDropdown', NsDropdown)
    app.component('NsDropdownItem', NsDropdownItem)
    app.component('NsPopover', NsPopover)
  },
}
export default NsUI
