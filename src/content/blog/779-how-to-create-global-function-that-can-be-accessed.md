---
title: "how to create global function that can be accessed from any controller and blade file"
description: "Title: Effortlessly Create Global Functions for Access in Any Laravel Controller or Blade File Introduction Laravel is an amazing PHP framework that makes..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Effortlessly Create Global Functions for Access in Any Laravel Controller or Blade File

Introduction
Laravel is an amazing PHP framework that makes web development a breeze with its vast features and tools. One of the most important aspects of any PHP application is code reusability. To achieve this, we can create global functions that can be accessed from anywhere within our Laravel application, including controllers and Blade files. In this blog post, we will explore various techniques to make these functions available globally in your application and offer practical examples and best practices for maximum efficiency.

1. Utilize the Helper Functions
Laravel provides a helper function named "function" which allows you to create global functions that are accessible from anywhere within your codebase. Here's how to create a simple global helper function:

```php
<?php
// Create a global function in the root namespace of your project
function helloWorld() {
    return 'Hello World!';
}
```

To use this newly created function, simply call its name from within any controller or Blade file:

```php
// Example use in controller
public function sayHi() {
    return helloWorld(); // Returns "Hello World!"
}
```

```blade
<!-- Example use in a view template -->
{{ helloWorld() }}
```

2. Leverage Service Providers
Service providers are another way to create global functions in Laravel. They allow you to register services and bind them to your application's container for easy access:

```php
<?php
// Register the service provider
class FunctionsProvider extends ServiceProvider {
    public function boot() {
        // Create a global function
        $this->app->singleton('helloWorld', function () {
            return 'Hello World!';
        });
    }
}
```

To use this global function, simply inject the service into your controller or Blade file:

```php
// Example use in controller
public function sayHi() {
    $helloWorld = app('helloWorld'); // Returns "Hello World!"
    return $helloWorld;
}
```

```blade
<!-- Example use in a view template -->
{{ get('helloWorld') }}
```

3. Use Laravel's Facades
Facades are static classes that provide an easy way to access complex services and functions without having to instantiate the service directly. They mimic interfaces and can be accessed as if they were classes:

```php
<?php
// Create a global function as a facade method in your helper file
use Illuminate\Support\Facades\App;
function helloWorld() {
    return App::make('helloWorld'); // Returns "Hello World!"
}
```

To use this global function, simply call it from any controller or Blade file:

```php
// Example use in controller
public function sayHi() {
    $helloWorld = helloWorld(); // Returns "Hello World!"
    return $helloWorld;
}
```

```blade
<!-- Example use in a view template -->
{{ get('helloWorld') }}
```

Conclusion
Creating global functions for access in any Laravel Controller or Blade file is essential for reducing code duplication and improving your application's maintainability. While there are multiple techniques to achieve this, each approach comes with its own set of benefits and drawbacks. The most suitable method depends on your specific requirements and project structure. By following best practices, you can ensure that your global functions remain easily accessible and efficient for all future development efforts.
