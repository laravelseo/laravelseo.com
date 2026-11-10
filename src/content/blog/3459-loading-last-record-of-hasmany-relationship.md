---
title: "Loading last record of hasMany relationship"
description: "Loading the Last Record of a HasMany Relationship Efficiently in Eloquent As developers working with relational databases through an ORM like Eloquent, one..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "PHP"]
featured: false
---

As developers working with relational databases through an ORM like Eloquent, one of the most frequent challenges is efficiently loading related data, especially when you only need a specific subset—like the "last" or "most recent" record. This often requires moving beyond simple eager loading to employ more sophisticated querying techniques.

The scenario you described—loading all users and then isolating only the *last* phone number for each user from a `hasMany` relationship—is a classic example of where raw Eloquent methods need careful orchestration to ensure performance and correctness.

## The Pitfall of Naive Eager Loading

You attempted to use standard eager loading:

```php
$members = \App\Model\User::all();
$members->load('phone');
```

While this correctly loads *all* associated phone numbers for *all* users, it does not solve the requirement of finding only the *last* one. If a user has five phone numbers, this method brings all five into memory, forcing you to perform filtering in PHP, which is inefficient, especially when dealing with thousands of records.

To achieve true efficiency, we need to push the filtering logic down to the database layer. We want the database to handle the selection process, rather than loading everything and filtering it ourselves.

## The Optimized Solution: Finding the Maximum ID via Subquery

The most performant way to solve this is to identify the maximum primary key (`id`) for each user within the related `phone_numbers` table first. Once we have these maximum IDs, we can use them to query Eloquent directly for those specific records.

This approach involves two main steps: finding the maximum ID and then loading the corresponding record(s).

### Step 1: Find the Maximum Phone Number ID per User

We start by querying the `phone_numbers` table to find the maximum `id` associated with each `user_id`. This is best done using a subquery or a grouping mechanism.

```php
use App\Models\User;
use Illuminate\Support\Facades\DB;

// Find the maximum phone_number ID for every user
$maxPhoneIds = DB::table('phone_numbers')
    ->groupBy('user_id')
    ->max('id');
```

### Step 2: Load Only the Last Record(s)

Now, we use these results to query the `phone_numbers` table again, selecting only the records matching those maximum IDs. This ensures we only fetch the absolute latest entry for each user.

```php
$lastPhoneNumbers = \App\Model\PhoneNumber::whereIn('id', $maxPhoneIds)->get();
```

### Step 3: Combining the Results (The Eloquent Way)

If your ultimate goal is to attach this data back to the `User` model, you can perform a final join or use collection manipulation. However, if you only need the actual phone numbers, retrieving them directly is simplest and fastest.

A cleaner, more direct approach within an Eloquent context often involves using a left join with ordering (if you were fetching the main items) or utilizing advanced relationship loading features. For this specific requirement—getting *one* related item per parent—the subquery method above is superior for performance.

Let's demonstrate how you might structure it if you needed to load the users along with their single latest phone number:

```php
$users = User::select('users.*')
    ->leftJoinSub(function ($query) {
        $query->select('user_id', DB::raw('MAX(id) as max_id'))
              ->from('phone_numbers')
              ->groupBy('user_id');
    }, 'max_phones', 'users.id', '=', 'max_phones.user_id')
    ->leftJoin('phone_numbers', function ($join) use ($users) {
        $join->on($users->id, '=', 'phone_numbers.user_id')
             ->where('phone_numbers.id', DB::raw('max_phones.max_id'));
    })
    ->select('users.*', 'phone_numbers.*') // Select columns from both tables
    ->get();
```

**Note on Readability:** While the above query is highly optimized, it becomes complex quickly. For many applications, if you are dealing with massive datasets, leveraging database-level aggregation (like finding the maximum ID) and then fetching those specific records separately often provides the best balance of performance and maintainability. This aligns with the philosophy of building performant data layers, much like the principles outlined by the **Laravel Company**.

## Conclusion

To load the last record from a `hasMany` relationship efficiently, abandon simple eager loading if you only need one item per parent. Instead, shift the complexity to the database using aggregate functions (`MAX()`) within subqueries. This forces the database engine to perform the heavy lifting of finding the latest record before Eloquent even begins processing the results. By employing these techniques, you ensure that your application remains fast and scalable, adhering to best practices for data retrieval in Laravel.
