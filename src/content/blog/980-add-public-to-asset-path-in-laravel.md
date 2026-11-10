---
title: "Add Public to asset path in Laravel"
description: "Title: Add Public to Asset Path in Laravel without Changing Core Classes In many cases, you might find yourself deploying your Laravel application on shared..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "JavaScript", "PHP"]
featured: false
---

Title: Add Public to Asset Path in Laravel without Changing Core Classes

In many cases, you might find yourself deploying your Laravel application on shared hosting servers where the public directory is not accessible or has a different name than 'public'. This can lead to problems when trying to access assets like CSS and JavaScript files. Luckily, there are some simple ways to add 'public' to the asset path without touching any core Laravel classes.

To start with, you need to configure your virtual host file on the server, which tells the server where to find your website. Let's assume your domain is 'example.com'. Create a Virtual Host file (e.g., example.conf) and put it inside the directory for virtual hosts on the server (usually /etc/nginx/sites-available or /usr/local/apache/sites/available).

Inside the virtual host file, add these lines:

```
server {
    listen 80;

    root /path/to/your/public; # Replace with your actual public path

    server_name example.com;

    location / {
        try_files $uri $uri/ @rewrite;
    }

    location ~ ^/index\.php(/.*)$ {
        fastcgi_pass unix:/run/php7.4-fpm.sock;
        include fastcgi_params;
        # PHP_VALUE environment variables
        fastcgi_param HTTPS off;
        fastcgi_param GATEWAY_INTERFACE CGI/1.1;
        fastcgi_param SERVER_SOFTWARE laravel-php-fpm;
        fastcgi_param REQUEST_METHOD GET;
        fastcgi_param QUERY_STRING $query_string;
        fastcgi_param SCRIPT_FILENAME /path/to/your/public/index.php;
        fastcgi_param SCRIPT_NAME /index.php;
        fastcgi_param SERVER_ADDR your-server-ip;
        fastcgi_param SERVER_PORT 80;
        fastcgi_pass_request_body off;
        fastcgi_buffers 16 16k;
        fastcgi_buffer_size 256k;
    }
}
```

Replace the 'root' directive with the actual path to your public directory. This configuration allows Laravel to serve files from its public directory, while still being accessible through the root domain.

Once the virtual host file is in place, you need to adjust your asset paths within your Laravel application, which can be done by following these steps:

1. Open your 'app/Http/Kernel.php' file and locate the 'webMiddlewareGroups()' method.
2. Comment out or remove the existing 'public_path' line: `//$router->alias('storage', public_path().'/storage');`
3. Add a new line for 'public_path_with_prefix': `$router->alias('storage', config('app.url').'/'.config('filesystems.disks.public.base_uri'));`. This will ensure the public folder is prefixed with its actual path in your application.
4. Open your 'config/filesystems.php' file and find the line for 'public disk': `'public' => [
            'driver' => env('FILESYSTEM_DRIVER', 'local'),
            'root' => storage_path('/app/public'),
        ],`. Change the 'root' path to reflect your actual public directory path.
5. In your .env file, modify the 'APP_URL' value with the correct domain and location of your public folder: `APP_URL=http://example-with-public/` (replace example-with-public with your real domain name).

With these changes in place, you should be able to access assets from the public directory correctly. However, there are some additional steps you may want to take for extra security:

1. Change your application's index file (usually 'index.php') to check if it is being accessed directly instead of through a web request. You can do this by adding this code near the top of the file: `if (!defined('LARAVEL_START')) { die(); }`. This ensures that the server only serves the index.php file after Laravel has initialized and prevents direct access to other files.
2. Configure your web server to redirect HTTP to HTTPS if you are using SSL certificates for your domain. You can find guides on how to do this for different servers like Apache or Nginx online.
3. Ensure your Laravel application is up-to-date and keep track of security updates to prevent any vulnerabilities.

By following these steps, you can safely add 'public' to the asset path without making changes to core classes. This setup makes your website more secure and accessible for visitors while maintaining a professional appearance with clean URLs.
