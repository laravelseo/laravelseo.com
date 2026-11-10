---
title: "How do you redirect all request to public/ folder in laravel 5"
description: "Title: Effortlessly Redirecting All Requests to the Public Folder in Laravel 5 Body: Introduction Laravel 5 is an excellent framework for building web..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Content", "JavaScript"]
featured: false
---

Title: Effortlessly Redirecting All Requests to the Public Folder in Laravel 5

Body:

<h2>Introduction</h2>
Laravel 5 is an excellent framework for building web applications, and its MVC-based architecture facilitates cleaner code and faster development. However, you might encounter a situation where you have to redirect all requests to your public folder in Laravel 5. This guide will provide a comprehensive solution to this problem while adhering to the best practices.

<h2>Prerequisites</h2>
Before proceeding with the steps, ensure that you have an existing Laravel 5 project and are familiar with the framework fundamentals. You'll need access to your web server or hosting environment and a text editor for making changes to the .htaccess file.

<h2>Understanding the Public Folder</h2>
The public folder is part of the Laravel 5 project structure and contains all the necessary files and directories that facilitate web requests, such as CSS, JavaScript, images, and static content. Redirecting all requests to this directory would ensure a seamless user experience, while still providing access to your application's assets.

<h2>Implementing the Redirection</h2>
There are two approaches you can take to redirect all requests to the public folder: using .htaccess and by modifying your web server's configuration files. We will discuss both methods in detail.

1. Using .htaccess:
.htaccess is an Apache configuration file that allows you to tailor its behavior without editing main server configuration files. To redirect all requests to the public folder, simply follow these steps:
- Open your Laravel 5 project's root directory (the one containing the public folder) and locate .htaccess.
- Inside this file, add the following code:
<pre>RewriteEngine On
RewriteCond %{REQUEST_URI} !^/public/
RewriteRule ^(.*)$ /public/$1 [L]</pre>
This configuration will redirect all non-public requests to your public folder.

2. Modifying Web Server Configuration Files:
If you have access to your web server's configuration files, you can modify them directly to achieve the desired result. This approach may vary depending on your hosting provider and server settings.

For NGINX servers, add this code snippet to the location block responsible for serving Laravel 5 requests:
<pre>if (!-e $request_filename) {
    rewrite /(.+)$ /public/$1 last;
}</pre>
This configuration will serve static files directly from disk if they exist and otherwise redirect to public with your request path appended.

For Apache servers, add this code snippet to the virtual host or .conf file:
<pre>.htaccess {
    Deny from all
    Require all denied
}
RewriteEngine On
RewriteCond %{REQUEST_URI} !^/public/
RewriteRule ^(.*)$ /public/$1 [L]</pre>
This configuration will first deny access to .htaccess files and then implement the redirect rule.

<h2>Conclusion</h2>
Regardless of your hosting environment, you now have two effective ways to redirect all requests to the public folder in Laravel 5. By following these steps, you can improve user experience by ensuring that only static assets are served from the public directory while retaining access to your application's core functionality. Happy coding!
