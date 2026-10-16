<template>
  <button
    ref="buttonRef"
    class="nuist-button"
    :class="[
      `nuist-button--${variant}`,
      `nuist-button--${size}`,
      `nuist-button--motion-${motion}`,
      {
        'nuist-button--icon-only': !hasLabel,
        'nuist-button--circle': shape === 'circle',
        'nuist-button--icon-end': iconPosition === 'end',
        'is-loading': loading,
        'is-pressed': pressed === true,
      },
    ]"
    :style="toneStyle"
    :type="nativeType"
    :disabled="blocked"
    :aria-busy="loading || undefined"
    :aria-pressed="pressed"
    @click="handleClick"
  >
    <span class="nuist-button__content">
      <span v-if="hasIconArea" class="nuist-button__icon" aria-hidden="true">
        <Transition name="nuist-button-icon">
          <svg
            v-if="loading"
            key="loading"
            class="nuist-button__spinner"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5" opacity=".2" />
            <path
              d="M12 3a9 9 0 0 1 9 9"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
            />
          </svg>
          <NsIcon v-else-if="icon" :key="icon" :icon="icon" />
        </Transition>
      </span>
      <span v-if="hasLabel" class="nuist-button__label"
        ><slot>{{ text }}</slot></span
      >
    </span>
  </button>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import NsIcon from '../icon/NsIcon.vue'
import type { ButtonMotion, ButtonSize, ButtonTone, ButtonVariant } from './types'

defineOptions({ name: 'NsButton' })

interface Props {
  variant?: ButtonVariant
  tone?: ButtonTone
  size?: ButtonSize
  icon?: string
  iconPosition?: 'start' | 'end'
  text?: string
  shape?: 'rounded' | 'circle'
  motion?: ButtonMotion
  /** 持续绑定布尔值，预留加载图标区域，避免加载时宽度变化。 */
  loading?: boolean
  disabled?: boolean
  nativeType?: 'button' | 'submit' | 'reset'
  /** 仅用于切换类操作；普通操作不传此值。 */
  pressed?: boolean
}

interface Emits {
  click: [event: MouseEvent]
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'outline',
  tone: 'default',
  size: 'md',
  iconPosition: 'start',
  shape: 'rounded',
  motion: 'subtle',
  loading: undefined,
  disabled: false,
  nativeType: 'button',
  pressed: undefined,
})
const emit = defineEmits<Emits>()
const slots = useSlots()
const buttonRef: import('vue').Ref<HTMLButtonElement | undefined> = ref<HTMLButtonElement>()
const hasLabel = computed(() => Boolean(props.text || slots.default))
const hasIconArea = computed(() => Boolean(props.icon) || props.loading !== undefined)
const blocked = computed(() => props.disabled || props.loading === true)
const toneStyle = computed<CSSProperties>(() => {
  if (props.tone === 'default') return {}
  return {
    '--ns-button-solid-text': ['success', 'warning', 'info'].includes(props.tone)
      ? '#141414'
      : 'var(--ns-color-white)',
    '--ns-button-tone': `var(--ns-color-${props.tone})`,
    '--ns-button-solid-hover': `var(--ns-color-${props.tone}-light-3)`,
    '--ns-button-solid-active': `var(--ns-color-${props.tone}-dark-2)`,
    '--ns-button-soft': `var(--ns-color-${props.tone}-light-9)`,
    '--ns-button-soft-hover': `var(--ns-color-${props.tone}-light-8)`,
    '--ns-button-soft-active': `var(--ns-color-${props.tone}-light-7)`,
    '--ns-button-outline': `var(--ns-color-${props.tone}-light-5)`,
  }
})

function handleClick(event: MouseEvent): void {
  if (blocked.value) {
    event.preventDefault()
    event.stopImmediatePropagation()
    return
  }
  emit('click', event)
}

// 根节点始终保持为原生按钮，供提示层和调用方定位焦点。
defineExpose({
  buttonRef,
  focus: (options?: FocusOptions) => buttonRef.value?.focus(options),
  blur: () => buttonRef.value?.blur(),
})
</script>

<style src="../../styles/theme.css"></style>

