---
title: "How to deploy separated backend and frontend on same server"
description: "How to Deploy Separated Backend and Frontend on the Same Server: The Reverse Proxy Masterclass As developers, we often build applications using modern..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "JavaScript", "HTML"]
featured: false
---

As developers, we often build applications using modern frameworks like Laravel for robust APIs and Vue.js for dynamic user interfaces. During local development, running these components on different ports (e.g., Laravel on port 8000 and Vue on port 3000) is perfectly fine. However, when moving to production, we need a unified, scalable, and secure deployment strategy. How do we get both applications talking to each other correctly while serving content from a single entry point?

The solution lies in mastering the concept of the **Reverse Proxy**. This technique allows a single web server (like Nginx or Apache) to handle incoming requests and intelligently route them to the appropriate backend service—in this case, your Laravel API and your compiled Vue assets.

## Understanding the Decoupled Architecture

In a decoupled architecture, the frontend (Vue.js) is typically built into static files (HTML, CSS, JavaScript bundles), while the backend (Laravel) only serves data via its API endpoints. When deploying together, we treat these two parts as distinct services that need to communicate over HTTP.

Your goal on the production server is not to serve the Vue application *and* the Laravel application directly from the same root directory in a complicated way; instead, you want one entry point that manages both concerns.

## Step-by-Step Deployment Strategy

Here is the practical workflow for deploying your separated stack on a single server instance (e.g., using a VPS running Linux).

### 1. Backend Preparation: Laravel API

First, ensure your Laravel application is set up to run correctly via the web server environment. You will typically use PHP-FPM to handle the dynamic requests coming from the frontend. This part remains standard—ensure your `.env` file is configured for production secrets and database connections. As you build robust APIs with Laravel, understanding how these services communicate securely is paramount; Laravel provides excellent structure for building these services, making them ideal candidates for a reverse proxy setup (refer to best practices detailed on [laravelcompany.com](https://laravelcompany.com) regarding service design).

### 2. Frontend Preparation: Vue.js Build

The Vue.js application must be compiled into optimized, static assets (usually placed in a `public/` or `dist/` folder). You use the Vue CLI or Vite to run the build command, which generates these static files ready for deployment.

```bash
# Example using Vite to build the production assets
npm run build
```

These resulting files are what the web server will serve directly to the user's browser.

### 3. Implementing the Reverse Proxy (The Glue)

This is the most crucial step. We will use Nginx as the reverse proxy because it excels at efficiently handling static file serving while proxying dynamic API requests to PHP-FPM.

You need to configure Nginx to listen on port 80/443 and route traffic:
1. Requests for the root path (e.g., `/`) should be served by the Vue application's static files.
2. Requests to API endpoints (e.g., `/api/*`) should be securely forwarded to the Laravel application running on a different internal port.

Here is a conceptual example of an Nginx configuration block:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # 1. Serve static frontend assets (Vue.js)
    root /var/www/html/public; # Directory where Vue build files are located
    index index.html;

    location / {
        try_files $uri $uri/ /index.html; # Handles SPA routing for Vue
    }

    # 2. Proxy API requests to the Laravel backend
    location /api/ {
        proxy_pass http://127.0.0.1:8000; # Forward requests to Laravel running on port 8000 (or whatever your PHP-FPM setup uses)
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### Conclusion: A Unified Production Environment

By implementing a reverse proxy, you achieve a clean separation of concerns while maintaining a single entry point for the user. The frontend serves the initial HTML shell and all its necessary assets, while the backend API is safely handled by Laravel behind the scenes. This setup is not only more secure but also far more scalable and maintainable than trying to manage two completely separate web servers. Mastering this pattern is essential for deploying modern, decoupled applications efficiently on any hosting environment.
