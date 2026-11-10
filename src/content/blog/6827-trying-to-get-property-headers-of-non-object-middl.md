---
title: "\"Trying to get property 'headers' of non-object\" Middleware\\VerifyCsrfToken.php:180"
description: "Debugging Middleware Errors: Why You See \"Trying to get property 'headers' of non object\" in Laravel As developers, we often dive deep into custom middleware..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers, we often dive deep into custom middleware and service layers to enforce business logic. While this customization is essential for building robust applications, it frequently exposes subtle pitfalls related to object handling, especially when dealing with database interactions in frameworks like Laravel.

Recently, I encountered a frustrating error while working on a custom middleware intended to check user permissions before allowing access to specific routes. The resulting error message—"Trying to get property 'headers' of non-object"—seems abstract, but it points directly to a common issue: attempting to call a method or access a property on a variable that holds `null` or an empty collection instead of an actual Eloquent model instance.

This post will dissect why this error occurs in the context of Laravel middleware and provide the best practices for defensive coding to prevent these runtime errors.

## The Root Cause: Misunderstanding Eloquent Returns

The core issue often lies not in the database query itself, but in how we interpret the result returned by Eloquent methods like `->get()`. When you execute a query that returns no matching records, Eloquent does not return `null`; it returns an empty **Collection**.

In your provided scenario:
```php
$empl = Employee::where('user_id','=', $id)->get();
```
If no employee is found for the given ID, `$empl` becomes an empty collection. When subsequent code attempts to treat this collection like a single model object—for example, trying to access `$empl->headers` or using strict comparisons that fail on collections—the PHP engine throws a fatal error because it expects an object but finds something else (like an empty array or `null`).

## Refactoring for Robustness in Middleware

The solution is to shift from checking if the variable *is* null to checking if the collection *contains* any data. This approach ensures that you are always dealing with a valid structure, regardless of whether a record was found.

Let's refactor your middleware logic to handle this scenario defensively. We need to explicitly check the count or use Laravel’s collection methods before attempting to access properties.

### Before (Problematic Logic)

```php
// Inside your middleware handle method...
$empl = Employee::where('user_id','=', $id)->get();

if($empl === null) // This often fails if $empl is an empty Collection
{
    return route('confirm');                    
}
// Subsequent code assumes $empl is a model object.
```

### After (Defensive and Correct Logic)

The best practice here is to check the count of the results immediately after fetching them. If the count is zero, we know no employee exists, and we can route accordingly.

```php
use App\Employee;
use Illuminate\Support\Facades\Auth;

class CheckConfirm
{
    public function handle($request, Closure $next)
    {
        if (Auth::check()) {
            $id = Auth::id();
            
            // Fetch the employee record(s)
            $employees = Employee::where('user_id', $id)->get();

            // Check if any records were returned
            if ($employees->isEmpty()) {
                // No employee found, redirect to login or confirmation flow
                return route('login'); 
            }

            // If we reach here, the employee exists. Proceed with the request.
            // You can access the first item safely if needed: $employee = $employees->first();
            return $next($request);

        } else {
            return route('login');
        }
    }
}
```

By using `$employees->isEmpty()`, we correctly check the state of the collection, satisfying the runtime requirement before any attempt is made to access properties like `headers`. This principle of defensive programming is crucial in building scalable applications, aligning perfectly with the principles advocated by platforms like [Laravel](https://laravelcompany.com).

## Conclusion: Embrace Defensive Coding

Debugging errors originating from data access is a rite of passage for every developer. The key takeaway here is to treat all returned Eloquent results—whether it's a single model or a collection—as potentially empty until proven otherwise. Always use methods like `isEmpty()`, `count()`, or check for the existence of the object itself before attempting property access. Adopting this defensive mindset will save you countless hours spent chasing elusive "Trying to get property of non-object" errors.
