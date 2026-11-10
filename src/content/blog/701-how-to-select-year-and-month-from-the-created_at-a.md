---
title: "How to select year and month from the created_at attributes of database table in laravel 5.1?"
description: "Title: Working with Date Partitions in Laravel 5.1: Extracting Year and Month from Created at Column Body: Understanding how to efficiently select data based..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Performance", "PHP"]
featured: false
---

Title: Working with Date Partitions in Laravel 5.1: Extracting Year and Month from Created_at Column

Body:

Understanding how to efficiently select data based on specific date ranges is a common requirement for developers working with database tables. In this blog post, we will discuss how to select records from the `created_at` attribute of a Laravel 5.1 database table and retrieve just the year and month using the built-in methods. We'll also utilize the powerful query builder provided by Eloquent (Laravel's ORM) for better performance, flexibility, and readability.

Firstly, let's create a simple example table with an attribute `created_at`. We will use the Eloquent model to access this table:

<pre><code>// Create the Post Model
<?php
namespace App;

use Illuminate\Database\Eloquent\Model;

class Post extends Model {
    protected $table = 'mjblog'; // Set Table Name
    public function getCreatedAtAttribute($value) {
        return \Carbon\Carbon::createFromTimestamp(strtotime($value))->format('Y-m-d H:i:s');
    }
}
</code></pre>

Here, we've created a `Post` model that connects to the table `mjblog`. This model uses Carbon's `createFromTimestamp()` method for converting created_at timestamps into readable date formats. It also provides additional functionalities like time zone handling, localization, and date manipulation.

Now, let's try to select records from the table based on year and month:

<pre><code>$post = Mjblog::select(DB::raw('YEAR(created_at) as year, MONTH(created_at) as month'))->get();
</code></pre>

In this code block, we are using Laravel's query builder to select all records from the `mjblog` table. We add two columns `year` and `month`, which represent the year and month values extracted from the `created_at` attribute, respectively. However, when calling `get()`, you obtain an array of instances of your Eloquent model, and each instance will have these added fields with their respective data.

If we want to apply a filter on the records based on year-month combination, use the where method provided by Eloquent:

<pre><code>$post = Mjblog::select(DB::raw('YEAR(created_at) as year, MONTH(created_at) as month'))->where('created_at', $requestedDate) // Use a date object or timestamp here
        ->get();
</code></pre>

Here, you provide the desired filtering criteria to find specific records matching your requirements.

In conclusion, working with year and month from a database table in Laravel 5.1 is easy once you're familiar with the built-in query builder methods. You can use Laravel's powerful Eloquent model for efficient data retrieval operations like selecting and filtering by date ranges. By incorporating Carbon as we have, you gain more flexibility when working with time stamps. For further exploration of these topics, refer to our resources at https://laravelcompany.com/blog/ or try your hand at implementing these methods in practice.
