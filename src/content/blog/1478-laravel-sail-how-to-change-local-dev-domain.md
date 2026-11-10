---
title: "Laravel Sail how to change local dev domain"
description: "Simplifying Local Development with Laravel Sail and Custom Domains Laravel Sail is an amazing tool that makes local development easier for developers by..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Content"]
featured: false
---

<h2>Simplifying Local Development with Laravel Sail and Custom Domains</h2>

Laravel Sail is an amazing tool that makes local development easier for developers by providing a Docker-based environment. However, sometimes you may want to change the default domain name from "localhost" to something more convenient or professional-looking for your project. This blog post aims to guide you through changing the local dev domain on Laravel Sail and improve your workflow while offering alternative solutions if necessary.

<h3>Step 1: Configure your hosts file</h3>
First, you'll want to modify your Windows (C:\Windows\System32\drivers\etc\hosts) or Mac/Linux (~/.hosts) hosts file. This will allow the browser to recognize custom domain names when they are mapped to local IP addresses. Simply add a new line in this file stating:

<code>127.0.0.1 laravel.test</code>

Where 'laravel.test' is your desired domain name for accessing the application locally. Save and close the file, and then open it again with administrative privileges to ensure the changes are saved correctly.

<h3>Step 2: Configure Laravel Sail</h3>
Now, you need to modify your <code>.env</code> file in your Laravel project's root directory. Add a new line:

<code>APP_URL=http://laravel.test</code>

This will set the desired domain name as your application's default URL. You can also use APP_URL=http://localhost for the standard localhost access.

<h3>Step 3: Set up DNS server or host file</h3>
In case you want to use other custom domains, you may need to configure a DNS server (if using an external domain) or edit your local hosts file (/etc/hosts for Linux and /Windows/System32/drivers/etc/hosts for Windows). This will allow your computer to recognize multiple custom domains pointing to the same local IP address (127.0.0.1) without having to worry about ports.

<h3>Step 4: Add a proxy server</h3>
You could also set up a reverse proxy server like Nginx or Apache that can redirect traffic from custom domains to your Laravel Sail localhost application, similar to how a web host handles multiple applications on the same IP address. This approach could be advantageous if you have many projects and don't want them to share the same port.

<h3>Conclusion</h3>
Changing the default domain name for Laravel Sail can streamline your local development workflow, allowing you to access multiple projects more efficiently without dealing with ports. By following these steps and making use of other tools like a web server or modifying the hosts file, you can achieve a simple and effective setup for your Laravel applications. Remember that if none of these solutions is suitable for your needs, it might be worth rethinking your system architecture to optimize performance and improve developer experience.
