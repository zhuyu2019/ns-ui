<template>
  <Teleport to="body">
    <Transition name="ns-dialog">
      <div v-if="modelValue" class="ns-dialog-layer" @keydown="handleKeydown">
        <div class="ns-dialog-backdrop" aria-hidden="true" @click="handleBackdropClick" />
        <section
          ref="dialogRef"
          class="ns-dialog"
          :class="[`ns-dialog--${size}`, { 'is-fullscreen': fullscreen }]"
          role="dialog"
          :aria-modal="true"
          :aria-labelledby="title ? titleId : undefined"
          :aria-describedby="description ? descriptionId : undefined"
          :aria-label="title ? undefined : ariaLabel"
          tabindex="-1"
          :style="dialogStyle"
          @mousedown.stop
        >
          <header v-if="title || description || $slots.header" class="ns-dialog__header">
            <slot name="header">
              <div class="ns-dialog__heading">
                <h2 :id="titleId" class="ns-dialog__title">{{ title }}</h2>
                <p v-if="description" :id="descriptionId" class="ns-dialog__description">{{ description }}</p>
              </div>
            </slot>
            <button v-if="showClose" class="ns-dialog__close" type="button" aria-label="关闭" @click="requestClose('close-button')">×</button>
          </header>
          <div class="ns-dialog__body"><slot /></div>
          <footer v-if="$slots.footer" class="ns-dialog__footer"><slot name="footer" /></footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { NsCloseReason } from '../overlay/types'

defineOptions({ name: 'NsDialog' })

interface Props {
  modelValue: boolean
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  width?: string | number
  top?: string
  fullscreen?: boolean
  showClose?: boolean
  ariaLabel?: string
  closeOnEscape?: boolean
  closeOnOutside?: boolean
  beforeClose?: (reason: NsCloseReason) => boolean | void | Promise<boolean | void>
}
const props = withDefaults(defineProps<Props>(), {
  size: 'md', showClose: true, closeOnEscape: true, closeOnOutside: false,
})
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  open: []
  opened: []
  close: [reason: NsCloseReason]
  closed: [reason: NsCloseReason]
  'close-request': [reason: NsCloseReason]
}>()
const dialogRef = ref<HTMLElement>()
const titleId = `ns-dialog-title-${Math.random().toString(36).slice(2)}`
const descriptionId = `ns-dialog-description-${Math.random().toString(36).slice(2)}`
const dialogStyle = computed<CSSProperties>(() => ({ width: typeof props.width === 'number' ? `${props.width}px` : props.width, marginTop: props.top }))
let previousActive: HTMLElement | null = null
let closing = false

watch(() => props.modelValue, (visible) => {
  if (visible) {
    previousActive = document.activeElement as HTMLElement | null
    emit('open')
    nextTick(() => { dialogRef.value?.focus(); emit('opened') })
  }
})

async function requestClose(reason: NsCloseReason) {
  if (closing) return
  emit('close-request', reason)
  const result = await props.beforeClose?.(reason)
  if (result === false) return
  closing = true
  emit('close', reason)
  emit('update:modelValue', false)
  nextTick(() => {
    closing = false
    emit('closed', reason)
    if (previousActive?.isConnected) previousActive.focus()
  })
}
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.closeOnEscape) { event.preventDefault(); requestClose('escape'); return }
  if (event.key !== 'Tab') return
  const root = dialogRef.value
  if (!root) return
  const items = [...root.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter((item) => !item.hasAttribute('disabled'))
  if (!items.length) { event.preventDefault(); return }
  const first = items[0]; const last = items[items.length - 1]
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
}
function handleBackdropClick() { if (props.closeOnOutside) requestClose('outside') }
defineExpose({ requestClose, dialogRef })
</script>

<style src="../../styles/theme.css"></style>
<style scoped>
.ns-dialog-layer { position: fixed; inset: 0; z-index: var(--ns-overlay-z-index); display: flex; align-items: center; justify-content: center; padding: 12px; }
.ns-dialog-backdrop { position: absolute; inset: 0; background: var(--ns-overlay-backdrop); }
.ns-dialog { position: relative; display: flex; flex-direction: column; max-height: calc(100dvh - 24px); overflow: hidden; padding: 0; color: var(--ns-text-color-primary); background: var(--ns-bg-elevated); border: 1px solid var(--ns-border-color); border-radius: var(--ns-radius-lg); box-shadow: var(--ns-shadow-overlay); outline: none; will-change: transform, opacity; }
.ns-dialog--sm { width: min(400px, calc(100vw - 32px)); } .ns-dialog--md { width: min(560px, calc(100vw - 32px)); } .ns-dialog--lg { width: min(800px, calc(100vw - 32px)); } .ns-dialog--xl { width: min(960px, calc(100vw - 32px)); }
.ns-dialog.is-fullscreen { width: 100%; height: 100%; max-height: none; border-radius: 0; }
.ns-dialog__header, .ns-dialog__footer { flex: 0 0 auto; display: flex; align-items: flex-start; gap: 8px; padding: 8px 12px; border-bottom: 1px solid var(--ns-border-color); }
.ns-dialog__footer { justify-content: flex-end; align-items: center; border-top: 1px solid var(--ns-border-color); border-bottom: 0; }
.ns-dialog__heading { min-width: 0; flex: 1; } .ns-dialog__title { margin: 0; font-size: 16px; line-height: 24px; font-weight: 650; } .ns-dialog__description { margin: 4px 0 0; color: var(--ns-text-color-muted); font-size: 12px; line-height: 18px; }
.ns-dialog__close { width: 28px; height: 28px; margin: -2px -6px 0 0; border: 0; border-radius: var(--ns-radius-md); color: var(--ns-text-color-muted); background: transparent; font-size: 22px; line-height: 24px; cursor: pointer; } .ns-dialog__close:hover { color: var(--ns-text-color-primary); background: var(--ns-fill-color-light); } .ns-dialog__close:focus-visible { outline: 2px solid var(--ns-color-primary); outline-offset: 1px; }
.ns-dialog__body { min-height: 0; overflow: auto; padding: 12px; }
.ns-dialog-enter-active,
.ns-dialog-leave-active {
  transition: opacity 180ms var(--ns-motion-easing);
}
.ns-dialog-enter-active .ns-dialog,
.ns-dialog-leave-active .ns-dialog {
  transition: opacity 180ms var(--ns-motion-easing), transform 180ms var(--ns-motion-easing);
}
.ns-dialog-enter-from,
.ns-dialog-leave-to {
  opacity: 0;
}
.ns-dialog-enter-from .ns-dialog,
.ns-dialog-leave-to .ns-dialog {
  opacity: 0;
  transform: translateY(10px) scale(0.97);
}
</style>
