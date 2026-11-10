---
title: "Laravel reverb with ssl on nginx"
description: "Securing Real Time: Mastering Laravel Reverb with SSL and Nginx Building real time applications with Laravel Reverb introduces a layer of complexity,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Building real-time applications with Laravel Reverb introduces a layer of complexity, especially when integrating it with secure protocols like SSL/TLS. While running locally without SSL is straightforward, securing your application for public access requires meticulous configuration of the web server (Nginx) to correctly handle both standard HTTP requests and the persistent, stateful nature of WebSocket connections.

This post dives deep into the common pitfalls developers encounter when trying to run Laravel Reverb behind Nginx with SSL, focusing on why simple proxying often fails and how to achieve a robust, secure setup.

## The Challenge: Reverb, WebSockets, and TLS Mismatch

Many developers attempt to configure `config/reverb.php` to specify local certificate paths for TLS, expecting the web server configuration to handle the rest seamlessly. However, when dealing with WebSocket connections—which rely on an HTTP upgrade handshake over a persistent connection—the interaction between PHP-FPM, Nginx proxy settings, and SSL termination becomes extremely delicate.

The error you encountered (`WebSocket connection failed`) typically signals that while Nginx successfully served the initial HTTPS request, it failed to correctly forward or maintain the `Upgrade` and `Connection` headers necessary for the WebSocket protocol to establish itself over the secure tunnel.

## Configuring Laravel Reverb for TLS within PHP

In your `config/reverb.php`, you are attempting to configure custom TLS options:

```php
// config/reverb.php snippet
'servers' => [
    'reverb' => [
        'host' => env('REVERB_SERVER_HOST', '0.0.0.0'),
        'port' => env('REVERB_SERVER_PORT', 8080),
        // ... other settings
        'options' => [
            'tls' => [
                'local_cert' => '/chirper_cert/cert1.pem' // Certificate path
            ],
        ],
    ],
],
```

While this tells Reverb where to find its certificate, the actual *termination* of the SSL connection must be handled by the reverse proxy (Nginx) before the traffic reaches PHP-FPM. The application itself should focus on defining server parameters, relying on the external reverse proxy for network security implementation.

## Mastering the Nginx Proxy for Secure WebSockets

The key to resolving this lies entirely within your Nginx configuration. You need a setup that handles the standard file serving while specifically tunneling the WebSocket upgrade request correctly.

Here is an optimized approach for handling secure WebSocket traffic:

```nginx
server {
    listen 443 ssl; # Listens on standard HTTPS port
    server_name example.com;

    # SSL Configuration (Managed by Certbot)
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;

    location / {
        # Standard static file serving
        root /var/www/laravel-chirper-react-realtime/public;
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Custom location for WebSocket proxying
    location /ws/ {
        proxy_pass http://127.0.0.1:8080; # Proxies to the Reverb application port (e.g., 8080)
        proxy_set_header Host $host;

        # CRITICAL for WebSockets: Preserve the protocol upgrade handshake
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_read_timeout 60;
    }

    # PHP-FPM handling for standard requests (if needed)
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        include fastcgi_params;
    }
}
```

### Why This Works

1.  **SSL Termination at Nginx:** Nginx terminates the external SSL connection on port 443, decrypting the request before forwarding it internally.
2.  **WebSocket Tunneling:** The specific `location /ws/` block intercepts WebSocket traffic. By setting `proxy_set_header Upgrade $http_upgrade;` and `proxy_set_header Connection 'upgrade';`, Nginx correctly signals to the backend (Reverb) that this is not a standard HTTP request but an attempt to upgrade the connection to the WebSocket protocol.
3.  **Clean Proxy:** The proxy layer handles the secure tunnel, allowing Laravel Reverb to focus solely on managing its real-time events without needing deep knowledge of certificate file paths within the application code itself.

## Conclusion: Building Resilient Laravel Services

Setting up complex services like Laravel Reverb requires understanding that security and application logic are distinct layers. Relying on a robust reverse proxy like Nginx to handle external TLS termination and specialized WebSocket protocol handling is the professional approach. By correctly configuring the `proxy_set_header` directives, you ensure that the communication flows smoothly between the client, the secure server, and your Laravel backend. For further insights into building scalable and secure applications within the Laravel ecosystem, always refer to the official documentation at [laravelcompany.com](https://laravelcompany.com).
