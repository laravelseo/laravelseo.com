---
title: "Laravel 5 Seeder - multiple rows in DB"
description: "Mastering Bulk Insertion: How to Seed Multiple Rows in Laravel Database Seeder As developers working with Laravel, seeding your database is a fundamental..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers working with Laravel, seeding your database is a fundamental task. Whether you are populating initial configuration settings, creating sample users, or setting up default roles, efficiently inserting multiple rows of data is a common requirement. However, as we dive into bulk operations using methods like `DB::table()->insert()`, subtle syntax errors can lead to unexpected results.

This post will diagnose the issue with your provided example and show you the most robust, idiomatic ways to insert multiple rows into a database table within a Laravel Seeder, ensuring your data seeding is clean, efficient, and scalable.

## The Problem with Sequential Insertion

You encountered an issue because the `insert()` method in the Query Builder is designed to accept a single array of values corresponding to a single row insertion. When you attempt to pass multiple arrays sequentially, the database driver interprets this as separate, distinct operations rather than one bulk operation for multiple records.

Your original approach:
```php
DB::table('settings')->insert(
    [
        'key' => 'username',
        'value' => 'testusername'
    ],
    [
        'key' => 'password',
        'value' => 'plain'
    ]
);
```
This attempts to insert the first record, and then the second structure is often misinterpreted or ignored in a single call, resulting in only the first row being inserted successfully.

## Solution 1: The Correct Way with Query Builder (Bulk Insert)

The correct way to insert multiple rows simultaneously using the raw Query Builder is to consolidate all the data you wish to insert into a **single, flat array**. Each inner array represents one complete row to be inserted.

For your `settings` table with `key` and `value` columns, here is how you correctly perform a bulk insertion:

```php
<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettingTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $settingsData = [
            [
                'key' => 'username',
                'value' => 'testusername'
            ],
            [
                'key' => 'password',
                'value' => 'plain'
            ],
            [
                'key' => 'theme',
                'value' => 'dark'
            ]
        ];

        // Use insert() with the array of arrays for a single, efficient bulk operation.
        DB::table('settings')->insert($settingsData);
    }
}
```

This method is highly efficient because it sends all the data to the database in one transaction, minimizing the overhead of multiple round trips. This technique is fundamental when performing large-scale data seeding, which aligns perfectly with best practices taught by resources like [Laravel Company](https://laravelcompany.com).

## Solution 2: The Eloquent Approach (The Laravel Way)

While the Query Builder solution above is fast, for complex applications, leveraging Eloquent Models provides superior readability and maintainability. If you have a dedicated `Setting` model, seeding via Eloquent relationships or mass assignment is the preferred method.

First, ensure you have a corresponding Eloquent Model:

```php
// app/Models/Setting.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = ['key', 'value'];
}
```

Then, in your Seeder, you can create and save multiple models:

```php
<?php

use Illuminate\Database\Seeder;
use App\Models\Setting; // Import the model

class SettingTableSeeder extends Seeder
{
    public function run()
    {
        // Insert records using Eloquent's create() method within a loop.
        // This is excellent for complex logic and validation during seeding.
        Setting::create(['key' => 'username', 'value' => 'testusername']);
        Setting::create(['key' => 'password', 'value' => 'plain']);
        Setting::create(['key' => 'theme', 'value' => 'dark']);
    }
}
```

For seeding simple, distinct records like this, the Eloquent approach is often more readable. However, if you are inserting hundreds or thousands of rows, using raw bulk insertion (Solution 1) can sometimes offer slightly better performance by bypassing the overhead of model instantiation for every single record.

## Conclusion

To successfully insert multiple rows in a Laravel Seeder, always aim for **bulk operations**. For simple key-value pairs, the `DB::table('table')->insert($arrayOfArrays)` method is the most performant way to handle large sets of data efficiently. If your application relies heavily on Eloquent relationships and model logic, creating and saving individual models within a loop provides the best balance between performance and code clarity. Master these techniques to streamline all your database seeding processes!
