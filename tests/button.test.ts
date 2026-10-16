import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import NsButton from '../src/components/button/NsButton.vue'

describe('NsButton 交互契约', () => {
  it('默认是普通原生按钮，保留插槽和透传属性', async () => {
    const onKeydown = vi.fn()
    const wrapper = mount(NsButton, {
      slots: { default: '<strong>保存</strong>' },
      attrs: { class: 'toolbar-action', title: '保存内容', 'aria-label': '保存内容', onKeydown },
    })
    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.attributes('type')).toBe('button')
    expect(wrapper.attributes('aria-pressed')).toBeUndefined()
    expect(wrapper.get('strong').text()).toBe('保存')
    expect(wrapper.classes()).toContain('toolbar-action')
    expect(wrapper.attributes('aria-label')).toBe('保存内容')
    await wrapper.trigger('keydown', { key: 'Enter' })
    expect(onKeydown).toHaveBeenCalledOnce()
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
    expect(wrapper.attributes('aria-pressed')).toBeUndefined()
    expect(wrapper.classes()).not.toContain('is-pressed')
  })

  it.each(['submit', 'reset'] as const)('支持显式原生类型 %s', (nativeType) => {
    expect(mount(NsButton, { props: { nativeType } }).attributes('type')).toBe(nativeType)
  })

  it.each([
    { disabled: true, loading: false },
    { disabled: false, loading: true },
    { disabled: true, loading: true },
  ])('禁用或加载时即刻阻止操作和冒泡：%j', (props) => {
    const wrapper = mount(NsButton, { props })
    const onParentClick = vi.fn()
    const parent = document.createElement('div')
    parent.addEventListener('click', onParentClick)
    parent.append(wrapper.element)
    const event = new MouseEvent('click', { bubbles: true, cancelable: true })
    wrapper.element.dispatchEvent(event)
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.emitted('click')).toBeUndefined()
    expect(event.defaultPrevented).toBe(true)
    expect(onParentClick).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('加载时保持根节点、标签和图标占位，结束后恢复操作', async () => {
    const wrapper = mount(NsButton, { props: { text: '保存', loading: false } })
    const button = wrapper.element
    const iconArea = wrapper.get('.nuist-button__icon').element
    await wrapper.setProps({ loading: true })
    expect(wrapper.element).toBe(button)
    expect(wrapper.get('.nuist-button__icon').element).toBe(iconArea)
    expect(wrapper.text()).toBe('保存')
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.find('.nuist-button__spinner').exists()).toBe(true)
    await wrapper.setProps({ loading: false })
    expect(wrapper.attributes('aria-busy')).toBeUndefined()
    expect(wrapper.find('.nuist-button__spinner').exists()).toBe(false)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('仅显式 pressed 表达切换状态', async () => {
    const wrapper = mount(NsButton, { props: { pressed: false, text: '固定' } })
    expect(wrapper.attributes('aria-pressed')).toBe('false')
    await wrapper.setProps({ pressed: true })
    expect(wrapper.attributes('aria-pressed')).toBe('true')
    expect(wrapper.classes()).toContain('is-pressed')
  })

  it('允许调用方保留编辑器选区，并暴露原生焦点操作', async () => {
    const wrapper = mount(NsButton, {
      attachTo: document.body,
      props: { text: '加粗' },
      attrs: { onMousedown: (event: MouseEvent) => event.preventDefault() },
    })
    const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
    wrapper.element.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)
    wrapper.vm.focus()
    expect(document.activeElement).toBe(wrapper.element)
    wrapper.vm.blur()
    expect(document.activeElement).not.toBe(wrapper.element)
    wrapper.unmount()
  })
})
