---
title: "Get list of all controllers and action in laravel 5"
description: "Discovering Your Application's Structure: Getting a List of Laravel Controllers and Actions As a developer, understanding the structure of your application..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a developer, understanding the structure of your application is crucial for maintenance, refactoring, and advanced tooling. When you are new to a framework like Laravel, asking how to introspect (examine) the code at runtime is a fantastic step. You want to know if there is a systematic way to fetch a list of all controllers and their corresponding methods without manually browsing the file system.

This post will walk you through the best practices for achieving this goal in a Laravel environment, focusing on introspection techniques.

## The Challenge of Introspection in Laravel

Laravel follows a Model-View-Controller (MVC) pattern. Controllers are PHP classes located in the `app/Http/Controllers` directory, and each controller defines specific methods that correspond to HTTP routes (actions). To get a comprehensive list, we need a way to scan these directories and read the contents of the files.

There is no single built-in Artisan command that spits out a perfectly formatted JSON list of *every* controller and its methods in one go. Therefore, we must leverage core PHP functionality, specifically the **Reflection API**, to achieve this programmatic introspection.

## Method 1: Using PHP Reflection for Dynamic Listing

The most robust way to solve this is by using PHP's Reflection class. Reflection allows you to examine the properties (methods, classes) and methods of an object at runtime.

Here is a conceptual example demonstrating how you would scan the `Controllers` namespace to find all controllers and their actions:

```php
<?php

namespace App\Console;

use Illuminate\Support\Facades\File;
use ReflectionClass;

class ControllerLister
{
    public function listAllControllers()
    {
        $controllers = [];
        $basePath = app_path('Http/Controllers');

        // 1. Scan the directory for PHP files
        $files = File::glob($basePath . '/*Controller.php');

        foreach ($files as $filePath) {
            $className = basename($filePath, '.php');
            $controllerClass = "App\\Http\\Controllers\\" . $className;

            if (class_exists($controllerClass)) {
                $controllers[] = [
                    'class' => $controllerClass,
                    'methods' => []
                ];

                // 2. Use Reflection to get all methods of the controller class
                $reflection = new ReflectionClass($controllerClass);
                $methods = [];

                foreach ($reflection->getMethods(ReflectionMethod::IS_PUBLIC) as $method) {
                    $methods[] = $method->getName();
                }

                $controllers[] = [
                    'class' => $controllerClass,
                    'methods' => $methods
                ];
            }
        }

        return $controllers;
    }
}
```

### Explanation of the Code

1.  **File Scanning:** We start by using Laravel’s `File::glob()` to find all files ending in `Controller.php` within the controllers directory.
2.  **Reflection Class:** For each file found, we construct the fully qualified class name (e.g., `App\Http\Controllers\UserController`).
3.  **Reflecting on Methods:** We instantiate a `ReflectionClass` object for that controller. We then call `$reflection->getMethods()` to retrieve all public methods defined within that controller. This gives us the list of actions associated with that controller.

This approach is highly efficient because it relies directly on PHP's core reflection capabilities, which is a fundamental aspect of how frameworks like Laravel operate. For more complex applications, understanding these underlying mechanics is key when building sophisticated solutions.

## Best Practices and Conclusion

While manually scripting this process works perfectly for simple introspection, remember that large-scale application development often benefits from established tools. As you grow your projects, exploring packages or custom Artisan commands can streamline these operations significantly. For instance, whenever you are diving into the architecture of Laravel and how it manages routing and MVC structure, understanding reflection is a powerful skill.

By mastering code introspection, you move beyond simply using a framework to truly understanding *how* that framework works internally. Continue exploring resources like those found at [https://laravelcompany.com](https://laravelcompany.com) as you build more complex applications. Happy coding!
