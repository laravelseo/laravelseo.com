---
title: "ReferenceError: $ is not defined, Jquery Import with vite"
description: "Title: Resolving ReferenceError: $ is not defined with jQuery Import in Vite Laravel App Body: You may encounter the \"ReferenceError: $ is not defined\" issue..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "HTML", "Errors"]
featured: false
---

Title: Resolving ReferenceError: $ is not defined with jQuery Import in Vite Laravel App
Body:
<p>You may encounter the "ReferenceError: $ is not defined" issue when attempting to use jQuery import with Vite Laravel App. To ensure a smooth integration, follow these steps:</p>

1. Initialize the required configurations for both Vite and the Laravel-Vite-Plugin.
   <pre><code>import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/js/app.js',
            ],
            refresh: true,
        }),
    ],
});</code></pre>
   This configuration enables the Vite JavaScript compiler to process your code and simplify the development workflow.

2. Import jQuery explicitly into your app.js file and declare it as a global variable.
   <pre><code>import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import $ from "jquery"; 
window.$ = window.jQuery = $;

import '../sass/app.scss';</code></pre>
    Ensure that jQuery is properly imported and set as a global variable within the app.js to avoid conflicts with other JavaScript frameworks or libraries.

3. Load the assets in your Blade template using the Vite helper function.
   <pre><code>@vite(['resources/js/app.js']);</code></pre>
    This line of code loads the jQuery and app.js files necessary for your application, preparing them to be added to your project's output bundle.

4. Test the functionality by accessing a jQuery element directly in the Blade template.
   <pre><code>@vite(['resources/js/app.js']);

$(&quot;#alertbox&quot;).alert(&quot;test&quot;);</code></pre>
    In this case, you are targeting an HTML element with the id "#alertbox" and calling its alert() method to display a message on your webpage. Make sure to include jQuery-specific functionality within your app.js file as well.

5. Test and resolve issues if any errors arise during development:
   If you still encounter the "ReferenceError: $ is not defined" error, ensure that jQuery is properly imported and added as a global variable. Additionally, verify that the correct dependencies are installed in your Laravel project. For example, with Laravel 9.20, make sure to include jQuery via `npm install jquery` or `composer require jquery`.

6. Final considerations:
   If the issue persists after following these steps, it could indicate a conflict with other JavaScript libraries or frameworks used in your project. In such cases, try using different syntax for referencing jQuery within your code or check for any conflicting dependencies that may cause the error.

By addressing the concerns mentioned above, you should successfully integrate jQuery into your Vite Laravel App and avoid the "ReferenceError: $ is not defined" issue. Remember to always test and debug your application thoroughly to ensure optimal performance and functionality across all browsers and environments.
