---
title: "Where do I put my custom classes and functions in Laravel"
description: "Where to Put Your Custom Classes and Functions in Laravel: A Developer's Guide Building reusable logic is the cornerstone of efficient software development...."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Building reusable logic is the cornerstone of efficient software development. When you start building applications with Laravel, it’s natural to ask: "Where do I put my custom classes, helper functions, and utility methods so they are accessible everywhere without causing namespace headaches?"

The scenario you described—creating a class with useful functions and trying to call them from a controller—is extremely common. The issue often lies not in *where* you place the file, but in how PHP's autoloading and Laravel's structure (PSR-4) are utilized. As a senior developer, I can guide you through the best practices for organizing code in a Laravel project.

## Understanding Laravel's Structure: PSR-4 and Autoloading

Laravel heavily relies on the **PSR-4 standard** for autoloading classes. This means that PHP (and thus Laravel) knows exactly how to find any class based on its namespace and file location within the `app` directory. To make this work seamlessly, all your custom code should reside within the `app/` directory structure.

The path you use defines the namespace. For example, a file at `/app/Http/Controllers/TasksController.php` belongs to the namespace `App\Http\Controllers`. If you create reusable logic, it should generally live in dedicated folders within `app/`, such as `app/Services` or `app/Helpers`.

## Method 1: Structuring Reusable Logic with Classes (The OOP Approach)

For complex logic, state management, and business rules, creating actual classes is the superior approach. This forces good object-oriented design principles.

### Best Practice: Using Namespaces Correctly

Instead of scattering files into arbitrary locations like `/app/Http/Helpers/MyClasses.php`, follow Laravel's conventions. Create a dedicated directory for your domain logic, for instance, `app/Services`.

**Example Setup:**

1.  **Create the Directory:** `app/Services`
2.  **Create the Class File:** `app/Services/TaskHelper.php`

**Code Example: `app/Services/TaskHelper.php`**

```php
<?php

namespace App\Services;

class TaskHelper
{
    /**
     * A frequently used function for handling task states.
     */
    public function sayHi()
    {
        echo 'Hello from the TaskHelper!';
    }

    public function processTask(string $taskName)
    {
        // Complex business logic goes here
        return "Processing task: " . $taskName;
    }
}
```

### Accessing the Class in a Controller

Because we followed PSR-4, we can easily import and use this class wherever needed.

**Code Example: `app/Http/Controllers/TasksController.php`**

```php
<?php

namespace App\Http\Controllers;

use App\Services\TaskHelper; // Import the specific class we need

class TasksController extends Controller
{
    public function index()
    {
        // Instantiate the service class
        $helper = new TaskHelper();
        
        // Call the methods cleanly
        $helper->sayHi(); 
        echo "\n";
        $result = $helper->processTask('Buy Groceries');
        echo $result;
    }
}
```

By following this structure, when you use `use App\Services\TaskHelper;`, PHP’s autoloader instantly knows where to find the file, eliminating the "Class not found" errors you encountered previously. This disciplined approach is crucial for maintaining clean codebases, aligning with the principles taught by developers at [laravelcompany.com](https://laravelcompany.com).

## Method 2: Handling Simple Functions (Static Helpers)

If your reusable code consists only of simple utility functions that don't require object state, you can use static methods within a dedicated class or even standalone helper files.

For very simple utilities, placing them in the `app/helpers.php` file and using a simple `require` directive is an option, though dependency injection (using Services as shown above) is generally preferred in modern Laravel applications.

**Example: Simple Static Helper**

If you put a static method inside your service class:

```php
// In app/Services/TaskHelper.php
class TaskHelper {
    public static function sayHi() {
        echo 'Static Hi!';
    }
}
```

You would access it like this in your controller:

```php
$helper = new TaskHelper();
$helper::sayHi(); // Accessing via static method
```

## Conclusion

The key takeaway is to embrace the structure provided by Laravel. Avoid placing custom files randomly in subdirectories like `/app/Http/Helpers`. Instead, organize your reusable code into logical service classes within the `app` directory and utilize proper PHP namespaces. This ensures that your project remains clean, scalable, and easily maintainable for years to come. Always strive for dependency injection and clear separation of concerns when developing applications on Laravel.
