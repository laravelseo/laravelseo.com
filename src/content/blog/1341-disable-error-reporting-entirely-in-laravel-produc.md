---
title: "Disable error reporting entirely in Laravel production?"
description: "Title: Disabling Error Reporting in Laravel Production: A Comprehensive Guide Introduction: When working with production environments, it's vital to maintain..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Title: Disabling Error Reporting in Laravel Production: A Comprehensive Guide

Introduction:
When working with production environments, it's vital to maintain a stable and secure application for users. However, dealing with legacy code can sometimes lead to errors or warnings that may not be immediately fixable but still need to be suppressed effectively. In this post, we discuss approaches to disable error reporting entirely in Laravel production, allowing developers to focus on the more crucial functionalities of their applications.

Solution 1: Using APP_DEBUG Flag
One way to suppress error reporting is by setting the APP_DEBUG flag to false within your .env file. This will prevent Laravel from throwing exceptions or displaying warnings when they occur. However, this option doesn't address the root issue of dealing with legacy code and its associated warnings.

Solution 2: Setting Appropriate Log Levels
Another approach is to set APP_LOG_LEVEL to emergency in your .env file. This will ensure that only the most severe errors are logged while suppressing less critical ones, such as those resulting from undefined variables and minor syntax errors. This can be a useful first step towards finding a comprehensive solution to your legacy code issues.

Solution 3: Disabling Error Handling at Runtime
You can disable error handling by setting display_errors(false) and setting the error handler (set_error_handler(null)) and exception handler (set_exception_handler(null)). This will prevent errors from being shown on your webpage, but it does not address the root cause of these issues: the legacy code.

Solution 4: Using Laravel Routing to Wrap Legacy Code
A more effective approach is to use Laravel's routing functionality in conjunction with PHP's output buffering feature. This will allow you to run your legacy code within an ob_start() block, capturing the output and returning it as a response. While this method works for one specific issue (undefined variable), it could be further adapted to handle other similar problems.

Further Refinement: Using Middleware to Suppress Errors
If the previous approach seems unsuitable or isn't scalable enough, you can create a middleware class that handles error suppression for all routes. This middleware will ensure that your application always returns clean responses, even in situations where errors occur due to legacy code. Here's an example implementation:

1) Create the Middleware Class:
```php
<?php namespace App\Http\Middleware;

class SuppressExceptions implements MiddlewareInterface {
    public function handle($request, Closure $next) {
        error_reporting(0);
        return $next($request);
    }
}
```

2) Register the Middleware in your Kernel File:
```php
<?php namespace Laravel\Lumen\Application;

use Illuminate\Routing\Router;
use App\Http\Middleware\SuppressExceptions;

class HttpKernel extends BaseKernel {
    public function register() {
        $this->app->pushMiddleware(new SuppressExceptions(...));
        
        // ... other middleware registrations
    }
}
```

Conclusion:
In conclusion, there are various options for disabling error reporting in Laravel production. While the above approaches might not address every issue at once, they offer a range of solutions that can be tailored to fit your specific needs. The key is finding the most effective approach for dealing with legacy code and ensuring that your application remains stable and functional for users. Remember always to prioritize security and performance when evaluating solutions for your Laravel applications.
