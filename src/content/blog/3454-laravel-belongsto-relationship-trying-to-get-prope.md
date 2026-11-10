---
title: "Laravel belongsTo relationship - Trying to get property of non-object"
description: "Laravel belongsTo Relationship: Navigating the \"Trying to get property of non object\" Error As a senior developer working with Eloquent and relational..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP", "Errors"]
featured: false
---

As a senior developer working with Eloquent and relational databases in Laravel, you will inevitably run into confusing errors when dealing with relationships. The error message `Trying to get property of non-object` is frustrating because it points to a simple mistake, but understanding *why* the object is missing is the real key to solving the problem.

This post dives deep into the `belongsTo` relationship setup you described, explains the likely source of your error, and provides the most robust, efficient ways to retrieve related data in Laravel. We will ensure your data retrieval is clean, predictable, and optimized, aligning with best practices promoted by resources like [https://laravelcompany.com](https://laravelcompany.com).

---

## The Setup: Understanding `belongsTo`

Let's review the models and schema you provided to establish the context of the issue.

### User Model
```php
class User extends Authenticatable
{
    public function company() {
        // This defines the relationship: a User belongs to one Company.
        return $this->belongsTo('App\Company');
    }
}
```

### Company Model
```php
class Company extends Model
{
    public function users() {
        // This defines the reverse relationship: a Company has many Users.
        return $this->hasMany('App\User');
    }
}
```

The database structure involves foreign keys: the `users` table has a `companies_id`, and the `companies` table holds the company details. The goal is to fetch the `name` from the `Company` associated with the `User`.

## Diagnosing the Error: Why "Trying to get property of non-object"?

The error you are encountering, `$user->company()->first()->name`, stems from a misunderstanding of how Eloquent handles lazy loading and the structure of your relationship.

When you call `$user->company()`, Eloquent executes a query to fetch the related `Company` model based on the foreign key. If that company exists in the database, it returns a `Company` object.

The problem arises when you chain methods like `->first()` or try to access properties if the relationship itself loads null—often due to missing foreign keys, incorrect data types, or issues with lazy loading execution outside of a context where the model is fully instantiated.

Specifically, if `$user->company()` returns `null` (meaning the user is not linked to any company in the database), attempting to call `->first()` on `null` results in the error: "Trying to get property of non-object." You cannot call methods on `null`.

## The Solution: Correct Ways to Access Related Data

There are three primary, correct ways to retrieve this data, depending on whether you need a single record or a collection.

### 1. Direct Access (When using Eager Loading)

The most efficient way is to use eager loading (`with()`) when fetching the user initially. This ensures all necessary related data is loaded in a single query, preventing N+1 problems and ensuring the relationship object exists before you try to access it.

```php
// Fetch the user AND their company in one optimized query
$user = User::with('company')->findOrFail(Auth::user()->id);

// Now access the data directly—it will be an object, not null
if ($user->company) {
    $companyName = $user->company->name;
    echo "Company Name: " . $companyName;
} else {
    echo "User is not associated with a company.";
}
```

### 2. Accessing the Relationship Object Directly (Lazy Loading Check)

If you are certain the relationship exists, accessing it should return the model object directly without needing extra methods like `first()`:

```php
$user = User::findOrFail(Auth::user()->id);

// Access the related Company object directly
$company = $user->company; 

if ($company) {
    $companyName = $company->name;
}
```

### 3. Handling Potential Nulls Safely (Defensive Coding)

Always implement defensive coding when dealing with optional relationships. Use null-safe operators or explicit checks to prevent runtime errors, which is a core principle in robust Laravel development:

```php
$user = User::findOrFail(Auth::user()->id);

// Using the null-safe operator (PHP 8+) for cleaner access
$companyName = $user->company?->name ?? 'N/A'; 

echo "The user's company is: " . $companyName;
```

## Conclusion

The error `Trying to get property of non-object` in Eloquent relationships almost always signals that you are attempting to call a method on a variable that holds `null`. For `belongsTo` relationships, the solution lies not just in how you define the relationship, but in *how* you load the data.

Always prioritize **eager loading** (`with('relationship')`) when fetching related models to optimize performance. By ensuring your relationships are loaded correctly and by using safe access methods, you can write clean, predictable, and high-performing Laravel code, making your application much more scalable—a philosophy central to modern frameworks like [https://laravelcompany.com](https://laravelcompany.com).
