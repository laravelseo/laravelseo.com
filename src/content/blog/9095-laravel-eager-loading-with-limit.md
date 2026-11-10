---
title: "Laravel eager loading with limit"
description: "Mastering Eager Loading: Retrieving Only the Latest Related Record in Laravel As developers working with Eloquent relationships, one of the most common..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "Performance", "PHP"]
featured: false
---

As developers working with Eloquent relationships, one of the most common challenges we face is not just loading related data, but loading *specific subsets* of that data—like retrieving only the "latest" item from a potentially massive one-to-many relationship. This problem often sits at the intersection of eager loading performance and complex SQL querying.

This post dives deep into your specific scenario: how to efficiently retrieve a list of users along with their single, most recent action, avoiding the pitfalls of fetching entire collections when you only need the latest entry. We will explore why simple `with()` fails and demonstrate the correct, performant way to handle "latest" relationships in Laravel.

## The Challenge: Eager Loading vs. Aggregation

Let's look at the setup you described: a `users` table and an `users_actions` table linked by `user_id`. You want to fetch users and only their single most recent action.

If we use standard eager loading:

```php
$users = User::with('action')->get();
// This loads ALL actions for every user, leading to unnecessary data transfer
// and requires manual filtering in PHP, which is inefficient.
foreach ($users as $user) {
    // You would have to manually sort and pick the first one here.
}
```

The reason your attempt using `with(['action' => function ($query) { ... }])` didn't work as expected stems from how Eloquent structures eager loading. It primarily loads the *entire* relationship set based on the join, and applying `orderBy` and `limit` inside a closure often results in inefficient subqueries or incorrect result sets when trying to aggregate per parent model concisely.

## The Solution: Finding the Latest Record Efficiently

To solve this efficiently without resorting to N+1 queries, we need to shift the logic from loading *all* relations to finding the single target record for each parent. While complex window functions are powerful, we can achieve a highly optimized result using **subqueries** or **joining with aggregation**.

For retrieving only the latest related item per parent, the most robust and often clearest solution involves pre-calculating the latest action ID for each user and then joining back to fetch the final record.

### Method 1: Using Subqueries (The Eloquent Way)

Instead of relying solely on eager loading the relation itself, we can use a subquery within the `whereHas` or by structuring the query to find the maximum timestamp per user first. However, for direct retrieval of the *related model*, an optimized join is usually superior.

A highly performant approach involves finding the `MAX(created_at)` for each user and then using that information to fetch the corresponding action. While this can be complex in a single Eloquent call, it demonstrates the necessary SQL thinking:

```php
// Step 1: Find the latest action ID for every user.
$latestActionIds = DB::table('users_actions')
    ->groupBy('user_id')
    ->orderBy('created_at', 'desc')
    ->select('user_id', DB::raw('MAX(created_at) as max_date'))
    ->get();

// Step 2: Fetch users and join them to find the single latest action.
$usersWithLatestAction = User::join('users_actions', 'users.id', '=', 'users_actions.user_id')
    ->select('users.*', 'users_actions.*')
    ->whereIn('users.id', $latestActionIds->pluck('user_id')) // Filter only users we care about
    ->join('users_actions as latest_action', function ($join) use ($latestActionIds) {
        $join->on('users_actions.user_id', '=', 'latest_action.user_id')
             ->where('users_actions.created_at', '=', DB::raw('MAX(users_actions.created_at)'))
             ->where('users_actions.user_id', '=', 'users.id');
    })
    ->get();

// This requires careful management of joins, but is far more performant than loading all relations.
```

**Why this works:** By calculating the maximum timestamp in a separate step (or using correlated subqueries), we force the database to perform the heavy lifting once, rather than letting Eloquent load potentially thousands of unnecessary rows. This approach aligns with high-performance querying principles advocated by frameworks like Laravel, where optimizing database interaction is key, much like performance considerations discussed on [laravelcompany.com](https://laravelcompany.com).

## Searching Within the Relation: Advanced Filtering

Your second concern—searching based on the *latest* relation (e.g., "find users whose last action was 'something'")—is where standard `whereHas` falls short. `whereHas` checks for the *existence* of a related record matching criteria, not necessarily the *specific* one you are interested in.

To achieve this advanced filtering efficiently, we must use **nested subqueries** or **joins with aggregation**:

```php
// Example: Find users whose LAST action had id = 1
$users = User::whereIn('id', function ($query) {
    $query->select('user_id')
          ->from('users_actions')
          ->groupBy('user_id')
          // Select only the user_id associated with the latest action ID=1 (if applicable)
          // This part requires complex logic depending on exactly what you mean by "last action"
          // For simple existence check:
          ->whereExists(function ($q) {
              $q->select(DB::raw(1))
                ->from('users_actions')
                ->whereColumn('users_actions.user_id', 'users.id')
                ->where('id_action', 1); // Check if a related action with id=1 exists for this user
          })
          ->distinct();
})->get();
```

This pattern ensures that the filtering logic happens at the database level, which is significantly faster than fetching all related data into PHP memory and filtering it there. Whenever you deal with complex relational queries, understanding how Eloquent translates these methods into SQL is crucial for writing fast, maintainable code.

## Conclusion

Dealing with "latest" or aggregated relationships requires moving beyond simple eager loading. While Laravel’s Eloquent provides beautiful syntactic sugar, achieving true performance and specific filtering often necessitates leveraging the underlying power of SQL—specifically joins, subqueries, and aggregation functions. By understanding how to structure these queries at the database level, you can write highly efficient code that scales beautifully, ensuring your applications remain fast and responsive.
