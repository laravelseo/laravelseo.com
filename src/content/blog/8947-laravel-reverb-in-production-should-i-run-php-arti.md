---
title: "Laravel reverb in production : should i run php artisan reverb:start on my vps.?"
description: "Laravel Reverb in Production: Should I Run php artisan reverb:start on My VPS? As a developer moving an application from a local environment to a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a developer moving an application from a local environment to a production VPS, the transition often exposes nuances that don't exist during local development. You’ve successfully getting Laravel Reverb working locally using `php artisan reverb:start`, but you immediately face a critical question for deployment: **Do I need to keep this command running indefinitely on my Virtual Private Server?**

The short answer is: **No, you should not run `php artisan reverb:start` directly in your terminal session and expect it to persist.** For production environments, managing long-running processes like Laravel Reverb requires a robust process management system.

This post will dive into why this is the case, outline the correct production deployment strategy, and show you how to ensure your real-time communication layer stays alive and healthy on your server.

---

## Understanding the Nature of Laravel Reverb

Laravel Reverb acts as a WebSocket server, enabling real-time communication between the application and connected clients. Unlike standard HTTP requests that are short, stateless transactions, WebSockets require a persistent, long-running process to continuously listen for incoming connections.

When you run `php artisan reverb:start` locally, it successfully spins up this WebSocket listener within your terminal session. However, when you close that terminal or log out of SSH, the process terminates. In production, if the process stops, your real-time functionality ceases immediately. Therefore, simply executing the command once is insufficient for a stable deployment.

## The Production Strategy: Process Management is Key

In a production VPS environment, we rely on system services to manage the lifecycle, health, and automatic recovery of critical applications. Running a single command manually is inherently unreliable.

The correct approach involves treating your Reverb server not as a script, but as a proper service that needs to be managed by the operating system. This is where tools like **Systemd** or **Supervisor** become indispensable.

### Using Systemd for Service Management

Systemd is the standard initialization system used by most modern Linux distributions (like Ubuntu and CentOS). By creating a `.service` file, you instruct the operating system how to start, stop, and monitor your Reverb process automatically upon boot, and manage it if it crashes.

Here is a conceptual overview of how you would set this up:

1.  **Identify the Execution Path:** Determine the full path to your PHP executable and the command you need to run (`php artisan reverb:start`).
2.  **Create the Service File:** Create a file (e.g., `/etc/systemd/system/reverb.service`) defining how Systemd should manage the process.

**Example Structure (Conceptual):**

```ini
[Unit]
Description=Laravel Reverb WebSocket Server

[Service]
Type=simple
User=www-data  # Or your application user
WorkingDirectory=/var/www/your_laravel_app
ExecStart=/usr/bin/php /var/www/your_laravel_app/artisan reverb:start
Restart=always

[Install]
WantedBy=multi-user.target
```

After creating this file, you would use commands like `sudo systemctl daemon-reload`, `sudo systemctl enable reverb.service`, and finally `sudo systemctl start reverb.service` to launch and manage the process reliably. This ensures that if the server restarts or the Reverb process crashes for any reason, it will automatically attempt to restart itself, guaranteeing uptime.

## Integrating with Your Web Server Setup (Nginx)

Your provided Nginx configuration correctly handles proxying HTTP requests. Since Reverb uses WebSockets, it typically runs on a separate port (e.g., 8080 or another high port) and the WebSocket connection handling needs explicit routing.

The key takeaway here is that Nginx acts as the entry point for HTTP traffic, while the `systemd` service manages the persistent background process (Reverb). This separation of concerns—web serving vs. real-time processing—is a core principle in scalable application architecture like that promoted by **Laravel Company**.

## Conclusion

To successfully deploy Laravel Reverb to production on your VPS, stop thinking of it as a simple command execution and start treating it as a critical service. Never rely on running `php artisan reverb:start` manually. Instead, implement a service manager like Systemd or Supervisor to ensure the Reverb process is automatically started at boot, monitored for health, and automatically restarted upon failure. This shift from manual execution to managed services is what separates functional local development from robust, scalable production environments.
