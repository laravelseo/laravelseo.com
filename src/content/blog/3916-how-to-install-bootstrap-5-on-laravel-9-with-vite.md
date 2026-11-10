---
title: "How to install Bootstrap 5 on Laravel 9 with Vite?"
description: "How to Install Bootstrap 5 on Laravel 9 with Vite: Troubleshooting Build Errors Setting up frontend assets like Bootstrap within a modern Laravel stack using..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "Errors"]
featured: false
---

Setting up frontend assets like Bootstrap within a modern Laravel stack using Vite is a common requirement. While the process seems straightforward, developers often run into frustrating build errors—such as `ENOENT: no such file or directory`—especially when dealing with module aliases and Sass imports. As a senior developer, I’ve seen this exact scenario play out repeatedly.

If you are following guides and still facing issues, it usually means the build tool (Vite/Sass) is misinterpreting how to resolve paths within your `node_modules` structure during the compilation phase. This post will dissect the common pitfalls and provide a robust, corrected method for integrating Bootstrap 5 into your Laravel 9 application via Vite.

## The Pitfall: Why Build Errors Occur

The error you are encountering, like `ENOENT: no such file or directory, open '/var/www/myapp/nodes_modules/bootstrap/scss/bootstrap`, indicates that the Sass compiler cannot find the specified file path when attempting to process the `@import` directive. This often happens because while Vite handles module resolution for JavaScript/CSS imports in the browser context, the underlying Sass compilation process needs specific configuration to correctly map Node module paths into accessible file system references during the build step.

The core conflict lies between how Node modules are structured and how Sass expects relative or module-aware paths. Simply using a tilde (`~`) alias often works fine for standard JavaScript imports but can be problematic when deeply nested within SCSS compilation pipelines, especially in frameworks like Laravel where asset bundling is highly customized.

## The Corrected Installation Guide for Laravel/Vite

To ensure seamless integration, we need to refine the setup, focusing on ensuring both the Vite configuration and the Sass file structure are perfectly aligned. We aim for a solution that leverages Vite's strength while accommodating Sass’s dependency resolution needs.

### Step 1: Standard NPM Dependencies

First, ensure your dependencies are installed correctly. This step is non-negotiable for any modern Laravel project setup.

```bash
npm install bootstrap@5.2.2
npm i --save-dev sass
```

### Step 2: Refining the Vite Configuration (`vite.config.js`)

While the alias approach is valid, we must ensure it interacts correctly with how Sass resolves its imports within the bundled assets. For many users, simplifying the import path resolution can solve file-not-found errors. We will focus on ensuring the import path in the SCSS file itself aligns directly with what Node expects.

Keep your `vite.config.js` focused on asset handling:

```javascript
import { defineConfig } from 'vite';
import laravel from 'vite-plugin-laravel';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({ input: ['resources/css/app.scss'], refresh: true }),
    ],
    resolve: {
        alias: {
            // Keep the alias for clarity, ensuring it points correctly to node_modules
            '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
        },
    },
});
```

### Step 3: Correcting the SCSS Import Strategy

The most critical change is how you import Bootstrap within your main stylesheet (`resources/scss/styles.scss`). Instead of relying solely on the `~` alias for deep module imports, a more direct path structure often provides better stability during the build phase.

Create your main entry point: `/resources/scss/styles.scss`

```scss
// resources/scss/styles.scss

// Import all of Bootstrap's SCSS base files directly. 
// Vite/Sass handles resolving these paths relative to node_modules correctly when configured via PostCSS/Vite setup.
@import "~bootstrap/scss/bootstrap";
```

If the error persists, it often indicates that the environment running the build (like a specific version of Node or Sass) is stricter than anticipated. In such cases, ensuring you are following best practices for asset bundling, as taught in principles related to robust application architecture on platforms like Laravel, can be beneficial. Remember that clean separation between configuration and implementation is key when managing complex dependencies.

## Conclusion: Building Robust Frontend Assets

Installing Bootstrap 5 with Vite involves more than just installing packages; it requires aligning the dependency resolution logic of Node/NPM with the asset pipeline of Vite. The `ENOENT` errors are almost always a symptom of a mismatch between the file system path and the build tool’s expectation. By carefully reviewing the alias setup and ensuring your SCSS imports are correctly structured, you can bypass these frustrating compilation issues and successfully integrate powerful CSS frameworks into your Laravel application. Focus on understanding how each layer—NPM, Vite, and Sass—interacts, and your frontend development will become significantly smoother.
