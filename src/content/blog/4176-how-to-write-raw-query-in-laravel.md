---
title: "How to write raw query in Laravel"
description: "Mastering Database Inspection: How to Write Raw Queries in Laravel As developers working with the Laravel ecosystem, we often rely heavily on the elegant..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "Errors"]
featured: false
---

As developers working with the Laravel ecosystem, we often rely heavily on the elegant abstraction provided by the Eloquent ORM and the powerful Query Builder. These tools allow us to interact with the database safely and efficiently. However, there are times when the complexity of a specific task—such as querying system metadata or executing highly complex stored procedures—demands direct interaction with the underlying SQL. This is where raw queries come into play.

This post will guide you on how to write and execute raw SQL queries within your Laravel application, using the example of retrieving table sizes from the MySQL `information_schema`.

## The Need for Raw Queries in Laravel

Laravel’s Query Builder is fantastic for standard CRUD operations. It keeps code clean and prevents many common errors. However, when you need to query information that doesn't map directly to your Eloquent models (like system tables, aggregated statistics, or complex joins), writing raw SQL becomes necessary.

The primary method Laravel provides for executing raw queries is through the `DB` facade. This gives us direct access to the underlying PDO connection, allowing us to execute any standard SQL command.

## Executing a Raw Query with `DB::select()`

To execute a custom query, we use methods like `DB::select()`, `DB::statement()`, or `DB::update()`. For retrieving data results, `DB::select()` is the most appropriate function, as it returns the results as an array of objects.

Let’s look at the specific MySQL query you provided, which aims to calculate the size of a specific table:

```sql
SELECT table_name "Name_of_the_table", table_rows "Rows Count", round(((data_length + index_length)/1024/1024),2) AS "Table Size (MB)" FROM information_schema.TABLES WHERE table_schema = "Name_of_the_Database" AND table_name ="Name_of_the_table";
```

To execute this in Laravel, we embed the SQL string directly into the `DB::select()` method:

```php
use Illuminate\Support\Facades\DB;

class TableSizeService
{
    public function getTableSize(string $database, string $tableName)
    {
        // Construct the raw query string
        $sql = "
            SELECT 
                table_name, 
                table_rows, 
                round(((data_length + index_length)/1024/1024),2) AS \"Table Size (MB)\")
            FROM information_schema.TABLES 
            WHERE table_schema = :db AND table_name = :table
        ";

        // Execute the query using DB::select() with bindings for security
        $results = DB::select($sql, [
            'db' => $database,
            'table' => $tableName
        ]);

        return $results;
    }
}
```

### Best Practice: Security and Bindings

Notice how we used named bindings (`:db` and `:table`) instead of simple string concatenation. This is the most critical best practice when writing raw queries. By using bindings, Laravel ensures that any variables passed into the query are properly escaped by the underlying driver, effectively mitigating **SQL Injection** vulnerabilities. As a senior developer, always treat user input—even if it's just a table name provided by an admin panel—as untrusted data.

## Advantages and Caveats

While raw queries are incredibly powerful for complex metadata retrieval, they come with trade-offs:

**Advantages:**
1. **Flexibility:** They allow you to execute any valid SQL command that the Query Builder might not easily support.
2. **Performance:** For highly optimized, specific database operations, a hand-written query can sometimes be marginally faster than the abstraction layer.

**Caveats:**
1. **Maintainability:** Raw queries are harder to read and maintain compared to Eloquent methods. If you need to refactor the logic, the SQL string must be manually managed.
2. **Portability:** Queries written for MySQL might require adjustments if you switch database systems (like PostgreSQL or SQL Server).

## Conclusion

Raw queries in Laravel are not a replacement for the Query Builder; rather, they are an essential escape hatch for scenarios demanding low-level control over the database. By utilizing methods like `DB::select()` and strictly enforcing the use of parameter bindings, you can leverage the raw power of SQL while maintaining the security and structure that Laravel is known for. When dealing with system introspection or complex reporting, mastering this technique will make you a more versatile and powerful Laravel developer.
