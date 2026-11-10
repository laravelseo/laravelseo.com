---
title: "Convert ES6 to ES2015 using babel and laravel-mix"
description: "Bridging the Gap: Converting ES6 to ES5 for IE11 Support with Babel and Laravel Mix As developers working within the modern JavaScript ecosystem, we..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "Errors"]
featured: false
---

As developers working within the modern JavaScript ecosystem, we frequently encounter a common challenge: ensuring our cutting-edge code remains compatible with older browser environments. When developing Vue components or complex front-end applications, leveraging the power of modern ES6+ syntax is natural. However, for projects that must support legacy browsers like Internet Explorer 11 (IE11), this modern syntax will cause runtime errors.

The solution lies in **transpilation**: converting the newer ECMAScript syntax (ES6) into older, widely supported JavaScript (ES5). In the Laravel ecosystem, where asset bundling is handled by tools like Laravel Mix (which uses Webpack under the hood), Babel is the essential tool for this transformation.

This guide will walk you through the precise steps required to successfully convert your ES6 code to ES5 using Babel integrated with Laravel Mix, ensuring broad browser compatibility.

## The Role of Babel in Asset Bundling

Laravel Mix automates the process of compiling and bundling your front-end assets. When you use `mix.js()`, it invokes Webpack to handle module resolution and asset processing. To introduce transpilation into this pipeline, we need to configure Babel so that Webpack knows to run Babel on our JavaScript files before they are bundled for production.

The process involves installing the necessary Babel packages and creating a configuration file that tells Babel *what* transformations to apply.

### Step 1: Installing Required Dependencies

First, you need to install Babel core, the necessary preset for handling modern syntax, and the Babel loader for Webpack.

```bash
npm install --save-dev @babel/core babel-loader @babel/preset-env
```

The `@babel/preset-env` package is crucial; it allows Babel to intelligently determine which transformations are needed based on the target environments you specify (in this case, IE11).

### Step 2: Configuring Babel

Next, create a configuration file, typically named `.babelrc.js` or `babel.config.js`, in the root of your project. This file defines the rules for transpilation. For maximum compatibility, we configure `@babel/preset-env` to target environments that include IE11.

Here is an example setup for your configuration file:

```javascript
// babel.config.js
module.exports = {
  presets: [
    "@babel/preset-env"
  ]
};
```

Within the configuration, you would typically define your target browsers. While `@babel/preset-env` can auto-detect targets, explicitly defining them ensures control over the output:

```javascript
// Example configuration detailing IE11 support
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        "targets": "> 0.25%, not dead, ie 11" // Targets browsers down to 0.25% market share, excluding dead browsers, specifically including IE 11.
      }
    ]
  ]
};
```

### Step 3: Integrating with Laravel Mix

Since you are using Laravel Mix, the integration is often handled automatically if you install the necessary loaders correctly within your `webpack.mix.js` setup, although custom configuration ensures proper execution. Your existing mix file remains the entry point for bundling:

```javascript
// webpack.mix.js
let mix = require('laravel-mix');

// Laravel Mix will now process these files through Webpack and Babel
mix.js('resources/assets/js/app.js', 'public/js')
mix.js('resources/assets/js/admin-app.js', 'public/js');
```

When Mix runs, it reads the configuration from your project root (like `babel.config.js`) and applies the necessary Babel transpilation to every ES6 file before compiling them into the final CSS/JS assets. This pipeline ensures that modern syntax is safely converted into ES5 code compatible with older environments.

## Conclusion

Converting ES6 to ES5 for IE11 support using Babel within a Laravel Mix environment is a straightforward but critical step for maintaining cross-browser compatibility. By correctly installing the necessary Babel packages, defining your target browsers in the configuration file, and ensuring that these tools are hooked into your asset pipeline, you successfully bridge the gap between modern development practices and legacy browser requirements. This approach ensures that developers building applications on platforms like Laravel can deliver robust, accessible solutions for a wider audience, aligning perfectly with the philosophy of building scalable systems demonstrated by companies like [laravelcompany.com](https://laravelcompany.com).
