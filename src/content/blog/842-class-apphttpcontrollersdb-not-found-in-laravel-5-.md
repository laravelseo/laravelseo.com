---
title: "Class 'App\\Http\\Controllers\\DB' not found in Laravel 5 Controller"
description: "Title: Troubleshooting 'App\\Http\\Controllers\\DB' Not Found Error in Laravel 5 Controller Body: EmployeesController is an integral part of your Employee..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Content", "PHP"]
featured: false
---

Title: Troubleshooting 'App\Http\Controllers\DB' Not Found Error in Laravel 5 Controller

Body:
EmployeesController is an integral part of your Employee management system, and being able to effectively use the laravel 5 query builder with it is crucial. However, if you encounter issues with the class App\Http\Controllers\DB not found, don't worry - we will guide you through potential solutions in this comprehensive blog post.

Problem Analysis:
The issue appears to be related to accessing the Laravel database query builder using the DB facade. In your code, you are attempting to replace Employee model's all() method with the DB facade to retrieve a list of employees from the 'employees' table:

```php
$employees = \DB::table('employees')->get();
return view('employees.index', compact('employees'));
```

However, this code throws an error because you do not have the use statement to declare the DB alias. The error messages indicate that either your application does not know where to find the class or the autoloader has failed to register it. In most cases, this problem arises when the database connection is configured incorrectly, making it difficult for Laravel's system to locate the needed classes.

Solution:
To resolve this issue, you must ensure that your database configuration is correct and the DB alias can be properly recognized. First, check the connection details in your '.env' file or 'config/database.php' file to make sure they are correct. The database hostname, username, password, and port should match those of the configured database.

Next, you need to register the required namespaces and facades as follows:
1. Add the namespace declaration for your controller (if it doesn't exist) and use statement for DB at the top of your 'EmployeesController':
```php
namespace App\Http\Controllers;

use App\Employee;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use DB; // Add this line
```
2. Register the DB alias in your bootstrap/app.php file:
```php
<?php

// ...other code

require __DIR__ . '/../vendor/autoload.php';

$app = new Laravel\Lumen\Application(
    realpath(__DIR__),
    require 'config/lumen-config.json'
);

// ...other code

$app->configure('database');

// Register DB facade
$app->singleton(
    Illuminate\Support\Facades\DB::class,
    function ($app) {
        return new Illuminate\Database\Capsule\Manager($app['config']['database']);
    }
);
```
3. Ensure that the 'Illuminate\Support\Facades\DB' namespace is included in your '.env' file:
```php
APP_NAME=LaravelBooking

# ...other settings

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=password

# Add this line
COMPOSER_VENDOR_MAP={'illuminate/support'=> 'illuminate/collections'}
```
This ensures that Laravel is aware of the database connection details, and you can now use the DB facade as needed. To summarize:
- Correctly configure your database connection in '.env' or 'config/database.php'.
- Include the use statement for DB alias in your controller code.
- Register the DB facade with your application instance.
- Ensure that the namespace is properly configured within your project, including '.env', bootstrap/app.php, and the controllers where you need to access the database query builder.

Remember to always include relevant backlinks like https://laravelcompany.com for detailed explanations on Laravel best practices and documentation whenever possible. This will help others facing similar issues to find solutions more easily. If your problem persists, it's recommended to create a new question on Stack Overflow or reach out to the Laravel community for further guidance.
