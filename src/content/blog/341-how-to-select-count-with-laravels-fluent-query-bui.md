---
title: "How to select count with Laravel's fluent query builder?"
description: "Title: Utilizing Laravel's Fluent Query Builder for Count Selection Introduction: In today's world of dynamic applications, having the ability to efficiently..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Keywords", "PHP"]
featured: false
---

Title: Utilizing Laravel's Fluent Query Builder for Count Selection

Introduction:

In today's world of dynamic applications, having the ability to efficiently manage large amounts of data is crucial. The Laravel framework has robust querying capabilities that allow developers to perform complex queries with ease through its fluent query builder. While it provides several methods for manipulating and selecting data from database tables, there may be instances where you need to select a count with specific criteria. In this blog post, we will explore how to achieve this using Laravel's fluent query builder effectively.

Body:

To start off, let us examine the raw MySQL query for the given scenario, which works perfectly fine:

```sql
Select issues.*, COUNT(issue_subscriptions.issue_id) AS followers
FROM category_issue JOIN Issues ON category_issue.issue_id = issues.id
LEFT JOIN issue_subscriptions ON issues.id = issue_subscriptions.issue_id
WHERE category_issue.category_id = 1
GROUP BY issues.id
ORDER BY followers DESC;
```

Now, let's translate this to Laravel's fluent query builder:

First, we need to define the query instance using `DB::table()`. We will select all fields from the 'issues' table and join necessary tables based on their relationships as follows:

1. Join tables for categories:
   ```php
    $query = DB::table('category_issue')
        ->select('issues.*')
        // Remaining code goes here
   ;
   ```
2. Join the 'Issues' table by using a proper key from the previous joined table:
   ```php
    $query = DB::table('category_issue')
        ->select('issues.*')
        ->join('issues', 'category_issue.issue_id', '=', 'issues.id')
        // Remaining code goes here
   ;
   ```
3. Add a left join with the `issue_subscriptions` table based on their relationship:
   ```php
    $query = DB::table('category_issue')
        ->select('issues.*')
        ->join('issues', 'category_issue.issue_id', '=', 'issues.id')
        ->left_join('issue_subscriptions', 'issues.id', '=', 'issue_subscriptions.issue_id')
        // Remaining code goes here
   ;
   ```
4. Add grouping and ordering based on the given requirements:
   ```php
    $query = DB::table('category_issue')
        ->select('issues.*')
        ->join('issues', 'category_issue.issue_id', '=', 'issues.id')
        ->left_join('issue_subscriptions', 'issues.id', '=', 'issue_subscriptions.issue_id')
        ->group_by('issues.id')
        ->order_by(DB::raw('COUNT(issue_subscriptions.issue_id)'), 'desc')
        // Remaining code goes here
   ;
   ```
5. Finally, add a call to `get()` to execute the query:
   ```php
    $data = $query->get();
   ```

Now that we have used Laravel's fluent query builder along with the necessary methods for our example, we can successfully retrieve the desired data.

Conclusion:

In this blog post, we explored how to select a count with specific criteria using Laravel's fluent query builder instead of a raw SQL query. We used various methods and techniques to manipulate database tables, join them, group data, and order by a specified count. By employing these skills, developers can efficiently manage their applications' vast amounts of data while maintaining the benefits of a modern framework like Laravel.
