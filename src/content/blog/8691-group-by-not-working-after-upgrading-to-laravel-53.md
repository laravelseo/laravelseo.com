---
title: "Group by not working after upgrading to laravel 5.3"
description: "Grouping Issues After Upgrading to Laravel 5.3: Understanding ONLY FULL GROUP BY Upgrading a framework, even minor versions like moving from Laravel 5.2 to..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP", "Errors"]
featured: false
---

Upgrading a framework, even minor versions like moving from Laravel 5.2 to 5.3, often exposes underlying incompatibilities related to database standards and strictness. When seamless functionality suddenly breaks, the first step is always to look beneath the surface—in this case, understanding how SQL grouping rules have tightened up in your MySQL server.

This post dives into a very common issue developers face when using Eloquent's grouping methods, explains why the error occurred, and provides the robust solution for handling complex data aggregations in modern Laravel applications.

## The Root Cause: Strict SQL Mode Enforcement

You encountered an `SQLSTATE[42000]: Syntax error or access violation: 1055 Expression #1 of SELECT list is not in GROUP BY clause...` error because your database server (MySQL/MariaDB) was operating under stricter SQL modes after the upgrade to Laravel 5.3.

The core issue lies with a setting called `ONLY_FULL_GROUP_BY`. Before this strict mode, MySQL allowed queries where you could group by one column and select others without explicitly grouping them. However, modern security and data integrity standards mandate that if you use a `GROUP BY` clause, *every* column in your `SELECT` list must either be part of the `GROUP BY` clause or be used within an aggregate function (like `SUM()`, `COUNT()`, `MAX()`).

Your original code:
```php
$menus = CmsMenuItem::groupBy('menu_id')->get();
```
When Eloquent translated this to SQL, it was likely selecting columns like `id` or other non-grouped attributes that were not functionally dependent on `menu_id`, leading to the conflict with `only_full_group_by` mode.

## Why Setting `strict => false` Didn't Work

You correctly attempted to modify database settings in your `database.php` configuration, setting `strict => false`. While this is a valid approach for temporarily relaxing SQL rules, it often doesn't solve the problem cleanly within an application context because:

1.  **Configuration Scope:** Modifying global server settings via the config file might not always override the session-specific behavior driven by specific Eloquent queries or framework defaults.
2.  **Best Practice:** Relying on relaxed SQL modes is generally discouraged as it can lead to unpredictable data results and potential security vulnerabilities down the line.

The proper solution is not to disable safety features but to write a query that inherently satisfies those safety features.

## The Correct Laravel Solution: Using Aggregation

Instead of relying solely on `groupBy()`, which attempts to group all selected fields, we need to explicitly tell the database *what* we want to aggregate or select. If you only need a list of menu IDs grouped by their parent ID, use standard aggregation functions.

For instance, if you simply want to retrieve distinct menu IDs and perhaps count how many items belong to that group, you should use `select()` with an aggregate function:

```php
// Example: Grouping menu items by menu_id and counting the items in each group
$groupedData = CmsMenuItem::select('menu_id', \DB::raw('count(*) as item_count'))
    ->groupBy('menu_id')
    ->get();

// $groupedData will now return a clean result set containing only menu_id and item_count.
```

This approach directly addresses the `ONLY_FULL_GROUP_BY` requirement by ensuring that every selected column is either explicitly grouped or aggregated, making the query compliant with strict SQL standards. This principle of writing explicit, intention-driven queries is fundamental to effective data modeling in any framework, including Laravel. For deeper insights into Eloquent and database interaction patterns, always refer to resources like those found on [laravelcompany.com](https://laravelcompany.com).

## Conclusion

Upgrades serve as excellent checkpoints for reviewing your application's interactions with the underlying database. The failure you experienced is not a bug in Laravel itself but a necessary enforcement of stricter SQL standards by your database server. By shifting from relying on implicit grouping to explicitly defining aggregations using functions like `count()` or `sum()`, you ensure your code remains robust, portable, and compliant across all future framework versions. Always prioritize writing explicit queries when dealing with complex data manipulations.
