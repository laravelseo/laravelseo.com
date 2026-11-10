---
title: "What effect does $hidden have exactly in eloquent model?"
description: "The Subtle Power of $hidden: Understanding Eloquent Model Attributes As developers diving deep into the world of Eloquent, we often focus on how data is..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers diving deep into the world of Eloquent, we often focus on how data is retrieved and manipulated. One feature that sometimes causes confusion—especially when dealing with sensitive information like passwords—is the use of the `$hidden` property on an Eloquent model. This property seems straightforward, but its implications touch upon mass assignment, data serialization, and ultimately, security in your application.

Let's break down exactly what `$hidden` does, why your hashing scenario behaved unexpectedly, and how to manage sensitive data effectively in Laravel.

## What Exactly Does `$hidden` Do in Eloquent?

The `$hidden` property on an Eloquent model serves a specific purpose related to **output**, not necessarily the direct mechanism of database input protection. When you define attributes in `$hidden`, you are telling Eloquent which attributes should be excluded when the model is converted into an array or JSON format (e.g., when returning data via an API).

As the documentation suggests, it controls what gets exposed when you serialize the model instance. It prevents sensitive data from leaking out of your application layer to the user interface or external systems.

```php
// Example Model Definition
class User extends Model
{
    protected $fillable = ['name', 'email', 'role'];
    protected $hidden = ['password']; // Hides 'password' from array/JSON output
}
```

This mechanism is primarily a feature for **data masking and presentation**. It does *not* inherently alter the rules governing mass assignment—the process of writing data *to* the database.

## The Distinction: `$hidden` vs. Mass Assignment Protection

The core confusion in your scenario lies in conflating two separate security concepts:

1.  **Mass Assignment Protection (Input Security):** This is controlled by `$fillable` and `$guarded`. These properties dictate which attributes are allowed to be set via methods like `create()` or `fill()`. If an attribute is not listed in `$fillable`, Eloquent will prevent mass assignment, protecting you from malicious data injection.
2.  **Attribute Hiding (Output Security):** This is controlled by `$hidden`. It restricts what the model exposes when serialized.

When you attempted to insert a new user: `User::create($requestData);`, the failure was likely not due to `$hidden` blocking the write operation, but rather how Eloquent handles attributes that are *not* explicitly defined in `$fillable` during creation, or potential issues with how the input data was being processed before hitting the database layer.

## Debugging the Password Insertion Issue

In your specific case, where you were hashing the password (`hash("sha512", $password)`), the issue likely stems from the fact that the `password` attribute was missing from your `$fillable` array:

```php
protected $fillable = ['name', 'email', 'role']; // 'password' is missing!
```

When you call `User::create($requestData)`, Eloquent looks at `$fillable`. Since `password` was not included, it correctly prevented the mass assignment of that field to the database. The data provided in `$requestData` (even the hashed version) was present, but because it wasn't permitted by the model configuration, the insertion failed for that specific field.

### Best Practice: Secure Handling of Passwords

Never store plain-text passwords or even raw hashes directly if you are handling user input. Always ensure data integrity and security first. When dealing with authentication systems, always rely on Laravel’s built-in features, which align with best practices promoted by the wider ecosystem like those found at [laravelcompany.com](https://laravelcompany.com).

Instead of manually hashing in your controller logic for standard password updates (which often involves using the `Hash` facade), you should leverage Eloquent's capabilities and ensure your model configuration is sound:

```php
// In your Controller/Service layer, handle the hashing securely
$requestData["password"] = Hash::make($requestData["password"]); // Use Laravel's built-in hashing
$user = User::create($requestData);
```

If you want to hide the password from API responses, keep `$hidden` for presentation purposes, but rely on `$fillable` for defining save permissions:

```php
protected $hidden = ['password']; // For output masking
protected $fillable = ['name', 'email', 'role', 'password']; // For input permission (if you need to store it)
```

## Conclusion

The `$hidden` property is a powerful tool for controlling **data exposure**—it manages the visibility of attributes in your application's data representations. It is distinct from mass assignment rules controlled by `$fillable` and `$guarded`, which manage **data persistence**. Understanding this separation is crucial. For security-sensitive fields like passwords, always prioritize input validation, secure hashing (using Laravel’s `Hash` facade), and strict permission definitions via `$fillable` before worrying about output masking with `$hidden`. By adhering to these principles, you ensure your Eloquent models are both functional and robustly secure.
