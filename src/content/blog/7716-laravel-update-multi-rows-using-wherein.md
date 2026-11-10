---
title: "Laravel update multi rows using whereIn"
description: "Mastering Bulk Updates with whereIn: Fixing the AJAX Data Format Error in Laravel As senior developers working with dynamic web applications, we frequently..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "PHP", "Errors"]
featured: false
---

As senior developers working with dynamic web applications, we frequently deal with scenarios where we need to perform bulk operations—updating multiple records simultaneously—based on data submitted asynchronously via AJAX. The beauty of Laravel's Eloquent ORM is that it provides elegant tools like `whereIn` for these tasks. However, as demonstrated by the error you encountered, the bridge between raw frontend input (a string) and Eloquent's expectation (an array) can be a source of frustrating SQL errors.

This post will dive deep into why your attempt failed and provide the robust, developer-approved solution for safely updating multiple database rows using `whereIn` with data fetched via AJAX in a Laravel application.

## The Pitfall: String Input vs. Array Expectation

You correctly identified the goal: use `whereIn('id', [1, 2])` to update products where their IDs are 1 or 2. The issue lies not in the Eloquent method itself, but in the format of the data being passed into it.

When your JavaScript sends `"1,2"` via AJAX, Laravel receives this as a single string within the request payload. When you try to use this directly in a context expecting an array (like `whereIn`), the underlying database driver attempts to interpret the entire string `'1,2'` as a single value for the `id` column, leading to the SQL error: `Truncated incorrect DOUBLE value: '1,2'`. The database sees the comma-separated string where it expects a clean list of distinct integer IDs.

The solution is simple data sanitization: we must convert that incoming comma-separated string into a proper PHP array of integers before Eloquent processes the query.

## The Solution: Sanitizing Input on the Backend

The fix involves processing the request data within your controller method to parse the string received from AJAX into an array. This ensures that when Eloquent executes the query, it receives the precisely formatted data it expects for `whereIn`.

Here is how you can correctly handle this in your Laravel controller:

```php
use Illuminate\Http\Request;
use App\Models\Product;

public function updateProduct(Request $request)
{
    // 1. Retrieve the raw string from the request
    $idString = $request->input('id'); // This will be "1,2"

    if (empty($idString)) {
        return response()->json(['error' => 'No IDs provided'], 400);
    }

    // 2. Sanitize and convert the string into an array of integers
    $ids = array_map('trim', explode(',', $idString));
    $ids = array_filter($ids); // Remove any empty entries just in case
    $ids = array_map('intval', $ids); // Ensure all elements are actual integers

    // 3. Perform the bulk update using the correctly formatted array
    if (empty($ids)) {
        return response()->json(['message' => 'Invalid ID format'], 400);
    }

    $updatedCount = Product::whereIn('id', $ids)
                              ->update(['title' => 'My updated title from AJAX']);

    return response()->json([
        'message' => 'Products updated successfully.',
        'count' => $updatedCount
    ]);
}
```

### Explanation of the Steps:

1.  **Retrieve Input:** We get the raw string (e.g., `"1,2"`) from `$request->input('id')`.
2.  **Explode and Trim:** `explode(',', $idString)` splits the string into an array: `['1', '2']`. `array_map('trim', ...)` cleans up any accidental whitespace.
3.  **Cast to Integers:** Crucially, we use `array_map('intval', $ids)` to cast these string elements (`'1'`, `'2'`) into actual integers (`1`, `2`). This is what the database expects for an ID column.
4.  **Execute Query:** Now, `$ids` is a clean array of integers (`[1, 2]`), which Eloquent can seamlessly use with `whereIn()`.

## Best Practices: Security and Eloquent Efficiency

When dealing with user input, always treat it as untrusted. While the above solution fixes the SQL error, remember that robust application development requires layers of security. Always validate that the IDs provided are actually numeric before attempting database interaction.

Furthermore, when performing bulk operations in Laravel, ensure you are leveraging the full power of Eloquent. For complex scenarios involving many updates or conditional logic, exploring relationship methods or using raw expressions can sometimes offer cleaner code paths, though `whereIn()->update()` remains highly efficient for simple bulk assignments. As we explore more advanced database interactions and ORM features, remember that Laravel is designed to make these complex operations manageable and secure, promoting clean architecture, much like the principles outlined on the [Laravel Company website](https://laravelcompany.com).

## Conclusion

The error you faced was a classic case of mismatched data types between the frontend string representation and the backend array expectation. By implementing a proper sanitization step—converting the comma-separated string into an array of integers—we successfully bypass the SQL formatting error and achieve efficient bulk updates using `whereIn`. Always prioritize validating and transforming user input before it touches your database layer.
