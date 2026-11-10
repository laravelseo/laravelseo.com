---
title: "What is the correct way to use vite-plugin-pwa in a laravel project?"
description: "Mastering PWA Migration: The Correct Way to Use vite plugin pwa in Laravel Applications Migrating a project from an older asset bundler like Laravel..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Performance", "JavaScript"]
featured: false
---

Migrating a project from an older asset bundler like Laravel Mix/Webpack to the modern Vite ecosystem often brings exciting performance gains, but it frequently introduces unexpected configuration hurdles. For developers moving into the Laravel landscape—especially those working with Inertia and Vue—understanding how build tools handle assets like Service Workers (SWs) is crucial.

If you are running into issues with `vite-plugin-pwa` not correctly placing or registering your Service Worker, you are likely wrestling with the fundamental difference in asset handling between Webpack's file-system-based compilation and Vite's dependency graph approach.

This post will dissect the migration challenge you described and provide the definitive, correct way to configure `vite-plugin-pwa` within a Laravel/Vite environment.

## The Shift: From Webpack Compilation to Vite Ingestion

The core of your problem lies in how the plugins interact with the file system during the build process. With Webpack, you explicitly configured the plugin to take a source file (e.g., `sw.js`) and emit it into a specific output directory (`public/`). This was a direct file-copying operation.

Vite, by design, focuses on serving assets directly from the entry point. When we use `vite-plugin-pwa`, we need to tell it *how* to handle the Service Worker: should it generate a manifest, inject the SW script directly into the main bundle, or manage an external file?

The strategy you chose, `'injectManifest'`, is designed for situations where the plugin manages injecting the manifest and potentially the service worker content during the build. However, your configuration points `swSrc` to `./public/sw.js`, which tells Vite to look for that file as a source, but it doesn't automatically handle the required asset relocation or bundling necessary for the browser registration step.

## The Correct `vite-plugin-pwa` Configuration

To resolve the 404 error and ensure your Service Worker is discoverable, we need to simplify the plugin’s role. Instead of relying on external file placement (which was Webpack's method), let the plugin handle the creation and registration logic internally based on the source files you provide.

Here is the recommended approach for a clean Vite setup:

### 1. Simplify the Strategy and Source Definition

For most modern PWA setups, especially when using manifest injection or manifest generation, it’s cleaner to define your Service Worker content directly within the configuration, rather than relying on an external file path that might confuse the build pipeline.

If you are using `injectManifest`, you typically point `swSrc` to the actual source file you want to use for building the worker logic, and let the plugin handle where it places the final manifest or the necessary registration hooks.

**Revised `vite.config.js` Example:**

```javascript
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.js',
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
                compilerOptions: {
                    isCustomElement: tag => tag.startsWith('pwa-') || tag.startsWith('font-')
                },
            },
        }),
        VitePWA({
            strategies: 'injectManifest',
            // Point swSrc to the actual source file relative to your project root.
            // The plugin will handle bundling/injection based on this source.
            swSrc: './src/service-worker.js', 
            // swDest defines where the final Service Worker bundle is placed (often in the build output).
            swDest: 'sw.js', // Or wherever you prefer it to land during the build process.
            devOptions: {
                enabled: true,
                type: 'module'
            }
        }),
    ],
});
```

### 2. Refactoring the Service Worker Logic

Instead of having a separate `public/sw.js`, move your Service Worker logic into your source directory (e.g., `./src/service-worker.js`). This keeps all related PWA assets within the Vite context, ensuring that when Vite runs its build, it correctly processes these files before generating the final assets for deployment in a Laravel application structure.

This approach ensures that `vite-plugin-pwa` has full visibility into your source code, allowing it to perform the necessary transformations and output generation without relying on a post-build file copy mechanism that doesn't exist in this build environment.

## Conclusion: Embracing the Modern Ecosystem

The transition from Laravel Mix/Webpack to Vite is an evolution towards more streamlined, faster development experiences. When integrating specialized tools like `vite-plugin-pwa`, the key is to stop trying to replicate old Webpack behaviors and start leveraging Vite's native asset ingestion model. By correctly configuring `swSrc` and ensuring your Service Worker logic resides within the project structure, you allow the plugin to manage the entire PWA lifecycle seamlessly.

By adopting this structured approach, you ensure that your Laravel application remains performant and future-proof, fully utilizing the power of modern frontend tooling. For more information on leveraging the capabilities of the Laravel stack, explore resources available at [https://laravelcompany.com](https://laravelcompany.com).
