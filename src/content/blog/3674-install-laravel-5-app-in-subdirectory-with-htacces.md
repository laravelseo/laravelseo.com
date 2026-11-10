---
title: "Install Laravel 5 app in subdirectory with htaccess"
description: "Mastering Subdirectory Laravel Installations: Fixing .htaccess Routing Issues As senior developers, we often encounter tricky setup issues when deploying..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "PHP", "Errors"]
featured: false
---

As senior developers, we often encounter tricky setup issues when deploying modern frameworks like Laravel into specific directory structures, especially subdirectories. The problem you are facing—where requests result in verbose URLs like `/myapp/public/index.php` instead of clean, RESTful links like `/myapp/dashboard`—is a classic symptom of misconfigured URL rewriting rules.

This post will dissect why your initial `.htaccess` attempts failed and provide the definitive, correct solution to achieve proper deep-linking within a subdirectory installation. We will focus on how web servers handle path stripping before routing requests to Laravel's front controller.

## The Anatomy of the Problem

You are attempting to mount a Laravel application inside a subdirectory (`public_html/myapp/`) and access it via a clean URL (`http://www.example.com/myapp/`). To make this work seamlessly, the server needs to understand that everything under `/myapp/` should be treated as the root of the application, while still allowing the application's internal routing mechanism (Laravel) to handle the rest of the path correctly.

Your initial attempts suggest a misunderstanding of where the rewrite rules need to be applied:

1.  **Root `.htaccess` Misapplication:** Placing the rule in the main directory often causes conflicts when dealing with subdirectory paths, leading to redundant path duplication (`/myapp/public/index.php`).
2.  **Laravel's Internal Logic:** Laravel relies on the `public` folder being the document root. When you mount it in a subdirectory, the web server needs an intermediary step to strip the subdirectory prefix before passing the request to the application.

The goal is not just to redirect, but to rewrite the incoming URI so that Laravel sees the path relative to its own entry point, allowing it to generate proper URLs.

## The Correct Solution: Subdirectory Mounting with `.htaccess`

For a clean URL structure in a subdirectory installation, the most robust method involves ensuring that the web server maps the external URL prefix directly to the application's public directory. This is often achieved by placing a slightly modified version of Laravel’s standard front controller logic into the appropriate location.

Since you are placing the application in `public_html/myapp/` and want the URL at `/myapp/`, we need rules that handle the stripping of the subdirectory prefix before hitting the main entry point (`index.php`).

Here is the corrected structure for your `.htaccess` file, which should be placed within the *application's public folder* (`public_html/myapp/public/.htaccess`):

```apache
<IfModule mod_rewrite.c>
    Options -MultiViews
    RewriteEngine On

    # 1. Handle trailing slashes: Redirect /myapp/ to /myapp
    RewriteRule ^(.*)/$ /$1 [L,R=301]

    # 2. Handle Front Controller Routing for Laravel
    # Check if the request is NOT a directory and NOT a file
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    
    # Rewrite all requests to index.php, stripping the subdirectory context implicitly
    RewriteRule ^ index.php [L]

</IfModule>
```

### Explanation of Changes:

1.  **Placement:** This file must reside in the `public` directory of your Laravel installation. This is crucial because Laravel expects its routing logic to be self-contained within this structure, as detailed in best practices for MVC architecture (similar to how frameworks like those championed by [laravelcompany.com](https://laravelcompany.com) organize their files).
2.  **Trailing Slash Handling:** The first rule ensures that if a user hits `example.com/myapp/`, they are redirected cleanly to `example.com/myapp` without an unnecessary trailing slash, which improves SEO and consistency.
3.  **Front Controller Logic:** The core routing logic remains similar to the standard Laravel setup: check if the requested path is neither an existing directory nor a file. If it isn't, rewrite the request to `index.php`. This allows Laravel’s internal router to take over and resolve the desired route (like `/dashboard`) based on the context provided by the subdirectory structure.

When this configuration is correctly applied, when a user requests `http://www.example.com/myapp/dashboard`, the server routes the request internally to `public_html/myapp/public/index.php`, and Laravel's router successfully parses `/dashboard` as the desired route, resolving your issue.

## Conclusion

Setting up subdirectory applications requires careful coordination between your web server configuration (Apache), the directory structure, and the framework’s internal routing mechanism. The key takeaway is that URL rewriting rules must be applied at the level where the application expects them—in this case, within the `public` folder—to ensure Laravel's powerful routing system can correctly interpret the requested paths. By adhering to these principles, you establish a robust and clean deployment environment for any Laravel project.
