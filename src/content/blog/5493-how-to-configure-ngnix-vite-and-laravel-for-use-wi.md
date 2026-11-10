---
title: "How to configure ngnix, vite and laravel for use with HMR via a reverse proxy?"
description: "How to Configure Nginx, Vite, and Laravel for HMR via a Reverse Proxy As developers diving into the Laravel and Vue ecosystem, setting up a robust local..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "PHP"]
featured: false
---

As developers diving into the Laravel and Vue ecosystem, setting up a robust local development environment—especially one involving Hot Module Replacement (HMR) and reverse proxying—can often feel like navigating a maze. You are essentially trying to unify the asset compilation server (Vite), the application backend (Laravel), and the public entry point (Nginx) under a single HTTPS umbrella. This is a common challenge when using Dockerized setups, but it requires understanding how HTTP requests differ from WebSocket communications.

This guide will walk you through the architectural strategy and practical Nginx configuration needed to successfully proxy these services, ensuring HMR functions correctly over your public entry point.

## Understanding the Components and the Challenge

You are working with three main layers:
1.  **Laravel/PHP:** Serves the backend API and application logic.
2.  **Vite:** Runs the development server for asset bundling and handles the WebSocket connection required for HMR updates.
3.  **Nginx:** Acts as the single, public HTTPS entry point, routing external requests to the correct internal service ports.

The core difficulty lies in handling two types of traffic simultaneously: standard HTTP file requests (for initial page loads) and persistent WebSocket connections (for live HMR updates). Standard `proxy_pass` directives handle HTTP well, but WebSockets require specific configuration to maintain the long-lived connection.

## The Strategy: Decoupling Services with Nginx Locations

The most effective way to manage this is by ensuring that Vite's development server runs on a known port (e.g., 3000), and Nginx acts as the intelligent gateway, routing traffic based on the URL path or hostname.

Since your goal is a single entry point, we will configure Nginx to listen on port 80/443 and forward requests appropriately.

### Step 1: Configure Vite for External Access

As you noted, setting `server.host` to `0.0.0.0` in `vite.config.ts` is crucial. This allows the Vite dev server to listen on all network interfaces, making it reachable from outside its container. Ensure your HMR client port (e.g., 80) is configured correctly within Vite to expose the necessary endpoints.

### Step 2: Nginx Configuration for Proxying

The key is defining separate `server` blocks or `location` blocks to handle the different traffic flows. For a typical Laravel/Vite setup, you often need one block for serving the main application (Laravel) and another for serving the assets/HMR (Vite).

Here is an example of how you might configure Nginx to proxy both your Laravel application (e.g., running on port 8000) and your Vite dev server (e.g., running on port 3000):

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    # Redirect all traffic to HTTPS later, focusing on HTTP for development ease
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;
    # SSL configuration goes here...

    # 1. Proxy requests for the main Laravel application (e.g., /api or root)
    location / {
        proxy_pass http://127.0.0.1:8000; # Assuming Laravel runs on 8000 inside Docker
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        # Essential for WebSockets (HMR)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # 2. Proxy requests for Vite/Asset serving and HMR
    location /assets/ {
        proxy_pass http://127.0.0.1:3000; # Vite dev server port
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;

        # WebSockets are often needed specifically for HMR communication
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### Explaining the WebSocket Handling

The most critical part for HMR is handling WebSockets correctly. When a browser initiates an HMR connection, it uses the `Upgrade` header to switch the communication protocol from standard HTTP to WebSocket. The configuration lines:

```nginx
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
```

are mandatory. They instruct Nginx to correctly manage the persistent, bidirectional connection required for Vite's HMR over the proxy layer. This setup ensures that when your Vue application requests an asset or attempts an HMR update, Nginx transparently forwards this specialized traffic to the correct backend service (Laravel or Vite).

## Conclusion

By strategically separating the routing responsibilities within Nginx—using distinct `location` blocks for the main application versus the asset/HMR endpoints—you achieve a clean, unified HTTPS entry point. This approach successfully decouples your development tooling from your production entry point while ensuring that complex WebSocket communications required by tools like Vite can be seamlessly proxied. Mastering this reverse proxy pattern is fundamental to building scalable and maintainable applications, aligning perfectly with the principles taught in frameworks like those promoted by **Laravel Company**.
