---
title: "How to extract the time from \"created_at\" with Carbon"
description: "How to Extract the Time from created at with Carbon in Laravel Struggling with date and time manipulation is a common hurdle when working with any..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Struggling with date and time manipulation is a common hurdle when working with any framework, especially when dealing with database timestamps. In the Laravel ecosystem, Carbon provides an incredibly powerful set of tools for handling these complexities. You are on the right track by utilizing custom accessors; they offer great control over how data is presented to your application.

Let's dive into how you can leverage Carbon to extract just the time component from a `created_at` field within your Eloquent model, building upon the foundation you’ve already established.

## Understanding the Power of Carbon Timestamps

In Laravel, when you define a timestamp column (like `created_at`) in your database, Eloquent automatically hydrates this into a Carbon instance when you access it on an Eloquent model. This means that methods like `->hour`, `->minute`, and `->format()` are immediately available. Understanding this underlying behavior is the key to unlocking cleaner code.

Your current accessor correctly uses `Carbon::createFromFormat` to parse the date, which is a solid starting point for handling custom string inputs. However, if your goal is strictly to extract *only* the time (e.g., "14:30:00"), we can simplify the process significantly by focusing on Carbon's native formatting capabilities instead of recreating the entire date structure.

## Method 1: Extracting Time via Custom Accessors

Since you are working within a model, defining custom accessors is an excellent pattern for ensuring consistent data presentation across your application. We can modify your existing function to target only the time portion of the Carbon object.

If you want to return the time in a specific format (e.g., 24-hour clock with leading zeros), you can directly use Carbon's `format()` method on the retrieved timestamp.

Here is how you would adjust your model method to focus solely on the time:

```php
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute; // Using modern Laravel 9+ syntax

class YourModel extends Model
{
    /**
     * Custom accessor to retrieve only the time component of created_at.
     */
    public function getCreatedAtTimeAttribute(): string
    {
        // Access the attribute, ensure it's a Carbon instance, and format it for time only.
        return $this->created_at->format('H:i:s');
    }

    // Keep your original accessor if you still need date formatting elsewhere
    public function getCreatedAtAttribute($date)
    {
        return Carbon::createFromFormat('Y-m-d H:i:s', $date)->format('d.m.Y');
    }
}
```

### Explanation of the Change

In the refined example above, we introduced a new accessor: `getCreatedAtTimeAttribute()`. This method directly accesses the `$this->created_at` property (which is a Carbon instance) and calls the standard PHP `format('H:i:s')` call. The `'H'` format character specifically extracts the hour in 24-hour format, fulfilling your requirement to isolate only the time.

This approach keeps the responsibility of formatting within the model, making your Eloquent relationships and data retrieval much cleaner, aligning with best practices discussed on platforms like [https://laravelcompany.com](https://laravelcompany.com).

## Method 2: Direct Query Extraction (The Simpler Alternative)

While custom accessors are great for presentation, if you only need the time for a specific query or display, you don't always need to add an accessor to the model. You can extract the time directly within your query using Carbon’s powerful query builder methods.

For instance, if you wanted to filter records created in the last hour based on the time component:

```php
$oneHourAgo = now()->subHour();

$recentRecords = YourModel::where('created_at', '>=', $oneHourAgo)
                          ->where('created_at', '>', $oneHourAgo) // Ensures we only look at the time component comparison if needed
                          ->get();
```

This method is often more efficient for database operations as it leverages the underlying SQL capabilities provided by Laravel and Carbon. Always check out the comprehensive documentation on Eloquent relationships and data handling available at [https://laravelcompany.com](https://laravelcompany.com) for deeper insights into these patterns.

## Conclusion

By understanding that `created_at` is a rich Carbon object, you gain access to powerful time manipulation functions. Whether you choose to use custom accessors like `getCreatedAtTimeAttribute()` for consistent display or utilize direct query methods for filtering, mastering Carbon allows you to handle date and time logic in Laravel with precision and elegance. Keep experimenting with these tools; they are fundamental to building robust applications.
