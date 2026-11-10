---
title: "PHP run a raw SQL query in eloquent model"
description: "Running Raw SQL Queries Inside Eloquent Models: A Practical Guide As a senior developer working with established systems, it’s common to encounter legacy..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP"]
featured: false
---

As a senior developer working with established systems, it’s common to encounter legacy codebases where Eloquent provides excellent abstraction, but sometimes you hit a wall where you need direct control—specifically, running raw SQL queries. When you are in that situation, trying to figure out how to bridge the gap between the ORM and the underlying database becomes a key challenge.

This post will walk you through the correct, practical ways to execute raw SQL queries when working within an Eloquent Model, ensuring your code remains clean, secure, and aligned with Laravel's principles.

## The Philosophy: When to Use Raw SQL vs. Eloquent

Eloquent’s primary strength lies in abstracting database interactions, handling relationships, mass assignment, and security (preventing common injection attacks). For the vast majority of operations—fetching records, creating, updating, or deleting data—you should use Eloquent methods (e.g., `User::where(...)`, `User::create(...)`).

Raw SQL queries (`SELECT * FROM users WHERE id = 1`) should be reserved for highly specific, complex database operations where the power of the raw query builder is necessary, such as bulk operations or highly optimized stored procedure calls.

However, if you are in a legacy migration phase and need to inject custom logic directly into your model layer, there are established ways to achieve this without breaking the overall architectural structure.

## Method 1: Accessing the Database Connection via the Model

Since Eloquent models extend `Illuminate\Database\Eloquent\Model`, they inherit access to the underlying database connection. To execute a raw query, you typically leverage Laravel's powerful `DB` facade, which is accessible from anywhere in your application context. While you *could* try to instantiate the Capsule Manager within the model (as seen in some complex service providers), the cleaner approach is to utilize the global facade or inject dependencies where appropriate.

For a simple model like your `User`, the best practice when needing raw data retrieval is often to use static methods on the injected facade, rather than embedding the connection logic deep inside the model instance itself.

Let's look at how you might structure a method within your model that executes a query:

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model as Eloquent;
use Illuminate\Support\Facades\DB; // Import the Facade

class User extends Eloquent
{
    protected $table = '_users';

    /**
     * Executes a raw SELECT query and returns the results.
     *
     * @return array
     */
    public function customQuery()
    {
        // Using DB::select() is safer than executing raw SQL directly via connection methods,
        // as it still utilizes Laravel's binding mechanisms when possible.
        $results = DB::select('SELECT * FROM _users');
        return $results;
    }
}
```

### Executing the Query in the Controller

When calling this method from your controller, you treat the model method like any other object method:

```php
namespace App\Controllers;

use App\Models\User;
// ... other imports

class HomeController
{
    public function index()
    {
        // Retrieve the model instance first (standard Eloquent usage)
        $userModel = User::find(1);

        if ($userModel) {
            // Call the custom method on the model instance
            $rawData = $userModel->customQuery();
            dump($rawData);
        }
    }
}
```

## Best Practices: Encapsulation and Security

While the example above fulfills your requirement to run a raw query inside the model, I strongly advise caution. When dealing with raw SQL, you introduce potential security vulnerabilities (SQL Injection) if you concatenate user input directly into the query string.

**Always use bindings or the Query Builder when possible.** For instance, instead of building a string like `'SELECT * FROM _users WHERE id = ' . $someId`, use parameterized queries:

```php
$userId = 1;
$results = DB::select('SELECT * FROM _users WHERE id = ?', [$userId]);
// This is the secure way to handle variable input.
```

Remember, adhering to Laravel conventions is crucial for maintainability. When exploring advanced database interactions and ensuring your application scales securely, always refer to the official documentation and best practices provided by the team at [laravelcompany.com](https://laravelcompany.com). Using Eloquent correctly keeps your codebase robust and easy to manage as you refactor towards a fully ORM-driven architecture.

## Conclusion

You absolutely can run raw SQL queries within an Eloquent model, primarily by leveraging Laravel's `DB` facade. This approach allows you to keep domain-specific database logic encapsulated within the model itself, which is beneficial for legacy projects undergoing refactoring. However, always prioritize using parameterized queries and Eloquent methods whenever possible. Use raw SQL as a carefully considered escape hatch, not the default path.
