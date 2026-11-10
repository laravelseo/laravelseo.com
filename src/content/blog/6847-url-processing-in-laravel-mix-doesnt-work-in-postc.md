---
title: "URL Processing in Laravel mix doesn't work in postCSS"
description: "This is a very common stumbling block when migrating from a preprocessor like Sass to a pure PostCSS workflow, especially when dealing with asset imports..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

This is a very common stumbling block when migrating from a preprocessor like Sass to a pure PostCSS workflow, especially when dealing with asset imports (fonts, images). The conflict arises because Sass uses its `@import` directive for file inclusion and path resolution *during the compilation phase*, whereas PostCSS plugins operate on the resulting CSS string *after* it has been generated.

The errors you are seeing:
```
Module not found: Error: Can't resolve '../fonts/lg.svg?22t19m' in '/home/http/app/resources/css'
```
These errors confirm that the `postcss-import` plugin, or the underlying module resolver (`enhanced-resolve`) used by Webpack, cannot find the specified relative paths when processing `/resources/css/app.css`. This usually means the file resolution logic is broken or incomplete in the context of your specific loader chain.

Here is a developer-focused breakdown of why this happens and how to achieve your goal—moving entirely to PostCSS for asset handling while leveraging Tailwind CSS, which aligns perfectly with modern tooling practices promoted by organizations like [Laravel](https://laravelcompany.com).

---

## Understanding the Conflict: Sass vs. PostCSS Asset Handling

When you use Sass (`@import 'path/to/file.svg'`), the Sass compiler handles fetching and embedding those files into the final CSS output based on its internal module system.

When you switch to a pure PostCSS setup, the process becomes:
1. **Sass/Preprocessor outputs raw CSS** (or plain CSS).
2. **PostCSS loaders read this CSS.**
3. Plugins like `postcss-import` try to resolve `@import` statements within that CSS string.

If your asset paths are relative (`../fonts/lg.svg`), the loader system needs explicit knowledge of where these assets reside relative to the source file being processed. The failure indicates that the path resolution mechanism in your specific setup is not correctly mapping the file system structure when PostCSS attempts to resolve those external references within `app.css`.

## Solution: Refactoring to a Pure PostCSS/Tailwind Workflow

To successfully eliminate Sass and rely entirely on PostCSS for asset handling, you need to shift the responsibility of asset inclusion from the preprocessor to the **build pipeline** (Webpack/PostCSS).

### Step 1: Eliminate Sass Imports for Assets

Remove all `@import` statements related to assets from your `.scss` file. Your primary CSS files should contain only Tailwind directives and custom styles.

**`/resources/sass/app.scss` (Refactored):**
```scss
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/* Remove asset imports from here */
/* @import '~lightgallery.js/src/sass/lightgallery'; 
@import 'mixins/svg'; 
*/
```

### Step 2: Handle Asset Inclusion via PostCSS Plugins (or Webpack)

Since you want to use PostCSS for this, you must rely on how your bundler handles static assets. The most robust way to handle fonts and images in a modern setup is to let the bundler (Webpack) manage asset imports rather than relying on CSS `@import`s referencing relative paths.

**If you absolutely must keep the structure where PostCSS resolves these:**

You need to ensure that the files referenced (`fonts/lg.svg`, `img/loading.gif`, etc.) are accessible and resolvable from the context of your CSS file *during the build*. Because this is failing, it strongly suggests a configuration issue with how **`postcss-import`** interacts with your asset paths in relation to the output file location (`resources/css`).

A cleaner approach, often favored by frameworks like Laravel which rely on clean bundling, is to use Webpack's built-in asset handling or a dedicated tool for injecting fonts.

### Step 3: The Recommended PostCSS/Tailwind Approach (The Cleanest Path)

For Tailwind projects, the most effective path is to let Tailwind handle the utility classes and use tools like **`@import`** *only* for Tailwind directives, while managing external assets separately via Webpack's asset modules or by placing assets in a way that can be imported cleanly.

If you are using Laravel Mix (which uses Webpack under the hood), ensure your asset paths are absolute or correctly configured within the context of the build.

**Refactoring `webpack.mix.js`:**

Since you want to ditch `.sass()`, you should remove it and rely purely on PostCSS handling the final output, or use a dedicated Sass/PostCSS compiler setup if necessary.

If you are committed to using CSS directly:
```javascript
const mix = require('laravel-mix');

mix.js('resources/js/app.js', 'public/js')
   // Remove .sass() call entirely
   // .sass('resources/sass/app.scss', 'public/css') 
   .styles([
        'resources/css/app.css' // This file will now be processed purely by PostCSS
      ],'public/css/app.css')
   .postCss('public/css/app.css', 'public/css', [
      require('postcss-import'), // Handles @import statements if they exist in app.css
      require('tailwindcss'),
      require('autoprefixer'),
    ]);
```

### Conclusion and Best Practice Summary

The core issue is that relative asset paths embedded directly into a CSS file via `@import` are often incompatible with the scope of PostCSS loaders unless the entire asset
