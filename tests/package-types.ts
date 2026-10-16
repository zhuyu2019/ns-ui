// 仅依据公开发布入口校验类型，禁止依赖组件库自动导入声明。
import NsUI, { NsButton, NsIcon, resolveNuistIcon } from 'ns-ui'
import type { ButtonTone, NuistIconId } from 'ns-ui'
import type { App } from 'vue'

const button = null! as InstanceType<typeof NsButton>
button.focus({ preventScroll: true })
button.blur()
const nativeButton: HTMLButtonElement | undefined = button.buttonRef
const props: InstanceType<typeof NsButton>['$props'] = { tone: 'primary', loading: false }
const iconProps: InstanceType<typeof NsIcon>['$props'] = { icon: 'nuist:save', size: 24 }
const tone: ButtonTone = 'danger'
const icon: NuistIconId = 'copy'
resolveNuistIcon(icon)
NsUI.install?.(null! as App)
void [nativeButton, props, iconProps, tone]
