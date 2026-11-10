---
title: "Unable to locate file in Vite manifest: resources/sass/app.scss. Laravel:10.6.2, while installing new project with php artisan auth:ui"
description: "Solving the Vite Manifest Mystery: Why \"Unable to locate file\" Breaks Your Laravel Setup As developers working with modern PHP frameworks, we often rely on..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers working with modern PHP frameworks, we often rely on sophisticated tooling like Vite for asset bundling and compilation. When setting up a new Laravel project, especially when using scaffolding tools like `php artisan auth:ui` which integrate Vite, unexpected errors can derail the setup process. One of the most frustrating errors encountered is: **"Unable to locate file in Vite manifest: resources/sass/app.scss."**

This post will dive deep into why this error occurs during a fresh Laravel installation and provide a comprehensive, developer-focused solution to get your assets compiling smoothly.

## Understanding the Root Cause: The Vite Manifest

The error message is not about missing files on your disk; it's an issue with how the Vite build process (managed by `vite.config.js`) is trying to locate the source files defined in its manifest.

Vite uses a manifest file to map all entry points and assets that need to be processed during compilation. When you run `npm run dev` or `npm run build`, Vite looks for references specified in this manifest. If it cannot find a specific path—like `resources/sass/app.scss`—it throws the "Unable to locate file" error, even if you know the file exists manually.

This usually points to a mismatch between the asset paths configured in your `vite.config.js` and the actual directory structure created by the scaffolding process.

## Troubleshooting Steps: A Developer’s Approach

Before diving into complex configuration changes, let’s review the steps you've already taken and why they might not have been sufficient. You mentioned checking the manifest, manually creating files, and reinstalling dependencies (`composer update`, `npm install`). While these are good first steps, the issue often lies in the *configuration* of how Vite is told to handle those assets.

### 1. Verify Directory Structure

Ensure your file structure strictly adheres to Laravel conventions:
```
resources/
├── css/
│   └── app.css (or app.scss)
└── js/
    └── app.js
```
If you are using Sass, the structure is typically `resources/sass/app.scss`. If the scaffolding process expected a different path for asset compilation, the link in Vite’s manifest will break.

### 2. Inspect `vite.config.js`

The most critical file is `vite.config.js`. This file dictates where Vite looks for entry points. For Laravel projects utilizing default setups, this file often needs explicit configuration to correctly point to the assets within the `resources` directory.

A common pitfall is incorrect path resolution, especially when dealing with Sass or Bootstrap imports that rely on specific file extensions being recognized by the build system.

### 3. The Correct Configuration Fix (The Solution)

Instead of relying solely on manual creation and dependency updates, we need to ensure Vite knows exactly how to handle the assets you are importing.

If your error specifically points to `resources/sass/app.scss`, open your `vite.config.js` and verify the `build.rollupOptions` or asset handling section. Often, explicitly defining the `publicDir` or ensuring that `@import` directives within your Sass files are correctly handled by the Vite plugin resolves this ambiguity.

Here is an example of how a standard configuration should look, emphasizing correct pathing:

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue'; // If using Vue stack

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.scss', // Ensure this path matches your actual file location
                'resources/js/app.js'
            ],
            refresh: true,
        }),
        vue(), 
    ],
    // If you are running into specific asset resolution issues related to Sass, 
    // ensure the base path is correctly set if using custom public directories.
});
```

Notice how we explicitly list the entry points under `input`. This explicit mapping ensures that Vite builds a manifest that accurately reflects the files it needs to process, resolving the "Unable to locate file" error caused by an incomplete or mismatched manifest generation.

## Conclusion

The error "Unable to locate file in Vite manifest: resources/sass/app.scss" is almost always a symptom of misconfiguration within the asset pipeline, rather than a simple missing file. By moving beyond manual file creation and focusing on correctly configuring your `vite.config.js` to explicitly map all entry points—as demonstrated above—you ensure that Laravel's modern asset tooling functions as intended.

Remember, mastering these configuration details is key to leveraging the power of frameworks like Laravel effectively. For more insights into building robust applications with Laravel, always check the official documentation and best practices provided by [Laravel Company](https://laravelcompany.com/). Happy coding!
