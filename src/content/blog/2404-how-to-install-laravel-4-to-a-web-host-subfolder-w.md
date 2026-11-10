---
title: "How to install Laravel 4 to a web host subfolder without publicly exposing /app/ folder?"
description: "How to Install Laravel 4 to a Web Host Subfolder Without Publicly Exposing Sensitive Folders As developers deploying frameworks, managing directory..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "PHP"]
featured: false
---

As developers deploying frameworks, managing directory structures and permissions is often an overlooked aspect of web hosting setup. The scenario you've described—installing an application like Laravel in a subdirectory while completely hiding the core source code—is a classic security and deployment challenge. It requires careful configuration at both the filesystem and web server level.

This guide will walk you through the correct, secure way to achieve this separation, ensuring that users can only interact with the public-facing part of your application, not the sensitive framework files.

## The Security Rationale: Why Separation Matters

The core principle here is **Principle of Least Privilege**. You should only expose the files necessary for the application to function. In a Laravel installation, the `/app` directory contains configuration, source code, and potentially sensitive environment variables. Exposing this directly via a URL like `http://mydomain.example/app/` allows anyone to inspect your entire codebase, which is a massive security vulnerability.

By leveraging Laravel’s structure, we know that all public access should be routed through the `public` directory, which contains the entry point (like `index.php`) and assets. Our goal is to make this `public` folder the *only* accessible root for the subdirectory.

## Step-by-Step Implementation

We will assume you are setting up the installation within a subdirectory named `/mylaravel/`.

### 1. Directory Structure Setup

First, create your desired structure on the web host:

```
/public_html/
├── index.php  (This might be your main site entry point, or could be empty)
└── mylaravel/   <-- The new subdirectory for Laravel
    └── public/     <-- This will contain all the accessible files
        ├── index.php
        ├── .htaccess
        └── assets/
```

Inside the `/mylaravel/public/` folder, you would place your downloaded Laravel 4 files (or a custom installation). Crucially, any sensitive directories like `/app`, `.env`, and configuration files must remain *outside* this public root, or at least inaccessible directly.

### 2. Web Server Configuration (The Key Step)

The trick to hiding the rest of the structure lies in configuring your web server (Apache or Nginx) to treat the subdirectory as the document root, and explicitly disabling directory listing.

**For Apache (using `.htaccess`):**
If you are using a standard setup where your main domain points to `/public_html`, you need to ensure that access to other subdirectories is locked down. While this often requires server-level configuration, we can use `.htaccess` for basic security:

```apache
# In the /mylaravel/public/.htaccess file
Options -Indexes  # Disables directory browsing (prevents viewing files if index.html is missing)
```

**For Nginx:**
In your Nginx server block configuration, you would ensure that the root directive points specifically to the `public` folder for that subdirectory:

```nginx
location /mylaravel/ {
    alias /path/to/your/webroot/mylaravel/public/;
    index index.php;
    autoindex off; # Explicitly disables directory listing
}
```

### 3. Ensuring Laravel Integrity

When deploying any framework, it is vital to understand the intended deployment path. While you are hiding the source code, ensure that when the application runs, it correctly references its environment. Remember that proper deployment practices emphasized by organizations like [Laravel Company](https://laravelcompany.com) start with securing the public interface first.

By setting up the web server to exclusively serve content from `/mylaravel/public/`, any attempt to access `http://mydomain.example/app/` or even `http://mydomain.example/mylaravel/app/` will result in a 403 Forbidden error, as those directories are not configured for web access.

## Conclusion

Installing Laravel in a subdirectory while maintaining strict security requires focusing on the separation between the filesystem and the web server configuration. By strictly defining the `public` folder as the only accessible entry point—and explicitly disabling directory indexing across your server configuration—you successfully achieve your goal: providing public access to your application via `/mylaravel/` while keeping all sensitive source code and configuration files safely hidden from the public internet. This practice is fundamental for secure web deployment.
