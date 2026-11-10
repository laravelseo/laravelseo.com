---
title: "Laravel eloquent where date is equal or greater than DateTime"
description: "Title: Effortlessly Filter Eloquent Models by Date Equality or Greater Than Current Time Introduction Laravel's Eloquent ORM offers a powerful set of..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Effortlessly Filter Eloquent Models by Date Equality or Greater Than Current Time

Introduction

Laravel's Eloquent ORM offers a powerful set of functions to work with database models. One important aspect is filtering and manipulating data based on datetime conditions, such as fetching records where the date column is equal to or greater than the current time. In this blog post, we will cover the correct way to achieve this using Laravel Eloquent's expressive syntax.

Best Practices for Filtering by Date Equality or Greater Than Current Time

To begin with, always make sure that your date column uses a consistent format like "Y-m-d H:i:s". This ensures compatibility across different database systems and better readability. In the following examples, we use the current time at 9 AM on June 1st as our example to filter data for future events.

Step 1: Retrieve Current DateTime Object

First, you need a reference point, which is usually the current date and time. Laravel provides an elegant way to achieve this by using Carbon's `now()` method. However, we will wrap it with `Carbon::now('Europe/Stockholm')` for better consistency across different time zones if needed:

```php
use Carbon\Carbon;
// Assume current date is 2017-06-01 and the time is 09:00:00 in Europe/Stockholm time zone.
$currentDateTime = Carbon::now('Europe/Stockholm');
```

Step 2: Filtering by Date Equality or Greater Than Current Time

Now, we need to apply the filtered conditions on our Eloquent relationship. We will use Laravel's `whereDate()`, which checks for equality of dates with a given time, and then check if that date is greater than or equal to the current time by chaining the query with the appropriate condition:

```php
public function customerCardFollowups() {
    return $this -> hasMany('App\CustomerCardFollowup', 'user_id') -> whereDate('date', '>', Carbon::now('Europe/Stockholm')) -> orderBy('date', 'asc') -> take(20);
}
```

In this example, the code returns all related models with their date columns greater than the given current time. Note that if you need to filter by equal or greater values, you should use `'='` instead of `'>'`.

Conclusion

With these best practices in place, you can easily retrieve or manipulate data based on date conditions in your Laravel application. By following these guidelines and incorporating Laravel's expressive syntax, you will be able to create flexible and efficient querying logic that perfectly suits your specific needs. Remember to use consistent formatting for your datetime columns across the database for better compatibility and readability. For more tutorials, resources, and expert guidance on working with Laravel and Eloquent models, visit https://laravelcompany.com/.
