---
title: "\"Call to undefined function str_slug()\" in Laravel 6.0"
description: "Title: Resolving \"Call to undefined function str slug()\" Error in Laravel 6.0 Body: When upgrading your Laravel 5.8 project to version 6.0, you may encounter..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Title: Resolving "Call to undefined function str_slug()" Error in Laravel 6.0
Body:

<p>When upgrading your Laravel 5.8 project to version 6.0, you may encounter an error stating "Call to undefined function str_slug()" within the session.php file. While it can occur during the upgrade process or even while installing a third-party package in your project, this issue has multiple potential solutions.</p>

<h2>Identify the Issue</h2>

The error messages "Call to undefined function str_slug()" and "str_slug() is not defined" indicate that Laravel's 6.0 release removed the 'Illuminate\Support\Str::slug()' method, which was used in session.php to generate unique IDs for sessions.

<h2>Solutions</h2>

To resolve this issue, you can follow these methods:

1. Use Laravel 5.7 or lower versions of the Str class

You can continue using your existing version of the Laravel framework (5.7 or below) instead of upgrading to version 6.0. This will ensure that you don't encounter any compatibility issues related to str_slug() usage in session.php.

2. Utilize a third-party helper

You can utilize an alternative helper class, such as the 'spatie/laravel-string-helpers', and implement the slug generation process using this library instead of Laravel's built-in functionality. This will enable you to maintain compatibility with your Laravel 6.0 upgrade while avoiding the str_slug() error.

3. Implement a custom Slugger class

If you don't want to rely on external libraries, you can create a custom 'Slugger' class that encapsulates your unique slug generation logic. This ensures compatibility with Laravel 6.0 while still providing the necessary functionality for your project.

4. Replace str_slug() with a predefined helper function

You could also try replacing the call to 'str_slug()' in your code with a more appropriate method, like '-'. This will achieve your desired output without raising the error related to the undefined function. Be cautious though as this may not provide the same functionality that Laravel's built-in method offers.

5. File an issue on Github and ask for support

If none of these solutions suit your project's needs, you can consider opening an issue on GitHub discussing the problem with the Laravel community. This will allow you to receive guidance from experts in the field and potentially find a customized solution for your specific use case.

<h2>Conclusion</h2>

The "Call to undefined function str_slug()" error in Laravel 6.0 can be resolved through various approaches depending on your project's requirements. When encountering this issue, consider the solutions mentioned, as each one provides a unique approach to addressing the error and maintaining the functionality your project needs. Remember that it is essential to ensure compatibility, security, and performance throughout your Laravel project.
