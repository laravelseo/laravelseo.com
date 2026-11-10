---
title: "How to deploy a Laravel app to a sub-directory"
description: "Mastering Subdirectory Deployment: Solving Laravel Routing Issues on Shared Hosting Welcome to the world of deployment! It’s completely normal to run into..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

Welcome to the world of deployment! It’s completely normal to run into roadblocks when moving a local development setup to a live, shared hosting environment. As a senior developer, I see this exact scenario—trying to map a framework like Laravel into a subdirectory and struggling with URL routing using `.htaccess`. Don't worry; this is a common hurdle that usually stems from misunderstandings about how web servers (like Apache or Nginx) interact with application routing.

This post will break down why your initial attempt failed and provide the most robust, developer-approved solutions for deploying a Laravel application into a subdirectory structure.

## The Challenge: Why Your `.htaccess` Failed

You are attempting to use `mod_rewrite` to tell the server: "When a request comes to `main.com/my-project`, serve the contents of `/public` inside that directory."

Your attempt was:
```apache
RewriteEngine On
RewriteCond %{REQUEST_URI} !^/project/public/
RewriteRule ^(.*)$ /project/public/$1 [L,QSA]
```

The reason this often results in a "404 Not Found" error is twofold:

1.  **Server Context:** Shared hosting environments have very specific security and permission constraints. The way the web server processes paths can be highly sensitive to the exact directory structure you are trying to rewrite, especially when dealing with nested folders.
2.  **Laravel's Entry Point:** Laravel relies on a clean root path defined in its configuration files. When you manually force a change via `.htaccess`, you often disrupt the environment that Laravel expects to handle routing, leading to conflicts between the physical file structure and the logical URL structure.

Simply redirecting the request doesn't automatically initialize the framework correctly; it just tells the server where to look for files, which isn't enough when dealing with complex MVC routing principles advocated by frameworks like [Laravel](https://laravelcompany.com).

## The Correct Approach: Directory Structure and Server Configuration

Instead of relying solely on complex path rewrites, the most reliable method involves ensuring your directory structure aligns perfectly with what the web server expects, and then leveraging Laravel’s built-in configuration.

### Step 1: Verify the Physical Structure

Ensure your files are organized correctly within the `public_html` folder. If your domain is `main.com` and you want the app at `main.com/my-project`, the structure should look like this:

```
/public_html/
├── my-project/          <-- This is the subdirectory requested by the URL
│   ├── .htaccess        <-- Configuration file for routing (if needed)
│   ├── public/          <-- Contains the actual Laravel public files
│   └── ... (other project files)
```

### Step 2: The Simplified `.htaccess` Fix

For subdirectory deployments, a simpler `mod_rewrite` rule is often more effective. This rule should instruct the server to ignore the subdirectory prefix and serve the content as if it were the root.

Place this file inside your project's main public folder (i.e., `/public_html/my-project/.htaccess`):

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    # Rewrite everything to point to the actual 'public' directory contents
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

**Explanation of the Fix:** This rule tells the server that any request hitting this subdirectory should internally look for files within the `public` folder. By placing it inside the project root, you isolate the routing logic to manage only that specific application context. While Laravel deployment often involves more complex setup (like using a reverse proxy if on shared hosting), this `.htaccess` adjustment is the standard way to handle path mapping in environments where directory structure must be preserved.

## Best Practices for Deployment

When deploying any framework, remember that the framework itself provides tools to manage these complexities. For Laravel developers looking into deployment strategies, understanding concepts like environment variables and configuration management is key, as discussed within the [Laravel documentation](https://laravelcompany.com).

For shared hosting specifically, always check your host's documentation regarding **URL rewriting settings** or if they support **Nginx** configurations instead of Apache. Nginx often handles path-based routing more cleanly than traditional `.htaccess` files on restrictive shared environments.

## Conclusion

Deploying a Laravel application to a subdirectory is achievable, but it requires precision in both file structure and server configuration. Avoid overly complex rewrite rules, and focus on ensuring the web server correctly maps the URL requested by the user to the actual location of your `public` directory. By simplifying your `.htaccess` and understanding the context of your hosting environment, you can successfully host your application without further frustration. Happy coding!
