---
title: "How do I completely disable chunking in Vite and Rollup?"
description: "Title: Disabling Chunking in Vite and Rollup for a Single Clean File Output Introduction: In this article, we will be looking at how to completely disable..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Content", "JavaScript"]
featured: false
---

Title: Disabling Chunking in Vite and Rollup for a Single Clean File Output

Introduction: In this article, we will be looking at how to completely disable chunking in both Vite and Rollup, allowing you to generate a single clean JavaScript file without any hashed filenames. We'll start with the configuration changes needed in vite.config.js before moving on to further optimizations such as creating separate entry files and enabling source maps for easier debugging.

Step 1: Configuring Vite's Output Options
You can use Vite's output options to control how your application is bundled. To disable chunking, we need to set manualChunks to an empty object in the build section of vite.config.js, as shown below:

<pre class="lang-js prettyprint-override"><code>export default defineConfig({
    build: {
        rollupOptions: {
            output: {
                manualChunks: {},
            },
        },
    }
});</code></pre>

This configuration should now allow Vite to generate a single JavaScript file with no chunking. However, the Firebase service worker may still have separate files due to its dependency on node_modules, which are imported by your application code.

Step 2: Separating Entry Files for Better Bundling
To achieve the desired result of having all your resources in a single clean file and without a hashed filename, you can use Vite's entry files feature. Create separate files for each resource type (CSS, JS, etc.) while still utilizing your existing vite.config.js:

1. Create an 'entry-files.js' file with the following content:
   <pre class="lang-js prettyprint-override"><code>import { defineConfig } from 'vite';
const config = require('./vite.config');
config.input.push(
  '@resources/css/app.css',
  '@resources/js/app.js',
  '@resources/js/firebase-messaging-sw.js'
);
export default config;</code></pre>
2. Import 'entry-files.js' into your vite.config.js:
   <pre class="lang-js prettyprint-override"><code>import config from './entry-files';
const input = [
  ...config.input,
  '@resources/css/app_styles.css',
  '@resources/js/firebase-messaging-sw.js'
];</code></pre>
3. Update your laravel({}) configuration in vite.config.js to use the input array from entry-files.js:
   <pre class="lang-js prettyprint-override"><code>plugins: [
    laravel(input, {
      valetTls: 'whatever.test',
      refresh: true,
    })
],</code></pre>
4. Finally, rename your output filename in public/index.html to be the root of our application:
   <pre class="lang-js prettyprint-override"><code><!-- Old code -->&lt;script src="/js/app.js" type="module" defer="defer">&lt;/script>
<!-- New code -->&lt;script src="/js/clean_app.js" type="module" defer="defer">&lt;/script></code></pre>
5. Adjust your webpack configuration to enable source maps for easier debugging:
   <pre class="lang-js prettyprint-override"><code>config.webpackConfig = (config, { mode }) => {
    config.output.sourceMapFilename = '[name].[contenthash].map.[resourceExt]';
    return config;
};</code></pre>

Step 3: Finalizing the Configuration
With these steps, we have managed to disable chunking in Vite and Rollup. Now all your resources (CSS and JS) are loaded into a single file without any hashed filenames. However, since you're using Laravel, we recommend following the traditional approach of utilizing Mix for JavaScript compilation and asset management for a simpler setup. Nonetheless, this solution should still offer a decent alternative when working with Vite and Rollup.

Conclusion: Disabling chunking in Vite and Rollup can be achieved by configuring output options, separating entry files, and adjusting webpack configurations. While these steps may not always be the ideal solution, they can provide a temporary workaround to your problem. For optimal performance and ease of use with Laravel applications, consider exploring alternative bundling solutions like using Mix or optimizing your existing setup for better compatibility.
