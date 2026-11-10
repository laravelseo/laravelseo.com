---
title: "Laravel 5: return number of affected rows MySQL"
description: "Mastering Row Counts in Laravel: Replacing mysql affected rows() with Eloquent Methods As a senior developer working with the Laravel ecosystem, we often..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP"]
featured: false
---

As a senior developer working with the Laravel ecosystem, we often deal with the need to precisely know how many rows were affected by a database operation—whether it's an insertion, update, or deletion. In environments like raw PHP MySQL interactions, functions like `mysql_affected_rows()` provide this crucial feedback. However, when moving to the elegant and powerful abstraction layer of Laravel’s Database facade, we need to understand how to achieve the same outcome using idiomatic Eloquent and Query Builder methods.

This post will dive into how to correctly return the number of affected rows in Laravel, effectively replacing direct calls to legacy MySQL functions with modern, secure, and expressive code.

## The Challenge: Bridging Raw SQL and Laravel Abstraction

When performing operations directly via raw SQL strings using the `DB` facade (e.g., `DB::delete(...)`), the return value is often boolean or pertains to statement execution status rather than a clean row count. This forces developers to either rely on complex manual handling of results or resort to executing separate `COUNT(*)` queries, which is inefficient.

The goal in Laravel is to leverage the Query Builder's built-in capabilities, which are designed to provide metadata about the executed query directly.

## The Laravel Solution: Using the `affected()` Method

Laravel’s Query Builder methods (which form the backbone of Eloquent) automatically expose methods that reflect the outcome of the operation. For modification operations like `DELETE`, `UPDATE`, and `INSERT`, the method you are looking for is simply **`affected()`**. This method returns an integer representing the number of rows that were modified by the preceding query.

### Example 1: Deleting Rows Safely

Let's look at your example scenario where you want to delete records based on a condition. Instead of executing a raw string, we use the Query Builder syntax for safety and clarity:

```php
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    public function deleteChat(int $userId)
    {
        // Using the Query Builder to select the intended records first (optional but good practice)
        $query = DB::table('chat')
                     ->where('user_id', $userId);
        
        // Execute the deletion and capture the affected rows
        $affectedRows = $query->delete();

        // $affectedRows will now hold the exact number of rows deleted.
        return response()->json([
            'message' => 'Chat records deleted successfully.',
            'rows_deleted' => $affectedRows
        ]);
    }
}
```

In this example, when `delete()` is called on the query builder instance, it returns the integer count of rows removed from the `chat` table. This eliminates the need to execute a separate `SELECT COUNT(*)` statement, making the operation atomic, faster, and far cleaner.

## Advanced Scenario: Updating Records

The same principle applies to `UPDATE` operations. When you modify data, knowing how many records were actually changed is critical for transactional integrity.

```php
// Example: Updating a user's status
$updatedCount = DB::table('users')
                 ->where('id', 10)
                 ->update(['status' => 'active']);

return response()->json([
    'message' => 'User updated.',
    'rows_updated' => $updatedCount // Returns the number of rows where status was actually changed
]);
```

## Best Practices for Database Interactions in Laravel

When working with data manipulation, it is highly recommended to favor Eloquent Models and the Query Builder over raw SQL strings whenever possible. This approach provides several significant advantages:

1.  **Security:** It automatically handles escaping and binding parameters, effectively preventing SQL injection vulnerabilities.
2.  **Readability:** The code clearly states *what* you are trying to do rather than *how* the database should execute it.
3.  **Maintainability:** Code using these abstractions is easier for other developers (and your future self) to understand and maintain.

As we continue to build robust applications on Laravel, mastering these built-in features—like understanding how methods return metadata such as `$affected()`—is key to unlocking the full potential of the framework provided by [laravelcompany.com](https://laravelcompany.com). By adopting these patterns, you move beyond simply executing commands and start interacting with the database in a truly object-oriented and secure manner.

## Conclusion

To summarize, when replacing the functionality of `mysql_affected_rows()`, developers should abandon raw string execution for modification queries. Instead, embrace the Laravel Query Builder's methods like `delete()`, `update()`, and `insert()`. By calling the resulting method (e.g., `$query->delete()`), you immediately receive the number of affected rows, providing a clean, secure, and highly efficient way to manage your data operations within any Laravel application.
