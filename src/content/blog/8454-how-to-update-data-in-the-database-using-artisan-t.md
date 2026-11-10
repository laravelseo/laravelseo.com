---
title: "How to update data in the database using artisan Tinker"
description: "How to Update Data in the Database Using Artisan Tinker: Avoiding Common Eloquent Pitfalls As a senior developer working with the Laravel ecosystem, we often..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer working with the Laravel ecosystem, we often leverage Artisan Tinker for rapid testing, debugging, and database manipulation. Tinker provides an incredibly powerful way to interact directly with your Eloquent models. However, when performing data updates, especially chain operations, developers frequently run into subtle errors related to object types.

This post will walk you through a common attempt to update a model in Tinker, explain why it fails, and demonstrate the correct, robust way to achieve database updates using Laravel's Eloquent principles.

## The Pitfall: Why Your Update Command Fails

Let's examine the command structure you attempted:

```php
$admin = App\Admin::get()->name="admin")->save()
```

When you execute this inside `php artisan tinker`, you encounter the error: `PHP Error: Call to a member function save() on string in Psy Shell`.

### Understanding the Error

This error is not about the database connection; it’s an object type mismatch. In Eloquent, methods like `get()` or static calls return an instance of an Eloquent model (an object). To call methods like `save()`, you must be operating on a valid Model instance.

In your attempted code, by chaining `->name="admin"`, you were attempting to assign a value directly to a property *after* calling `get()`, which results in the result being a string (or an unexpected type) instead of the intended Eloquent model object that holds the save functionality. You are trying to treat a simple string as if it were a full Model instance, leading PHP to throw an error when it tries to find the non-existent `save()` method on that string.

## The Correct Approach: Step-by-Step Data Update in Tinker

To successfully update data using Tinker, you must explicitly retrieve the model first, modify its attributes, and then persist those changes back to the database.

Here is the correct, idiomatic way to update a record in your `Admin` model within the Tinker shell:

### Step 1: Retrieve the Model Instance

First, use the appropriate Eloquent method (like `find()` or `where()`) to fetch the specific record you intend to modify. We will assume you want to find an admin by their primary key for this example.

```php
// Find the record with ID 1
$admin = App\Admin::find(1);
```

### Step 2: Modify the Attributes

Once you have the model instance, you can safely modify its properties.

```php
// Update the name attribute on the retrieved model
$admin->name = 'admin';
```

### Step 3: Save the Changes to the Database

Finally, use the `save()` method on the instantiated model object to commit the changes to the database.

```php
$admin->save();
```

### Complete Example in Tinker

Putting it all together, your complete sequence within Artisan Tinker should look like this:

```php
// 1. Retrieve the record
$admin = App\Admin::find(1);

// Check if the record was found (good practice)
if ($admin) {
    // 2. Update the attribute
    $admin->name = 'admin';

    // 3. Save the changes
    $admin->save();

    echo "Admin record updated successfully!";
} else {
    echo "Admin record not found.";
}
```

## Best Practices for Tinker and Eloquent Operations

When working with Tinker, remember that you are interacting with live Eloquent objects. For more complex operations or when dealing with nested data, always ensure you are operating on a proper model instance. As you build complex applications, understanding how Eloquent models interact with the database is crucial, which is why sticking to proven patterns taught by resources like those found at [laravelcompany.com](https://laravelcompany.com) is essential for long-term success.

Always verify the type of variable you are working with before attempting method calls. This simple attention to detail prevents frustrating errors and keeps your development process smooth and efficient.

## Conclusion

Updating data in a database via Artisan Tinker requires precision. The error encountered stems from trying to chain attribute assignment directly onto query results instead of operating on an instantiated Eloquent model. By following the three distinct steps—**Find**, **Modify**, and **Save**—you ensure that your operations are valid, safe, and correctly persist changes to your Laravel application. Master this pattern, and Tinker will become an indispensable tool for your development workflow.
