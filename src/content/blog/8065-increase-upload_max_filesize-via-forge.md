---
title: "Increase upload_max_filesize via Forge"
description: "Solving the 413 Error: How to Properly Increase File Upload Limits via Forge Dealing with a 413 Request Entity Too Large error during file uploads is a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "PHP", "Errors"]
featured: false
---

Dealing with a `413 Request Entity Too Large` error during file uploads is a common pain point for developers running web applications. It’s frustrating because you adjust the PHP settings, deploy via Laravel Forge, and restart services, only to find the limit remains unchanged. This issue rarely stems from just one configuration file; it usually involves a chain reaction between PHP settings, the web server (Nginx or Apache), and the underlying system limits.

As a senior developer, I can tell you that the failure often lies in misconfiguring one of these layers. In this guide, we will diagnose why your `upload_max_filesize` changes aren't sticking and provide the definitive method to resolve the 413 error on your AWS EC2 environment managed by Forge.

## Understanding the 413 Error Context

The HTTP status code **413 Request Entity Too Large** indicates that the server refused to process the request because the entity (the uploaded file) is larger than the server is configured to allow. While you successfully changed `upload_max_filesize` in PHP, this setting often only governs what PHP *can* handle internally. The 413 error is typically enforced by the web server itself (Nginx or Apache) acting as a reverse proxy before the request even hits PHP-FPM.

Therefore, increasing the PHP setting alone is insufficient; we must ensure that every layer of the stack permits the large file size.

## The Three Critical Configuration Directives

To successfully handle large file uploads, you need to synchronize three specific directives across your environment:

1.  **`upload_max_filesize` (PHP):** The maximum size of an uploaded file.
2.  **`post_max_size` (PHP):** The maximum size of POST data that PHP will accept. This *must* be equal to or larger than `upload_max_filesize`.
3.  **`client_max_body_size` (Nginx/Web Server):** The maximum allowed size of the client request body. This is often the missing piece on shared hosting or managed environments like Forge, as it controls the initial reception of the file data.

If only the PHP settings are adjusted, Nginx will still reject the request with a 413 error because its own limit is tighter.

## Step-by-Step Implementation on EC2

Since you are running an Nginx environment on AWS EC2, we need to address both the PHP configuration and the Nginx configuration.

### 1. Adjusting PHP Configuration

Even if Forge tools don't seem to save changes correctly, manually verifying the file is crucial. Locate your main PHP configuration file (often `/etc/php/X.X/fpm/php.ini`). Ensure the following lines are set appropriately. For example, targeting a 20MB limit:

```ini
upload_max_filesize = 20M
post_max_size = 20M
```

### 2. Adjusting Nginx Configuration (The Crucial Step)

Next, you must adjust the Nginx configuration file to allow the request body to be large enough. This is typically located in your site's configuration directory (e.g., `/etc/nginx/sites-available/your_app`).

You need to add or modify the `client_max_body_size` directive within the appropriate `server` block:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # This line is essential for large uploads
    client_max_body_size 25M; 

    location / {
        # ... other configuration
    }
}
```

After making these changes, you must always test the Nginx configuration syntax before reloading:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Conclusion and Best Practices

The `413 Request Entity Too Large` error is a classic example of layered configuration failure. It teaches us that in modern web deployment, especially on managed platforms like Laravel Forge, we cannot rely solely on changing application-level settings (like PHP's directives). We must adopt a holistic approach, ensuring the limits are respected at every layer: the application (PHP), the proxy/web server (Nginx), and the underlying system.

Always remember to consult documentation and best practices from trusted sources like [laravelcompany.com] when deploying complex features to ensure your infrastructure configuration is robust and secure. By correctly setting `client_max_body_size` in Nginx alongside PHP settings, you ensure that large file uploads are accepted seamlessly, solving the 413 error permanently.
