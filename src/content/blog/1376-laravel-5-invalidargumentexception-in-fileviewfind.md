---
title: "Laravel 5 InvalidArgumentException in FileViewFinder.php line 137: View [.admin] not found"
description: "Title: Resolving Laravel 5 InvalidArgumentException in FileViewFinder.php line 137: View [.] not found Body: In a Laravel application, the..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Title: Resolving Laravel 5 InvalidArgumentException in FileViewFinder.php line 137: View [.] not found

Body:

In a Laravel application, the `InvalidArgumentException` is commonly encountered when certain resources cannot be found or are simply missing. This error can manifest itself during runtime and prevent your application from functioning as intended. In this blog post, we will explore why you might encounter the specific issue of "InvalidArgumentException in FileViewFinder.php line 137: View [.] not found" and discuss potential fixes to remedy the problem.

Firstly, it is essential to understand that Laravel utilizes a powerful templating engine called Blade to render your application's views. These views are stored within your `resources/views` folder and can be accessed using the `View::make()` method. In this case, you are trying to access a view named `admin`, which is located in the `.admin` folder, as indicated by the code snippet:

<pre><code>
return \View::make('/admin');
</code></pre>

However, there seems to be an issue with the actual path to this view. Since you are using a slash (/) before the name `admin`, Laravel will assume that it's in your root directory. This might not be what you intend, as the documentation states that providing a dot '.' at the beginning of a folder name would make it private and not accessible directly.

To address this issue, you need to change the view path to reflect the correct location for accessing the `admin` view. You'll need to replace the path with an absolute one pointing to the actual location of your admin view:

<pre><code>
return \View::make('path/to/views/admin');
</code></pre>

Alternatively, you can update the route definition in `routes.php` to indicate that it's a subdirectory within your application and not directly accessible from the root:

<pre><code>  Route::match(['get', 'post'], '/admin/', 'student@admin');</code></pre>

This change would make Laravel aware of the intended path for accessing the `admin` view. As a result, you should no longer encounter the "InvalidArgumentException in FileViewFinder.php line 137: View [.] not found" issue.

Remember that proper naming and organization of your application's folders and views are crucial to avoid errors like this one. By following best practices, you can easily prevent and solve Laravel-related issues effectively. To learn more about routing in Laravel, visit the official documentation at https://laravelcompany.com/blog/getting-started-with-routing-in-laravel-5.

In conclusion, understanding the root cause of the "InvalidArgumentException in FileViewFinder.php line 137: View [.] not found" error is essential for maintaining a functional Laravel application. By adjusting your code and ensuring that your views are placed appropriately within their designated folders, you can avoid this common issue and ensure optimal performance of your Laravel project.
