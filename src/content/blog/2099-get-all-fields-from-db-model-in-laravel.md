---
title: "Get all fields from db model in Laravel"
description: "Get All Fields from DB Model in Laravel: Handling Empty Attributes As a senior developer working with Laravel and Eloquent, you've encountered a very common..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a senior developer working with Laravel and Eloquent, you've encountered a very common scenario: retrieving data from a database where some fields are intentionally left empty (NULL or empty strings), but standard methods like `attributesToArray()` seem to omit these values. This is often frustrating because you need the full context of the record, including those empty placeholders, for proper display or processing.

The issue stems from how Eloquent hydrates the model instance and how it translates that state into an array of attributes. Let’s dive into why this happens and how we can reliably retrieve *all* fields, even the empty ones.

## The Behavior of `attributesToArray()`

When you call `$model->attributesToArray()`, Eloquent typically focuses on the attributes that have been explicitly loaded or populated during the query execution. If a database column is entirely `NULL` (or an empty string, depending on your column type and casting), Eloquent often omits it from the resulting array to keep the output clean and focused on meaningful data.

Consider your example: if the `capacity` field is empty in the database, `$drink->attributesToArray()` might return only fields where a value exists, effectively hiding the empty state you need to capture for UI rendering.

```php
// Example of what might happen when capacity is empty:
$drink = Drink::find(1); // Suppose capacity is NULL or '' in DB
$data = $drink->attributesToArray();
// $data might look like: ['id' => 1, 'shopId' => 8, 'name' => 'Cola', 'bottleID' => 3]
// The 'capacity' field is missing.
```

## The Solution: Accessing Raw Attributes Directly

The most reliable way to bypass the filtering behavior of Eloquent's accessor methods and retrieve *every* column defined in your model—regardless of whether they have a value or not—is to interact directly with the underlying model instance attributes or use raw query methods.

### Method 1: Using `toArray()` on the Model Instance (Best Practice)

For retrieving all columns from an already loaded model, using the standard `toArray()` method often provides a more comprehensive result than `attributesToArray()`, although behavior can still context-dependent.

However, the most robust approach when you need *guaranteed* access to every column defined in your migration is to leverage the relationship between the model and the database structure directly, or use methods that expose all columns.

### Method 2: Using `getAttributes()` (The Direct Approach)

For maximum control and ensuring you see everything Eloquent knows about the model instance, accessing attributes via the accessor method can sometimes be more revealing:

```php
if ($drink) {
    // Use getAttributes() which often returns all loaded attributes, 
    // including those that might be NULL if they exist on the hydrated object.
    $allAttributes = $drink->getAttributes(); 
}
```

### Method 3: The Comprehensive Approach (Querying for All Columns)

If you are working with a query result and need to ensure *every* column exists, sometimes executing a raw query or using `select('*')` combined with fetching the results is cleaner, especially when dealing with complex relationships. For simple attribute retrieval from an existing model, however, ensuring your model structure correctly maps all columns defined in the migration is paramount.

In many scenarios where you need full fidelity over database columns, relying on the raw data fetched by Eloquent and massaging it slightly is effective. If you are building complex views, ensure your Eloquent models strictly adhere to the schema defined in your migrations; this ensures that the structure of the attributes is known upfront, which aligns with good architectural practices in Laravel development. For deeper insights into optimizing database interactions, exploring advanced query builders is always beneficial, as detailed on resources like https://laravelcompany.com.

## Conclusion

To solve your specific problem—retrieving all fields including empty ones—focus on accessing the model's data structure directly rather than relying solely on methods designed for optimized data presentation
