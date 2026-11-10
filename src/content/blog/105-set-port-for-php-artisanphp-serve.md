---
title: "Set port for php artisan.php serve"
description: "Title: Customizing Ports for PHP Artisan Serve Commands: Optimizing Local Development Workflow Body: The Laravel framework has become increasingly popular..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Customizing Ports for PHP Artisan Serve Commands: Optimizing Local Development Workflow

Body:

The Laravel framework has become increasingly popular among developers worldwide due to its robust features, ease of use, and flexibility. One of the most useful features in Laravel is the Artisan command-line interface. It allows users to perform various tasks such as creating new applications, updating packages, and serving local development environments with a single line of code. However, you may need to set custom port numbers for your PHP Artisan serve commands if you develop multiple sites on localhost.

In this comprehensive blog post, we will dive into the details of setting custom ports for different folders and understand how it can optimize your local development workflow. We'll also incorporate real-life examples to make the concepts easier to grasp.

1. Using Artisan Serve Command:

First, let us briefly review using the standard PHP artisan serve command. To run a local server for a specific Laravel project, type the following in your terminal:

<pre><code>php artisan serve
</code></pre>

This will launch your application on the default port (8000), allowing you to access it through http://localhost:8000. This is usually enough for a single project; however, if you are working on multiple projects simultaneously, you might need to assign unique ports for each of them for better organization and ease of switching between different applications.

2. Setting Custom Port Numbers:

To set a custom port number for your PHP Artisan serve command, follow these steps:

- Open the folder containing your Laravel project.
- Locate the "config/app.php" file.
- Search within this file for the line that specifies "port". By default, it should be set to 8000:
<pre><code>'url' => env('APP_URL', 'http://localhost'),
'env' => env('APP_ENV', 'local'),
'debug' => (bool) env('APP_DEBUG', false),
'app_start' => Envoy\Illuminate\Foundation\Application::class,
'ignore' => [
    'route_cache.php',
],
'down' => false,
'strict_routing' => true,
'app_url' => 'http://localhost:8000',
'asset_url' => null,
'url_prefix' => '',
'log_view' => false,
'port' => 8000,
</code></pre>
- Change the port number to your desired custom value (e.g., 1000 for this example):
<pre><code> 'port' => 9000,
</code></pre>
- Save and close the file.

3. Running Customized Serve Command:

Once you've set a custom port number in your config file, you can run the PHP artisan serve command as usual to see the new port being used.

<pre><code>php artisan serve
</code></pre>

Access your application by typing its specific URL into your favorite browser, keeping in mind that the current port number is 9000: http://localhost:9000

4. Accessing Two Different Development Sites:

As mentioned earlier, you can access two different development sites simultaneously on localhost using custom port numbers. To do so, follow these steps:

- Open two terminal windows or tabs.
- Run the PHP artisan serve command separately for each project's folder, specifying a unique port number for each one:
<pre><code>php artisan serve --port 8080
</code></pre>
<pre><code>php artisan serve --port 9000
</code></pre>
- Save and close the files.

5. Conclusion:

Incorporating custom port numbers for your Laravel projects can significantly improve your local development workflow by reducing confusion and making it easier to switch between different applications. By following these steps, you'll be able to access various projects on your local server more efficiently, leaving you more time for actual coding instead of troubleshooting network issues.

Remember, as a developer, it's crucial to stay up-to-date with the latest tools and techniques that optimize your workflow and enhance productivity. If you need further guidance or want to learn more about Laravel framework development, visit https://laravelcompany.com for comprehensive resources on Laravel and its ecosystem.
