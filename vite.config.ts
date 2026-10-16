import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { fileURLToPath } from 'node:url'
import { copyFileSync } from 'node:fs'

export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    AutoImport({
      imports: [{ vue: ['ref', 'computed', 'watch', 'nextTick', 'onMounted', 'onBeforeUnmount', 'useSlots', 'useAttrs'] }],
      dts: 'src/auto-imports.d.ts',
      dtsMode: 'overwrite',
    }),
    {
      name: 'ns-ui-theme',
      closeBundle() {
        if (mode !== 'playground') copyFileSync('src/styles/theme.css', 'dist/theme.css')
      },
    },
  ],
  build:
    mode === 'playground'
      ? { outDir: 'site' }
      : {
          lib: {
            entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
            formats: ['es'],
            fileName: 'ns-ui',
            cssFileName: 'ns-ui',
          },
          rolldownOptions: { external: ['vue', '@iconify/vue'] },
        },
}))
