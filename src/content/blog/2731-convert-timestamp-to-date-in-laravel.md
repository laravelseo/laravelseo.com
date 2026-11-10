---
title: "Convert timestamp to date in Laravel?"
description: "Convert Timestamp to Date in Laravel: Formatting Data from Your Database As a senior developer working with Laravel, you frequently encounter situations..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a senior developer working with Laravel, you frequently encounter situations where raw database timestamps need to be presented in a specific, user-friendly format. A common requirement is fetching records and displaying the date in a custom pattern, such as `d-m-Y H:i`.

The question arises: How can I return all rows using the Eloquent `all()` method with this specific date formatting applied?

The short answer is that while the database stores the time internally as a precise timestamp (e.g., `2023-10-27 14:30:00`), Laravel/Eloquent's default retrieval methods return this data in its native format. The conversion itself usually happens in the application layer using powerful tools like Carbon.

Let’s dive into the practical, developer-centric ways to achieve this transformation efficiently and correctly.

## Understanding Data Retrieval with `all()`

When you use `$model->all()`, Eloquent executes a standard `SELECT` query against the database and hydrates the results into your model instances. By default, if your column is a `dateTime` or `timestamp`, Laravel returns it as a Carbon instance, which is excellent for manipulation, but it doesn't automatically reformat the string on retrieval unless explicitly told to do so.

If you are dealing with a custom attribute like `birthday`, and you need to ensure that every returned record has this date formatted exactly as `d-m-Y H:i`, we need to intervene either at the database level or the application level.

## Method 1: Formatting in the Application Layer (The Laravel Way)

For most presentation needs, formatting the data after retrieval is the cleanest and most flexible approach. This keeps your Eloquent models clean of presentation logic. We will use Carbon, which is integral to Laravel and provides robust date handling.

Assuming you have a `Birthday` model with a `birthday` attribute:

```php
use App\Models\Birthday;
use Carbon\Carbon;

class BirthdayController extends Controller
{
    public function index()
    {
        // 1. Retrieve all records using all()
        $birthdays = Birthday::all();

        // 2. Format the date for display
        $formattedBirthdays = $birthdays->map(function ($birthday) {
            // Use Carbon's format method to achieve d-m-Y H:i
            $formattedDate = $birthday->birthday->format('d-m-Y H:i');
            return [
                'id' => $birthday->id,
                'formatted_date' => $formattedDate,
                // Include other necessary fields...
            ];
        });

        return response()->json($formattedBirthdays);
    }
}
```

### Explanation of the Approach

1.  **`Birthday::all()`**: This fetches all raw data from the database.
2.  **`->map(...)`**: We iterate over the resulting collection using the `map` method. This is a functional approach favored in modern PHP/Laravel development for transforming collections.
3.  **`$birthday->birthday->format('d-m-Y H:i')`**: Inside the map, we access the specific timestamp stored in the model attribute and use Carbon's powerful `format()` method to convert it into the exact string format you requested (`27-10-2023 14:30`).

This method ensures that the raw data remains untouched in the database while providing perfectly formatted output for your API responses or views. For deeper understanding of Eloquent relationships and query building, always refer to excellent resources like those found on [laravelcompany.com](https://laravelcompany.com).

## Method 2: Database Level Formatting (For Performance)

If you are fetching an extremely large dataset and performance is paramount, pushing the formatting logic down to the database layer using built-in functions can be significantly faster. This delegates the heavy lifting to the highly optimized SQL engine.

If your database is MySQL, you could use `DATE_FORMAT()` or `DATE_FORMAT()` combined with `TIME_FORMAT()` directly in your query:

```php
use Illuminate\Support\Facades\DB;

public function indexOptimized()
{
    $results = DB::table('birthdays')
        ->select(
            'id',
            DB::raw("DATE_FORMAT(birthday, '%d-%m-%Y %H:%i') as formatted_date")
        )
        ->get();

    return response()->json($results);
}
```

### When to Choose Which Method?

*   **Application Layer (Method 1):** Best for flexibility. Use this when the formatting requirement changes often, or if you need complex logic based on the date before displaying it.
*   **Database Layer (Method 2):** Best for raw performance. Use this when dealing with massive tables where minimizing the data transferred over the network is critical.

## Conclusion

To summarize, while you can use the simple `all()` method to retrieve your data, achieving a custom date format like `d-m-Y H:i` requires explicit manipulation. For most Laravel applications, leveraging Carbon within an Eloquent collection's `map()` function offers the best balance of readability, maintainability, and flexibility. Always consider performance implications, opting for database functions only when dealing with very large result sets to ensure your application
