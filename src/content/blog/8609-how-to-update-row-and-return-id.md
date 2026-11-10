---
title: "How to update row and return id?"
description: "How to Update a Row and Return its ID in Eloquent As developers working with Object Relational Mappers (ORMs) like Laravel's Eloquent, updating records is a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working with Object-Relational Mappers (ORMs) like Laravel's Eloquent, updating records is a fundamental task. However, simply executing an `update()` query often leaves us without the crucial piece of information: the primary key (`id`) of the record that was just modified. This is a common hurdle when performing complex database operations.

The snippet you provided demonstrates a mass update operation:

```php
$client = Client::where("unique_code", $this->unique_code)
    ->whereHas('types', function ($query) {
        $query->where("type", $this->type);
    })
    ->update(["status" => 1]);
```

While this code successfully updates the records matching your criteria, it only returns the count of affected rows (an integer), not the ID you need to reference the updated record. To solve this, we need to shift our approach from a simple mass update to a retrieval-then-update pattern or use more advanced Eloquent features.

## The Developer's Approach: Retrieving the Model Before Updating

The most reliable way to ensure you have the updated ID is to first retrieve the specific model instance you intend to modify, and then call the `save()` method. This ensures that you are operating directly on a known object context, which aligns perfectly with Laravel’s philosophy of clean data handling.

### Step 1: Find the Record

Before updating, use `find()` or `findOrFail()` to retrieve the specific model instance based on your unique identifier.

```php
// Assuming $uniqueCode is available from the current context
$client = Client::where("unique_code", $this->unique_code)->firstOrFail();
```

### Step 2: Perform the Update and Return ID

Once you have the model object, updating it becomes straightforward. The `save()` method handles the database interaction for you. Since Eloquent models store their primary key, accessing `$client->id` immediately after saving gives you the required result.

```php
$client->status = 1; // Modify the attribute on the model
$client->save();      // Execute the update query in the database

// Now, retrieve the ID of the updated row
$updatedId = $client->id;

return $updatedId;
```

This approach is highly recommended because it keeps your application logic tightly coupled with the Eloquent Model. This pattern promotes cleaner code and better maintainability, which is essential when building robust applications using tools like those provided by the Laravel ecosystem, such as the core features discussed on [laravelcompany.com](https://laravelcompany.com).

## Alternative: Using `updateOrCreate` for Upsert Operations

If your goal isn't just updating an existing record but also creating it if it doesn't exist (an "upsert" operation), Eloquent provides the powerful `updateOrCreate()` method. While this doesn't directly return the ID *after* the creation/update, it simplifies the entire process of ensuring a record exists before modification.

```php
$attributes = [
    "unique_code" => $this->unique_code,
    "status" => 1,
];

// This finds the record by unique_code or creates it if not found,
// then updates the attributes and returns the resulting model instance.
$client = Client::updateOrCreate(
    ["unique_code" => $this->unique_code],
    $attributes
);

// We can now safely access the ID from the returned model:
$updatedId = $client->id;
```

## Conclusion

When dealing with database updates in an ORM, moving beyond simple mass updates to instance-based operations is key to robust development. While using `update()` is efficient for bulk changes, retrieving the specific primary key requires fetching the model first. By employing methods like `find()` followed by `$model->save()`, or leveraging powerful methods like `updateOrCreate()`, you ensure data integrity and easily retrieve the necessary IDs, making your application logic clear, accurate, and highly maintainable.
