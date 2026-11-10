---
title: "Eloquent - What is $fillable really for?"
description: "Eloquent What is $fillable really for? Moving Beyond Simple Mass Assignment When you start working with Eloquent in Laravel, especially when dealing with..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

When you start working with Eloquent in Laravel, especially when dealing with form submissions or API requests, you quickly run into the concept of "Mass Assignment." This is where methods like `create()` or `fill()` seem incredibly convenient. The documentation points us toward defining the `$fillable` property on our models to control which attributes can be mass-assigned.

But the real question a seasoned developer asks is: Why bother with `$fillable` at all? Why not just let everything pass through by default? Understanding this nuance moves you from simply using the framework to writing secure, robust, and maintainable applications.

## The Danger of Unrestricted Mass Assignment

The short answer is security and data integrity. When you omit the `$fillable` property on your Eloquent model, Laravel defaults to allowing mass assignment for *every* column in that table. While this seems convenient for rapid prototyping, it introduces a significant security vulnerability known as Mass Assignment.

Mass Assignment occurs when an attacker can manipulate input data (like a POST request) to update fields they shouldn't have access to. For example, if you have a `password_hash` or an `is_admin` boolean field, and you allow any user input to write to it, an attacker could potentially change their role or bypass security checks simply by sending the right data.

This is why defining `$fillable` acts as a crucial gatekeeper. It explicitly tells Eloquent: "Only these specific attributes are safe to be assigned via mass assignment." This enforces a principle of least privilege, which is fundamental in secure application development.

## Defining Boundaries with `$fillable`

The `$fillable` property serves as an explicit whitelist for mass assignable fields. Instead of relying on implicit permissions, you take control and define exactly what the application intends to allow for bulk operations.

Consider a simple `User` model:

```php
// app/Models/User.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password', // Note: We handle passwords separately (see below)
    ];
}
```

By defining `$fillable`, we ensure that if an incoming request tries to update a field like `is_admin` or `account_balance`—fields *not* listed in `$fillable`—Eloquent will silently ignore the attempt, effectively preventing unauthorized data changes.

## Best Practices: Handling Sensitive Data Separately

A common point of confusion is handling sensitive fields like passwords. Notice that even though we included `'password'` in `$fillable`, this approach is flawed for security best practices. You should *never* store plain passwords, and usually, you don't want to mass-assign the raw password input directly into the database.

A better practice involves using Mutators or setting fields via dedicated methods:

```php
// In a Controller or Service Layer:

$user = User::create([
    'name' => $request->name,
    'email' => $request->email,
    // The password must be hashed before saving
    'password' => Hash::make($request->password), 
]);
```

This separates the data flow: `$fillable` controls *which* fields can be mass-assigned (the structural control), and explicit processing (hashing) controls *how* sensitive data is managed (the security control).

## Conclusion

In summary, `$fillable` is not just a convenience; it is a critical security mechanism. It shifts your Eloquent usage from an implicit trust model to an explicit permission model. By defining `$fillable`, you establish clear boundaries for mass assignment, significantly mitigating the risk of unintended data manipulation and ensuring that your application adheres to secure coding standards. Always define these boundaries early in your model definitions, as suggested by Laravel's principles on building robust systems.
