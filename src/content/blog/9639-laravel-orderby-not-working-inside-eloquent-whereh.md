---
title: "Laravel Orderby not working inside Eloquent whereHas relationship?"
description: "Laravel Eloquent Mystery Solved: Why orderBy in whereHas Fails with Relationships As senior developers working with the Laravel ecosystem, we frequently..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As senior developers working with the Laravel ecosystem, we frequently encounter scenarios where complex filtering and ordering across nested Eloquent relationships cause unexpected behavior. One specific scenario that trips up many developers is attempting to apply an `orderBy` clause within a `whereHas` statement to control the sorting of the primary query results.

The issue you are facing stems from how Eloquent processes nested constraints versus primary collection sorting. While `whereHas` is excellent for filtering records based on the existence or properties of a relationship, it doesn't inherently dictate the ordering of the *parent* model unless that ordering is explicitly handled via a join or by structuring the query differently.

Let’s dive into your specific problem, analyze why the initial approach failed, and implement the correct, efficient solution for sorting `CompletedService` records based on their related `Account` information.

---

## The Limitation of `whereHas` for Ordering

Your provided code snippet demonstrates an attempt to order results using a closure within `whereHas`:

```php
$serviceNew = CompletedService::selectRaw('...')
    ->where("service_id", '1')
    ->where('service_provider_id', $service_privider_id)
    ->whereMonth('service_date', $month)
    ->whereYear('service_date', $year)
    ->with('account')
    ->whereHas('account', function($qs) {
        $qs->orderBy('restaurant_name', 'DESC'); // This ordering doesn't affect the main result set sort.
    })
    ->get();
```

When you use `whereHas`, Laravel is primarily focused on ensuring that the related records *exist* and satisfy the nested condition (in this case, `$qs->orderBy('restaurant_name', 'DESC')` only affects the check for existence or filtering within the subquery). It does not automatically translate that internal ordering instruction into a sort order for the main `CompletedService` collection.

The core issue is that applying an order constraint inside the `whereHas` closure filters/validates, it doesn't necessarily dictate the final presentation order of the main model unless explicitly joined or ordered.

## The Solution: Joining for Correct Ordering

To achieve the desired outcome—sorting the `CompletedService` records based on the `restaurant_name` from the related `Account` table—we must transition from a pure relationship filtering approach to an explicit join operation. This allows the database engine to sort the results directly based on the joined columns, which is significantly more efficient than trying to force ordering via nested constraints alone.

Since you need to order the main records (`CompletedService`) by data in the related table (`Accounts`), a standard `join` combined with appropriate ordering is the most robust method here.

### Step-by-Step Implementation

We will modify the query to explicitly join the `accounts` table and then apply the desired sorting on that joined result.

**Assumptions:**
1.  `CompletedService` has a foreign key `account_id`.
2.  `Account` has the field `restaurant_name`.

```php
use App\Models\CompletedService;
use Illuminate\Support\Facades\DB;

// ... inside your controller or service method

$serviceNew = CompletedService::selectRaw('gallons_collected as total,account_id,id,service_provider_id,service_id,service_date')
    ->join('accounts', 'completed_services.account_id', '=', 'accounts.id') // Explicitly join the related table
    ->where("service_id", '1')
    ->where('service_provider_id', $service_privider_id)
    ->whereMonth('service_date', $month)
    ->whereYear('service_date', $year)
    // Apply the ordering directly to the joined table field
    ->orderBy('accounts.restaurant_name', 'DESC') 
    ->get();
```

### Why This Works Better

1.  **Explicit Control:** By using `join()`, we are telling Eloquent exactly how the data should be linked, allowing us to use standard SQL ordering clauses (`ORDER BY`).
2.  **Efficiency:** For simple sorting based on a direct foreign key relationship (one-to-one or one-to-many), an explicit join is often the most performant way to handle this requirement in large datasets compared to relying solely on complex nested `whereHas` logic for sorting purposes.
3.  **Clarity:** This method clearly separates filtering (which can still be done via `where` clauses) from ordering (handled by `orderBy`).

If you were *only* concerned with loading the relationship data and not necessarily sorting the main query, using eager loading (`with('account')`) as you initially did is perfect. However, when the requirement shifts to ordering based on that loaded data, a direct join provides the necessary control. This practice is fundamental when dealing with complex reporting queries in Laravel, which is a key concept championed by frameworks like **Laravel Company** promotes.

## Conclusion

The failure of `orderBy` within `whereHas` highlights the difference between *filtering* relationships and *ordering* primary collections. While `whereHas` is indispensable for defining existence constraints, explicit `join` operations are the correct tool when you need to sort your main Eloquent query based on fields in related tables. Always favor clear, explicit SQL constructs like joins when performance and precise ordering are paramount.

By switching to an explicit join linking `CompletedService` and `Accounts`, you gain full control over the sorting mechanism, ensuring your results are correctly ordered according to the restaurant names. Happy coding!
