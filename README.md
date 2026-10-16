# NS UI

独立的 Vue 3 + TypeScript 基础组件库。当前版本为 `ns-ui@0.2.0`，提供 NsButton、NsIcon、NsDialog、NsDropdown、NsDropdownItem、NsPopover 和离线图标工具。与桌面前端分别安装、构建和管理版本。

## 开发与校验

```powershell
pnpm install --frozen-lockfile
pnpm dev
pnpm test
pnpm run build
pnpm run build:playground
pnpm run verify:ui
pnpm run pack:local
```

`pnpm dev` 只启动独立网页预览，不启动 Electron。开发服务器终端会显示实际访问地址。`dist/` 包含 ESM、CSS 和 TypeScript 声明；`site/` 为静态预览；`artifacts/` 为版本压缩包。生成目录不纳入源码管理。

## 在 Vue 项目使用

当前采用本地版本包，不发布 npm。将 `artifacts/ns-ui-0.2.0.tgz` 复制到目标项目的 `vendor/` 后安装：

```powershell
pnpm add ./vendor/ns-ui-0.2.0.tgz
```

```vue
<script setup lang="ts">
import { NsButton, NsIcon } from 'ns-ui'
import 'ns-ui/style.css'
</script>

<template>
  <NsButton variant="solid" tone="primary" icon="nuist:save">保存</NsButton>
  <NsButton variant="ghost" icon="nuist:copy" aria-label="复制" />
  <NsIcon icon="nuist:paper-library" :size="24" aria-label="论文库" />
</template>
```

可选全局注册：`import NsUI from 'ns-ui'; app.use(NsUI)`，仍需导入 `ns-ui/style.css`。Vue 是 peerDependency，不打入组件库；无需安装 Element Plus，不依赖宿主自动导入插件或路径别名。

## NsButton

| 属性            | 取值                                                  | 默认值  |
| --------------- | ----------------------------------------------------- | ------- |
| variant         | solid / soft / outline / ghost / link                 | outline |
| tone            | default / primary / success / warning / danger / info | default |
| size            | xs / sm / md / lg（24 / 28 / 32 / 36px）              | md      |
| icon            | `nuist:语义名称` 或兼容的 Iconify 名称                | 无      |
| iconPosition    | start / end                                           | start   |
| text / 默认插槽 | 文本或内容                                            | 无      |
| shape           | rounded / circle                                      | rounded |
| motion          | subtle / press / none                                 | subtle  |
| loading         | 布尔值，加载时禁用操作                                | 未传入  |
| disabled        | 布尔值                                                | false   |
| nativeType      | button / submit / reset                               | button  |
| pressed         | 显式切换状态                                          | 未传入  |

点击发出原生 MouseEvent；其他属性、样式、键盘与 mousedown 监听透传原生根按钮。实例暴露 `buttonRef`、`focus(options?)`、`blur()`。纯图标按钮需提供 `aria-label`。link 是按钮外观，真正导航使用链接或路由组件。

纯文字按钮如有加载状态，必须从初始 false 持续绑定 `:loading="saving"`，提前保留图标空间。loading 由调用方管理，不自动调用请求。普通点击不会设置 pressed；编辑器选区由调用方按需使用 `@mousedown.prevent`。

默认轻量颜色过渡；press 缩放内部内容；none 取消装饰过渡。系统 `prefers-reduced-motion: reduce` 会停止缩放、淡化及加载旋转。

## 主题与图标

默认主题已包含在 style.css；`:root.dark` 或局部 `[data-ns-theme="dark"]` 启用深色主题。组件库只使用 `--ns-*` 变量，例如 `--ns-color-primary`、`--ns-text-color-primary` 和 `--ns-bg-elevated`。自定义主色需同时配置对应 light-3/5/7/8/9 和 dark-2 状态色。

`ns-ui/theme.css` 可单独导入默认回退主题。`src/styles/theme.css` 为完整变量清单；亮色 success / warning / info 实色按钮使用深色文字，自定义配色需检查对比度。

202 个确认过的本地图标内嵌 SVG 数据，沿用 1.6px 线宽；`nuist:*` 名称及已映射的历史名称离线渲染。未映射的第三方 Iconify 名称保留原有远程解析行为，完全离线场景请使用本地图标。业务路由映射留在宿主。

`src/icons/data/` 是组件库构建使用的图标数据。桌面前端原有图标生成脚本和设计稿暂留，更新图标时需明确同步这两个 JSON、递增组件库版本、重新构建打包及验证，不能仅修改旧前端快照。

## NsDialog、NsDropdown、NsPopover

`NsDialog` 提供 `v-model`、标题、描述、插槽、Escape、点击遮罩关闭、关闭前拦截和焦点回收；`NsDropdown` 配合 `NsDropdownItem` 提供菜单选择、禁用项、键盘导航和定位；`NsPopover` 支持 click、hover、manual 三种触发方式、定位、延迟和最大高度。

```vue
<NsDialog v-model="dialogOpen" title="确认删除" close-on-outside>
  <p>正文内容</p>
</NsDialog>
<NsDropdown v-model="menuOpen">
  <template #trigger><NsButton>更多操作</NsButton></template>
  <NsDropdownItem value="copy">复制</NsDropdownItem>
</NsDropdown>
<NsPopover v-model="popoverOpen" show-arrow>
  <template #reference><NsButton>查看说明</NsButton></template>
  说明内容
</NsPopover>
```

## 当前接入与边界

桌面前端通过自身 `vendor/` 中的版本包消费，保留原路径作为兼容导出；按钮与图标运行实现来自本库。前端安装、类型检查及打包不要求同级组件库源码存在。

业务表格适配、SSH 弹窗、Element Plus 提示/下拉及路由映射留在前端。暂不将全部业务组件迁入，也不替换 Element Plus 内部控件。本项目尚未配置远程仓库或发布渠道，`private: true` 防止误发布。
