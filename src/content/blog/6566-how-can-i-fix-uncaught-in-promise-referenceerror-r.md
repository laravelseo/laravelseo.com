---
title: "How can I fix Uncaught (in promise) ReferenceError: require is not defined with Vite?"
description: "How Can I Fix Uncaught (in promise) ReferenceError: require is not defined with Vite? Migrating an existing Laravel application, especially one built using..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "JavaScript", "Errors"]
featured: false
---

Migrating an existing Laravel application, especially one built using older tooling like Mix, to the modern Vite stack is a common yet often frustrating process. As you’ve encountered, these migrations frequently surface subtle errors related to module resolution, particularly when transitioning from CommonJS `require()` syntax to the native ES Module (ESM) environment that Vite enforces.

The specific error you are facing—`Uncaught (in promise) ReferenceError: require is not defined`—is a classic symptom of this transition. This post will walk you through the root cause and provide practical, modern solutions for fixing this issue in your Vue/Inertia application built with Vite.

## Understanding the Conflict: CommonJS vs. ES Modules

The core problem lies in the incompatibility between how older JavaScript modules (using `require()`) were designed and how modern bundlers like Vite operate.

When you use `require('./Pages/${name}.vue')` in your entry file (`app.js`), you are invoking Node.js's CommonJS module loading mechanism. While Node.js supports `require`, the environment Vite uses for bundling and serving assets is fundamentally based on ES Modules (ESM). In a pure ESM context, the global function `require` simply does not exist, leading to the `ReferenceError`.

This error often pops up when you try to dynamically import local files that were traditionally loaded using synchronous module loading.

## The Solution: Adopting Native ES Module Imports

The fix is to refactor your code to exclusively use native ES Module `import` statements for resolving dependencies. This aligns your application with Vite’s expectations and ensures proper tree-shaking and dependency resolution during the build process, which is crucial for performance and stability in modern Laravel applications.

### Refactoring `app.js` for Vite Compatibility

In your `resources/js/app.js`, you need to replace synchronous `require` calls with dynamic or static ES `import` statements. Since you are resolving components dynamically based on a variable, we will leverage Vite’s ability to handle dynamic imports if necessary, though for static routes, direct import is cleaner.

Here is how you can approach fixing the specific line causing the error:

**Original problematic code snippet:**
```javascript
createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => require(`./Pages/${name}.vue`), // <-- Problematic line
    setup({ el, app, props, plugin }) {
// ... rest of the code
```

**Recommended Fix using ES Imports:**

Instead of relying on dynamic `require`, you should structure your file imports to be handled by Vite's asset pipeline. If you are resolving pages dynamically within Inertia, ensure that the resolution mechanism is handled either statically or via a dedicated route configuration rather than runtime file system access via `require`.

For component resolution in an Inertia context, if possible, resolve these paths statically at build time or use dynamic `import()` if the module loading needs to be asynchronous:

```javascript
import { createApp, h } from "vue";
import { createInertiaApp } from "@inertiajs/inertia-vue3";
import { InertiaProgress } from "@inertiajs/progress";

/* FontAwesome */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import "@/**/Sources/icons"; // Ensure asset imports are handled correctly by Vite

/* Multi-language */
// ... (all your i18n imports remain the same)

const appName = window.document.getElementsByTagName("title")[0]?.innerText || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    // Change the resolve function to use dynamic import if necessary, 
    // or rely on Inertia's standard routing setup for file resolution.
    resolve: (name) => import(`./Pages/${name}.vue`), // Use dynamic import()
    setup({ el, app, props, plugin }) {
        return createApp({ render: () => h(app, props) })
            .use(plugin)
            .use(i18n)
            .use(VueHighlightJS)
            .component("icon", FontAwesomeIcon)
            .mixin({ methods: { route } })
            .mount(el);
    },
});

InertiaProgress.init({ color: "#4B5563" });
```

By changing `require(...)` to the asynchronous `import(...)`, you signal to Vite that this is an asset dependency that needs to be processed by the bundler, resolving the runtime error and enabling proper module tree-shaking, which is a key principle behind efficient application development on platforms like Laravel.

## Conclusion: Embracing the Modern Stack

Migrating from older build systems to Vite is an opportunity to modernize your codebase and leverage superior tooling. The `require is not defined` error is merely a friction point indicating that you are mixing module paradigms. By consciously shifting all dependency resolution to use native ES Module syntax—specifically using `import` statements—you ensure compatibility with Vite, achieve optimal performance through effective bundling, and align your Laravel application with current best practices. Embrace the power of modern tooling; it makes developing robust applications on platforms like **[laravelcompany.com](https://laravelcompany.com)** smoother and more efficient.
