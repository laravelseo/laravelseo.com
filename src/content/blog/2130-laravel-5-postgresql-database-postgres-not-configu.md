---
title: "Laravel 5 + PostgreSQL: \"Database [postgres] not configured.\" Error"
description: "Title: Laravel 5 + PostgreSQL: \"Database [postgres] not configured.\" Error Body: When working with Laravel and PostgreSQL, you might encounter certain..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Title: Laravel 5 + PostgreSQL: "Database [postgres] not configured." Error

Body: <p>When working with Laravel and PostgreSQL, you might encounter certain configuration issues that prevent your database from functioning correctly. One of the most common problems is the "[InvalidArgumentException] Database [postgres] not configured." error message, which can be frustrating for newcomers to this setup.</p>

<hr>

To understand and resolve this issue, we must first examine the Laravel configuration file that contains all database-related settings. In Laravel 5, this is generally located at <code>/config/database.php</code>. A crucial part of this file is the default connection:

<pre><code>'default' =&gt; env('DB_CONNECTION', 'postgres')
</code></pre>

The error message you are experiencing can be caused by two possible scenarios. First, if you didn't specify a different database in your environment variables or did not set the <code>DB_CONNECTION</code> environment variable explicitly to something other than 'postgres', Laravel will default to using PostgreSQL as it is mentioned above.

Secondly, you might have configured multiple connections for your databases in the same file, including a connection named 'pgsql'. This might create confusion, especially if you use the 'pgsql' connection name within your code but accidentally configure PostgreSQL through your hosting provider or cPanel. Laravel will interpret this as two different databases – one defaulting to 'postgres' and another one configured in your <code>database.php</code> file.

To resolve these potential issues, follow the below steps:

1. Check your environment variables and ensure that you have correctly set both the $DB_CONNECTION variable (if any) and the connection settings within your application code.

2. Review the PostgreSQL configuration in your database.php file. If you have multiple connections configured, delete or rename the 'pgsql' connection to avoid confusion. You can also adjust the credentials for each connection to ensure they match with your actual setup.

3. If possible, set a specific environment variable (<code>DB_CONNECTION</code>) in your Laravel project, so that it is not related to any default values or hard-coded names within the framework's configuration files. This way, you can guarantee the correct database connection at runtime.

4. In case you don't want to change the name of the 'pgsql' connection, consider adjusting your codebase to use explicit database references instead of relying on Laravel's default assumptions. You can achieve this by using <code>\DB::connection('pgsql')->query(...)</code> and referencing the specific database connection where applicable.

By following these steps, you should be able to manage your databases successfully within your Laravel 5 application. Remember to test and re-test every time you make a change to ensure everything is working as intended. Should you encounter any further issues or need additional help with Laravel development, don't hesitate to reach out to the community on platforms like Laravel Company's forums (<a href="https://laravelcompany.com/forum" rel="noreferrer">link</a>).
