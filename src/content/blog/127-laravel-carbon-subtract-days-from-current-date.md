---
title: "Laravel Carbon subtract days from current date"
description: "Title: Working with Date Ranges in Laravel Using Carbon An Example on Filtering Users Based on Creation Dates Introduction As a senior developer and..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

Title: Working with Date Ranges in Laravel Using Carbon - An Example on Filtering Users Based on Creation Dates

Introduction

As a senior developer and technical blogger, one of the key aspects that we need to master is working with date ranges. In this comprehensive guide, we will focus on how you can extract data from your database by using Laravel's Carbon library to subtract days from the current date. Specifically, we want to filter users whose created_at timestamps are more than 30 days ago.

Why Use Carbon?

Carbon is a powerful and essential component within Laravel that simplifies working with date and time. It offers a fluent API for manipulating dates and timespaces, making it easier to deal with complex scenarios like the one we're discussing in this tutorial.

Subtracting Days from Now() Using Carbon

Carbon::now() helps us obtain our current date/time. To subtract 30 days from it:

1. First, create a Carbon instance using the now method of the Carbon class, like so:
   `$now = Carbon::now();`

2. Next, we need to subtract 30 days from our $now instance by utilizing its sub method:
   `$thirtyDaysAgo = $now->subDays(30);`

It is vital to remember that this method returns a new Carbon instance instead of altering the original one. So, you need to store it in a different variable if you want to preserve its value.

Filtering Users Based on Creation Date with Eloquent Query Builder

Now that we have our desired $thirtyDaysAgo variable, let's see how we can filter users based on their created_at date being more than 30 days old using Laravel's expressive Eloquent query builder. We will use a simple example from the Users model:

1. Start by fetching all active users in your database that are also within the last 30 days of today:
   `$users = Users::where('status_id', 'active')`
    - We assume you have a status_id column with values indicating their current status. In this case, we're selecting only those with an active status.

2. Next, add the created_at filter based on our $thirtyDaysAgo variable:
   `->where('created_at', '<', $thirtyDaysAgo)`
    - The expression '>' will return records where their timestamps are greater than your specified value (in this case, 30 days ago). To reverse this and include those less than the given date, you should use a 'less than' condition with '<'.

3. Finally, run the Eloquent query:
   `$result = $users->get();`
    - This will return an array of all active users created within the last 30 days from today.

Conclusion

By following these steps and understanding how to use Carbon and Laravel's Eloquent query builder, you can efficiently filter your database data based on date ranges. This technique can be applied to various scenarios such as finding orders placed within a specific timeframe or users who haven't logged in for more than 30 days.

Remember to always back up your data before making any major changes and test the query thoroughly to ensure it works as intended. For further insights into Carbon functionalities, please refer to LaravelCompany's comprehensive guides on manipulating dates using Carbon.
