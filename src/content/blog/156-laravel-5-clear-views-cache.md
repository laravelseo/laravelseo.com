---
title: "Laravel 5 Clear Views Cache"
description: "Title: Efficiently Managing Laravel View Caches: Understanding Their Location, Deletion, and Disabling Introduction Laravel is an incredibly powerful PHP..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Performance", "PHP"]
featured: false
---

Title: Efficiently Managing Laravel View Caches: Understanding Their Location, Deletion, and Disabling

Introduction
Laravel is an incredibly powerful PHP framework that saves developers time by providing numerous features to simplify the creation of web applications. One of these features is caching for views; this allows the application to store commonly used view data in a cache folder instead of regenerating it each time it's requested. However, as your application grows and changes, you may need to manage the cache directory and its contents to free up space or disable specific aspects of the caching system. In this article, we will discuss how to locate Laravel view caches, delete them using various methods, and disabling views caching if needed.

Location of View Caches in Laravel 5
The location for stored Laravel view caches is fixed across versions: they are all found inside the <code>storage/framework</code> directory. Specifically, the cache files for views can be found within the subdirectory called 'views.' To ensure that you're working with the correct path, you must use the framework's public directory as a reference point:
<p><code>public/../storage/framework/views</code></p>

Deleting Laravel View Caches
Deletion is often necessary for freeing up space or when you need to clear outdated view caches. To delete all the stored views, you can use the command <code>php artisan cache:clear</code>, but this will clear not only the views cache but also other cached data. If you want to remove only the views cache, follow these steps:

1. Navigate to your Laravel application's directory:
<p><code>cd /path/to/laravel-project</code></p>
2. Delete all files in the <code>storage/framework/views</code> directory:
<p><code>rm -rf storage/framework/views/*</code></p>
3. Clear other cached data if necessary. You can remove them by running the command <code>php artisan config:clear</code> and then <code>php artisan cache:clear</code>. These commands will clear all configuration caches as well as the application cache.

Manually Deleting View Cache Files
Another option to delete Laravel view caches is performing manual deletion of files from the directories. This way, you can selectively choose which cached files to remove. Follow these steps:

1. Access your project's directory using the terminal or command prompt.
2. Identify specific view cache files to be removed and delete them manually by appending their names with <code>rm</code>, for example:
<p><code>rm storage/framework/views/home.blade.php</code></p>
3. Repeat this step for any other unwanted cached view files.
4. Ensure that you've removed any files or directories that pertain to your application, as deleting unrelated files could interrupt the functionality of your Laravel project.

Disabling View Caching in Laravel 5
Sometimes, you may need to disable views caching altogether for various reasons, such as debugging, updating certain parts of your site, or ensuring live updates of data sources. You can achieve this by following these steps:

1. Open the <code>config/cache.php</code> file in your Laravel project and locate the 'views' section.
2. Change the value of 'expire_now' from <code>true</code> to <code>false</code>. This will prevent the application from generating new cache files for views.
3. Save the changes, and when you run your Laravel project again, the views caching will be disabled. Keep in mind that this is a global setting, meaning it applies to all views of your Laravel application.

Conclusion
Managing Laravel view caches involves understanding their location, deleting them through different methods or disabling the feature altogether. By following the steps outlined above and maintaining a structured approach, you can ensure the efficient operation of your Laravel project while freeing up valuable space on your server. Remember to always back up your application before making any significant changes to avoid potential issues.
