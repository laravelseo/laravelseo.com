---
title: "Laravel models: Where are model properties?"
description: "Laravel Models: Where are the Properties? Bridging EF Mentality and Eloquent Reality (Coming from Visual Studio + Entity Framework background and trying to..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP"]
featured: false
---

<em>(Coming from Visual Studio + Entity Framework background and trying to locate equivalent functionality in Laravel + Eloquent)</em>

When transitioning from strongly-typed, code-generation environments like Visual Studio with Entity Framework (EF) to the dynamic nature of PHP with Laravel and Eloquent, a common point of friction arises: Model properties. In EF/VS, adding a database context automatically generates public properties for every column, providing instant IntelliSense and compile-time safety. In Laravel, this automatic generation doesn't happen in the same way. Understanding this difference is key to mastering the Eloquent paradigm.

## The Fundamental Difference: Static Generation vs. Dynamic Definition

The core difference lies in philosophy. Entity Framework operates on a static model where the database schema dictates the C# class structure at compile time. Laravel and Eloquent operate within a dynamic, runtime environment (PHP). While Eloquent is incredibly powerful for interacting with the database, it focuses on *relationships* and *data manipulation*, not necessarily generating boilerplate property definitions automatically from the database schema upon model creation.

When you run `artisan make:model Post`, what Laravel creates is a basic PHP class. By default, this class contains only Eloquent methods (like `save()`, `create()`, etc.) and abstract relationships. It does not inherently contain public properties directly mapped to your table columns unless explicitly defined by you.

This leads to the crucial question: Do I write them all by hand? The short answer is **yes**, but we can make the process much cleaner and safer than traditional manual property definition.

## Defining Properties in Eloquent Models

Since automatic, compile-time generation of properties isn't a default feature, developers must define these properties explicitly within the Model class. However, instead of simply defining standard public variables, we leverage PHP’s object-oriented features to achieve the safety and structure you are accustomed to from .NET.

### 1. The Standard Approach (Explicit Definition)

The most straightforward way is to define the properties directly in your model:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    /**
     * The attributes that are mass assignable.
     * This tells Eloquent which fields it can bind from request data.
     *
     * @var array<string, string>
     */
    protected $fillable = ['title', 'content', 'user_id'];

    /**
     * Define the properties that map to the database columns.
     */
    protected $attributes = [
        'created_at' => \Carbon\Carbon::now(),
        'updated_at' => \Carbon\Carbon::now(),
    ];

    // Properties are defined here, ready for use in methods.
}
```

### 2. Mimicking EF with Accessors and Mutators (The Eloquent Way)

To gain the control and structure you desire—especially regarding data formatting or handling relationships—Laravel provides powerful mechanisms that act as getters and setters, effectively replacing traditional property accessors. This aligns perfectly with the principles of clean code advocated by the Laravel community, as seen in resources like those found on the official [Laravel documentation](https://laravelcompany.com/).

For example, if you want to ensure a property is always formatted when retrieved (like converting a timestamp), you use Accessors or Mutators:

```php
class Post extends Model
{
    // ... other properties

    /**
     * Accessor to format the created_at date nicely.
     */
    public function getFormattedCreatedAtAttribute($value)
    {
        return \Carbon\Carbon::parse($value)->toDateTimeString();
    }

    /**
     * Mutator to ensure input is always stored in a specific format.
     */
    public function setTitleAttribute($value)
    {
        $this->attributes['title'] = trim($value);
    }
}
```

By using these features, you gain control over how data enters and leaves the model, providing encapsulation that is superior to simply exposing raw public variables. This approach ensures your models remain robust and adhere to good object-oriented design principles, making them easier to maintain as your application grows.

## Conclusion: Embracing PHP's Flexibility

The experience of moving from compiled languages to dynamic scripting languages often involves a shift in mindset. Instead of relying on the compiler to enforce structure (as in C#), we rely on explicit definitions and runtime validation (as in PHP). While Laravel doesn't automatically generate every property like EF, by embracing Eloquent’s accessors, mutators, and strong type hinting within your PHP classes, you achieve a highly structured, maintainable, and robust object-relational mapping layer. Embrace the flexibility; it leads to powerful, dynamic applications!
