---
title: "How to call Stored Procedure with Eloquent (Laravel)?"
description: "How to Call Stored Procedures with Eloquent (Laravel)? Bridging ORM and Procedural Logic As a senior developer working within the Laravel ecosystem, we are..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "PHP", "Errors"]
featured: false
---

As a senior developer working within the Laravel ecosystem, we are constantly seeking ways to bridge the gap between our elegant Object-Relational Mapping (ORM) tools like Eloquent and the raw power of the underlying database features, such as MySQL Stored Procedures. You are correct in observing that there is no magical, pure Eloquent syntax equivalent to `$result = StoredProcedures::my_custom_procedure(param1, param2);`.

The short answer is: **Eloquent itself does not provide a built-in abstraction layer for calling stored procedures.** This is because Eloquent's primary focus is mapping relational tables and relationships, not executing arbitrary procedural code. However, this doesn't mean we cannot achieve the goal. We must leverage Laravel’s powerful database facade to interact directly with the MySQL engine, which is where stored procedures reside.

This post will detail the correct, practical ways to execute stored procedures from within a Laravel application and integrate those results seamlessly back into your Eloquent workflows.

---

## Understanding the Limitation: ORM vs. Procedural Logic

Eloquent operates on the principle of mapping database tables to PHP models. When you use Eloquent, you are defining *what* data you want (e.g., `User::where(...)`), not *how* that data is calculated or retrieved procedurally. Stored procedures execute logic directly within the MySQL server, offering performance benefits for complex operations.

Since stored procedures are procedural blocks of code, calling them requires executing raw SQL commands against the database connection, bypassing Eloquent’s standard query builders for that specific execution.

## The Practical Solution: Using the `DB` Facade

The correct approach in Laravel is to use the `Illuminate\Support\Facades\DB` facade to execute the stored procedure call. This allows you to send the necessary parameters and retrieve the resulting data set back into your application memory.

Stored procedures that return result sets (using `SELECT` statements) can be treated like any other query, allowing us to fetch the output using methods like `select()`.

### Example: Calling a Stored Procedure

Let’s assume you have a stored procedure named `calculate_monthly_sales` in your MySQL database that takes a month as an input parameter and returns calculated sales figures.

```php
use Illuminate\Support\Facades\DB;

class SalesController extends Controller
{
    public function runProcedure(int $month)
    {
        // Define the stored procedure call using DB::select()
        $sql = "CALL calculate_monthly_sales(?)";
        
        // Execute the call and fetch the results
        // Note: The method used depends on whether your SP returns a result set or just modifies data.
        $results = DB::select($sql, [$month]);

        // $results will be an array of objects returned by the MySQL query.
        // You can now process these results.
        return response()->json($results);
    }
}
```

## Integrating Results with Eloquent Models

While the above example successfully calls the procedure and gets raw data, the next logical step is to map this result into a meaningful structure using Eloquent. If your stored procedure returns data that corresponds to an existing model (e.g., sales records), you can fetch those results directly:

```php
use App\Models\Sale;
use Illuminate\Support\Facades\DB;

class SalesController extends Controller
{
    public function getSalesViaProcedure(int $month)
    {
        // Assuming the stored procedure populates a temporary table or directly returns data 
        // that can be mapped. For demonstration, we'll simulate fetching post-procedure results.
        $results = DB::select("SELECT * FROM monthly_report WHERE month = ?", [$month]);

        // If you need to map these raw results back into an Eloquent collection:
        $salesRecords = Sale::where('month', $month)->get(); 

        return response()->json($salesRecords);
    }
}
```

### Best Practice: Security and Abstraction

When working with raw SQL, always prioritize security. Since you are passing variables into the query, ensure you use parameterized queries (as shown above with `?` placeholders) rather than string concatenation to prevent SQL injection vulnerabilities. Furthermore, for very complex logic that needs to be abstracted away from your controllers, consider creating a dedicated **Service Class** or **Repository** layer in Laravel. This keeps your presentation logic separate from your data access logic, aligning with the principles of clean architecture often emphasized in modern Laravel development (as promoted by resources like those found on [laravelcompany.com](https://laravelcompany.com)).

## Conclusion

To summarize, there is no "pure Eloquent" method for calling MySQL stored procedures. The bridge between the ORM world and procedural database logic is built using the low-level power of the `DB` facade. By utilizing methods like `DB::select()`, you gain full control over executing complex procedural calls and retrieving their results, allowing you to integrate powerful database logic directly into your Laravel applications effectively and securely.
