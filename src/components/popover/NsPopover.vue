<template>
  <span ref="rootRef" class="ns-popover">
    <span ref="triggerRef" class="ns-popover__trigger" :aria-expanded="modelValue" :aria-haspopup="interactive ? 'dialog' : undefined" @click="handleTriggerClick" @mouseenter="handleTriggerEnter" @mouseleave="handleTriggerLeave" @focusin="handleTriggerEnter">
      <slot name="reference" :open="modelValue" :toggle="toggle" />
    </span>
    <Teleport to="body">
      <Transition name="ns-popper">
        <div v-if="modelValue" ref="panelRef" class="ns-popover__panel" :class="{ 'is-interactive': interactive }" :style="panelStyle" role="dialog" :aria-modal="interactive ? 'false' : undefined" @mouseenter="handlePanelEnter" @mouseleave="handlePanelLeave">
          <slot />
        </div>
      </Transition>
    </Teleport>
  </span>
</template>
<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { NsPlacement } from '../overlay/types'
import { getOverlayPosition } from '../overlay/position'

defineOptions({ name: 'NsPopover' })
const props = withDefaults(defineProps<{ modelValue: boolean; trigger?: 'click' | 'hover' | 'manual'; placement?: NsPlacement; offset?: number; width?: string | number; maxHeight?: string | number; showArrow?: boolean; interactive?: boolean; openDelay?: number; closeDelay?: number }>(), { trigger: 'click', placement: 'top', offset: 8, showArrow: false, interactive: false, openDelay: 0, closeDelay: 100 })
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; show: []; hide: [] }>()
const rootRef = ref<HTMLElement>(); const triggerRef = ref<HTMLElement>(); const panelRef = ref<HTMLElement>(); const panelStyle = ref<CSSProperties>({})
let openTimer: number | undefined; let closeTimer: number | undefined
function setOpen(value: boolean) { window.clearTimeout(openTimer); window.clearTimeout(closeTimer); if (value && props.openDelay) openTimer = window.setTimeout(() => doOpen(true), props.openDelay); else if (!value && props.closeDelay) closeTimer = window.setTimeout(() => doOpen(false), props.closeDelay); else doOpen(value) }
function doOpen(value: boolean) { if (value === props.modelValue) return; emit('update:modelValue', value); value ? emit('show') : emit('hide') }
function toggle() { setOpen(!props.modelValue) }
function handleTriggerClick() { if (props.trigger === 'click') toggle() }
function handleTriggerEnter() { if (props.trigger === 'hover') setOpen(true) }
function handleTriggerLeave() { if (props.trigger === 'hover') setOpen(false) }
function handlePanelEnter() { if (props.trigger === 'hover') setOpen(true) }
function handlePanelLeave() { if (props.trigger === 'hover') setOpen(false) }
function updatePosition() { const anchor = triggerRef.value?.getBoundingClientRect(); const panel = panelRef.value; if (!anchor || !panel) return; const result = getOverlayPosition(anchor, { width: panel.offsetWidth, height: panel.offsetHeight }, props.placement, props.offset); panelStyle.value = { left: `${result.left}px`, top: `${result.top}px`, width: typeof props.width === 'number' ? `${props.width}px` : props.width, maxHeight: typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight } }
function outside(event: MouseEvent) { if (!rootRef.value?.contains(event.target as Node) && !panelRef.value?.contains(event.target as Node)) setOpen(false) }
function keydown(event: KeyboardEvent) { if (event.key === 'Escape' && props.modelValue) { event.preventDefault(); setOpen(false) } }
watch(() => props.modelValue, (open) => { if (open) { nextTick(updatePosition); window.addEventListener('resize', updatePosition); window.addEventListener('scroll', updatePosition, true); document.addEventListener('mousedown', outside); document.addEventListener('keydown', keydown) } else { window.removeEventListener('resize', updatePosition); window.removeEventListener('scroll', updatePosition, true); document.removeEventListener('mousedown', outside); document.removeEventListener('keydown', keydown) } })
onBeforeUnmount(() => { window.clearTimeout(openTimer); window.clearTimeout(closeTimer); window.removeEventListener('resize', updatePosition); window.removeEventListener('scroll', updatePosition, true); document.removeEventListener('mousedown', outside); document.removeEventListener('keydown', keydown) })
defineExpose({ open: () => setOpen(true), close: () => setOpen(false), updatePosition })
</script>
<style src="../../styles/theme.css"></style>
<style scoped>
.ns-popover { display: inline-flex; } .ns-popover__trigger { display: inline-flex; } .ns-popover__panel { position: fixed; z-index: calc(var(--ns-overlay-z-index) + 2); max-width: min(420px, calc(100vw - 16px)); overflow: auto; padding: 12px; color: var(--ns-text-color-primary); background: var(--ns-bg-elevated); border: 1px solid var(--ns-border-color); border-radius: var(--ns-radius-lg); box-shadow: var(--ns-shadow-overlay); outline: none; } .ns-popover__panel.is-interactive { pointer-events: auto; } .ns-popper-enter-active, .ns-popper-leave-active { transition: opacity var(--ns-motion-fast) var(--ns-motion-easing), transform var(--ns-motion-fast) var(--ns-motion-easing); } .ns-popper-enter-from, .ns-popper-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
