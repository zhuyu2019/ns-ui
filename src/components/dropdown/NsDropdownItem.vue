<template>
  <li
    class="ns-menu-item"
    :data-value="value == null ? '' : String(value)"
    :class="[`ns-menu-item--${tone}`, { 'is-disabled': disabled, 'is-divided': divided }]"
    role="menuitem"
    :aria-disabled="disabled || undefined"
    tabindex="-1"
    @click="handleClick"
  >
    <span v-if="$slots.icon" class="ns-menu-item__icon"><slot name="icon" /></span>
    <span class="ns-menu-item__label"><slot>{{ label }}</slot></span>
    <kbd v-if="shortcut" class="ns-menu-item__shortcut">{{ shortcut }}</kbd>
  </li>
</template>
<script setup lang="ts">
defineOptions({ name: 'NsDropdownItem' })
const props = withDefaults(defineProps<{ label?: string; value?: unknown; disabled?: boolean; divided?: boolean; tone?: 'default' | 'danger'; shortcut?: string }>(), { tone: 'default' })
const emit = defineEmits<{ select: [value: unknown] }>()
function handleClick() { if (!props.disabled) emit('select', props.value) }
defineExpose({ select: handleClick })
</script>
<style src="../../styles/theme.css"></style>
<style scoped>
.ns-menu-item { position: relative; display: flex; align-items: center; gap: 8px; min-height: 32px; padding: 0 10px; border-radius: var(--ns-radius-md); color: var(--ns-text-color-regular); font-size: 13px; line-height: 20px; cursor: pointer; user-select: none; outline: none; }
.ns-menu-item:hover, .ns-menu-item:focus-visible, .ns-menu-item.is-active { color: var(--ns-text-color-primary); background: var(--ns-fill-color-light); }
.ns-menu-item.is-disabled { color: var(--ns-text-color-muted); opacity: .55; cursor: not-allowed; } .ns-menu-item.is-divided { margin-top: 6px; } .ns-menu-item.is-divided::before { content: ''; position: absolute; top: -4px; left: 0; right: 0; height: 1px; background: var(--ns-border-color); }
.ns-menu-item--danger { color: var(--ns-color-danger); } .ns-menu-item--danger:hover, .ns-menu-item--danger:focus-visible { color: var(--ns-color-danger-dark-2); background: var(--ns-color-danger-light-9); }
.ns-menu-item__icon { display: inline-flex; width: 16px; justify-content: center; } .ns-menu-item__label { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .ns-menu-item__shortcut { color: var(--ns-text-color-muted); font: inherit; font-size: 11px; }
</style>
