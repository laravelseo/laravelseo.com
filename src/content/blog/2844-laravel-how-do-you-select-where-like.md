---
title: "Laravel - how do you SELECT WHERE LIKE?"
description: "Laravel: Mastering SELECT WHERE LIKE with Bindings As a senior developer working extensively with the Laravel ecosystem, I frequently encounter situations..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords"]
featured: false
---

As a senior developer working extensively with the Laravel ecosystem, I frequently encounter situations where standard parameter binding seems to break down when dealing with pattern matching operations like the SQL `LIKE`. The confusion you are experiencing—where simple equality works fine but pattern matching fails—stems from how raw query bindings interact with SQL wildcards.

This post will dive deep into why this happens and provide the correct, robust strategies for performing flexible string searches using Laravel's Query Builder and Eloquent.

## The Pitfall of Positional Binding in `LIKE` Queries

You correctly observed that simple equality checks work seamlessly:
```sql
WHERE email = ?
```
When you use positional bindings (`?`), Laravel/PDO safely substitutes the provided value into the placeholder. This works perfectly because the database driver handles simple value substitution reliably.

However, when you introduce pattern matching using `LIKE`, the interaction changes significantly:
```sql
SELECT * FROM users WHERE email LIKE '%?%'
```
When you place the wildcards (`%`) inside the bound parameter placeholder, the database treats the entire string, including the percent signs, as a literal value to be matched against the column. It does not interpret the `?` as a dynamic insertion point for pattern matching; instead, it looks for an email address that literally contains the string `%?%`. This results in no matches unless you intentionally search for emails containing those exact characters.

The issue is not with Laravel's binding mechanism itself, but how the SQL structure requires the actual pattern to be constructed *before* binding.

## The Correct Approach: Binding the Pattern

To successfully use `LIKE` with positional bindings in Laravel, you must construct the full pattern—including the wildcards—on the application side before passing it to the query builder. This ensures that the database receives a valid search pattern, not a literal placeholder containing wildcards.

### 1. Using Raw Query Builder (`DB::select`) Correctly

If you are executing raw queries using the `DB` facade, ensure your input variable contains the required wildcards:

**Incorrect Attempt (As per your example):**
```php
// This binds 'test' literally inside the LIKE pattern, causing failure.
DB::connection('operator')->select("SELECT * FROM users WHERE email LIKE '%?%'", array('test'));
```

**Correct Implementation:**
You must construct the dynamic search term in PHP and inject it into the query string:

```php
$searchTerm = 'test'; // The value you want to search for
$pattern = '%' . $searchTerm . '%';

// Now bind the fully constructed pattern
$results = DB::connection('operator')
    ->select("SELECT * FROM users WHERE email LIKE ?", [$pattern]);

// Or, if using a more modern approach:
$results = DB::connection('operator')
    ->table('users')
    ->where('email', 'LIKE', $pattern)
    ->get();
```

By constructing the `$pattern` variable first, you ensure that the string passed to the `?` placeholder is the actual pattern (`%test%`), which the database can correctly use for pattern matching. This practice makes your code predictable and robust, aligning with Laravel's philosophy of clear data flow.

### 2. The Eloquent Way: Cleaner Syntax

For most Laravel developers, using Eloquent’s fluent syntax is far more readable and less error-prone than raw SQL bindings. Eloquent handles the underlying binding correctly for you:

```php
$searchTerm = 'test';
$pattern = '%' . $searchTerm . '%';

$results = \App\Models\User::where('email', 'LIKE', $pattern)->get();
```

This approach clearly separates the data logic (building the pattern) from the query execution, which is a core principle of writing maintainable code in Laravel. This aligns perfectly with how we structure data operations when leveraging tools like the `laravelcompany.com` framework.

## Conclusion

The seemingly simple failure of binding wildcards in `LIKE` queries is a classic trap involving the separation between application-level string construction and database-level pattern matching. Remember: positional bindings substitute values; they do not dynamically interpret SQL operators or pattern syntax. Always construct your full search pattern (`%value%`) in PHP before passing it to the query builder
