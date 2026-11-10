---
title: "Unable to create or change a table without a primary key - Laravel DigitalOcean Managed Database"
description: "Title: Unable to Create or Change a Table Without a Primary Key Solving Laravel and DigitalOcean Managed Database Issues Body: I've just deployed my app to..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "PHP", "Errors"]
featured: false
---

Title: Unable to Create or Change a Table Without a Primary Key - Solving Laravel and DigitalOcean Managed Database Issues

Body:

<p>I've just deployed my app to DigitalOcean using (Managed Database) and I'm getting the following error when calling <code>php artisan migrate</code></p>
<pre><code>SQLSTATE[HY000]: General error: 3750 Unable to create or change a 
table without a primary key, when the system variable 'sql_require_primary_key'
is set. Add a primary key to the table or unset this variable to avoid
this message. Note that tables without a primary key can cause performance
problems in row-based replication, so please consult your DBA before changing
this setting. (SQL: create table `sessions` (`id` varchar(255) not null,
`user_id` bigint unsigned null, `ip_address` varchar(45) null,
`user_agent` text null, `payload` text not null, `last_activity` int not null)
default character set utf8mb4 collate 'utf8mb4_unicode_ci')
</code></pre>
<p>It appears that Laravel Migrations doesn't work when mysql var <code>sql_require_primary_key</code> is set to <code>true</code>.</p>
<p>Do you have any solutions for that?</p>

Introduction:
The MySQL system variable 'sql_require_primary_key' affects how Laravel Migrations interact with the database. When this variable is set to true, it requires all tables to have a primary key; otherwise, an error occurs during migration. However, there are times when you may not need or want to have a primary key for every table in your application. In these situations, you can follow these steps for working around the issue with DigitalOcean Managed Databases and Laravel Migrations.

Solution 1: Disable sql_require_primary_key Option
To overcome this error, you may choose to disable the 'sql_require_primary_key' option temporarily. You can do that by setting it to false in your MySQL configuration file or through an environment variable. Here is a sample code snippet:
<pre><code># Include the current configuration
include_once '/etc/mysql/my.cnf';

## Set sql_require_primary_key to false
$config['mysqld'] = array_merge($config['mysqld'], [
    'sql-require-primary-key' => 0,
]);

## Save the updated configuration
file_put_contents('/etc/mysql/my.cnf', ini_set('auto_prepend_file', '/dev/null') . PHP_EOL . "<?php" . 'include_once '/etc/mysql/my.cnf'; print($config); ?>' . PHP_EOL, FILE_APPEND | LOCK_EX);
</code></pre>

Solution 2: Define the Primary Key on a Table Later
Another approach is to define the primary key for the table in question after the migration has run. You can use Laravel's Schema Builder to add the primary key after the fact, as shown below:
<pre><code>DB::table('users')->addColumn('id', 'integer', array('auto_increment' => true));
</code></pre>
This code snippet creates a new column named 'id' with an integer data type and sets it to be auto-incrementing. This approach lets you define the primary key later, even if the migration fails due to this problem.

Solution 3: Use Alternative Temporary Database for Migrations
Another option is to use a separate database during migrations. You can create a temporary database just for your application's migration process and set up all the necessary tables with primary keys. After successfully executing the migration, you can merge the temporary database with the main one, ensuring no data loss.

Conclusion:
In summary, handling the 'sql_require_primary_key' issue when using Laravel Migrations with DigitalOcean Managed Databases requires some careful consideration and appropriate solutions based on your needs. The three approaches mentioned address different requirements, so you can choose the one that best suits your particular case. Remember, always consult a DBA if you have any doubts regarding database performance impacts.
