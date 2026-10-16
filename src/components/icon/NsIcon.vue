<!-- 图标组件 -->
<template>
  <Icon
    v-if="icon"
    :icon="resolvedIcon"
    v-bind="bindAttrs"
    :ssr="typeof resolvedIcon !== 'string'"
    class="ns-icon"
    :aria-hidden="decorative ? 'true' : attrs['aria-hidden']"
    :role="decorative ? undefined : attrs.role"
  />
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { resolveNuistIcon } from '../../icons/resolve'

defineOptions({ name: 'NsIcon', inheritAttrs: false })

interface Props {
  /** 本地语义标识或兼容的Iconify名称 */
  icon?: string
  /** 图标尺寸 */
  size?: number | string
  /** 仅用于装饰时隐藏辅助技术；提供 aria-label 时默认应传 false。 */
  decorative?: boolean
}

const props = defineProps<Props>()

const attrs = useAttrs()
const resolvedIcon = computed(() => resolveNuistIcon(props.icon || ''))
const decorative = computed(() => props.decorative === true)

const normalizedSize = computed(() => {
  if (props.size === undefined || props.size === null || props.size === '') return undefined
  return typeof props.size === 'number' ? `${props.size}px` : props.size
})

const bindAttrs = computed(() => ({
  ...attrs,
  ...(normalizedSize.value ? { width: normalizedSize.value, height: normalizedSize.value } : {}),
}))
</script>

<style src="../../styles/theme.css"></style>
<style scoped>
.ns-icon {
  display: inline-block;
  flex: 0 0 auto;
  vertical-align: middle;
}
</style>
