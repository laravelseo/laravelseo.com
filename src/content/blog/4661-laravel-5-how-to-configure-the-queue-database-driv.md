---
title: "Laravel 5 How to configure the Queue database driver to connect to a non-default database?"
description: "Laravel 5: Configuring the Queue Database Driver for Non Default Connections As senior developers working with large applications, managing database..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As senior developers working with large applications, managing database connections across different environments—especially in complex setups involving multiple databases—is a common challenge. When setting up background jobs using Laravel Queues, connecting to a specific database that isn't the application's default requires careful configuration.

This post will guide you through correctly configuring the Queue database driver in Laravel 5.1 to point to a non-default database connection, allowing your queue tables to reside in a separate MySQL instance (like `mysql2` instead of the default `mysql1`).

## Understanding the Default Limitation

When you configure the queue driver as `'database'`, Laravel looks at `config/queue.php` to determine how to store job data. If you specify a table name, like `'table' => 'jobs'`, the system defaults to using the database connection defined in your primary configuration file, `config/database.php`.

The initial setup might look like this:

```php
// config/queue.php
QUEUE_DRIVER=database

'database' => [
    'driver' => 'database',
    'table' => 'jobs', // This implicitly uses the default DB connection
    'queue' => 'default',
    'expire' => 60,
],
```

As you correctly noted, this configuration ties the queue table directly to whatever Laravel defines as its primary database. To connect to a specific named connection (e.g., `mysql2`), we must explicitly instruct the queue system which connection to use.

## The Solution: Explicitly Specifying the Connection

To achieve cross-database queuing, you need to modify the queue configuration to reference the specific connection defined in your `config/database.php` file. This allows the queue mechanism to utilize any existing connection defined by Laravel's Eloquent setup.

### Step 1: Ensure Multiple Connections are Defined

First, ensure your `config/database.php` correctly defines both your default and your secondary connections. For this example, we assume you have defined `mysql1` (default) and `mysql2`.

```php
// config/database.php (Example Snippet)
return [
    'connections' => [
        'mysql1' => [ // Your default connection
            'driver' => 'mysql',
            'host' => env('DB_HOST', '127.0.0.1'),
            // ... other settings
        ],
        'mysql2' => [ // The remote connection for the queue
            'driver' => 'mysql',
            'host' => env('DB_HOST_MYSQL2', 'remote_server_ip'),
            'database' => env('DB_DATABASE_MYSQL2', 'mysql2'),
            // ... other settings
        ],
    ],
];
```

### Step 2: Configure the Queue Driver to Use a Specific Connection

Next, modify `config/queue.php` to explicitly point the queue functionality towards the desired connection, which in this case is `mysql2`.

```php
// config/queue.php (The corrected configuration)
QUEUE_DRIVER=database

'database' => [
    'driver' => 'database',
    'table' => 'jobs',
    'queue' => 'default',
    'expire' => 60,
    // *** THE CRITICAL CHANGE IS HERE ***
    'connection' => 'mysql2', 
],
```

By adding the `'connection' => 'mysql2'` line, you instruct Laravel’s queue system to use the settings defined under the `mysql2` entry in your database configuration when performing all read/write operations for the jobs table. This separation ensures that your main application uses `mysql1`, while the background processing is safely isolated on `mysql2`.

## Best Practices and Conclusion

This approach of leveraging existing Eloquent connections within Laravel is a core principle of building scalable applications, as highlighted by best practices discussed on platforms like https://laravelcompany.com. It promotes separation of concerns: the application logic remains tied to its primary data store, while asynchronous tasks can utilize dedicated, isolated resources.

When dealing with complex multi-database setups, always favor explicit configuration over relying on implicit defaults. Always test your queue setup thoroughly to ensure that background jobs are correctly persisting data in the intended remote database. By explicitly setting the connection, you gain full control over where your queue infrastructure resides.
