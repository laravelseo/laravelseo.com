---
title: "Laravel Vite assets from https"
description: "Resolving HTTPS Asset Loading Issues in Laravel Vite Deployments As developers working with modern Laravel stacks, we often encounter subtle but frustrating..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "HTML"]
featured: false
---

As developers working with modern Laravel stacks, we often encounter subtle but frustrating issues related to asset loading, especially when deploying applications to secure environments like HTTPS. A common scenario arises when your application is configured for `APP_URL=https://`, yet the compiled assets, loaded via the `@vite` directive, continue to reference or load resources from the insecure `http` protocol.

This post dives deep into why this happens and provides a robust solution within the Vite configuration, bypassing complex changes to service providers.

## The Problem: Protocol Mismatch in Asset Loading

The issue you are facing—where Vite assets are served over HTTP despite the application running under HTTPS—is typically not a failure of the web server itself, but rather an incorrect base path resolution embedded within the compiled asset manifest or the build configuration.

When Vite compiles your assets, it generates manifest files that dictate where the browser should look for these resources. If this manifest is hardcoded or defaults to an insecure protocol based on the environment context during the build process, the resulting HTML/JavaScript calls will default to HTTP, regardless of the root URL set in your Laravel configuration.

This often happens because the mechanism used by Vite to determine the public path isn't correctly inheriting the secure context provided by Laravel's framework setup. As we explore solutions here, remember that understanding the underlying architecture is key, much like when building robust applications on platforms like those promoted by [laravelcompany.com](https://laravelcompany.com).

## Why Simple Flags Fail

You mentioned trying `vite build -- --https`. While this seems intuitive, command-line flags often control the *build* process (compilation and bundling) rather than the *runtime* asset serving path resolution. The issue here is about how the final deployed files are referenced, not how they are initially built. We need to adjust the configuration that governs public path generation.

## The Solution: Configuring Vite for HTTPS Base Paths

Since we want to avoid modifying core service providers, the most effective place to enforce correct base paths is within the `vite.config.js` file itself. We can explicitly define the base URL context that Vite uses when generating asset links.

By setting the correct base path in the configuration, we instruct Vite to generate assets that are correctly prefixed for HTTPS environments.

Here is how you can adjust your `vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import laravel from 'laravel-vite';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/js/app.js',
            ],
            // *** The fix is applied here ***
            base: 'https://your-domain.com/', 
        }),
    ],
});
```

### Explanation of the Change

By explicitly setting the `base` option in the Vite configuration to your full HTTPS domain (`'https://your-domain.com/'`), you are telling the Vite build system exactly what public root path the assets should be generated relative to. When Vite generates the asset manifest, it uses this defined base URL as the prefix for all generated paths.

When the browser subsequently requests `@vite('resources/js/app.js')`, the resulting link will correctly reference the asset location prefixed by `https://your-domain.com/`, ensuring that the protocol context is respected across your entire application. This approach keeps the framework setup clean while fixing the asset loading discrepancy directly at the build configuration level.

## Conclusion

Resolving subtle deployment issues like this often requires looking beyond the immediate framework configuration and diving into the tool's specific configuration files. By correctly setting the `base` path within `vite.config.js`, developers can ensure that their compiled assets are correctly scoped for secure HTTPS environments without introducing unwanted side effects to other parts of the Laravel application. This practice ensures consistency, security, and robustness in your deployment pipeline, aligning perfectly with best practices promoted by the Laravel ecosystem.
