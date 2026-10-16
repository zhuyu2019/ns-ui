import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NsIcon from '../src/components/icon/NsIcon.vue'
import { getNuistIconId, resolveNuistIcon, resolveFileIcon } from '../src/icons/resolve'

describe('离线图标与兼容名称', () => {
  it('本地标识和历史名称解析到相同离线数据', () => {
    expect(getNuistIconId('ri:file-copy-line')).toBe('copy')
    expect(resolveNuistIcon('ri:file-copy-line')).toBe(resolveNuistIcon('nuist:copy'))
    expect(resolveNuistIcon('nuist:missing')).toBe(resolveNuistIcon('nuist:help'))
    expect(resolveFileIcon('C:/notes/paper.PDF')).toBe('nuist:file-pdf')
  })

  it('无需宿主注册即可同步渲染 SVG、尺寸和可访问名称', () => {
    const wrapper = mount(NsIcon, {
      props: { icon: 'nuist:copy', size: 24 },
      attrs: { 'aria-label': '复制' },
    })
    expect(wrapper.element.tagName.toLowerCase()).toBe('svg')
    expect(wrapper.attributes('width')).toBe('24px')
    expect(wrapper.attributes('aria-label')).toBe('复制')
    expect(wrapper.html()).toContain('stroke-width="1.6"')
  })
})
