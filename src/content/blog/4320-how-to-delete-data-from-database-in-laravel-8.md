---
title: "How to delete data from database in Laravel 8.*"
description: "How to Delete Data from the Database in Laravel 8: A Complete Guide As a senior developer working with the Laravel ecosystem, we frequently encounter..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "PHP", "Errors"]
featured: false
---

As a senior developer working with the Laravel ecosystem, we frequently encounter scenarios where developers get stuck on basic CRUD operations—specifically deletion. Dealing with database interactions requires not just knowing the syntax but understanding how Laravel's Eloquent ORM and Query Builder are designed to handle these tasks safely and efficiently.

If you’ve encountered errors like those related to missing arguments or trying to call methods on arrays instead of models, you are likely running into common pitfalls when mixing raw SQL concepts with Laravel's object-oriented approach. This guide will walk you through the correct, robust, and idiomatic ways to delete records from your database in a Laravel 8 application.

## Understanding Database Deletion Strategies in Laravel

When deleting data, there are three primary methods in Laravel: using Eloquent Models, using the Query Builder, or executing raw SQL via the `DB` facade. Each method has its place, but for maintaining clean, maintainable code, we strongly recommend leveraging Eloquent where possible.

### Method 1: The Recommended Approach – Using Eloquent Models

The most "Laravel" way to delete a record is by interacting with the corresponding Eloquent Model. This approach encapsulates your database logic within the model itself, making your controller cleaner and safer.

If you have a `City` model, deleting a city based on its ID looks like this:

```php
use App\Models\City;
use Illuminate\Http\Request;

class CityController extends Controller
{
    public function delete(Request $request)
    {
        // 1. Find the record first (ensuring it exists and handling potential errors)
        $city = City::findOrFail($request->input('cityId'));

        // 2. Perform the deletion
        $city->delete();

        return redirect()->route('cities.index')->with('success', 'City deleted successfully!');
    }
}
```

**Why this is better:**
This method is superior because Eloquent handles all the necessary database interactions. If `findOrFail()` fails to find the record, it automatically throws a `ModelNotFoundException`, which Laravel can handle gracefully (often by redirecting to a 404 page), preventing common errors like trying to delete non-existent data. This adherence to ORM principles is fundamental to building scalable applications with Laravel.

## Method 2: Using the Query Builder for Specific Deletions

If you are performing a bulk deletion or need more granular control over the query, the Query Builder is an excellent tool. The method you attempted using `DB::table('cities')->where('id', $cityId)->delete();` is actually the correct way to execute a mass delete command using the Query Builder.

Let's refine your approach:

```php
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class CityController extends Controller
{
    public function delete(Request $request)
    {
        $cityId = $request->input('cityId');

        // Use the Query Builder to safely delete records matching a condition.
        $deletedCount = DB::table('cities')
                         ->where('id', $cityId)
                         ->delete();

        if ($deletedCount > 0) {
            return redirect()->route('frontend/city/index')->with('success', 'City successfully deleted.');
        } else {
            // Handle case where no record was found with that ID
            return redirect()->route('frontend/city/index')->with('error', 'City not found.');
        }
    }
}
```

This method directly targets the database operation. It avoids the type mismatch errors you encountered because it uses the dedicated methods provided by the facade, ensuring that the query is executed correctly against the underlying database structure. For complex data manipulation, understanding these facade methods is key to mastering Laravel's capabilities.

## Security and Best Practices for Deleting Data

When dealing with destructive operations like deletion, security and validation are paramount. Never trust user input directly when interacting with the database.

1.  **Validation:** Always validate the incoming `cityId` before attempting any database operation. Ensure the ID is an integer and exists in your system.
2.  **Authorization:** Implement proper authorization checks (using Gates or Policies) to ensure that the currently authenticated user has the permission to delete the specific record they are targeting.
3.  **Transactions:** For operations involving multiple steps, wrap them in a database transaction to ensure atomicity. While a single `delete()` call is atomic, it's good practice to be aware of this concept when scaling up your logic.

## Conclusion

Deleting data in Laravel is straightforward once you shift from raw SQL thinking to using the framework's built-in tools—specifically Eloquent or the Query Builder. By favoring Eloquent methods like `$model->delete()` for single records and utilizing `DB::table()->where()->delete()` for more complex operations, you write code that is not only functional but also secure, readable, and maintainable. Keep exploring the documentation at [laravelcompany.com](https://laravelcompany.com) to deepen your understanding of these powerful tools!
