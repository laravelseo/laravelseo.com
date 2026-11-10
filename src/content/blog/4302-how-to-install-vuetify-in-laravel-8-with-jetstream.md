---
title: "How to install Vuetify in Laravel 8 with jetstream-inertia?"
description: "How to Install Vuetify in Laravel 8 with Jetstream and Inertia: A Deep Dive Integrating a powerful UI framework like Vuetify into a modern Laravel..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "Errors"]
featured: false
---

Integrating a powerful UI framework like Vuetify into a modern Laravel stack—especially one leveraging the power of Jetstream and Inertia—can sometimes feel like navigating a maze. While the basic setup looks straightforward, subtle configuration mismatches in Webpack, asset loading, or Vue initialization can lead to frustrating errors that don't immediately throw a fatal exception.

If you are running into issues installing Vuetify on Laravel 8 with Jetstream/Inertia, it is usually not a problem with the Vuetify library itself, but rather how the build tools (Webpack/Vite) and the Vue entry points are configured to handle global CSS imports and component bundling.

As a senior developer, I’ve seen many developers struggle with this exact setup. Let's break down the correct approach to ensure your integration is smooth and robust, drawing on best practices for modern Laravel applications.

## Understanding the Integration Challenge

The core challenge in integrating Vuetify is bridging the gap between a standard Laravel asset pipeline (like Mix or Vite) and Vue’s component-based structure, ensuring that the necessary CSS is correctly injected globally, and that the Vue application initializes with the Vuetify instance correctly exposed.

Your provided configuration snippets show you are on the right track by using `vuetify-loader`, but we need to ensure the loading order and module definitions are perfectly aligned within the Inertia context.

## Step 1: Setting Up the Vuetify Plugin (The Entry Point)

The file you referenced, `resource/plugins/vuetify.js`, is crucial. It defines how Vue should interact with the Vuetify library.

```javascript
import Vue from 'vue'
import Vuetify from 'vuetify/lib' // Use the correct import path for setup
import 'vuetify/dist/vuetify.min.css' // Import the core CSS here for global scope

Vue.use(Vuetify)

const opts = {}

export default new Vuetify(opts)
```

**Key Takeaway:** By importing `vuetify.min.css` directly within this setup file, you ensure that the necessary global styles are loaded early in the application lifecycle, which is essential for components to render correctly across your Inertia pages.

## Step 2: Configuring Webpack/Mix for Asset Loading

The configuration in your `webpack.mix.js` dictates how these Vue assets are compiled. Using a dedicated loader plugin is the correct way to handle Vuetify's specific CSS and module requirements within a Laravel environment.

```javascript
const mix = require('laravel-mix')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

mix
    .js('resources/js/app.js', 'public/js')
    .postCss('resources/css/app.css', 'public/css', [
        require('postcss-import'),
        require('tailwindcss'),
        // Vuetify styles should ideally be handled by the loader, but ensure your base CSS is included
    ])
    .webpackConfig({
  plugins: [
    new VuetifyLoaderPlugin() // This plugin manages the necessary imports during compilation
  ],
})
.browserSync('tb8.test');
```

The `VuetifyLoaderPlugin` hooks into the Webpack build process to ensure that all required Vuetify modules and CSS references are correctly bundled, preventing runtime errors where components fail to render their styling. Remember, adhering to the principles of clean architecture is vital when building complex applications, and Laravel provides excellent foundations for this kind of development, as demonstrated by the community support around frameworks like [Laravel Company](https://laravelcompany.com/).

## Step 3: Initializing Vue with Inertia

The final piece is correctly integrating the Vuetify instance into your main application entry point (`app.js`). This is where you expose the `vuetify` instance to the root Vue component.

```javascript
import PortalVue from 'portal-vue';
import Vue from 'vue';
// Assuming vuetify is imported or defined globally if using specific modules setup earlier
import vuetify from './plugins/vuetify'; // Import your configured Vuetify instance

Vue.use(InertiaApp);
Vue.use(InertiaForm);
Vue.use(PortalVue);
Vue.use(vuetify); // Register the Vuetify instance

const app = document.getElementById('app');

new Vue({
   vuetify, // Pass the instantiated instance here
   render: (h) =>
      h(InertiaApp, {
        props: {
            initialPage: JSON.parse(app.dataset.page),
            resolveComponent: (name) => require(`./Pages/${name}`).default,
        },
    }),
}).$mount(app);
```

By passing the `vuetify` instance directly to the root Vue component via the `render` function, you ensure that all subsequent components rendered through Inertia inherit the necessary styling context. This structure allows your application to scale while maintaining strong separation of concerns between backend logic (Laravel) and frontend presentation (Vue/Vuetify).

## Conclusion

Installing Vuetify in a Laravel 8/Jetstream/Inertia environment is less about finding a single error and more about correctly sequencing the setup: defining the Vue plugin, configuring the build tool to handle assets, and correctly injecting the framework instance into the main application entry point. By following these structured steps and paying close attention to how your asset pipelines interact with Vue initialization, you will successfully achieve a beautiful and functional interface on your Laravel application.
