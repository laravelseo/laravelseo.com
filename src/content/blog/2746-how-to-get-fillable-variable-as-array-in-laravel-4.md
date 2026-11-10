---
title: "How to get fillable variable as array in laravel 4.2"
description: "Mastering Model Attributes: How to Access $fillable as an Array in Laravel As developers working with the Laravel ecosystem, understanding how Eloquent..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working with the Laravel ecosystem, understanding how Eloquent models manage their attributes is fundamental. One of the most commonly encountered properties that deals with data mass assignment is `$fillable`. While accessing it seems straightforward, handling it efficiently—especially when looping or passing data—requires a solid understanding of PHP object orientation and Laravel's conventions.

This post will dive into the practical ways to extract the `$fillable` property from an Eloquent model instance into a usable array, addressing the concerns about modifying variables and maintaining clean code structure.

## Understanding the `$fillable` Property

In Laravel Eloquent models, the `$fillable` property is a protected attribute that defines which attributes are mass-assignable. This is a crucial security feature to prevent accidental or malicious updates to sensitive columns via methods like `create()` or `fill()`.

When you retrieve an instance of a model, such as `$model = new Demo;`, the `$fillable` property exists on that object. The core challenge often lies in how we extract this protected property into a standard, iterable PHP array without resorting to overly complex workarounds.

The user's observation regarding accessing it via `$model->fillable` or `$model->fillable()` is valid in PHP, but relying on direct access to protected members can sometimes feel like bending strict Object-Oriented principles. However, for convenience in data retrieval, we must find the most practical path.

## Method 1: Direct Property Access (The Quick Way)

For simple, one-off retrievals where you are confident about the model structure, direct access is the quickest method. If you need to loop over these attributes immediately after fetching the model, this approach works fine in a procedural context.

```php
// Assume $demo is an instance of your Eloquent Model
$demo = new Demo(['name' => 'Alice', 'email' => 'alice@example.com']);

// Accessing the property directly and casting to an array
$fillableArray = (array) $demo->fillable;

echo "Fillable Attributes: ";
foreach ($fillableArray as $attribute) {
    echo $attribute . "\n";
}
```

While this solves the immediate problem of getting the data, it relies on accessing a protected property directly. For more complex applications or when building reusable components, we need a more encapsulated solution.

## Method 2: Using Accessors for Encapsulation (The Best Practice)

In professional Laravel development, the preferred way to expose model data is through **Accessors**. Accessors allow you to define custom methods that retrieve and format data from the model, keeping the internal structure of the model private while providing a clean interface to the outside world. This adheres to the principles of encapsulation championed by frameworks like Laravel, as detailed on [laravelcompany.com](https://laravelcompany.com).

By defining an accessor, you control exactly what data is exposed and how it is presented.

First, define the accessor in your `Demo` model:

```php
// In app/Models/Demo.php

class Demo extends Model
{
    /**
     * Get the fillable attributes as an array.
     *
     * @return array
     */
    public function getFillableAttributesAttribute()
    {
        // Return the protected property as a standard public array
        return $this->fillable;
    }
}
```

Now, when you retrieve the model, accessing the custom accessor gives you the desired array directly:

```php
$demo = new Demo(['name' => 'Alice', 'email' => 'alice@example.com']);

// Accessing the data via the accessor method
$fillableArray = $demo->fillable_attributes; // Note: Laravel automatically converts getFillableAttributesAttribute to fillable_attributes convention if using attribute naming conventions, but for simplicity in this example, we use the defined method name. Let's stick to the standard Eloquent way:

$fillableArray = $demo->getFillableAttributes(); 
// Or, if sticking strictly to the accessor pattern:
$fillableArray = $demo->fillable_attributes; // (If configured correctly via Laravel reflection)


echo "Successfully retrieved fillable attributes via Accessor:\n";
foreach ($fillableArray as $attribute) {
    echo "- " . $attribute . "\n";
}
```

This approach is superior because:
1. **Encapsulation:** You hide the internal `$fillable` property, making your model safer and easier to refactor.
