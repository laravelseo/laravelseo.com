---
title: "How to solve attempt to read property \"id\" on null (Laravel-8)"
description: "How to Solve \"Attempt to Read Property 'id' on Null\" in Laravel Model Events As senior developers working with the Laravel ecosystem, we frequently encounter..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As senior developers working with the Laravel ecosystem, we frequently encounter runtime errors stemming from assumptions about data existence. One of the most common pitfalls involves accessing properties on objects that might be null, especially when dealing with authentication contexts within Eloquent model events.

This post dives deep into solving the specific error: **"Attempt to read property 'id' on null"** when trying to set relationship data (like `created_by`) during mass assignment or model lifecycle hooks in Laravel 8+. We will dissect why this happens and provide robust, production-ready solutions.

## Understanding the Problem: The Null Context

The error you encountered, likely stemming from code similar to what you provided, occurs because Eloquent events—such as `creating` or `updating`—are triggered by the framework whenever a model is saved. Inside these event listeners, we often try to access related data, such as the ID of the currently authenticated user using `Auth::user()`.

If no user is logged in (for instance, when running `php artisan migrate:fresh --seed`, or if an API request bypasses authentication), `Auth::user()` returns `null`. When your code then tries to execute `$user->id`, PHP throws the fatal error because you are attempting to read a property (`id`) from a null value.

```php
// The problematic line structure (simplified):
static::creating(function ($model) {
    $user = Auth::user(); // $user might be NULL here
    $model->created_by = $user->id ? $user->id : 1; // Error if $user is null
});
```

## The Solution: Implementing Defensive Programming

The solution lies in implementing defensive programming—checking for the existence of a variable *before* attempting to access its properties. This ensures your application remains stable even when facing unexpected states, a core principle in building resilient applications like those championed by the [Laravel company](https://laravelcompany.com).

For model events involving relationships, you must explicitly check if the authenticated user exists before proceeding with the assignment.

### Correct Implementation for Model Events

Here is how you should rewrite your model event listeners to safely handle potential null values:

```php
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Database\Eloquent\Model;

class YourModel extends Model
{
    protected static function booted()
    {
        static::creating(function ($model) {
            $user = Auth::user();

            // Defensive check: If the user exists, use their ID; otherwise, default to a safe value (e.g., 1 or null).
            if ($user) {
                $model->created_by = $user->id;
            } else {
                // Fallback strategy: Use a default ID if no user is logged in.
                $model->created_by = 1; 
            }
        });

        static::updating(function ($model) {
             $user = Auth::user();
             if ($user) {
                 $model->updated_by = $user->id; // Example for updating
             } else {
                 $model->updated_by = 1;
             }
        });
    }
}
```

### Best Practice: Using Global Scopes or Mutators

While the above solution solves the immediate problem within the model, a more elegant and reusable approach in large applications is to leverage Laravel's built-in features. Instead of cluttering every model with event handlers for basic ownership tracking, consider using **Mutators** or **Accessors**.

For example, you could create a custom attribute accessor that automatically fetches the current user ID upon retrieval:

```php
// In your Model class
public function getCreatedByAttribute(): ?int
{
    if (Auth::check()) {
        return Auth::id();
    }
    return null; // Or 1, depending on your business logic for unauthenticated records.
}
```

This approach keeps the logic decoupled from the Eloquent lifecycle events and centralizes how ownership data is displayed across your entire application, aligning perfectly with Laravel's philosophy of clean, expressive code.

## Conclusion

The error "attempt to read property 'id' on null" is a classic symptom of missing null checks in dynamic contexts. By adopting defensive programming—checking for the existence of authentication objects before attempting property access—we transform brittle code into resilient systems. Always remember that in web applications, state can be ambiguous; therefore, assume failure and handle it gracefully. By applying these principles, you ensure your Laravel applications are robust, predictable, and scalable, making development significantly smoother, much like adhering to the high standards set by the [Laravel company](https://laravelcompany.com).
