---
title: "Include custom JavaScript in the app.js"
description: "Including Custom JavaScript: Mastering Dependencies in Your Application As senior developers, we frequently encounter situations where we need to manage..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Content", "JavaScript", "HTML", "Errors"]
featured: false
---

As senior developers, we frequently encounter situations where we need to manage dependencies—like jQuery and Bootstrap—within a custom JavaScript file. The request to include code using `require('...')` directly inside a single `app.js` file touches upon a fundamental difference between Node.js module systems and how browsers execute JavaScript.

This post will dive into why the direct use of `require()` often fails in a browser context, and more importantly, outline the correct, modern, and practical ways to achieve dependency management for your application scripts.

## The Misconception: `require` vs. Browser Execution

The code snippet you provided:
```javascript
window.$ = window.jQuery = require('jquery')
require('bootstrap-sass');
```
This syntax is characteristic of the CommonJS module system used by Node.js. In a standard web browser, JavaScript engines do not natively understand `require()`. Therefore, if you try to run this code directly in an HTML file (e.g., `<script src="app.js"></script>`), it will result in a runtime error because the browser cannot resolve these module calls.

To include external libraries like jQuery or Bootstrap successfully, you must use methods that allow the browser to download and execute those scripts sequentially.

## Solution 1: The Traditional & Robust Method (CDN Linking)

The simplest, most reliable way to include large, established libraries is by linking to them via Content Delivery Networks (CDNs). This delegates the loading and dependency management to a specialized server, which is much more efficient than bundling everything yourself for simple setups.

For example, instead of trying to `require` jQuery, you simply add the `<script>` tags into your HTML structure:

```html
<!-- Load jQuery first, as Bootstrap often depends on it -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<!-- Load Bootstrap Sass (or compiled CSS) -->
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">

<!-- Your custom application logic -->
<script src="app.js"></script>
```

In your `app.js` file, you can now safely assume that the global variables (`$`, `$.fn.addClass`, etc.) have been injected into the window object by the scripts loaded above. This approach keeps your main application logic clean and avoids complex bundling issues. This philosophy of separating concerns is highly valued in modern development practices, similar to how robust architecture is key when building scalable systems, regardless of whether you are working on a full-stack framework or front-end tools like those promoted by organizations such as Laravel.

## Solution 2: The Modern Approach (Module Bundlers)

If your project grows and requires managing dozens of dependencies, bundling them manually becomes unwieldy. This is where modern build tools like Webpack, Vite, or Parcel become essential. These tools act as sophisticated dependency managers. They read your entry file (`app.js`), identify all the `import` or `require` statements, download those modules, resolve their dependencies, and output a single, optimized bundle that the browser can execute.

With a bundler, you would structure your files like this:

1.  **Dependencies:** List requirements in a configuration file (e.g., `package.json`).
2.  **Entry Point (`app.js`):** Use standard ES Module syntax (`import`) to pull in the libraries you need.
3.  **Bundler Execution:** Run the build command, which processes everything into one optimized output file (e.g., `bundle.js`).

This approach moves dependency management out of the runtime environment and into the development workflow, leading to more maintainable code. For complex applications, adopting these professional tooling standards ensures that your application remains scalable and easy to maintain as it evolves.

## Conclusion

To summarize, attempting to use Node-specific `require()` calls directly within a browser-executed `app.js` file is not the correct path for standard web development. The best strategy depends entirely on the scope of your project:

1.  **For small projects or quick setups:** Use CDN links to load libraries directly in your HTML.
2.  **For large, complex applications:** Employ a module bundler (like Webpack) to handle dependency resolution and bundling automatically.

By understanding this distinction between runtime execution and build-time processing, you can write more robust, predictable, and maintainable JavaScript code.
