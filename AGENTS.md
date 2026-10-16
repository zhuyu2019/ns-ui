# NS UI 组件库

- 所有文档和注释使用中文。独立 Vue 3 基础组件库，不引入 Electron、业务 API、Store 或宿主路径别名。
- Vue 运行时 API 由本项目 Vite 自动导入，仅依赖自身配置；对外发布编译后的 ESM、类型声明及 CSS。
- 组件使用 Nuist 前缀及 `<script setup lang="ts">`。新增公开 API 同步 README、预览页和必要交互验证。
- 通过 `pnpm test`、`pnpm run build` 和 `pnpm run build:playground` 验证。不自动发布 npm，不创建远程仓库，不提交或推送。
- 修改交付行为时递增 package.json 并同步 release-notes.json。已有版本包不可覆盖后继续交付。
- `src/icons/data/` 为离线图标数据；业务路由到图标的映射属于宿主，不进入基础库。
