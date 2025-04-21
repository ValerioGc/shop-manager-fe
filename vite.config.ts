import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';
import * as zlib from 'zlib';
import dotenv from 'dotenv';
import autoprefixer from 'autoprefixer';
import purgecss from '@fullhuman/postcss-purgecss';
import { compression } from 'vite-plugin-compression2';
import cssnano from 'cssnano';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { createHtmlPlugin } from 'vite-plugin-html';
import combineSelectors from 'postcss-combine-duplicated-selectors';
import injectPreload from 'unplugin-inject-preload/vite';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export default defineConfig(({ mode }) => {
    const isProduction: boolean = mode === 'production';
    const isTest: boolean = mode === 'test';

    const VITE_API_ENDPOINT: string | undefined = process.env.VITE_API_ENDPOINT;
    const VITE_BASE_URL: string | undefined = process.env.VITE_BASE_URL;

    return {
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },

        server: {
            port: 5173,
            open: true,
            headers: {
                'Content-Security-Policy':
                    !isProduction || !isTest
                        ? // dev
                          `default-src 'self'; ` +
                          `style-src 'self' 'unsafe-inline';` +
                          `font-src 'self';` +
                          `img-src 'self' data: ${VITE_API_ENDPOINT} ${VITE_BASE_URL}; ` +
                          `script-src 'self' 'nonce-random123' 'unsafe-inline' ${VITE_BASE_URL}; ` +
                          `object-src 'none'; ` +
                          `base-uri 'self';` +
                          `form-action 'self'; ` +
                          `frame-ancestors 'none'; ` +
                          `connect-src 'self' ${VITE_API_ENDPOINT};` +
                          `report-uri ${VITE_API_ENDPOINT}/api/csp-violation;`
                        : // production
                          `default-src 'self'; ` +
                          `script-src 'nonce-random123' 'self' ${VITE_BASE_URL};` +
                          `style-src 'self'; ` +
                          `img-src 'self' data: ${VITE_BASE_URL} ${VITE_API_ENDPOINT}; ` +
                          `font-src 'self'; ` +
                          `object-src 'none'; ` +
                          `base-uri 'self'; ` +
                          `form-action 'self'; ` +
                          `frame-ancestors 'none'; ` +
                          `connect-src 'self' ${VITE_BASE_URL} ${VITE_API_ENDPOINT}; ` +
                          `report-uri ${VITE_API_ENDPOINT}/api/csp-violation;`,
            },
        },

        plugins: [
            vue({
                template: {
                    compilerOptions: {
                        /**
                         * Ignore custom elements in templates
                         *  @see ImagePlaceholder.vue
                         * @param tag - The tag to check
                         * @returns {boolean} - Whether the tag is a custom element
                         */
                        isCustomElement: (tag: string): boolean =>
                            tag.startsWith('sodipodi:namedview'),
                    },
                },
            }),
            vueJsx(),
            !isProduction && !isTest && vueDevTools(),

            createHtmlPlugin({
                minify: true,
            }),

            injectPreload({
                files: [
                    {
                        // Preload del file fe_config.json
                        entryMatch: /fe_config\.json$/,
                        outputMatch: /fe_config\.json$/,
                        attributes: {
                            as: 'fetch',
                            type: 'application/json',
                            fetchPriority: 'high',
                        },
                    },
                    {
                        // Preload SVG logo image
                        entryMatch: /logo\.svg$/,
                        outputMatch: /logo\.[a-z0-9]+\.svg$/,
                        attributes: {
                            as: 'image',
                            type: 'image/svg+xml',
                            fetchPriority: 'high',
                        },
                    },
                    {
                        // Prelaod font file
                        entryMatch: /OpenSans-VariableFont_wdth,wght\.ttf$/,
                        outputMatch: /OpenSans-VariableFont_wdth,wght\.[a-z0-9]+\.ttf$/,
                        attributes: {
                            type: 'font/ttf',
                            as: 'font',
                            crossorigin: 'anonymous',
                        },
                    },
                    {
                        // Preload images in the banners folder
                        entryMatch: /banners\/.*\.(jpg|jpeg|png|webp)$/i,
                        outputMatch: /banners\/.*\.(jpg|jpeg|png|webp)$/i,
                        attributes: {
                            as: 'image',
                            fetchPriority: 'high',
                        },
                    },
                ],
                injectTo: 'head-prepend',
            }),

            ViteImageOptimizer({
                test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,
                exclude: undefined,
                include: undefined,
                includePublic: true,
                logStats: true,
                ansiColors: true,
                svg: {
                    multipass: true,
                    plugins: [
                        {
                            name: 'preset-default',
                            params: {
                                overrides: {
                                    cleanupNumericValues: false,
                                    removeViewBox: false, // https://github.com/svg/svgo/issues/1128
                                    cleanupIds: {
                                        minify: false,
                                        remove: false,
                                    },
                                    convertPathData: false,
                                },
                            },
                        },
                        'sortAttrs',
                        {
                            name: 'addAttributesToSVGElement',
                            params: {
                                attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
                            },
                        },
                    ],
                },
                png: { quality: 100 },
                jpeg: { quality: 100 },
                jpg: { quality: 100 },
                tiff: { quality: 100 },
                webp: { lossless: true },
                avif: { lossless: true },
                cache: false,
                cacheLocation: undefined,
            }),

            compression({
                include: /\.(html|xml|css|json|js|mjs|svg|yaml|yml|toml)$/,
                exclude: [],
                threshold: 10240,
                algorithm: 'brotliCompress',
                skipIfLargerOrEqual: true,
                deleteOriginalAssets: false,
                compressionOptions: {
                    params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 },
                },
            }),

            compression({
                include: /\.(html|xml|css|json|js|mjs|svg|yaml|yml|toml)$/,
                threshold: 10240,
                algorithm: 'gzip',
                skipIfLargerOrEqual: true,
                deleteOriginalAssets: false,
                compressionOptions: {
                    level: 9,
                },
            }),
        ].filter(Boolean),

        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: "@use '@/styles/global.scss' as *;",
                },
            },
            postcss: {
                plugins: [
                    combineSelectors({ removeDuplicatedProperties: true }),
                    purgecss({
                        content: [
                            './public/**/*.html',
                            './src/**/*.vue',
                            './src/**/*.ts',
                            './src/styles/*.scss',
                        ],
                        safelist: {
                            standard: [/^v-/, /^el-/],
                        },
                        defaultExtractor: (content: string): string[] =>
                            content.match(/[\w-/:]+(?<!:)/g) || [],
                    }),
                    autoprefixer({
                        overrideBrowserslist: ['last 4 versions', 'not dead'],
                    }),
                    cssnano({ preset: 'default' }),
                ],
            },
        },

        build: {
            logLevel: 'debug',
            minify: 'terser',
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                    pure_funcs: ['console.info', 'console.debug', 'console.warn'],
                    passes: 4,
                },
                mangle: {
                    toplevel: true,
                },
                output: {
                    comments: false,
                    beautify: false,
                    max_line_len: 80,
                },
                keep_fnames: false,
                keep_classnames: false,
            },
            rollupOptions: {
                output: {
                    manualChunks(id: string): string | undefined {
                        if (id.includes('node_modules')) {
                            if (id.includes('vue')) {
                                return 'vue-vendor';
                            } else if (id.includes('axios')) {
                                return 'axios-vendor';
                            }
                            return 'vendor';
                        }

                        if (
                            id.includes('/src/components/layout/partials/PageHeader.vue') ||
                            id.includes('/src/components/layout/MainLayout.vue')
                        ) {
                            return 'layout';
                        }

                        if (
                            id.includes('/src/views/show/ShowView.vue') ||
                            id.includes('/src/components/show/ShowPageDescription.vue') ||
                            id.includes('/src/components/show/ShowPageList.vue')
                        ) {
                            return 'show';
                        }
                    },
                    chunkFileNames: 'static/js/[name]-[hash].js',
                    entryFileNames: 'static/js/[name]-[hash].js',
                    assetFileNames: 'static/assets/[name].[ext]',
                },
            },

            sourcemap: false,
            assetsInlineLimit: 4096,
            brotliSize: true,
            reportCompressedSize: true,
        },
    };
});
