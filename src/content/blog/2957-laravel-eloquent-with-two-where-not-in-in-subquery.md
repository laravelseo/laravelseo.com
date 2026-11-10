---
title: "Laravel Eloquent with two “WHERE NOT IN” in subquery"
description: "Laravel Eloquent: Mastering Complex WHERE NOT IN Subqueries As senior developers working with Laravel and Eloquent, we constantly face the challenge of..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP"]
featured: false
---

As senior developers working with Laravel and Eloquent, we constantly face the challenge of translating complex, multi-condition SQL logic into elegant, readable ORM syntax. One scenario that often trips up developers is constructing queries involving multiple negative existence checks, such as using nested `NOT IN` clauses.

Today, we will tackle the specific problem presented by a query requiring two separate exclusion conditions: finding records in one table that do not have corresponding entries in another table based on two different foreign keys.

## The SQL Challenge Explained

The raw SQL expression you provided is:

```sql
SELECT DISTINCT cust, cust_no FROM delivery_sap 
WHERE cust NOT IN ( SELECT cust_name FROM customer) 
AND cust_no NOT IN ( SELECT cust_code FROM customer)
```

The goal here is to retrieve distinct records from the `delivery_sap` table where the associated customer name *does not exist* in the `customer` table AND the customer number *does not exist* in the `customer` table. Translating this directly into idiomatic Eloquent can be tricky because standard relationship methods often focus on inclusion (`whereIn`) rather than exclusion (`whereNotIn`).

## The Eloquent Solution: Using `whereNotIn` with Subqueries

Laravel Eloquent provides excellent tools for handling these types of exclusionary conditions through the `whereNotIn` method. Since we need to check against two separate sets derived from the related `customer` table, we will construct two distinct subqueries and combine them using the logical AND operator in the main query scope.

To make this work smoothly within Eloquent, we first ensure you have established the correct relationships between your models. Assuming you have a `DeliverySap` model and a `Customer` model:

```php
// App\Models\DeliverySap.php
class DeliverySap extends Model
{
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
```

### Implementation Example

We can leverage Eloquent's ability to scope queries to filter based on the related data. The key is to use `whereNotIn` with a closure to inject our subqueries.

```php
use App\Models\DeliverySap;
use Illuminate\Support\Facades\DB;

class DeliverySapService
{
    public function findExcludingCustomers()
    {
        // Subquery 1: Find all customer names present in the customer table
        $customerNames = DB::table('customer')->pluck('cust_name');

        // Subquery 2: Find all customer codes present in the customer table
        $customerCodes = DB::table('customer')->pluck('cust_code');

        // Execute the main query with the NOT IN conditions applied
        $results = DeliverySap::select('cust', 'cust_no')
            ->whereNotIn('cust', $customerNames) // Check against customer names
            ->whereNotIn('cust_no', $customerCodes) // Check against customer codes
            ->distinct()
            ->get();

        return $results;
    }
}
```

### Best Practice: Using Eloquent Relationships (Advanced)

While the method above is direct and clear, a more Eloquent-centric approach involves using nested `whereNotIn` if you are operating directly on the relationship. However, since your original SQL checks different fields (`cust` vs `cust_name`, and `cust_no` vs `cust_code`), performing the exclusion checks against raw subqueries (as shown above) often results in the most performant and readable code for this specific scenario.

For more complex relational queries involving exclusions, always remember that leveraging database-level optimization is crucial. As you build large applications, understanding how Eloquent translates these methods into optimized SQL—like those found on [laravelcompany.com](https://laravelcompany.com)—is essential for peak performance.

## Performance Considerations: The Anti-Join Alternative

While `NOT IN` is conceptually simple, in very large datasets, database query planners sometimes execute `NOT IN` less efficiently than an anti-join using `LEFT JOIN`. For scenarios demanding maximum performance on massive tables, consider rewriting the logic using a `LEFT JOIN` and checking for `NULL`.

Here is how the equivalent operation looks using a `LEFT JOIN`:

```php
$results = DB::table('delivery_sap')
    ->leftJoin('customer', 'delivery_sap.cust', '=', 'customer.cust_name') // Example join condition
    ->leftJoin('customer', 'delivery_sap.
