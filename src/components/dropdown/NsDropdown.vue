<template>
  <div ref="rootRef" class="ns-dropdown">
    <span ref="triggerRef" class="ns-dropdown__trigger" :aria-expanded="modelValue" aria-haspopup="menu" @click="toggle">
      <slot name="trigger" :open="modelValue" :toggle="toggle" />
    </span>
    <Teleport to="body">
      <Transition name="ns-popper">
        <div v-if="modelValue" ref="menuRef" class="ns-dropdown__menu" role="menu" :style="menuStyle" @keydown="handleKeydown" @click="handleMenuClick">
          <slot />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { NsPlacement } from '../overlay/types'
import { getOverlayPosition } from '../overlay/position'
defineOptions({ name: 'NsDropdown' })
const props = withDefaults(defineProps<{ modelValue: boolean; placement?: NsPlacement; offset?: number; disabled?: boolean; closeOnSelect?: boolean; maxHeight?: string | number }>(), { placement: 'bottom-start', offset: 6, closeOnSelect: true, maxHeight: 360 })
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; select: [value: unknown]; open: []; close: [] }>()
const rootRef = ref<HTMLElement>(); const triggerRef = ref<HTMLElement>(); const menuRef = ref<HTMLElement>()
const menuStyle = ref<CSSProperties>({})
function toggle() { if (!props.disabled) setOpen(!props.modelValue) }
function setOpen(value: boolean) { emit('update:modelValue', value); value ? (emit('open'), nextTick(updatePosition)) : emit('close') }
function updatePosition() { const anchor = triggerRef.value?.getBoundingClientRect(); const menu = menuRef.value; if (!anchor || !menu) return; const result = getOverlayPosition(anchor, { width: menu.offsetWidth, height: menu.offsetHeight }, props.placement, props.offset); menuStyle.value = { left: `${result.left}px`, top: `${result.top}px`, maxHeight: typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight } }
function handleOutside(event: MouseEvent) { if (!rootRef.value?.contains(event.target as Node) && !menuRef.value?.contains(event.target as Node)) setOpen(false) }
function rows() { return [...(menuRef.value?.querySelectorAll<HTMLElement>('[role="menuitem"]') || [])].filter((item) => !item.classList.contains('is-disabled')) }
function handleKeydown(event: KeyboardEvent) { const list = rows(); const current = list.indexOf(document.activeElement as HTMLElement); if (event.key === 'Escape') { event.preventDefault(); setOpen(false); triggerRef.value?.focus(); return } if (event.key === 'Tab') { setOpen(false); return } if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); const next = current < 0 ? 0 : (current + (event.key === 'ArrowDown' ? 1 : -1) + list.length) % list.length; list[next]?.focus() } else if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); (event.key === 'Home' ? list[0] : list[list.length - 1])?.focus() } else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); (document.activeElement as HTMLElement)?.click() } }
function handleMenuClick(event: MouseEvent) { const item = (event.target as HTMLElement).closest('[role="menuitem"]') as HTMLElement | null; if (!item || item.classList.contains('is-disabled')) return; emit('select', item.dataset.value); if (props.closeOnSelect) setOpen(false) }
watch(() => props.modelValue, (open) => { if (open) { nextTick(() => { updatePosition(); rows()[0]?.focus() }); window.addEventListener('resize', updatePosition); window.addEventListener('scroll', updatePosition, true); document.addEventListener('mousedown', handleOutside) } else { window.removeEventListener('resize', updatePosition); window.removeEventListener('scroll', updatePosition, true); document.removeEventListener('mousedown', handleOutside) } })
onBeforeUnmount(() => { window.removeEventListener('resize', updatePosition); window.removeEventListener('scroll', updatePosition, true); document.removeEventListener('mousedown', handleOutside) })
defineExpose({ open: () => setOpen(true), close: () => setOpen(false), updatePosition })
</script>
<style src="../../styles/theme.css"></style>
<style scoped>
.ns-dropdown { display: inline-flex; } .ns-dropdown__trigger { display: inline-flex; } .ns-dropdown__menu { position: fixed; z-index: calc(var(--ns-overlay-z-index) + 1); min-width: 150px; max-width: min(320px, calc(100vw - 16px)); overflow: auto; padding: 6px; border: 1px solid var(--ns-border-color); border-radius: var(--ns-radius-lg); background: var(--ns-bg-elevated); box-shadow: var(--ns-shadow-overlay); outline: none; } .ns-popper-enter-active, .ns-popper-leave-active { transition: opacity var(--ns-motion-fast) var(--ns-motion-easing), transform var(--ns-motion-fast) var(--ns-motion-easing); } .ns-popper-enter-from, .ns-popper-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
