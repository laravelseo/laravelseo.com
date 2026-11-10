---
title: "Reverse Order of Array Elements with Foreach Loop using Eloquent in Laravel"
description: "Reverse Order of Array Elements with Foreach Loop using Eloquent in Laravel Working with database results in Laravel often involves fetching data,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Working with database results in Laravel often involves fetching data, manipulating it in PHP, and then rendering it in a Blade view. When you need to reverse the order or limit the results, the key question becomes: should I do this manipulation in the database (SQL) or in the application layer (PHP)? As a senior developer, I always advocate for pushing data manipulation down to the database whenever possible, as it is significantly more efficient and scalable.

This post will walk you through the most effective way to reverse and slice your Eloquent results while ensuring you can access all associated model attributes cleanly within your Laravel application.

## The Pitfall of Post-Processing Arrays

Your attempt to use `array_reverse()` on an Eloquent collection failed because models are objects (or collections), not simple PHP arrays that automatically support these functions in the way you expect when dealing with relational data. When you fetch results using methods like `get()`, you receive a Laravel Collection, which is designed to be iterated over cleanly by the framework, rather than forcing raw array manipulation on it before rendering.

The goal isn't just to reverse an array; the goal is to ensure the *data retrieved* is in the desired order, and then loop through that result to display all necessary fields.

## The Eloquent Solution: Ordering and Limiting in the Database

The most performant way to achieve reversed ordering and slicing is by leveraging Eloquent's query builder methods. This shifts the heavy lifting from PHP memory management to the highly optimized database engine.

If you want the *last* 20 records, you need to order them descendingly and then limit the result set. To reverse the display order (showing the newest first), you must sort by a timestamp in descending order.

Here is how you can structure your query to get the 20 most recent scores in reverse chronological order:

```php
use App\Models\Score;
use Carbon\Carbon;

// Define the desired limit and ordering
$limit = 20;

$scores = Score::where('unit_id', $id)
    ->where('created_at', '>', Carbon::now()->subDays(3))
    ->orderBy('created_at', 'desc') // Order by creation date descending (newest first)
    ->take($limit)                // Limit the result set to the top 20 results
    ->get();                      // Execute the query and get the collection
```

### Explanation of the Query:

1.  **`orderBy('created_at', 'desc')`**: This is the crucial step. By ordering by `created_at` in descending order (`desc`), you instruct the database to return the most recently created records first. This effectively reverses the chronological order you might naturally get from a simple ascending sort.
2.  **`take($limit)`**: This limits the number of records returned, ensuring you only fetch the top 20 results, which handles your slicing requirement efficiently.

This single Eloquent query returns a perfectly ordered and sliced collection, eliminating the need for manual `array_reverse()` or `array_slice()` calls in your controller logic. This approach aligns perfectly with Laravel's philosophy of keeping business logic close to the data source, as discussed on **https://laravelcompany.com**.

## Looping Through the Results in the View

Now that `$scores` is a correctly ordered Eloquent Collection, looping through it in your Blade view becomes straightforward and robust. Since it is a Collection, you can iterate over it directly, accessing all model attributes:

```blade
@foreach($scores as $score)
    <tr>
        <td>{{ $score->id }}</td>
        <td>{{ $score->ratingradio }}</td>
        <td>{{ $score->ratingtext }}</td>
    </tr>
@endforeach
```

Notice how we access `$score->id`, `$score->ratingradio`, and `$score->ratingtext`. This is the standard, clean way to interact with Eloquent models in a view. You don't need to worry about array indexing or reversing; you simply iterate over the structured data provided by the database.

## Conclusion

By focusing on optimizing your data retrieval within the Eloquent query—using `orderBy()` and `take()`—you achieve reversed ordering and slicing directly from the database. This method is superior to fetching large datasets into PHP memory only to manipulate them afterward. Always prioritize letting SQL handle the sorting and limiting; this practice keeps your Laravel application fast, maintainable, and efficient. For more advanced tips on maximizing Eloquent performance, check out the resources available at **https://laravelcompany.com**.
