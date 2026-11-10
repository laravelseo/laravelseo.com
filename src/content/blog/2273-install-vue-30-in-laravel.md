---
title: "Install vue 3.0 in laravel"
description: "Title: A Comprehensive Guide to Installing Vue 3.0 in Laravel 8 Introduction: Laravel 8 combines perfectly with VueJS for building powerful, user friendly..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "JavaScript"]
featured: false
---

Title: A Comprehensive Guide to Installing Vue 3.0 in Laravel 8

Introduction:
Laravel 8 combines perfectly with VueJS for building powerful, user-friendly applications. But sometimes, you may run into issues while integrating both frameworks. This article will offer a guide for a seamless installation of Vue 3 and troubleshoot common problems that arise during the process.

Step 1: Install Vue 3.0 with Laravel Mix
To install Vue 3.0 in your Laravel project, you can use the Laravel Mix package. Laravel Mix is a streamlined tool for compiling assets (CSS/JS) and managing dependencies. Here's how to set it up:

1. Update Laravel: Ensure you have Laravel 8 installed by running `composer update`. If not, follow the Laravel installation guide from the official documentation.
2. Install Vue CLI: Since Laravel Mix uses webpack under the hood, we need to install the Vue CLI globally, which comes with webpack. Type `npm install -g @vue/cli` in your terminal.
3. Start a new project: Create a new Vue 3.0 project using the Vue CLI. Run `vue create vue3-app`, select "Manually select features" and press Enter, then `npm run serve` to start the app. This will install Vue 3.0 without any dependencies on Laravel.
4. Install dependencies: Now that you have a running Vue 3.0 project, navigate back to your Laravel project's folder and create a new directory for assets with `mkdir resources/js`. Move the Vue project files (`src`) into this new directory, replacing "vue" with "app".
5. Update Laravel Mix: Open the `webpack.mix.js` file in your Laravel project and replace the contents with:
   ```javascript
   let mix = require('laravel-mix');

   mix.webpackConfig((config) => {
       config.module.rules.push({
           test: /\.vue$/,
           loader: 'vue-loader',
           options: {
               compilerOptions: {
                   preserveWhitespace: false,
                   optimizeSSR: false,
               },
           },
       });
   });

   mix.js('resources/js/app.js', 'public/js').sass('resources/sass/app.scss', 'public/css');
   ```
6. Update the `app.js` file: Replace your existing code with this:
   ```javascript
   import Vue from 'vue';

   const { createApp } = require('./src/create-app');

   window.Vue = new Vue({
       el: '#app',
       render: h => createApp().$mount(h),
    });
   ```

Step 2: Install vue-template-compiler and Resolve Issues
If you still face issues while installing dependencies or see errors regarding different versions of Vue, there might be conflicts between the Laravel version and Vue CLI. To resolve these issues, follow these steps:

1. Remove the old installation: Delete your current vue3-app directory and node_modules folder.
2. Update Vue CLI: Update your global Vue CLI by running `npm uninstall -g @vue/cli` followed by `npm install -g @vue/cli`. This will ensure you have the latest version of Vue CLI.
3. Update npm configuration: Edit your `package.json` file and add the following lines to the dependencies section:
   ```json
   "@vue/cli-plugin-babel": "^4.5.12",
   "@vue/cli-service": "^4.5.12"
   ```
4. Reinstall dependencies: Run `npm install` in your Laravel project's folder to reinstall all dependencies and update the node_modules directory.
5. Create a new Vue 3.0 project again using the updated Vue CLI.
6. Copy the freshly created files into your Laravel project as described in step 1 of Step 1 above.
7. Remove `npm install vue@next` and replace it with `npm install @vue/runtime-dom`.
8. Run `composer require laravel/ui:^2.0` to update the Laravel UI package.
9. Update Laravel Mix as described in Step 1. Ensure compatibility between Laravel and Vue versions.

Conclusion:
Now, you've successfully installed Vue 3.0 with Laravel 8 without any issues from conflicts or incorrect versioning. This comprehensive guide should provide you with a seamless experience when integrating these powerful frameworks, allowing you to create robust web applications quickly and efficiently. Remember to keep your dependencies up-to-date to avoid potential errors or discrepancies.
