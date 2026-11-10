---
title: "Laravel hidden attributes. e.g. Password - security"
description: "Laravel Hidden Attributes: Beyond Serialization—Securing Sensitive Data in Eloquent Models As developers working with Laravel and Eloquent, we constantly..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working with Laravel and Eloquent, we constantly grapple with balancing data access, serialization, and security. One common practice for managing sensitive fields, like passwords, is utilizing the `$hidden` attribute within an Eloquent Model. However, as we dive deeper into the mechanics of how Eloquent handles data retrieval, we uncover a crucial distinction: hiding an attribute from JSON or array conversion does not, by itself, guarantee its security when that object is loaded and displayed to a user.

This post will explore why simply using `$hidden` for fields like passwords falls short in securing sensitive information and outline robust strategies for managing data visibility in Laravel applications.

## The Limitation of `$hidden`: Serialization vs. Access Control

The initial approach, as noted in documentation regarding Eloquent, suggests hiding attributes from array or JSON conversion:

```php
class User extends Eloquent {
    protected $hidden = array('password');
}
```

This setup successfully prevents the `password` field from being included when you use methods like `toArray()` or when serializing the model for an API response. This is excellent for protecting data transmission across boundaries.

However, the core security vulnerability arises when the model instance itself exists in memory and is accessed directly within your application logic or views. As demonstrated in the provided example, when you query a user:

```php
$user = User::find(1);
// ... later in the view or controller
echo $user->password; // This exposes the password!
```

Even with `$hidden` set, the actual password value is loaded into the `$user` object's attributes upon retrieval from the database. The `$hidden` property only controls *how* the object is converted to a new format (serialization); it does not inherently stop an authorized developer or an accidental view layer access from reading the internal property directly.

This highlights a fundamental distinction: **data serialization security is separate from data access control.** We need mechanisms that govern *who* can read the data, not just how it is formatted.

## A Developer's Solution: Controlled Access and Mutators

To truly secure sensitive data in Laravel, we must implement controls at multiple layers—the Model, the Controller, and the View. Relying solely on `$hidden` is insufficient for critical fields like passwords. The best practice involves using Eloquent features to control how data is exposed.

### 1. Hashing and Storage (The Foundation)

First and foremost, remember that you should **never** store plain passwords. Laravel handles this beautifully through the `Hash` facade, which uses strong hashing algorithms (like bcrypt). This ensures that even if the database is compromised, the actual password remains protected.

### 2. Custom Accessors for Controlled Output

Instead of hiding the data entirely (which might break necessary internal operations), a more robust approach is to use Eloquent Accessors to define exactly *how* an attribute should be represented when retrieved. This gives you fine-grained control over presentation.

For example, instead of exposing the password directly, you can create a method that returns a masked or hashed representation:

```php
class User extends Eloquent {
    protected $hidden = array('password');

    public function getPasswordAttribute($value)
    {
        // Only return the hash for verification purposes if needed internally, 
        // or mask it entirely for display.
        return bcrypt($value); // Or a masked version for display: '********'
    }
}
```

By implementing an accessor like this, you ensure that when code attempts to access `$user->password`, it executes your defined logic, preventing the raw database value from being dumped directly into the view. This aligns with Laravel’s philosophy of leveraging Eloquent's power for data manipulation and presentation, as discussed on the official [Laravel documentation](https://laravelcompany.com).

## Conclusion: Layered Security is Key

Securing sensitive attributes in a Laravel application requires a layered approach. While using `$hidden` is useful for controlling serialization, it is not a complete security solution. True security comes from enforcing strict access control at the object level using Accessors and ensuring that all data handling respects the principle of least privilege. By implementing these controls, you move beyond simple attribute hiding and build a robust system where sensitive data remains protected throughout its lifecycle in your application.
