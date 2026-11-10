---
title: "Laravel 5 : Use different database for testing and local"
description: "Title: Effortlessly Switch Databases for Development and Testing in Laravel 5 Applications Body: Laravel makes it easy to manage databases by allowing you to..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Title: Effortlessly Switch Databases for Development and Testing in Laravel 5 Applications

Body:
<p>Laravel makes it easy to manage databases by allowing you to connect to multiple database connections. This convenient feature can be particularly useful when working on both development and testing environments where different database needs may arise. In this comprehensive guide, we'll walk through how to configure your Laravel application to use separate databases for development and testing without editing the <code>.env</code> file each time.</p>

<h2>Creating Separate Database Connections</h2>
<p>Start by creating two database connections in your <code>config/database.php</code> file, one for development and another for testing. In this example, let's imagine using a PostgreSQL connection for development and MySQL for testing:</p>

- Development Connection:
  ```php
    'mysql-dev' => [
      'driver'   => 'mysql',
      'host'     => env('DB_HOST_DEV'),
      'port'     => env('DB_PORT_DEV'),
      'database' => env('DB_DATABASE_DEV'),
      'username' => env('DB_USERNAME_DEV'),
      'password' => env('DB_PASSWORD_DEV'),
    ],
  ```
- Testing Connection:
  ```php
    'mysql-test' => [
      'driver'   => 'mysql',
      'host'     => env('DB_HOST_TEST'),
      'port'     => env('DB_PORT_TEST'),
      'database' => env('DB_DATABASE_TEST'),
      'username' => env('DB_USERNAME_TEST'),
      'password' => env('DB_PASSWORD_TEST'),
    ],
  ```
<p>Now, we'll create a separate <code>.env</code> file for each environment. Name these files according to your preference (e.g., <code>.env.development</code>, <code>.env.test</code>) and place the database connection credentials in their respective files.</p>

<h2>Configuring Laravel to Use Custom Database Connections</h2>
<p>Next, we'll modify the <code>bootstrap/app.php</code> file to load the correct .env file based on the environment. This can be done using the following code:</p>
```php
$env = env('APP_ENV', 'local');
require __DIR__.'/../'.configPath().'/env/'.$env;
```
<p>This ensures that your Laravel application will load the appropriate database connection based on the environment. For example, if you are working on the development environment, your <code>.env</code> file should point to the 'mysql-dev' connection.</p>

<h2>Switching Database Connections Automatically</h2>
<p>Lastly, we can use Laravel's built-in phpunit to run database migrations and seeds according to your environment by setting the <code>APP_ENV</code> variable. You can do this by running the following commands:</p>
- For development:
```bash
export APP_ENV=development && php artisan migrate --seed
```
- For testing:
```bash
export APP_ENV=test && php artisan migrate:fresh --seed --env=testing
```
<p>This way, your Laravel application will load the correct database connection for development and testing without the need to edit any .env files.</p>

Conclusion:
<p>With this guide, you can easily switch between multiple database connections in your Laravel 5 application according to the environment. By creating separate database connections for development and testing, you'll have a more efficient setup that allows for better testing and development practices without the hassle of editing .env files every time.</p>
