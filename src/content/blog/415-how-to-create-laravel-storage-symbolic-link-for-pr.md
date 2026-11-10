---
title: "How to create laravel storage symbolic link for production or sub domain system?"
description: "Title: Streamlining Laravel Storage Link Creation for Production Servers or Subdomains Body: When working on your Laravel application locally, the command..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Title: Streamlining Laravel Storage Link Creation for Production Servers or Subdomains

Body:

When working on your Laravel application locally, the command <code>php artisan storage:link</code> generates a symbolic link in the public directory that points to the storage folder. This simplifies access to private files and ensures seamless operations. However, when you deploy your site to a production server or run it via a subdomain, things can get tricky. This guide will showcase how to create Laravel's storage symbolic link effectively in various scenarios so that your application runs smoothly across environments.

1. Understanding the root folder issue:
When your app is placed within the root folder (e.g., public_html), you cannot use the same command as in local development because the storage and public folders are located outside the main directory. In this case, you should configure Apache or Nginx to handle accessing files in subdirectories, such as the storage folder.

2. Configuring Apache for file access:
Ensure your Laravel application root folder is set up correctly within <code>DocumentRoot</code> in the virtual host configuration. The structure usually looks like this:
<pre><code>DocumentRoot /var/www/app_name
	Alias /storage /path/to/storage
	Alias /public /path/to/public
</code></pre>
In this scenario, you can create a symbolic link as follows:
<pre><code>ln -s /path/to/storage /var/www/app_name/public/storage
</code></pre>
This will enable storage access within the subdirectory structure.

3. Configuring Nginx for file access:
With Nginx, you can set up a reverse proxy to handle requests from different domains or subdomains while still allowing Laravel's storage folder link to work as intended. The configuration would look like this:
<pre><code>server {
    listen 80;
    server_name app_subdomain.example.com;
    location /storage {
        alias /path/to/storage;
    }
    location / {
        try_files $uri $uri/ @app;
    }

    # Laravel specific configuration
    location ~ ^(?<segment>.*)\.(?:xml|css|jpg|js|png|ico)$ {
        root /var/www/app_name;
        try_files $uri @rewriteproxy;
    }
}
</code></pre>
In this case, you can create the symbolic link using:
<pre><code>ln -s /path/to/storage /var/www/app_name/public/storage
</code></pre>

4. Using Laravel Mix for CSS and JS assets compilation:
To simplify the process further, you can leverage Laravel Mix to compile assets during production builds instead of using symbolic links. Laravel Mix will create optimized static files in the public directory that are accessible via subdomains or different servers without any additional configuration. This ensures a consistent user experience across environments.

5. Conclusion:
The Laravel storage link creation process differs slightly between local and production environments, but the essential steps remain relatively straightforward regardless of your server type. By following the appropriate methods for each scenario, you can guarantee that your Laravel application runs smoothly on any system. And remember to always double-check your configurations for optimal performance.
