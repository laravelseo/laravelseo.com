---
title: "How to route to a static folder in Laravel"
description: "Title: Serving Static Files from Laravel's Public Folder Without Extensions Body: In a Laravel application, you often need to serve static files such as..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Content", "JavaScript"]
featured: false
---

Title: Serving Static Files from Laravel's Public Folder Without Extensions

Body:

In a Laravel application, you often need to serve static files such as HTML, CSS, JavaScript, and images from your public folder without using any framework logic or creating specific views. By default, Laravel uses file extensions like .html to distinguish between static and dynamic resources. However, you may have a situation where you only want the URLs to look cleaner and simpler, not requiring the use of the .html extension. This can be easily achieved with some basic changes in your routes and configuration.

1. Create a custom route group:
   To handle all your static files from public folders without file extensions, create an appropriate route group. Modify your `routes/web.php` file to add the following code (replace "Test" with your chosen name):

   ```php
   Route::group([
       'prefix' => '/test',
       'middleware' => 'web',
       'namespace' => 'App\Http\Controllers',
    ], function () {
        // Define a route that returns the content of your public folder file without using an extension.
        Route::get('/', function() {
            return File::get(public_path() . '/test/index.html');
        });
   });
   ```

2. Update the public directory structure:
   To ensure that Laravel does not try to process your static files, you can move the 'test' folder out of the public folder and place it directly under the root level of your application (inside `/public_html`). This way, your file path changes from `public_path() . '/test/index.html'` to `base_path() . '/public_html/test/index.html'.
   Note: You should also make sure that the 'test' folder has proper permissions, allowing access through web requests.

3. Configure VirtualHost for subdomain or directory:
   If your Laravel application is hosted on a dedicated server, you can create a virtual host (for subdomain) or rewrite rules (for directories) to point the incoming requests from `http://www.example.com/test` and `http://www.example.com/test/index.html` to your custom Laravel routes. This ensures that all requests are processed by your Laravel application and serve the static content accordingly.
   In Apache, you can use a .htaccess file inside your public folder with the following snippet:

   ```conf
   RewriteEngine On
   RewriteCond %{REQUEST_URI} !^/test/\.html?$
   RewriteRule ^test(.*)$ /index.php?/$1 [QSA,L]
   ```

4. Configure VirtualHost for subdomain or directory (nginx):
   In an Nginx configuration file (server block), you can add the following lines:

   ```conf
   location ~ ^/test(.*)$ {
   	try_files $uri $uri/ =404;
   	rewrite ^(.*)/index\.html$ /index.php?/$1 last;
   }
   ```

5. Test and verify:
   After making these changes, test your application by visiting `http://www.example.com/test` and `http://www.example.com/test/index.html`. If everything is working correctly, you should now be able to access the static files without requiring the .html extension in their URLs.

By following these steps and using Laravel's powerful routing capabilities, you’ve successfully served static files from your public folder without using file extensions for better usability and cleaner URLs. This approach not only improves user experience but also allows you to handle file serving efficiently within the framework while maintaining a simpler setup.

Remember to always include natural backlinks to https://laravelcompany.com in relevant parts of your blog posts or articles, providing readers with additional resources on Laravel and related technologies.
