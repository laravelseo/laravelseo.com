---
title: "Laravel return one record where max value"
description: "Finding the Full Record for a Maximum Value in Laravel: A Deep Dive As developers working with relational databases through an ORM like Eloquent, we..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers working with relational databases through an ORM like Eloquent, we constantly face scenarios where we need more than just a simple aggregate value; we need the entire context—the full record associated with that maximum value. This is a very common requirement, and while it seems straightforward, chaining standard aggregation functions often leads to dead ends.

Let’s break down why your initial attempts didn't work and explore the correct, idiomatic Laravel/Eloquent way to solve this problem efficiently.

## The Pitfall of Simple Aggregation

You correctly identified that simply using `max('amount')` returns only a single scalar value (the highest amount). When you try to chain methods onto this result, like attempting to call `get()` on the result of `max()`, you are operating on an aggregated result set, not filtering or retrieving a specific model from the original query.

Your attempt:
```php
return auth()->user()->expenses()->max('amount')->get(); // This fails conceptually
```
This fails because the result of `max('amount')` is just a number (e.g., 500.00). You cannot call Eloquent methods like `get()` directly on that raw numeric value to fetch a related model record.

To get the full record, we need to instruct the database to *order* the results by the field we care about (`amount`) and then limit the result set to just the very first row. This is far more efficient than fetching all records and sorting them in PHP memory.

## The Correct Solution: Ordering and Limiting

The most robust and performant way to retrieve the entire record corresponding to the maximum value is to use Eloquent’s built-in ordering capabilities, often combined with the `first()` method.

### Step 1: Find the Maximum Value (Optional but good for context)

While you can find the max value separately, we will integrate it into the main query structure.

### Step 2: Order and Retrieve the Record

We start by querying the relationship (in this case, the user's expenses), apply the ordering criteria (`orderBy`), and then select only the first result (`first()`). This tells the database to find the single record that satisfies the sorting condition and return the entire row for that record.

Here is how you implement it within your service method:

```php
use App\Models\Expense;

class ExpenseService
{
    public function highestExpense()
    {
        // 1. Start with the user's expenses relationship
        $userExpenses = auth()->user()->expenses();

        // 2. Order the results in descending order based on the 'amount' column
        // 3. Retrieve only the first record found (which will be the highest)
        $highestExpense = $userExpenses->orderBy('amount', 'desc')->first();

        // Check if a record was actually found
        if ($highestExpense) {
            return $highestExpense;
        }

        return null; // Return null if no expenses exist
    }
}
```

### An Alternative: Using `with` and `orderBy` on the Main Query

If you are starting from a more general query (e.g., finding the overall highest expense across all users, or structuring it differently), you can leverage Eloquent’s scoping features. For instance, if you were querying directly on the `Expense` model:

```php
$highest = Expense::where('user_id', auth()->id())
               ->orderBy('amount', 'desc')
               ->first();

if ($highest) {
    // $highest is now the full Expense model object
    return $highest; 
}
```

This approach ensures that the heavy lifting—sorting and limiting—is performed by the database engine, which is significantly faster than fetching all records into PHP memory just to sort them. This principle of letting the database handle complex filtering and ordering is central to building high-performance applications with Laravel, as detailed on the official [Laravel documentation](https://laravelcompany.com).

## Conclusion

The key takeaway is that when you need an entire model record based on a maximum or minimum value, avoid trying to use raw aggregate functions (`max()`) followed by separate retrieval calls. Instead, leverage Eloquent’s powerful query builder methods: `orderBy()` combined with `first()` or `get()`. This pattern ensures that your application remains fast, scalable, and adheres to the principles of efficient data retrieval.
