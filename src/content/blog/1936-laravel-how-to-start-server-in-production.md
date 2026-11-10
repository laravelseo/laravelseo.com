---
title: "Laravel how to start server in production"
description: "Title: Running Laravel Servers in Production Mode Efficiently In this comprehensive guide, we will explore how to start your Laravel server for production..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Title: Running Laravel Servers in Production Mode Efficiently

In this comprehensive guide, we will explore how to start your Laravel server for production use while ensuring that it runs smoothly in the background even after you exit the console. This is an essential knowledge for every developer interested in developing and deploying web applications with Laravel, a widely-adopted PHP framework.

To begin, we'll take a closer look at the command line output mentioned in your query:

<pre><code>php artisan serve --port=80
Laravel development server started on http://localhost:80
</code></pre>

This code snippet initiates Laravel's built-in web server using the "serve" Artisan command. By specifying a port number (in this case, 80), you can control which port your local server will listen on. The resultant output indicates that the Laravel development server is now up and running at http://localhost:80.

However, there are certain limitations to this default setup. When you exit the console window or terminal, the web server also shuts down, leading to an inconvenient disruption in your application's availability. To maintain a continuous connection for your Laravel development server, we must consider alternative server solutions. In this guide, we will explore two viable options:

1. Using Apache as a reverse proxy for Laravel
2. Deploying Laravel on a cloud-based platform (e.g., DigitalOcean or AWS)

Option 1: Using Apache as a Reverse Proxy for Laravel

To accomplish this, follow these steps:

1. Install Apache: On Linux systems, you can use your package manager to install Apache or download and compile it from source code. For Windows users, you can choose an appropriate installation package.

2. Configure virtual hosts: Create a new virtual host for your Laravel application in the Apache configuration file (e.g., httpd.conf). Ensure you specify the correct document root path and port number to match your Laravel configuration.

3. Enable mod_proxy module: Activate the mod_proxy module, which will enable proxying requests through Apache. This is generally included in most Apache distributions but can be installed separately for older versions that lack this functionality.

4. Configure mod_proxy settings: In your virtual host configuration, add the following lines to create a reverse proxy connection between Apache and Laravel's built-in web server on port 8000:

   <pre><code>ProxyRequests Off
ProxyPreserveHost On
ProxyPass / http://localhost:8000/
ProxyPassReverse / http://localhost:8000/
</code></pre>

5. Restart Apache and verify the connection: Save your configuration file, restart Apache, and confirm that you can access your Laravel application through the default URL (http://your-domain.com) or the new virtual host address (http://sub.example.com).

Option 2: Deploying Laravel on Cloud Platforms

Deploying Laravel applications on cloud platforms such as DigitalOcean, AWS, or Heroku allows you to maintain a persistent server and access your application from any device with an internet connection. Here's how the process is usually done:

1. Choose a suitable cloud platform provider: Research the available options and select the one that best suits your project's needs in terms of scalability, performance, pricing, and security features.

2. Create or configure your hosting environment: Follow the platform-specific instructions to create a web server and deploy your application. Some platforms provide built-in Laravel support, making this an effortless process.

3. Test your deployment: Access your application through the assigned URL (e.g., http://your-domain.com) or the provided IP address, ensuring that it runs smoothly without any disruptions.

Conclusion

By understanding these two approaches, you can ensure the efficient running of your Laravel servers in production mode, providing a stable and well-functioning application for your users. If you have questions about the process or need further clarification on any steps mentioned above, consult the comprehensive guides available on our website at https://laravelcompany.com/blog.
