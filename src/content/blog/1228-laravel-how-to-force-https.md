---
title: "Laravel: how to force HTTPS?"
description: "Title: Enforcing HTTPS in Laravel Applications: A Comprehensive Guide for Developers Body: Forcing HTTPS (Hypertext Transfer Protocol Secure) connections is..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "PHP"]
featured: false
---

Title: Enforcing HTTPS in Laravel Applications: A Comprehensive Guide for Developers

Body:

Forcing HTTPS (Hypertext Transfer Protocol Secure) connections is an important security measure when developing web applications, and it's even more critical if you are using a framework like Laravel. In this post, we will explore how to enforce the use of HTTPS for every page in a Laravel application with both .htaccess file modifications and configuration adjustments within Laravel itself.

Firstly, let us discuss the necessity of forcing HTTPS connections: it protects your website visitors against eavesdropping and man-in-the-middle attacks by encrypting data transfers between users' browsers and your server. Enforcing HTTPS also ensures that your application is served over a more secure network.

Now, let us dive into the implementation of this feature in Laravel 5:

1. .htaccess File Modifications:

- Add the following lines to your existing .htaccess file or create one if it doesn't exist.

<pre><code>RewriteCond %{HTTPS} off
   RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
</code></pre>

This code redirects all HTTP requests to their corresponding HTTPS versions by setting the environment variable 'HTTPS' to 'on'. Moreover, it adds a 301 permanent redirect to ensure search engines can pick up on the change without any hassle.

2. Laravel Config Modifications:

- Open the config/app.php file and locate the following line:
  
<pre><code>'url' => env('APP_URL', 'http://localhost'),</code></pre>

Replace it with this:

<pre><code>'url' => env('APP_URL', 'https://example.com'),</code></pre>

By default, the .env file is located in the root directory of your Laravel project and includes a variable named 'APP_URL' which specifies the URL used for your application. In this case, we are setting it to use an HTTPS version of the website. You can change the domain name to your preferred one based on your application's purpose.

3. Testing and Troubleshooting:

- After making these changes, run your Laravel application in the browser and test the various pages within to ensure they all load over an HTTPS connection. If you encounter any issues, double-check the modifications made to the .htaccess file, Laravel configuration, as well as any third-party package integrations that might interfere with the forced HTTPS functionality.

4. Optional: Using Laravel's Forge for Better Security:

- If your Laravel application is hosted on a server with DigitalOcean or other hosting providers, you can use Laravel Forge to improve security and reliability. Laravel Forge provides automatic SSL certificates through Let's Encrypt alongside other handy features for efficient server management.

In conclusion, enforcing HTTPS connections in your Laravel application is essential in ensuring better data protection and providing a more secure user experience. By following the steps described above, you can easily implement this security feature and make your website as safe as possible from potential threats.