<style scoped lang="scss">
.nuist-button {
  --ns-button-height: 32px;
  --ns-button-icon-size: 16px;
  --ns-button-tone: var(--ns-text-color-primary);
  --ns-button-solid-text: var(--ns-bg-color);
  --ns-button-solid-hover: var(--ns-text-color-regular);
  --ns-button-solid-active: var(--ns-text-color-primary);
  --ns-button-soft: var(--ns-fill-color-light);
  --ns-button-soft-hover: var(--ns-fill-color);
  --ns-button-soft-active: var(--ns-fill-color-dark);
  --ns-button-outline: var(--ns-border-color);

  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: var(--ns-button-height);
  padding: 0 12px;
  margin: 0;
  font: inherit;
  font-size: 13px;
  line-height: 1;
  color: var(--ns-button-tone);
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  appearance: none;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  transition:
    background-color 120ms ease-out,
    border-color 120ms ease-out,
    color 120ms ease-out;

  &--xs {
    --ns-button-height: 24px;
    --ns-button-icon-size: 14px;
    padding: 0 6px;
    font-size: 12px;
  }

  &--sm {
    --ns-button-height: 28px;
    --ns-button-icon-size: 14px;
    padding: 0 10px;
    font-size: 12px;
  }

  &--lg {
    --ns-button-height: 36px;
  }

  &--icon-only {
    width: var(--ns-button-height);
    padding: 0;
  }

  &--circle {
    border-radius: 999px;
  }

  &--solid {
    color: var(--ns-button-solid-text);
    background-color: var(--ns-button-tone);

    &:hover:enabled {
      background-color: var(--ns-button-solid-hover);
    }

    &:active:enabled,
    &.is-pressed {
      background-color: var(--ns-button-solid-active);
    }
  }

  &--soft {
    background-color: var(--ns-button-soft);

    &:hover:enabled {
      background-color: var(--ns-button-soft-hover);
    }

    &:active:enabled,
    &.is-pressed {
      background-color: var(--ns-button-soft-active);
    }
  }

  &--outline {
    border-color: var(--ns-button-outline);

    &:hover:enabled {
      background-color: var(--ns-button-soft);
      border-color: var(--ns-button-tone);
    }

    &:active:enabled,
    &.is-pressed {
      background-color: var(--ns-button-soft-hover);
      border-color: var(--ns-button-tone);
    }
  }

  &--ghost,
  &--link {
    &:hover:enabled {
      background-color: var(--ns-button-soft);
    }

    &:active:enabled,
    &.is-pressed {
      background-color: var(--ns-button-soft-hover);
    }
  }

  &--link {
    padding-right: 2px;
    padding-left: 2px;

    &:hover:enabled .nuist-button__label {
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }

  &:focus-visible {
    outline: 2px solid
      var(--ns-color-primary);
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
    transition: none;
  }

  &.is-loading {
    cursor: progress;
  }

  &--motion-press:active:enabled .nuist-button__content {
    transform: scale(0.98);
    transition-duration: 70ms;
  }

  &--motion-press.nuist-button--icon-only:active:enabled .nuist-button__content {
    transform: scale(0.96);
  }

  &--motion-none {
    transition: none;
  }
}

.nuist-button__content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 0;
  transition: transform 120ms ease-out;
}

.nuist-button--icon-end .nuist-button__content {
  flex-direction: row-reverse;
}

.nuist-button__icon {
  position: relative;
  display: inline-grid;
  flex: 0 0 var(--ns-button-icon-size);
  place-items: center;
  width: var(--ns-button-icon-size);
  height: var(--ns-button-icon-size);
  font-size: var(--ns-button-icon-size);

  > * {
    grid-area: 1 / 1;
    width: 100%;
    height: 100%;
  }
}

.nuist-button__spinner {
  animation: nuist-button-spin 900ms linear infinite;
}

.nuist-button-icon-enter-active,
.nuist-button-icon-leave-active {
  transition: opacity 100ms ease-out;
}

.nuist-button-icon-enter-from,
.nuist-button-icon-leave-to {
  opacity: 0;
}

.nuist-button--motion-none,
.nuist-button:disabled:not(.is-loading) {
  .nuist-button__content,
  .nuist-button-icon-enter-active,
  .nuist-button-icon-leave-active {
    transition: none;
  }
}

@keyframes nuist-button-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .nuist-button,
  .nuist-button__content,
  .nuist-button-icon-enter-active,
  .nuist-button-icon-leave-active {
    transition: none !important;
  }

  .nuist-button__content {
    transform: none !important;
  }

  .nuist-button__spinner {
    animation: none;
  }
}
</style>
