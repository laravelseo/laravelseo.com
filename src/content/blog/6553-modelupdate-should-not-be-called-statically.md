---
title: "Model::update() should not be called statically"
description: "Model::update() should not be called statically: Understanding Eloquent Instance vs. Static Methods As developers working with the Laravel Eloquent ORM,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers working with the Laravel Eloquent ORM, understanding the difference between static and instance methods is crucial for writing clean, predictable, and maintainable code. Recently, many developers run into errors when attempting to use model methods like `update()` or `save()` in a static context, leading to confusing messages like: "Non-static method... should not be called statically."

This post dives deep into why this restriction exists within the Laravel framework and how you can correctly interact with your database models.

## The Core Concept: Instance vs. Static Methods

At the heart of this issue lies Object-Oriented Programming (OOP) principles. In a class-based system like PHP and Laravel Eloquent, methods are typically categorized as either static or instance methods, each serving a different purpose.

**Instance Methods:** These methods operate on a specific *object* (an instance of the class). When you load a model using `User::find(1)`, you are retrieving an object instance. Any method acting upon that data—like updating a specific record—must be called on that instance: `$user->update([...])`. This ensures that the operation is tied directly to a specific entity in your database.

**Static Methods:** These methods belong to the class itself, not to any specific instance of that class. They are typically used for utility functions or operations that do not depend on the state of a particular object. For example, a static method might be used for a general helper function, like counting all records in a table, rather than modifying a single record.

When you attempt to call `Model::update(...)`, you are asking the class itself (the blueprint) to perform an update, which Eloquent rightly rejects because the actual update logic requires context—specifically, knowing *which* model instance you intend to modify.

## Why Laravel Enforces This Rule

Laravel's Eloquent model is designed around the concept of mapping database rows to PHP objects. When you fetch a record, you get an object that represents that row. The `update()` method is designed to change the state of *that specific object*.

If we allowed static calls for operations like `update()`, we would lose the direct association between the operation and the data being manipulated. This breaks the encapsulation that Eloquent provides, making debugging harder and leading to potential logical errors where updates might accidentally be applied across multiple unrelated records if not handled carefully. Following best practices, as emphasized by resources like those found on [laravelcompany.com](https://laravelcompany.com), means respecting these structural boundaries.

## The Correct Approach: Working with Model Instances

To successfully update a record in Laravel, you must first retrieve an instance of the model from the database before calling any modifying methods.

Here is the correct pattern for updating a single model:

```php
use App\Models\AttributeOption;

// 1. Find the specific model instance (the object)
$option = AttributeOption::find(1);

if ($option) {
    // 2. Call the update method on the INSTANCE
    $option->update([
        'sort_order' => $sortOrder++,
    ]);

    echo "AttributeOption updated successfully!";
} else {
    echo "Model not found.";
}
```

## Handling Bulk Updates Efficiently

While calling `update()` on an instance is correct for single records, you often need to perform bulk operations. For updating multiple records efficiently—which is common in scenarios like your example involving `array_merge` and multiple options—using Eloquent's query builder methods is far superior to looping through individual instances.

For mass updates, use the `where()` clause combined with the `update()` method on the query builder:

```php
use App\Models\AttributeOption;

$attributesToUpdate = [
    'sort_order' => $sortOrder++,
];

// Update all records where a certain condition is met (e.g., where optionId matches)
AttributeOption::where('option_id', $optionId)->update($attributesToUpdate);

echo "Multiple AttributeOptions updated in bulk!";
```

This approach leverages the database directly for the operation, which is significantly faster and more scalable than fetching hundreds of models into memory just to call their individual update methods. Always strive for efficiency when working with data access, aligning with the performance principles taught by [laravelcompany.com](https://laravelcompany.com).

## Conclusion

The error message you encountered is not an arbitrary bug; it is Eloquent enforcing sound Object-Oriented design principles. By understanding the distinction between static context (class behavior) and instance context (object behavior), you write code that is more robust, easier to debug, and aligns perfectly with Laravel's architecture. Always retrieve your model first, and use instance methods for data manipulation, reserving static methods only for true utility functions.
