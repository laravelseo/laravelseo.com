---
title: "How to remove /public/ from a Laravel URL"
description: "Title: Simplifying Laravel URLs without Public Folder Troubles A Practical Guide for Developers Introduction Laravel is an incredibly powerful framework that..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Errors"]
featured: false
---

Title: Simplifying Laravel URLs without Public Folder Troubles - A Practical Guide for Developers

Introduction
Laravel is an incredibly powerful framework that has made web development more efficient, but there are times when working with it comes along with some challenges. One such issue faced by developers is removing the /public/ fragment from Laravel URLs without using a virtual machine or modifying document roots. In this article, we will explore various methods to achieve this goal while retaining ease of switching between projects and maintaining overall efficiency.

1. The .htaccess Solution
The first approach that comes to mind is utilizing an .htaccess file with the mod_rewrite method:

<pre><code>&lt;IfModule mod_rewrite.c&gt;
  RewriteEngine On
  RewriteRule ^(.*)$ public/$1 [L]
&lt;/IfModule&gt;
</code></pre>

However, this method may not work for everyone due to compatibility issues with specific servers and framework versions. If you experience a Laravel NotFoundHttpException error, proceed to the next solution.

2. Virtual Hosts and Domain Aliases
To avoid configuring your document root to point to the public folder or using mod_rewrite in your .htaccess file, you can consider setting up virtual hosts on your local development environment. This method involves creating a configuration file (for example, httpd-vhosts.conf) with the following content:

<pre><code>NameVirtualHost *:80
  &lt;VirtualHost *:80&gt;
    DocumentRoot "C:\xampp\htdocs\Project1"
    ServerName project1.local
    ServerAlias www.project1.local
  &lt;/VirtualHost&gt;
</code></pre>

However, this method still requires managing multiple virtual hosts for each Laravel application you have and does not ensure a consistent approach across all your projects. For simplicity and ease of switching between projects, consider the following solutions.

3. Symlinking the Public Folder to the Root
An alternative solution is symlinking the public folder into the root directory of your project. This method can be beneficial for Laravel 5 projects because the directory structure has changed from previous versions. By creating a symbolic link, you will be able to access the public folder without having to specify it in your URLs:

<pre><code>ls -la # Get the symlink command
ln -s path/to/laravel-project/public / # Create the symlink
</code></pre>

This method ensures that all URLs accessing your application will now be accessible without the public folder fragment. However, it may not suit everyone's workflow preferences or server configurations.

4. Using Composer Autoloader to Simplify URLs
Another approach is to leverage Composer autoloading within Laravel 5 to simplify your application URLs further:

<pre><code>$script = file_get_contents(__DIR__.'/../public/index.php');
require_once __DIR__.'/autoload.php';

function main() {
    $app = require_once __DIR__.'/../../bootstrap/start.php';
    $request = \Illuminate\Foundation\Application::make(
        \Illuminate\Contracts\Console\Kernel::class,
        \Illuminate\Foundation\Application::$rootDir . '/'
    );
    require_once __DIR__.'/../public/index.php';
}

if (PHP_SAPI === 'cli-server') {
    // To help the built-in HTTP server work normally,
    // we listen for requests on a temporary domain name based on the script name.
    // This enables us to rewrite all requests to route through this single file.
    $script = str_replace('index.php', 'public/index.php', $script);
    echo "Running PHP $PHP_VERSION as a Symfony Server\n";
    eval($script);
} else {
    // Process signals and then send requests to the server
    pcntl_signal(SIGTERM, function () use ($request) {
        $request->stop();
    });

    pcntl_signal(SIGINT,  function () use ($request) {
        $request->stop();
    });

    include __DIR__.'/../public/index.php';
}
</code></pre>

This solution requires minimal configuration and is independent of your server setup or project directory structure. Simply add the code snippet to your public/index.php file, and you're good to go! However, this method may not suit projects where other applications are already using the public folder for their own purposes.

Conclusion
In conclusion, there is no one-size-fits-all solution for removing the /public/ fragment from Laravel URLs while maintaining ease of switching between projects. The most appropriate approach will depend on your specific workflow preferences and server configurations. Our guide provides several solutions to cater to a variety of developer needs, making it essential that you choose one that aligns with your development ecosystem and project requirements. Ultimately, the goal is to streamline your Laravel application setup for greater efficiency and success in your projects.
