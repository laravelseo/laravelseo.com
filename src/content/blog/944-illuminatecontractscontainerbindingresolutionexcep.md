---
title: "Illuminate\\Contracts\\Container\\BindingResolutionException - Target class [CommandMakeCommand] does not exist"
description: "Title: Illuminate\\Contracts\\Container\\BindingResolutionException Target class [CommandMakeCommand] does not exist Body: Using Laravel 8.75 and trying to..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Title: Illuminate\Contracts\Container\BindingResolutionException - Target class [CommandMakeCommand] does not exist
Body:
<p>Using Laravel 8.75 and trying to upgrade your project to PHP 8.1 by updating the composer.json file might lead to errors, specifically the error message "Illuminate\Contracts\Container\BindingResolutionException - Target class [CommandMakeCommand] does not exist." This can happen when you encounter issues with Laravel's dependency injection container and the autoloading process.</p>
<pre><code>Loading composer repositories with package information
Updating dependencies
Nothing to modify in lock file
Installing dependencies from lock file (including require-dev)
Nothing to install, update or remove
Package swiftmailer/swiftmailer is abandoned, you should avoid using it.
Use symfony/mailer instead.
Generating optimized autoload files
 
Illuminate\Foundation\ComposerScripts::postAutoloadDump
@php artisan package:discover --ansi

Illuminate\Contracts\Container\BindingResolutionException

Target class [CommandMakeCommand] does not exist.

at
</code></pre>
<p>vendor/laravel/framework/src/Illuminate/Container/Container.php:879</p>
<pre><code>875▕
876▕         try {
877▕             $reflector = new ReflectionClass($concrete);
878▕         } catch (ReflectionException $e) {
879▕             throw new BindingResolutionException(&quot;Target class [$concrete] does not exist.&quot;, 0, $e);
880▕         }
881▕
882▕         // If the type is not instantiable, the developer is attempting to resolve
883▕         // an abstract type such as an Interface or Abstract Class and there is

  +13 vendor frames
 14  artisan:37
 Illuminate\Foundation\Console\Kernel::handle()
Script @php artisan package:discover --ansi handling the post-autoload-
dump event returned with error code 1
</code></pre>

<p>To resolve this issue, first examine the command you are trying to execute (in your case CommandMakeCommand) and make sure it is defined in the application. If that is not the case, you can create or update the relevant class inside the App\Console\Commands directory of your Laravel project. Alternatively, check if it's a Laravel package command, and ensure that the package has been installed and updated if necessary. If the issue persists, consider upgrading to PHP 8.1 and adjusting your code according to compatibility guidelines for the new version.</p>
<pre><code>vendor/laravel/framework/src/Illuminate/Contracts/Container/BindingResolutionException.php:20
vendor/laravel/framework/src/Illuminate/Container/Container.php:879
</code></pre>
<p>Ensure your composer.json file is correctly configured and run 'composer update' to install all dependencies. Pay attention to any warnings or errors while updating, as these could provide valuable information regarding the issue with CommandMakeCommand. Lastly, if none of these steps resolves the error, consider seeking help from online forums or reaching out to your company's support team.</p>
<p><strong>Conclusion:</strong> When upgrading Laravel and PHP versions or working with packages, it is crucial to ensure that all dependencies are properly set and that there are no conflicts in your project. Always check the compatibility guidelines for new versions and update your code accordingly. To avoid such issues from happening in future, consider utilizing a version control system like Git to track changes and keep your codebase consistent across different environments.</p>
