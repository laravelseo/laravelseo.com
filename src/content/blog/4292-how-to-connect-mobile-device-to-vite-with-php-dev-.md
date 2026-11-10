---
title: "How to connect mobile device to vite with php dev server? (exposing host)"
description: "How to Connect Your Mobile Device to Vite and PHP Dev Server: Exposing the Host on Your Network Developing modern applications, especially those built with..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "PHP", "Errors"]
featured: false
---

Developing modern applications, especially those built with the Inertia stack—combining a powerful frontend like Vue/React with a robust backend like Laravel and PHP—requires seamless testing across different devices. Often, the challenge lies in bridging the gap between your local development environment (running on `localhost`) and an external device connected to the same Wi-Fi network.

If you are using Vite for your frontend build process and PHP's Artisan server to handle your backend API, exposing these services correctly can be surprisingly tricky. You want to ensure that when you run `http://localhost:3000` on your desktop, a mobile device on the same network can successfully access it via its internal IP address.

This guide breaks down the exact steps and best practices for exposing both your Vite development server and your PHP Artisan server so that any mobile device on your local network can connect to them.

## The Connectivity Challenge in Full-Stack Development

When you run `vite` or `php artisan serve` locally, they typically bind themselves only to the loopback address (`127.0.0.1` or `localhost`). This means the server is only accessible from the machine it is running on. When trying to access these URLs from a mobile phone, the request fails because the external device cannot see those services directly through the loopback interface.

To solve this, we need to force both servers to listen not just to `localhost`, but to all available network interfaces, effectively making them accessible across your local network.

## The Solution: Exposing the Host IP for Both Services

The key to solving this lies in explicitly telling both the Vite and PHP server commands which external IP address they should bind to. By setting a common host address, we ensure that both services are ready to accept incoming connections from other devices on the Wi-Fi network.

Here is the consolidated approach using two terminal tabs:

### Step 1: Determine Your Host IP

First, you need to know your computer's local IP address (e.g., `192.168.1.X`). This IP will be the address your mobile device uses to reach your development server.

### Step 2: Run Vite with Host Exposure

Run your Vite command, explicitly setting the `--host` flag to your determined IP address. This forces Vite to listen on all network interfaces instead of just `localhost`.

```bash
vite --host=HOST_IP
```

*Note: Replace `HOST_IP` with your actual local network IP (e.g., `192.168.1.10`). You can find this by running `ipconfig` (Windows) or `ifconfig`/`ip a` (Linux/macOS).*

### Step 3: Run the PHP Artisan Server with Host Exposure

Similarly, instruct your Laravel backend server to bind to the same external IP address. This ensures that API requests coming from your phone are correctly routed back to your PHP application running on the server.

```bash
php artisan serve --host=HOST_IP --port=8000
```

By setting `--host=HOST_IP` for both commands, you effectively create a bridge: your desktop machine becomes the central access point for both your frontend assets (Vite) and your backend API (PHP).

### Step 4: Connect from Your Mobile Device

Once both servers are running with host exposure enabled, connect to them using the IP address and the configured ports:

*   **Frontend (Vite):** `http://HOST_IP:3000`
*   **Backend (PHP Artisan):** `http://HOST_IP:8000`

This method bypasses many common networking restrictions, allowing your mobile device to successfully fetch the necessary assets and interact with your API running on your local machine. This pattern is crucial for testing full-stack applications where the frontend build process and the backend API must coexist seamlessly, much like managing complex projects within the Laravel ecosystem.

## Conclusion

Exposing development servers is a fundamental skill for any developer working in a networked environment. By understanding how to leverage flags like `--host` to bind services beyond the loopback address, you can effortlessly connect your mobile devices to your local Vite and PHP development setup. This simple configuration allows you to conduct real-world testing efficiently, ensuring that your Inertia/Laravel application functions perfectly regardless of the device you are using to test it. Always remember to prioritize security when exposing services; ensure your network settings are configured securely before making these changes live!
