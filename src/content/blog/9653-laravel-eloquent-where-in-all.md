---
title: "Laravel Eloquent - Where In All"
description: "Mastering Relational Queries in Laravel Eloquent: Solving the \"AND\" Problem As developers working with relational databases through an ORM like Laravel..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP"]
featured: false
---

As developers working with relational databases through an ORM like Laravel Eloquent, we often encounter nuanced challenges when trying to express complex logical conditions. One of the most common sticking points is moving from checking for *existence* (finding users who have Activity A **OR** B **OR** C) to checking for true *intersection* (finding users who have Activity A **AND** B **AND** C).

This post dives into a classic scenario: how to efficiently query for users who possess a specific set of related records. We will explore why the standard Eloquent approach falls short and present two powerful, developer-grade solutions using raw SQL capabilities within Laravel.

## The Challenge: Finding Users with ALL Activities

Imagine you have a `users` table and an `activities` table linked by a pivot table (`activity_user`). You want to find all users who have participated in activities A, B, and C simultaneously.

The standard Eloquent method using `whereHas` combined with `whereIn` correctly finds users who have *at least one* of the specified activities (the OR condition):

```php
// This returns users who have Activity A OR Activity B OR Activity C
$userByActivities = User::with('activities')
    ->whereHas('activities', function($query) use($selectedActivities){
        $query->whereIn('id', $selectedActivities);
    })->get();
```

This is insufficient for our goal. We need users who have **all three** activities (the AND condition). Simply checking if the user has *any* of them fails to enforce the required intersection.

## Solution 1: The Correlated Subquery Approach (The Complex Path)

One way to force an AND relationship across multiple related records is by using correlated subqueries within the main `WHERE` clause. This method explicitly checks the existence and count of each required relationship for every user. While technically correct, this approach often results in highly complex SQL, which can be less readable and potentially slower than aggregate methods on large datasets.

As demonstrated by some community solutions, this involves running separate checks for each activity:

```sql
select * from users where 
    (select count(*) from activities inner join activity_user on activities.id = activity_user.activity_id where activity_user.user_id = users.id and id = 'ActivityA') >= 1
    AND (select count(*) from activities inner join activity_user on activities.id = activity_user.activity_id where activity_user.user_id = users.id and id = 'ActivityB') >= 1
    -- ... and so on for Activity C
```

This method forces the database to execute multiple correlated lookups for every user, which can be computationally expensive. While effective, it sacrifices Eloquent's clean syntax for raw SQL complexity.

## Solution 2: The Aggregate Counting Trick (The Efficient Path)

A far more elegant and often performant solution involves leveraging aggregate functions and counting distinct relationships. Instead of checking if a user has *at least one* of the required activities, we check if the total count of the *required* activities matched the *total number* of required activities.

This technique allows us to perform the entire intersection logic within a single, powerful subquery. By using `selectRaw` and counting distinct IDs, we can confirm that the set of activities associated with a user perfectly overlaps with the set of activities we are looking for.

Here is how this looks in Laravel Eloquent:

```php
use Illuminate\Support\Facades\DB;

$selectedActivities = [1, 2, 3]; // IDs for A, B, C

$userByActivities = User::select('users.*')
    ->join('activity_user', 'users.id', '=', 'activity_user.user_id')
    ->whereIn('activity_user.activity_id', $selectedActivities)
    ->groupBy('users.id')
    ->having(DB::raw('count(DISTINCT activity_user.activity_id)'), '=', count($selectedActivities))
    ->get();
```

**Explanation of the Efficiency:**

1.  **Joins:** We join `users` with the pivot table `activity_user`.
2.  **Filtering:** We restrict these results only to activities present in our `$selectedActivities` array using `whereIn`.
3.  **Grouping:** We group the results by `user_id`.
4.  **The Key (`HAVING` Clause):** The `having` clause is the crucial part. By applying `having(DB::raw('count(DISTINCT activity_user.activity_id)'), '=', count($selectedActivities))`, we instruct the database to only return users where the number of unique activities they possess *from our specified list* exactly equals the total number of required activities.

This approach effectively enforces the **AND** condition at the database level, resulting in a single, highly optimized query rather than multiple correlated subqueries. This is a perfect example of how leveraging raw SQL power within Eloquent (as seen when interacting with underlying database logic) can lead to superior performance and cleaner code structure.

## Conclusion

When dealing with relational constraints like finding records that satisfy an **AND** relationship across multiple related tables, relying solely on simple `whereHas` methods is often insufficient. As senior developers, we must know how to translate complex logical requirements into efficient database operations. While the correlated subquery method works, the aggregate counting approach—using `JOIN`, `GROUP BY`, and a clever `HAVING` clause—provides a more robust, readable, and significantly more performant solution for enforcing true relational intersections in Laravel applications. Always strive for efficiency when manipulating data, and remember that mastering these underlying SQL concepts is key to mastering Eloquent.
