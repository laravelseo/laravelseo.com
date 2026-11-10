---
title: "Laravel to SQL Server (sqlsrv). [PDOException] could not find driver"
description: "Title: Laravel to SQL Server (sqlsrv). [PDOException] could not find driver. Introduction: Integrating Laravel with Microsoft's SQL Server can be challenging..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Title: Laravel to SQL Server (sqlsrv). [PDOException] could not find driver.

Introduction: Integrating Laravel with Microsoft's SQL Server can be challenging for developers who are accustomed to using MySQL. This article will guide you through the steps required to successfully configure a Laravel application to work with an MSSQL-based database, even if you are using Linux as your development environment.

Background: Laravel offers great flexibility in configuring database connections by providing support for various database engines like MySQL, PostgreSQL, SQLite, and so on. However, configuring Laravel with Microsoft's SQL Server (sqlsrv) can be tricky. The error "could not find driver" usually arises due to misconfiguration or missing dependencies.

Step 1 - Installing the necessary drivers
To use the MSSQL driver in your Laravel application, you need to install two packages: FreeTDS and PHP-PDO_ODBC. You can install them using Composer by running the following commands:

```bash
composer require pda/pdo_sqlsrv
composer require pda/driver_mssql
```

Step 2 - Configuring Laravel to use MSSQL
After adding FreeTDS and PHP-PDO_ODBC, you need to configure your application's database.php file with the new driver configuration. Replace the existing 'mysql' section in your database.php with the following:

```php
'sqlsrv' => [
    'driver'   => 'MSSQL',
    'host'     => env('DB_HOST', 'server-ip'),
    'database' => env('DB_DATABASE', 'my_database'),
    'username' => env('DB_USERNAME', 'my_username'),
    'password' => env('DB_PASSWORD', 'my_pass'),
    'port'     => 1433,
    'prefix'   => '',
],
```

Remember to replace the values with your database credentials and adjust the port number if necessary. Note that the driver name is now 'MSSQL', as FreeTDS uses it for connecting to MS SQL Server via PHP-PDO.

Step 3 - Troubleshooting common issues
If you encounter errors such as "Unsupported driver [MSSQL]", double-check your database configuration file and ensure that the correct drivers have been installed. You might also need to install other dependencies like php_ctype and php_intl, which are sometimes required for certain PHP PDO drivers.

Conclusion: Integrating Laravel with Microsoft's SQL Server (sqlsrv) can be challenging but is achievable with the correct configuration and proper dependency management. By following these steps and troubleshooting common issues, you should be able to successfully connect your Laravel app to an MSSQL-based database on any Linux development platform.

Remember that connecting your Laravel application to a new database engine, particularly when using Linux, can often require tweaking the php.ini file or making other adjustments. If you encounter persistent issues, consult online resources and be sure to check whether your server environment supports these changes. Happy coding!
