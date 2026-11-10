---
title: "Join two MySQL tables in different databases on the same server with Laravel Eloquent"
description: "Title: Join Two MySQL Tables in Different Databases on the Same Server with Laravel Eloquent Joining two tables from different databases can be a tricky..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "Performance", "PHP"]
featured: false
---

Title: Join Two MySQL Tables in Different Databases on the Same Server with Laravel Eloquent

Joining two tables from different databases can be a tricky situation, but when you have the right tools and techniques, it's possible to accomplish this using Laravel Eloquent. In this comprehensive guide, we will discuss how to achieve this task, providing you with clear examples and best practices for optimal performance.

Firstly, let's review your database connection configuration:

```php
return array(
    'default' => 'mysql',
    'connections' => array(
        # Primary database connection
        'mysql' => array(
            'driver'   => 'mysql',
            'host'     => 'samehost',
            'database' => 'database1',
            'username' => 'user1',
            'password' => 'pass1',
            'charset'  => 'utf8',
            'collation' => 'utf8_unicode_ci',
            'prefix'   => '',
        ),
        # Secondary database connection
        'mysql2' => array(
            'driver'   => 'mysql',
            'host'     => 'samehost',
            'database' => 'database2',
            'username' => 'user2',
            'password' => 'pass2',
            'charset'  => 'utf8',
            'collation' => 'utf8_unicode_ci',
            'prefix'   => '',
        ),
    )
);
```

Next, let's define two models for your tables: one for table1 connected to database1, and another for table2 with a connection to database2. Both of these tables have an id column.

To join queries, you can use Laravel Eloquent relationships. Eloquent has four types of relations: hasOne(), belongsTo(), hasMany(), and belongsToMany(). In this case, you will need to create a hasOne relationship for the two models to connect them. Here's how it should look like:

For table1 model file:

```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Table1 extends Model
{
    // Define the relationship as a hasOne for the connection to table2
    public function table2() {
        return $this->hasOne(Table2::class, 'table1_id', 'id');
    }
}
```

For table2 model file:

```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Table2 extends Model
{
    // Define the relationship as a hasOne for the connection to table1
    public function table1() {
        return $this->hasOne(Table1::class, 'table2_id', 'id');
    }
}
```

Now that your models have the relationships defined, you can access and manipulate data from both tables simultaneously. For example:

```php
// Retrieve the first row in table1 and its related information from table2 without loading table2 or the intermediate query
$table1WithTable2 = Table1::with('table2')->first();

// Retrieve all rows in table1 and their respective connected rows in table2 with an alias ('t2' for short)
$allTable1Rows = Table1::with(['table2' => function ($query) { $query->where('t2.column', 'some_value'); }])->get();

// Retrieve all rows in table1 and their connected rows in table2 with a condition on the connection ('table1_id = 5')
$matchingTable1Rows = Table1::with(['table2' => function ($query) { $query->where('t1.table1_id', '=', 5); }])->get();
```

By utilizing Laravel Eloquent relationships, you can easily join queries from tables in different databases on the same server efficiently and effectively. Remember to always follow best practices for performance, such as properly indexing your database columns or using eager loading techniques when applicable. To learn more about Eloquent relationships, refer to the official Laravel documentation at https://laravel.com/docs/7.x/eloquent-relationships.

In summary, with Laravel's Eloquent ORM and a well thought-out database design, you can successfully join queries from two MySQL tables in different databases on the same server by leveraging hasOne relationships between your models.
