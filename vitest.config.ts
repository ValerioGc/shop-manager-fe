import { fileURLToPath } from 'node:url';
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config';
import viteConfigFn from './vite.config';

const viteConfig = viteConfigFn({
    mode: 'test',
    command: 'build',
});

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            environment: 'jsdom',
            exclude: [...configDefaults.exclude, 'e2e/**'],
            include: ['src/__tests__/**/*.ts'],
            root: fileURLToPath(new URL('./', import.meta.url)),
        },
    }),
);
