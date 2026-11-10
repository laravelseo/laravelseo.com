---
title: "The plain HTTP request was sent to HTTPS port error Docker nginx"
description: "Solving the Docker Nginx HTTPS Redirection Error: Plain HTTP Request Sent to HTTPS Port As a senior developer working with containerized applications, I..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Technical SEO", "Errors"]
featured: false
---

As a senior developer working with containerized applications, I frequently encounter frustrating configuration errors that seem simple but hide complex interactions between web servers, proxies, and networking. The error you are encountering—`400 Bad Request: The plain HTTP request was sent to HTTPS port`—is a classic symptom of a misconfigured Nginx server block dealing with HTTP-to-HTTPS redirection.

This post will diagnose exactly why this error is occurring in your Docker setup and provide the concrete steps needed to resolve it, ensuring your application runs smoothly, much like building robust systems we advocate for at [laravelcompany.com](https://laravelcompany.com).

---

## Diagnosing the Nginx Conflict

The problem stems from how your `pages/default.conf` file is structured and how Nginx interprets the listening directives. When a client attempts to connect via plain HTTP (e.g., `http://localhost:8343/`), Nginx sees that port 8343 is configured specifically for SSL (`listen 8343 ssl;`). Since the request lacks the necessary SSL handshake, Nginx throws this specific error instead of processing it as a standard HTTP request.

Let's examine your configuration:

```nginx
server {
    listen 80;
    rewrite ^(.*)$ http://localhost:8343$1 permanent;
}

server {
    listen 8343 ssl; # This is the HTTPS block
    listen 443 ssl;
    # ... rest of SSL setup
}
```

The first `server` block correctly sets up a redirect from port 80 to the HTTPS port (8343). However, if you are trying to access the service directly via `http://localhost:8343/`, Nginx attempts to process that request against the SSL-enabled configuration, leading to the conflict.

## The Solution: Correcting the Port Handling

To fix this, we need to ensure that the port you intend to use for plain HTTP access is properly configured as a standard HTTP listener, separate from your secure HTTPS setup. In many Docker setups, it’s cleaner to handle HTTP traffic on one port and HTTPS traffic on another, ensuring the redirection logic only applies where intended.

Since you are attempting to access the service via `http://localhost:8343/`, we need to configure Nginx to listen for plain HTTP traffic on that port *before* or *instead of* forcing an SSL context immediately.

### Step 1: Adjusting the Configuration File

We will modify your `pages/default.conf` to explicitly define separate, non-SSL listening ports for clarity and correctness. We’ll assume you want:
1.  HTTP access on port 80 (or perhaps 8343 if that's your public entry point).
2.  HTTPS access on port 443 (the standard secure port).

If the goal is to serve HTTP content from a port and redirect it to an HTTPS endpoint, ensure you are listening for the plain HTTP request correctly.

**Revised `pages/default.conf` Example:**

```nginx
# --- Block 1: HTTP Redirection Server ---
server {
    listen 80; # Listen for standard HTTP traffic here
    server_name localhost;
    return 301 https://$host$request_uri; # Redirect all HTTP to HTTPS
}

# --- Block 2: HTTPS Server (Your actual application server) ---
server {
    listen 443 ssl; # Standard secure listening port
    listen 8343 ssl; # Keep this if you must use 8343 for SSL, or simplify.
    index index.php;
    server_name localhost;

    # Ensure these paths are correctly set up for your Laravel application structure
    root /var/www/laravel/public;
    error_log  /dev/stderr debug;
    access_log  /dev/stdout;

    ssl_certificate /etc/nginx/ssl_key/localhost.pem;
    ssl_certificate_key /etc/nginx/ssl_key/localhost.key;

    location / {
            try_files $uri $uri/ /index.php$is_args$args;
    }

    # ... (FastCGI configuration remains the same)
    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass php7:9000;
        # ... (rest of fastcgi setup)
    }
```

### Step 2: Reviewing Docker Compose Ports

In your `docker-compose.yml`, ensure the ports map cleanly to what Nginx expects. The error suggests that port 8343 is strictly reserved for SSL traffic, and plain HTTP traffic needs a separate path. If you intend to use 8343 as your primary entry point, you should configure it to handle standard HTTP requests first, then manage the SSL upgrade internally or via a reverse proxy setup (like Traefik or a separate load balancer).

For simplicity in this scenario, if you want `http://localhost:8343/` to work for basic testing before full SSL setup, ensure that the port is listening for HTTP traffic correctly. If you are using Nginx as a simple front-end proxy, you might simplify the configuration by removing the conflicting `listen 8343 ssl;` from the layer where plain requests arrive.

## Conclusion

The "plain HTTP request sent to HTTPS port" error is almost always a symptom of mismatched listening directives in your web server configuration. By explicitly defining separate `server` blocks for standard HTTP (port 80) and secure HTTPS (port 443), you provide Nginx with clear, unambiguous instructions on how to handle incoming requests.

Always treat your web server configuration as the single source of truth. For building scalable applications, especially those based on robust frameworks like Laravel, understanding these low-level networking details is crucial for ensuring your application architecture is sound and resilient. Happy coding!
