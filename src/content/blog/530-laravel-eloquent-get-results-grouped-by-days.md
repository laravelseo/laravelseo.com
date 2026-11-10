---
title: "Laravel Eloquent get results grouped by days"
description: "Title: Efficiently Grouping Laravel Page Views by Day Using Eloquent Introduction: In this article, we will explore how to effectively group page views in..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Keywords", "PHP"]
featured: false
---

Title: Efficiently Grouping Laravel Page Views by Day Using Eloquent

Introduction: In this article, we will explore how to effectively group page views in Laravel based on different days using its powerful database queries. By understanding the concepts and techniques involved, you can easily achieve your desired output from a complex set of data that includes timestamps with seconds.

1. Understanding the Challenge: You have a table containing page_views with timestamps (created_at) in 'timestamp' format which records each user's access to specific pages. However, when you use Eloquent's groupBy() queries, you find that same days aren't being combined together due to slight differences in timings.

2. Grouping by Date: The initial challenge can be overcome using the Laravel's Carbon library for date manipulation. Since your created_at column is already a timestamp, we can convert it into a simpler format before performing the grouping operation.

Example 1: Let's first create a new method in our User model to transform the created_at timestamps into a friendlier date format:

   <?php
    namespace App\Models;

    use Carbon\Carbon;

    class User extends Model {
      public function getFormattedDateAttribute() {
        return Carbon::parse($this->created_at)->format('Y-m-d'); // Assuming you want it in Y-m-d format
      }
    }

3. Querying Page Views: Now that we have formatted the date column, let's use Laravel's Eloquent to group the page views based on these new dates. We can use the "groupBy" method by calling it inside a scope, which would be more flexible and reusable for future queries:

<?php
   namespace App\Models;

   use Illuminate\Database\Eloquent\Builder;

   class User extends Model {
      public function scopeGroupedViewsByDate(Builder $query) {
        return $query->selectRaw('COUNT(*) as views, DATE(created_at) as date')
                     ->groupBy('date')
                     ->orderBy('date');
      }
   }

This code block creates a scope called 'groupedViewsByDate' which retrieves the count of page views grouped by date. To get results for all dates, you can use this method as follows:

<?php
  $views = User::groupedViewsByDate()
             ->get();
?>

4. Handling Multiple Dates: If you have different date formats or need to include the count of views for multiple days in one query, you can modify your scope like this:

<?php
   namespace App\Models;

   use Illuminate\Database\Eloquent\Builder;

   class User extends Model {
      public function scopeGroupedViewsByDateRange(Builder $query, array $date_range) {
        // $date_range is an array like ['start' => '2013-07-01', 'end' => '2013-12-31']
        if (count($date_range) <= 0) throw new InvalidArgumentException('No date range provided.');
        $query->selectRaw('COUNT(*) as views, DATE(created_at) as date')
              ->whereBetween('created_at', [$date_range['start'], $date_range['end']])
              ->groupBy('date')
              ->orderBy('date');
      }
   }

5. Conclusion: By understanding the concepts and techniques involved, you can easily group page views by date using Laravel's Eloquent database queries. This approach ensures accurate results and makes it easier to analyze your data based on specific time periods. For more information on working with dates in Laravel, visit https://laravelcompany.com/blog/manipulating-dates-in-laravel.
