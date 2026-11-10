---
title: "php artisan migrate - SQLSTATE[HY000] [1045] Access denied for user 'laravel'@'localhost'"
description: "Title: Troubleshooting the Laravel Migration Error: SQLSTATE[HY000] [1045] Access Denied for User 'laravel'@'localhost' Body: If you are running into issues..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Title: Troubleshooting the Laravel Migration Error: SQLSTATE[HY000] [1045] Access Denied for User 'laravel'@'localhost'

Body:
<p>If you are running into issues while attempting to use the <code>php artisan migrate</code> command and encountering the error:</p>

<pre><code>[Illuminate\Database\QueryException]                                                                               
  SQLSTATE[HY000] [1045] Access denied for user 'laravel'@'localhost' (using password: NO) (SQL: select * from information_schema.tables where table_schema = laravel and table_name = migrations)

[PDOException]                                                                             
  SQLSTATE[HY000] [1045] Access denied for user 'laravel'@'localhost' (using password: NO)</code></pre>

<p>You are not alone. This is a common error, and it can be fixed with the right adjustments.</p>

To start, ensure you have configured your database connection details in the <code>.env</code> file properly. The following code snippet shows a correct example:

<pre><code>DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=yourpassword</code></pre>

<p>Note that:</p>
- The <code>DB_USERNAME</code> is usually 'root' or the database user created during MySQL installation, but depending on your application setup, it could be different. Use the actual username you have set.
- The connection port defaults to 3306 in most installations. If yours is different, adjust this value.
- Passwords can be omitted if they are not required for database access. However, if you find your migration command still giving a password issue, ensure the correct password is entered.

<p>Once you have double-checked your database configuration settings, move to reviewing the MySQL configurations.</p>

In Ubuntu 16.04 (unlike Mac OS X), MySQL installation may not be configured with a specific database user. As a result, if you are using the <code>laravel</code> user specified in your configuration files, this could cause the error. To resolve this issue, follow these steps:

1. Open your terminal and run the command: sudo mysql_secure_installation
2. Follow the prompts to set a root password for MySQL (if you haven't done so already).
3. When asked if you want to disable remote login, select 'Y' or 'y' to prevent direct database access from unauthorized users over the network.
4. Next, update the privileges using the command: ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '<your-new-password>';
5. Finally, re-create your Laravel user and grant it proper privileges to access the database with the command: CREATE USER 'laravel'@'%' IDENTIFIED BY '<laravel-user-password>'; GRANT ALL PRIVILEGES ON *.* TO 'laravel'@'localhost'; FLUSH PRIVILEGES;

<p>Now, with the proper database credentials and user privileges set correctly, you should be able to run your <code>php artisan migrate</code> command without issues. If the problem persists or you encounter another error, revisit your database configuration settings, MySQL configuration, or consider seeking help from Laravel community resources such as the official Laravel documentation and Laracasts videos.</p>

By following these steps and ensuring your application is properly configured, you can solve the SQLSTATE[HY000] [1045] Access Denied error and move forward with learning Laravel effectively. Remember to test other database interactions from your application, like connecting via CLI or local tools like Sequel Pro and PhpStorm. This helps ensure everything is set up correctly and running as it should be.
