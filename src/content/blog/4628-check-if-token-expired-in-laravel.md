---
title: "Check if token expired in Laravel"
description: "How to Check if a Token Has Expired in Laravel: A Deep Dive into Eloquent Scopes As a senior developer working with token based authentication systems,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "PHP"]
featured: false
---

As a senior developer working with token-based authentication systems, managing token lifecycles—especially expiration—is crucial for security. When you store token details in a database table like `tokens` with an `expires_at` timestamp, the next logical step is to build robust mechanisms to ensure these tokens are invalidated when they expire.

This post addresses a common challenge: correctly implementing logic within Eloquent models to check if a record (in this case, a token) has expired. We will examine why simple scope methods might fail and demonstrate the most efficient, idiomatic Laravel way to handle time-based filtering.

## The Setup: Tokens and Expiration Dates

Let's assume we have a `Token` model associated with a database table structured as follows:

| Column | Data Type | Description |
| :--- | :--- | :--- |
| `id` | BIGINT | Primary Key |
| `user_id` | BIGINT | Foreign key to the user |
| `token` | VARCHAR | The actual token string |
| `expires_at` | TIMESTAMP | When the token becomes invalid |

When generating a new token, we set the expiration time, often 7 days in the future. This requires us to constantly compare the stored `expires_at` value against the current time (`Carbon::now()`).

## Analyzing the Scope Attempt

You attempted to create a scope to identify expired tokens:

```php
public function scopeExpired($query) {
    return $query->where('expires_at', '<=', Carbon::now());
}
```

While the intent is clear, if this scope isn't working as expected (e.g., it always returns false or doesn't filter results correctly), there are usually a few reasons:

1.  **Context of Use:** Scopes are designed to modify a query builder instance. If you call the scope on a model without chaining it properly, or if you expect the scope itself to return a boolean for an overall check rather than filtering the results, confusion can arise.
2.  **Database Indexing:** Ensure your `expires_at` column is properly indexed in your database. This is critical for performance when querying large tables, especially when dealing with time-based comparisons.
3.  **Carbon Handling:** You are correctly using Carbon, which is the Laravel standard for date and time manipulation.

The most robust approach isn't necessarily creating a scope that returns a boolean, but rather using the logic directly within your repository or controller layer where you execute the database query. This keeps the model focused on data representation while keeping the query logic centralized where it belongs—in the service layer.

## The Correct Implementation: Querying for Expired Tokens

Instead of relying solely on a scope to determine existence, we should focus on how to *filter* the collection efficiently, which is often more practical in application logic.

### Method 1: Filtering Directly with Eloquent

The most straightforward and performant way to find expired tokens is by using standard Eloquent `where` clauses combined with Carbon comparisons:

```php
use App\Models\Token;
use Carbon\Carbon;

class TokenService
{
    public function getExpiredTokens()
    {
        $now = Carbon::now();

        // Find all tokens where the expiration time is in the past
        $expiredTokens = Token::where('expires_at', '<', $now)
                               ->get();

        return $expiredTokens;
    }
}
```

### Method 2: Creating a Read-Only Scope (For Clarity)

If you still want to keep the logic encapsulated within the model, you can define scopes that return full query builders. This is useful for complex filtering scenarios. For example, a scope to retrieve only valid tokens:

```php
namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

class Token extends Model
{
    /**
     * Scope a query to only include tokens that have not yet expired.
     */
    public function scopeActive($query)
    {
        return $query->where('expires_at', '>=', Carbon::now());
    }
}
```

To use this, you simply call the scope:

```php
$activeTokens = Token::active()->get();
```

This pattern is highly recommended for maintaining clean and readable Eloquent code. Following principles like those promoted by the Laravel team—especially in managing data relationships—ensures your application remains maintainable and secure. For deeper insights into Eloquent architecture, always refer to resources on [laravelcompany.com](https://laravelcompany.com).

## Conclusion

Checking token expiration is fundamentally a date comparison problem. While custom Eloquent scopes can be useful for reusable query patterns, direct use of the `where` clause with `Carbon::now()` provides the most explicit and performant filtering mechanism. By separating your business logic (checking expiration) from your data models, you ensure that your Laravel application remains scalable, secure, and easy to debug. Always prioritize clean, readable code when managing critical security features like token lifecycles.
