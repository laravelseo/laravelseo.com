---
title: "Deploy Vue SPA with Laravel Backend"
description: "Deploying Vue SPA with a Laravel Backend on DigitalOcean: A Complete Guide As a senior developer, I often see this scenario: you have a solid Laravel API..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "HTML", "PHP"]
featured: false
---

As a senior developer, I often see this scenario: you have a solid Laravel API running perfectly on a VPS, and now you want to introduce a modern Single Page Application (SPA) built with Vue.js and Webpack. While deploying a standalone Laravel application is straightforward, integrating a frontend SPA requires understanding how the server should handle both static assets and dynamic routing.

Deploying this combination onto an Ubuntu instance on DigitalOcean involves setting up a robust architecture using a reverse proxy, typically Nginx, to manage traffic between the two services seamlessly.

## Understanding the Architecture: Separation of Concerns

The core principle here is separation of concerns. Your Laravel application will primarily serve as your API backend (handling routing for data requests), and your Vue SPA will be compiled into static assets that need to be served directly to the browser.

When deploying both, you essentially have two distinct deployment targets that need to coexist under a single domain:

1.  **Laravel Backend:** Runs PHP-FPM and serves API endpoints (e.g., `/api/*`).
2.  **Vue Frontend:** After running `npm run build`, this generates static files (HTML, CSS, JS) that must be served by the web server.

## Step-by-Step Deployment Strategy on Ubuntu

Here is the recommended structure and deployment flow for your setup:

### 1. Prepare the Laravel Backend

Ensure your Laravel application is set up to serve API routes correctly. Since you are using a standalone app, focus on making sure environment variables are configured correctly for production access. As with any robust project, following best practices, like those emphasized by the Laravel community, ensures maintainability.

### 2. Build the Vue Frontend

First, navigate into your Vue project directory and execute the build command:

```bash
cd /var/www/my-project/frontend
npm run build
```

This command compiles your Vue components, transpiles TypeScript (if used), and bundles everything into an optimized static folder, usually named `dist` or `public`. This `dist` folder contains all the necessary HTML, CSS, and JavaScript files.

### 3. Structuring the Deployment Folders

You need a single root directory on your Ubuntu server where Nginx will point. A common practice is to place both the compiled Vue assets and the Laravel public files within this structure.

A recommended structure might look like this:

```
/var/www/html/my-app/
├── .env                  (Laravel configuration)
├── public/               (Laravel entry point, usually handled by Nginx proxy)
├── vue-dist/             (The output folder from the Vue build)
│   ├── index.html
│   ├── assets/
│   └── ... (all compiled JS/CSS)
└── nginx.conf            (The reverse proxy configuration)
```

### 4. Configuring Nginx as a Reverse Proxy

This is the critical step. You will configure Nginx to handle requests for your SPA (which should serve the `index.html` from the Vue build) and proxy any API requests (like `/api/*`) to your running Laravel PHP-FPM process.

Here is an example snippet for your `/etc/nginx/sites-available/my-app.conf`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html/my-app/vue-dist; # Point root to the Vue build directory

    index index.html;

    location / {
        try_files $uri $uri/ /index.html; # Crucial for SPA routing
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/; # Proxy API calls to Laravel running on port 8000 (or your PHP-FPM setup)
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 5. Finalizing the Deployment

After creating and enabling your Nginx configuration, test the syntax (`sudo nginx -t`) and reload the service (`sudo systemctl reload nginx`). Ensure that your Laravel application is running correctly (e.g., via a process manager like Supervisor or using a tool like Forge) so that Nginx can successfully proxy API calls to it.

## Conclusion

Deploying a decoupled stack like Vue/Laravel requires shifting focus from simply deploying one framework to orchestrating two services. By leveraging Nginx as a reverse proxy and correctly configuring the `try_files` directive, you create a unified experience where the frontend handles routing for the SPA while the backend efficiently serves data via API calls. This layered approach is fundamental to modern, scalable web application deployment, allowing you to utilize the strengths of both Laravel's ecosystem and Vue's component-based architecture.
