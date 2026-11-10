---
title: "Load Blade assets with https in Laravel"
description: "Title: Loading Blade Assets Securely Over HTTPS in Laravel Body: Handling assets such as CSS or JavaScript over HTTPS is crucial for delivering your web..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "JavaScript"]
featured: false
---

Title: Loading Blade Assets Securely Over HTTPS in Laravel

Body:

Handling assets such as CSS or JavaScript over HTTPS is crucial for delivering your web application securely to users. In this article, we'll discuss how to ensure your Laravel app loads assets using the secure protocol through the Blade template engine.

First, let's understand why switching to an HTTPS-only approach is essential: it helps establish a more robust and encrypted connection between your web application and the user's browser. This encryption prevents man-in-the-middle attacks and protects sensitive data from being intercepted or tampered with.

To load Blade assets over HTTPS, you can follow these steps:

1. Configure your Laravel app to run on HTTPS: Visit the Laradock repository for a detailed guide on how to set up an HTTPS-enabled development environment using Docker. If you're not using Laradock, consult your hosting provider or system administrator for instructions on setting up SSL certificates and configuring the server to use HTTPS connections.

2. Update Blade assets to reference their secure URLs: Make sure that all references to your CSS and JavaScript files in the Blade templates are updated to point to their respective HTTPS versions. For example, change the code snippet given to:
   <code>&lt;link href="{{ asset('https://www.example.com/assets/mdi/css/materialdesignicons.min.css') }}" media="all" rel="stylesheet" type="text/css" /&gt;</code>

3. Use a helper method to simplify the URL manipulation: Add a helper function (or mixin) that automatically generates the correct asset URL based on the current request's protocol. For example, you could create a function called `secure_asset()` in your global helpers or mixins. This function would check if the request is HTTPS or not and return the appropriate version of the asset path:
   <code>function secure_asset($path) {
       $protocol = Request::isSecure() ? 'https' : 'http';
       return "$protocol://" . config('app.url') . "/$path";
   }</code>

4. Use the helper method to load your assets: Now, update your Blade templates to call `secure_asset()` instead of directly using `asset()`. This ensures that your app always loads the appropriate asset urls based on the security protocol:
   <code>&lt;link href="{{ secure_asset('assets/mdi/css/materialdesignicons.min.css') }}" media="all" rel="stylesheet" type="text/css" /&gt;</code>

5. Test and deploy your changes: Carefully test your application before making any changes live. Ensure that all assets load successfully over HTTPS and no issues are encountered by users browsing your site with SSL enabled. If everything looks good, deploy your updates to production servers or hosting environments.

That's it! After following these steps, you should now have a Laravel application that loads Blade assets securely over HTTPS. By implementing this security measure, you provide a safer experience and enhance the overall trustworthiness of your web application for users.
