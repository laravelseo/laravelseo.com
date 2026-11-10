---
title: "Search Value in Laravel Collection"
description: "Mastering Substring Search in Laravel Collections: Beyond Exact Matches As developers working with data, one of the most common requirements is searching for..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP"]
featured: false
---

As developers working with data, one of the most common requirements is searching for partial matches—finding records that *contain* a specific string rather than requiring an exact equality. When dealing with collections in Laravel, especially when you need to search across multiple attributes like usernames, this requirement often trips up newcomers.

This post will walk you through the common pitfalls when trying to implement substring searches on Laravel Collections and provide robust, efficient solutions.

## The Pitfall: Why Simple `where()` Fails for Substrings

You correctly identified the issue: attempting to use `$itemCollection->where('username', $search)` only works if the username is an exact match. This is because the standard Eloquent `where` method translates directly into SQL equality checks (`=`). To achieve substring searching, we need to leverage SQL pattern matching capabilities, specifically the `LIKE` operator in your database queries.

You also noted that trying to use a `'like'` method directly on the collection didn't work as expected. While collections have methods like `where`, applying string comparison operators like `LIKE` requires careful handling of how you structure the query, especially when dealing with dynamic input.

## Solution 1: Filtering within Eloquent (The Most Efficient Way)

Before diving into filtering a resulting collection in PHP, the most performant solution is to let the database handle the heavy lifting. When fetching data from a database using Eloquent, you can use the `where` clause combined with the SQL `LIKE` operator and the wildcard character (`%`).

For example, if you were querying your `Contact` model directly:

```php
$search = 'yun';

// This query searches for usernames that CONTAIN 'yun'
$contacts = Contact::where('username', 'LIKE', "%{$search}%")
                    ->orderBy('created_at', 'DESC')
                    ->get();
```

This approach is highly recommended because the database engine (MySQL, PostgreSQL, etc.) is optimized for these operations. This aligns perfectly with the principles of building efficient applications, much like those promoted by the Laravel philosophy.

## Solution 2: Filtering the Collection After Retrieval

If, for some complex reason (e.g., filtering based on relationships or computed properties that aren't easily translated into a direct SQL `WHERE` clause), you must filter the data *after* it has been loaded into a collection, you can use the built-in `filter` method on the Laravel Collection.

To achieve a substring search on a collection of usernames, you iterate through the collection and apply the string comparison using PHP's native string functions:

```php
$itemCollection = collect($contacts);
$search = 'yun';

$filtered = $itemCollection->filter(function ($contact) use ($search) {
    // Check if the username contains the search string (case-insensitive recommended for robust searching)
    return str_contains(strtolower($contact->username), strtolower($search));
});

$filtered->all();
```

**Why this works:**
The `filter` method iterates over every item. Inside the closure, we use `str_contains()` (available in PHP 8+) or a combination of `strpos()` to check if the target string exists within the current username. By converting both the stored username and the search term to lowercase before comparison, we ensure that the search is case-insensitive, providing a much better user experience.

## Applying the Fix to Your Example

In your provided controller function, instead of applying `$itemCollection->where('username', $search)`, you should modify how you initialize or filter the data retrieval. Since your logic involves complex relationships and transformations before creating the collection, filtering within the Eloquent query (Solution 1) is superior if possible.

If you must stick to post-retrieval filtering on `$itemCollection`, here is how you would correctly apply the substring search:

```php
public function index(Request $request)
{
    $user = request()->user();
    $search = $request->input('search'); // Use input() for safer retrieval

    // 1. Fetch and Transform Data (as you did previously)
    $contacts = [];
    Contact::for($user->id)
        ->orderBy('created_at', 'DESC')
        ->get()
        ->each(function ($contact) use ($user, &$contacts) {
            $friend = $contact->user1_id === $user->id ? $contact->user2 : $contact->user1;
            $contacts[] = $friend->toArray() + ['room' => $contact->room->toArray()];
        });

    $itemCollection = collect($contacts);

    // 2. Correct Substring Filtering using Collection Filter
    if ($search) {
        $filtered = $itemCollection->filter(function ($contact) use ($search) {
            // Check if the username contains the search term (case-insensitive)
            return str_contains(strtolower($contact['username'] ?? ''), strtolower($search));
        });
        $finalResults = $filtered->all();
    } else {
        $finalResults = $itemCollection->all();
    }

    return response()->json($finalResults);
}
```

## Conclusion

When searching within Laravel Collections, remember that the method you choose depends heavily on where the data resides and what performance constraints you face. For large datasets, always prioritize filtering at the database level using `WHERE LIKE '%value%'`. If post-retrieval filtering is necessary for complex logic, leverage PHP's powerful string manipulation functions like `filter` combined with `str_contains` to achieve flexible, case-insensitive substring matching. Mastering these techniques ensures your Laravel applications are not only functional but also highly efficient and scalable, just as we strive for in building robust systems on platforms like the one offered by the [Laravel Company](https://laravelcompany.com).
