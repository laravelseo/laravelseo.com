---
title: "Invalid datetime format: 1366 Incorrect string value"
description: "Title: Solving \"SQLSTATE[22007]: Invalid datetime format: 1366 Incorrect string value\" in Laravel Apps using utf8mb4 unicode ci Tables and Text Columns Body:..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML", "Errors"]
featured: false
---

Title: Solving "SQLSTATE[22007]: Invalid datetime format: 1366 Incorrect string value" in Laravel Apps using utf8mb4_unicode_ci Tables and Text Columns

Body:

<p>In the development world, errors and exceptions are always lurking around. One such persistent issue faced by many developers is the "SQLSTATE[22007]: Invalid datetime format: 1366 Incorrect string value..." error. This can especially be problematic when working with databases like MariaDB and MySQL, which follow the utf8mb4_unicode_ci character set. This blog will provide a comprehensive guide on how to solve this issue in Laravel apps that use these specific database settings.</p>

<p>Let's understand the error first. The error occurs when Laravel tries to add quotes around the column values containing special characters, non-ASCII characters, or Unicode symbols. However, doing so converts the Unicode characters into their hexadecimal representation using backslash (\x) notation. This results in an incorrect string value for the database column, triggering this error.</p>

<p>To fix this error, we can follow a few steps:</p>

1. Use Laravel Eloquent's raw() method to skip any escaping or casting on your model attributes:
   <pre><code>Model::create([
    'column-name' => \DB::raw('"Some text before 11 ▒ and other text after, and after."'),
    ...
]);</code></pre>

2. If possible, modify the schema to change the data type of your trouble column from TEXT to any other appropriate data type (for example, TEXT, VARCHAR, CHAR, etc.). This depends on which type accurately represents the values in that column.
   <pre><code>    Schema::create('mws_orders', function (Blueprint $table) {
        ...
        $table-&gt;text('column-name')-&gt;nullable(); // change to an appropriate data type
        ...
    });</code></pre>

3. If you can't modify the schema, use Laravel Eloquent's casting to tell your model how it wants to handle that column value. In this case, we will use a custom cast method:
   <pre><code>class Order extends Model {
    protected $casts = [
        'column-name' => function ($value) {
            return preg_replace('/[^A-Za-z0-9\-\_\.\/:]/', '', $value); // strip non-ASCII and special characters from text
        }
    ];
}</code></pre>

4. Lastly, you can try to sanitize your data before saving it into the database by replacing any unwanted Unicode symbols with appropriate values or removing them entirely:
   <pre><code>    $text = preg_replace('/[^A-Za-z0-9\-\_\.\/:]/', '', $text); // replace non-ASCII and special chars
    Model::create([
        'column-name' => $text,
        ...
    ]);</code></pre>

Remember to always double‑check your data before inserting it into the database. By following these solutions, you should be able to successfully avoid this pesky error in your Laravel apps using utf8mb4_unicode_ci tables and text columns.

In conclusion, understanding the cause of the "Invalid datetime format: 1366 Incorrect string value" error is crucial for resolving it effectively. By exploring these troubleshooting methods, you can ensure smooth operation of your Laravel apps even under complex data scenarios. For more comprehensive guides on Laravel development and best practices, visit https://laravelcompany.com.
