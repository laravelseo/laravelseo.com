---
title: "Laravel and PHPUnit: could not find driver (SQL: PRAGMA foreign_keys = ON;)"
description: "Title: Troubleshooting 'could not find driver' errors in Laravel and PHPUnit Introduction: When running your Laravel application using PHPUnit, you might..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Title: Troubleshooting 'could not find driver' errors in Laravel and PHPUnit

Introduction: When running your Laravel application using PHPUnit, you might encounter the following error: "Illuminate\Database\QueryException: could not find driver (SQL: PRAGMA foreign_keys = ON;)" or "Caused by PDOException: could not find driver". This blog post will guide you through troubleshooting these issues in Laravel 6 with PHPUnit.

Step 1: Check your PHP installation
Ensure that both your PHP and Laravel versions are up-to-date. The ideal setup for Laravel is PHP 7.4, which may not be compatible with older database drivers. A possible cause for this error could be the missing driver on your PHP installation. You can use the command `php -r "echo phpversion();"` to see your current PHP version.

Step 2: Verify your SQLite installation
SQLite is an in-memory database commonly used in Laravel applications during testing. Ensure that you have installed the correct SQLite version according to your PHP version. Check if the required drivers for your desired database connection are available by inspecting your `php.ini` file or executing `php -i | grep extensions`.

Step 3: Update phpunit.xml configuration
Modify your `phpunit.xml` file to remove any unsupported or unnecessary configurations that may lead to the 'could not find driver' error. An example of a working `phpunit.xml` is given below, but it might differ based on your application setup:

<code>&lt;phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:noNamespaceSchemaLocation="./vendor/phpunit/phpunit/phpunit.xsd"
     bootstrap="vendor/autoload.php"
     colors="true">&lt;testsuites>&lt;/testsuites>
    &lt;filter>
        &lt;whitelist processUncoveredFilesFromWhitelist="true">
            &lt;directory suffix=".php">&lt;/directory&gt;
        &lt;/whitelist&gt;
    &lt;/filter&gt;
    &lt;php>
        &lt;server name="APP_ENV" value="testing"/>
        &lt;server name="BCRYPT_ROUNDS" value="4"/>
        &lt;server name="CACHE_DRIVER" value="array"/>
        &lt;server name="DB_CONNECTION" value="sqlite"/>
        &lt;server name="DB_DATABASE" value=":memory:"/>
        &lt;server name="MAIL_MAILER" value="array"/>
        &lt;server name="QUEUE_CONNECTION" value="sync"/>
        &lt;server name="SESSION_DRIVER" value="array"/>
        &lt;server name="TELESCOPE_ENABLED" value="false"/>
    &lt;/php&gt;
&lt;/phpunit&gt;</code>

Step 4: Configure your SQLite database connection
Ensure that the `DB_CONNECTION` configuration in `.env` file is set to 'sqlite' and the path of your test database is correct. If you are using the in-memory storage (':memory:'), it might create issues with PDO connections. By default, SQLite uses the system drive letter as the directory for its databases, which could be problematic on Windows systems. In such cases, use an absolute path instead of a relative one (e.g., 'C:\path\to\sqlitedb').

Step 5: Confirm your Laravel configuration
Check if you have set `$app->configure('database');` in your bootstrap/app.php or app/Providers/AppServiceProvider.php file, ensuring that the database connection is properly configured and available to PHPUnit.

Conclusion: By following these steps and maintaining up-to-date PHP and Laravel versions, you can successfully troubleshoot and fix the 'could not find driver' error in your Laravel application with PHPUnit. Ensure to test thoroughly after each adjustment to minimize potential issues during the testing process.
