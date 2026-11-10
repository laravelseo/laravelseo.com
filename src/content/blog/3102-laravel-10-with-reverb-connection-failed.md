---
title: "Laravel 10 with reverb connection failed"
description: "Laravel Reverb Connection Failed in Production: Debugging WebSocket Failures Dealing with infrastructure issues when moving a Laravel application from a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Dealing with infrastructure issues when moving a Laravel application from a local development environment to a live production setup is a classic pain point for every developer. You have everything configured perfectly locally—Reverb broadcasting works flawlessly—but when you deploy it behind complex infrastructure like Cloudflare, PHP-FPM, and reverse proxies, the connection breaks in production.

The specific error, `websocket connection to 'my domain' failed`, points directly to a failure in establishing or maintaining the persistent WebSocket connection required for real-time communication. This isn't usually a simple code bug; it’s almost always a networking, proxy, or server configuration issue that is masked during local testing.

As a senior developer, let's break down why this happens and how to systematically debug these production connectivity failures.

## Understanding the Disparity: Local vs. Production Networking

Your setup involves several layers: Laravel application $\rightarrow$ PHP-FPM $\rightarrow$ Web Server (Apache) $\rightarrow$ Cloudflare $\rightarrow$ Public Internet. When testing locally, everything is direct. In production, the reverse proxy and SSL termination introduce complexity that can break persistent connections like WebSockets.

The fact that `telnet` to port 8080 works confirms the application *is* listening on the server side, but the WebSocket handshake (which involves specific HTTP upgrade headers) is failing between the client and the server stack.

### Reviewing Your Configuration Stack

Let's review the components you mentioned:

1.  **Laravel Reverb Setup:** The configuration for `BROADCAST_DRIVER=reverb` and the `.env` settings look standard for Laravel Reverb.
2.  **Client Side (Bootstrap.js):** Using `wsHost: 'my-domain'` implies the client is expecting a secure connection (`wss://`).
3.  **Server Side (PHP/Apache):** The failure often occurs here, specifically how PHP handles the raw socket connection forwarded by the web server.

When dealing with production environments, especially those involving Cloudflare SSL, the primary suspect shifts to TLS negotiation and proxy handling rather than just basic port access. Remember, robust application architecture, much like that championed by Laravel principles, requires understanding these external constraints.

## Deep Dive: Troubleshooting Networking Layers

Since you’ve already checked basic firewall rules (`iptables`) and connectivity (`telnet`), we need to focus on the interaction between PHP-FPM and the WebSocket protocol.

### 1. SSL/TLS Mismatch and Proxy Headers

When using `wss://` (secure WebSockets), the server must correctly handle the TLS handshake. If Cloudflare is terminating SSL, it passes the connection to your server, but how the backend handles that
