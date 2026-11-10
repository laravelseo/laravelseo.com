---
title: "how does laravel finds the connection between models and its table in database"
description: "Unveiling the Magic: How Laravel Connects Eloquent Models to Database Tables As developers working with the Laravel ecosystem, one of the most powerful yet..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working with the Laravel ecosystem, one of the most powerful yet often misunderstood aspects is the relationship between your PHP classes (Models) and your relational database tables. When you write a simple call like `Page::all()`, it seems like magic—Laravel knows exactly which SQL query to run against which table. But how does this connection actually happen?

This post dives deep into the mechanism Eloquent uses to bridge the gap between your elegant PHP models and the underlying relational database structure.

## The Foundation: Convention Over Configuration

The short answer is that Laravel relies heavily on **Convention over Configuration**. By default, Eloquent establishes a smart convention for naming tables based on the model class name. This saves developers from having to explicitly define every single relationship in their code, allowing them to focus on business logic—a core philosophy of the framework, much like the principles discussed on the official [Laravel documentation](https://laravelcompany.com).

When you define a Model, Eloquent automatically assumes a naming pattern for its corresponding database table:

1.  **Model Name:** `Page`
2.  **Table Name Convention:** The system typically defaults to pluralizing the model name and converting it to snake\_case. Therefore, the `Page` model is expected to map to the `pages` table in your database.

When you call `$model::all()`, Eloquent internally constructs the necessary query by implicitly assuming this convention: it translates `Page::all()` into a request for data from the `pages` table. This automatic mapping is what makes working with Eloquent incredibly productive and expressive.

## Beyond Convention: Customizing the Table Mapping

While the convention works perfectly 90% of the time, real-world applications often require flexibility. What happens if your database uses a non-standard naming convention (e.g., `page_items` instead of `pages`), or if you are working with legacy systems?

Eloquent provides powerful methods to override this default behavior, ensuring that your application remains flexible and decoupled from specific database naming choices.

### Using the `$table` Attribute

The most direct way to tell Eloquent exactly which table to use is by defining the `$table` property within your Model class. This explicitly severs the convention and forces Eloquent to use the specified table name for all queries related to that model.

Consider how you would implement this in your `app/Models/Page.php` file:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    /**
     * The table associated with the Page model.
     *
     * @var string
     */
    protected $table = 'page_items'; // Explicitly setting the table name

    // Other model properties...
}
```

With this change, even when you call `Page::all()`, Eloquent will now generate the query targeting the `page_items` table in your database. This ability to customize behavior is a testament to Laravel's deep extensibility and control over data access.

## Conclusion: Embracing Eloquent's Power

The connection between an Eloquent Model and its database table is not arbitrary; it is built upon a smart convention reinforced by flexible configuration options. Laravel successfully abstracts away the tedious details of raw SQL, allowing developers to interact with data using intuitive PHP objects. By understanding that this relationship is governed by conventions (like pluralization) but can be explicitly overridden (using `$table`), you gain full control over your data layer. Mastering these conventions and customization points is key to writing clean, maintainable, and highly scalable applications on the Laravel platform.
