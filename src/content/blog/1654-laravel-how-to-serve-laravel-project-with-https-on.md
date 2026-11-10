---
title: "Laravel - how to serve laravel project with https on local development"
description: "Title: Serving Laravel Projects with HTTPS Locally A Comprehensive Guide Introduction: Serving your Laravel projects on an encrypted connection is essential..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content"]
featured: false
---

Title: Serving Laravel Projects with HTTPS Locally - A Comprehensive Guide

Introduction:
Serving your Laravel projects on an encrypted connection is essential for ensuring security, privacy, and seamless user experiences while developing or testing applications locally. In this blog post, we'll explore various methods to serve Laravel projects over HTTPS using local development tools. We will also provide step-by-step instructions and code examples to help you implement secure connections with ease.

Why HTTPS for Local Development?
HTTPS (Hypertext Transfer Protocol Secure) is the secured version of HTTP (Hypertext Transfer Protocol), which encrypts data while in transit between clients and servers. It protects sensitive information, preventing any potential security threats or privacy issues. Using HTTPS in local development not only enhances your security but also ensures a smooth user experience by providing an encrypted connection.

Serving Laravel Project with HTTPS using Laragon:
Laragon is a popular lightweight web development environment that allows you to develop applications quickly and easily on various platforms, including Windows, macOS, and Linux. Here's how to set up HTTPS while serving your Laravel project locally using Laragon:

1. Download and install Laragon from https://laragon.org/.
2. Open Laragon Control Panel and click on the "http" option.
3. Select "Enable SSL for http" and press "OK".
4. Click on the "SSL" option in the Laragon Control Panel.
5. Configure your SSL profile by selecting a certificate from the pre-defined options or providing your own PEM/CRT and KEY files.
6. After configuring the SSL profile, click on "Apply" to apply SSL for http.
7. Now, start Apache and Nginx in Laragon Control Panel, ensuring they are running.
8. Access your application by navigating to https://localhost or https://<hostname>:port.

Serving Laravel Project with HTTPS using Homestead:
Homestead is a Vagrant-powered development environment that allows you to manage multiple virtual machines with ease. Follow these steps to serve your Laravel project over HTTPS in a Homestead environment:

1. Install and configure Homestead on your local machine following the official documentation at https://laravel.com/docs/8.x/homestead#configuration.
2. Activate SSL inside your Vagrantfile by adding the following code snippet:
   <pre><code>config.vm.network "private_network", ip: "192.168.33.10"
config.vm.network :forwarded_ports, guest: [
  443 => 443,
], host: ""
</code></pre>
3. Ensure your Vagrant Box (virtual machine) is running with the command: "vagrant up".
4. Access your application by navigating to https://localhost or https://<hostname>:port.

Serving Laravel Project with HTTPS using Valet:
Valet is a tool that allows you to easily set up and manage local development environments in macOS. Here's how to serve your project over HTTPS using Valet:

1. Install Valet on your Mac by following the official guide at https://laravel.com/docs/8.x/valet#quick-installation.
2. Activate SSL in your local development environment with the command "valet ssl".
3. Start your application server using the command "php artisan serve --ssl".
4. Access your application by navigating to https://localhost or https://<hostname>:port.

Serving Laravel Project with HTTPS locally without external tools:
If you don't want to install additional tools, you can still make it work using standard Laravel features. Here are the steps for serving your project over HTTPS locally:

1. Ensure that you have SSL certificates installed on your local machine (e.g., self-signed or obtained from a trusted CA).
2. Edit the ".env" file to configure the application's base URL with the desired HTTPS scheme, e.g.:
   <pre><code>APP_URL=https://localhost:8000
</code></pre>
3. In your "config/app.php" file, ensure you have defined your preferred protocol (HTTP or HTTPS) in the "url" key of the "paths" array:
   <pre><code>
'paths' => [
    'api' => env('APP_API_URL') ?? '/api',
    'auth' => env('AUTH_ROUTE_PREFIX') ?? null,
    'bindings' => env('BINDINGS_ROUTE_PREFIX') ?? null,
    'broadcasting' => env('BROADCASTING_ROUTE_PREFIX') ?? '/broadcasting',
    'cache' => env('CACHE_ROUTE_PREFIX') ?? '/cache',
    'cors' => env('CORS_ROUTE_PREFIX') ?? null,
    'defaults' => null,
    'domains' => env('DOMAINS_ROUTE_PREFIX') ?? null,
    'egress' => env('EGRESS_ROUTE_PREFIX') ?? '/egress', // Ensure it has HTTPS protocol
    'filesystems' => null,
    'frontend' => null,
    'gateway' => env('GATEWAY_ROUTE_PREFIX') ?? '/gateway',
    'help' => null,
    'internal' => null,
    'inspire' => null,
    'lang' => null,
    'location' => env('LOCATION_ROUTE_PREFIX') ?? null,
    'mail' => env('MAIL_ROUTE_PREFIX') ?? '/mail',
    'marketing' => null,
    'notifications' => null,
    'passwords' => null,
    'redis' => null,
    'search' => null,
    'settings' => null,
    'storage' => null,
    'test' => env('TEST_ROUTE_PREFIX') ?? '/testing',
    'ui' => null,
    'user' => null,
    'welcome' => env('WELCOME_ROUTE_PREFIX') ?? null,
],
</code></pre>
4. Finally, access your application by navigating to https://localhost or https://<hostname>:port. Note that browsers may warn about the self-signed certificate, but that can be resolved by adding trusted SSL certificates to your local machine.

Conclusion:
Serving Laravel projects over HTTPS is essential for ensuring a secure and seamless user experience in your development environment. By following these different methods and best practices, you are well on your way to providing encrypted connections for your applications while developing locally. For further exploration, check out the Laravel documentation at https://laravel.com/docs/8.x/, which contains more useful resources on securing and optimizing your web applications.
