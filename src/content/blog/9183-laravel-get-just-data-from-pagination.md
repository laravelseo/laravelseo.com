---
title: "Laravel get just data from pagination"
description: "Extracting Pure Data from Laravel Pagination: A Developer's Guide When working with data in modern web applications, especially when dealing with large..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

When working with data in modern web applications, especially when dealing with large datasets, pagination is an essential tool. Laravel’s Eloquent ORM makes implementing pagination incredibly straightforward using the `paginate()` method. However, as you have observed in your example, this method returns more than just the list of items; it wraps them in a comprehensive structure containing metadata about the current page, total counts, and navigation links.

The challenge often arises when you only need the actual records—the payload—and want to discard the pagination scaffolding. As a senior developer, knowing how to efficiently extract this core data is crucial for clean code and optimizing data handling.

This post will walk you through the most straightforward and idiomatic ways to achieve your goal: extracting just the array of user objects from the paginated result.

---

## Understanding the Pagination Output

Let’s first review the structure you are dealing with. When you execute a query using methods like `paginate(2)`, Laravel returns an object (specifically, a `LengthAwarePaginator` instance) which contains two main components: the actual data array and the pagination links/metadata.

Your example output clearly shows this separation:

```json
{
    "current_page": 1,
    "data": [ // <-- This is the array you want!
        { "id": 2, "user_name": "user_name" },
        { "id": 3, "user_name": "user_name" }
    ],
    "first_page_url": "...",
    // ... other metadata fields
}
```

The key to solving your problem is recognizing that the actual list of results resides within the `data` property of the returned object.

## The Solution: Accessing the Data Array

Since the result of `$users = \App\User::selectRaw('id, "user_name"')->paginate(2);` is an instance of a Laravel Paginator class (or an object implementing similar traits), you can access the results directly via the `data` attribute.

Here is how you would extract the user list into a simple PHP variable:

```php
// Assuming $users holds the result from your database query
$paginatedUsers = \App\User::selectRaw('id, "user_name"')->paginate(2);

// Extract only the data array
$usersData = $paginatedUsers->data;

// Now $usersData contains exactly what you need:
/*
[
    { "id": 2, "user_name": "user_name" },
    { "id": 3, "user_name": "user_name" }
]
*/

// You can now work directly with $usersData
foreach ($usersData as $user) {
    echo "User ID: " . $user->id . ", Name: " . $user->user_name . "\n";
}
```

### Best Practice: Using Collection Methods

While direct access (`$paginatedUsers->data`) is the most direct way, a more robust and idiomatic approach in Laravel development is to leverage Eloquent's ability to work with Collections. Since the `data` property returned by pagination is inherently a Collection object (or an array that behaves like one), you can treat it as such immediately.

If you are only interested in the records, you can use methods available on the underlying collection for further manipulation:

```php
$paginatedUsers = \App\User::selectRaw('id, "user_name"')->paginate(2);

// Accessing the data and immediately casting it to a Collection (optional but clean)
$usersCollection = collect($paginatedUsers->data);

// Example: Filtering the collection locally
$activeUsers = $usersCollection->filter(function ($user) {
    return $user->id > 1; // Example filtering logic
});

// $activeUsers now holds only the filtered records.
```

This approach aligns perfectly with the principles of data handling advocated by frameworks like Laravel. When building complex systems, focusing on manipulating collections rather than raw arrays ensures your code remains readable and maintainable, which is a core principle behind effective development practices seen across platforms like [Laravel Company](https://laravelcompany.com).

## Conclusion

Extracting just the data from a paginated result is a common task, and Laravel provides an elegant solution by embedding the records within the `data` property of the Paginator object. By accessing `$paginatedUsers->data`, you cleanly separate your desired dataset from the navigational metadata. For further processing, leveraging PHP’s array or Collection methods on this extracted data allows you to perform filtering, mapping, and transformation efficiently. Mastering these subtle details is what separates functional code from truly professional, high-quality application development.
