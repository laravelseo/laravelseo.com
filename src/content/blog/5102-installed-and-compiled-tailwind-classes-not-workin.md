---
title: "Installed and compiled: tailwind classes not working on fresh install of laravel 6"
description: "Installed and Compiled: Why Tailwind CSS Fails on a Fresh Laravel 6 Install (And How to Fix It) As a senior developer, I’ve seen countless times where..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

As a senior developer, I’ve seen countless times where installation commands run perfectly, dependencies are installed correctly, but the final output simply doesn't reflect the changes you’ve made. This is especially frustrating when setting up a modern utility framework like Tailwind CSS on an older stack, such as a fresh Laravel 6 installation.

You’ve encountered a very common roadblock: installing and compiling Tailwind classes results in zero visible change, even without throwing explicit errors. This usually points to a misconfiguration in the asset pipeline—specifically how Webpack (Laravel Mix) is instructed to process your SCSS files through PostCSS.

Let's dive into why this happens and walk through the definitive solution for getting Tailwind working flawlessly on Laravel 6.

## The Anatomy of the Problem: Silent Failures in Asset Compilation

When you follow the steps you outlined—installing Tailwind, defining the directives in your SCSS, and setting up `webpack.mix.js`—you are essentially telling Laravel Mix to compile Sass into CSS. However, for Tailwind to inject its utility classes, the build process must correctly recognize the PostCSS pipeline that Tailwind relies on.

The silence you experience (no errors) means the compilation *runs*, but the critical step of processing the Tailwind directives through PostCSS is either missing or improperly configured in your Mix setup. The framework is installed, but the final CSS file isn't being generated with the necessary utility classes.

## The Correct Implementation for Laravel 6

To ensure success on older setups like Laravel 6, we need to make sure PostCSS and Tailwind are correctly chained together within our asset compilation configuration. Here is the proven, step-by-step method:

### Step 1: Standard Installation

First, ensure you have the necessary packages installed via npm:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
*(Note: Using `npx tailwindcss init -p` is often cleaner than managing the configuration files manually.)*

### Step 2: Configure SCSS Directives

Ensure your main stylesheet (e.g., `resources/sass/app.scss`) correctly imports the Tailwind directives. This tells the PostCSS processor where to inject the base styles, components, and utilities.

```scss
/* resources/sass/app.scss */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 3: Update Webpack Mix Configuration (The Crucial Step)

This is where the magic happens. You must explicitly tell Laravel Mix to use PostCSS, passing it the generated `tailwind.config.js` file. This ensures that Tailwind's engine runs during the compilation process.

In your `webpack.mix.js` file, ensure your setup looks like this:

```javascript
// webpack.mix.js
var tailwindcss = require('tailwindcss');

mix.js('resources/js/app.js', 'public/js')
  .sass('resources/sass/app.scss', 'public/css')
  .options({
    processCssUrls: false,
    // Crucially, integrate PostCSS and pass the Tailwind config
    postCss: [ tailwindcss('tailwind.config.js') ], 
});
```

By including `tailwindcss('tailwind.config.js')` within the `postCss` array, you are forcing Webpack to run the Tailwind compiler on your SCSS files before generating the final public CSS output. This correctly bridges the gap between Sass compilation and Tailwind utility generation.

## Conclusion: Framework Consistency Matters

The issue you faced is less about Tailwind itself and more about ensuring framework consistency across different versions. Whether you are working within the robust ecosystem provided by platforms like Laravel, understanding how build tools integrate is paramount. When setting up projects, always refer to official documentation or community best practices—for instance, exploring resources related to modern PHP frameworks can provide deeper insights into these asset pipeline configurations.

By correctly configuring PostCSS within your Webpack setup, you ensure that Tailwind CSS is properly compiled and injected into your final assets. Now, when you apply classes like `bg-red-400` in your HTML, they will render perfectly!
