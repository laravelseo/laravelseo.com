---
title: "what is the difference between 'extends Authenticatable' vs 'extends Model' in Laravel?"
description: "Understanding Eloquent Inheritance: The Difference Between Model and Authenticatable in Laravel As a senior developer working with the Laravel ecosystem,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a senior developer working with the Laravel ecosystem, you frequently deal with Eloquent models that inherit from base classes. A common point of confusion arises when dealing with `extends Model` versus `extends Authenticatable`. This distinction isn't just semantic; it dictates what features your model gains regarding authentication, relationships, and data access within your application.

If you are experiencing issues displaying data correctly for one model but not another—especially when dealing with routes or middleware—it is almost certainly due to how these base classes influence the model's behavior. Let’s break down exactly what these two classes represent and why it matters for your application architecture.

## The Foundation: `extends Model`

The `Model` class is the absolute foundation of any Eloquent object in Laravel. When you extend `Model`, you are telling PHP that this class inherits all the core functionality provided by the base Eloquent framework.

**What `Model` provides:**
1.  **Database Interaction:** It grants access to all the necessary methods for querying, creating, updating, and deleting records from the database (e.g., `$table`, `$fillable`, Eloquent methods like `save()`, `find()`).
2.  **Basic Structure:** It establishes the standard structure required for any table-backed entity in your application.

In essence, extending `Model` makes your class a fully functional Eloquent model capable of managing data persistence. For a simple data object that doesn't involve user sessions or authentication logic, `extends Model` is sufficient.

```php
// Example: A generic product model
class Product extends Model
{
    // This model only needs standard CRUD operations.
}
```

## The Specialization: `extends Authenticatable`

The `Authenticatable` trait (which is typically implemented by the base `Authenticatable` class) introduces specific behaviors and features related to user management and authentication within the Laravel framework. It signals that this model represents an entity that is tied to a user identity or requires specific security context.

**What `Authenticatable` provides:**
1.  **Authentication Hooks:** It integrates models with Laravel's authentication system, allowing them to interact seamlessly with authentication guards (like session-based or token-based).
2.  **Soft Deletes:** By default, models extending this class often gain the ability to use soft deletes, which is a crucial feature for business logic that requires tracking history rather than physically removing data from the database.
3.  **Relationship Context:** It sets up the necessary context for relationship management tied to the authenticated user.

When you extend `Authenticatable`, you are signaling to Laravel that this model is part of your application's security layer. This is why models like the `User` model *must* extend `Authenticatable` if they are intended to handle login, permissions, or ownership checks—which explains why data display might fail when authentication context is missing.

```php
// Example: A user model that needs authentication features
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Model;

class User extends Authenticatable // Inherits all Model functionality PLUS auth-related traits
{
    // ... model properties and methods
}
```

## Resolving Your Issue: Context is Key

The difference boils down to **feature set**: `Model` provides data management; `Authenticatable` provides data management *plus* authentication context.

If your `Foo` model displays correctly but your `User` model does not, it strongly suggests that the route or controller logic attempting to fetch the user is expecting an authenticated context (perhaps checking `$request->user()`), which only exists when the model implements the necessary authentication traits. The data retrieval itself might work fine for `Foo`, but the surrounding application logic breaks down for `User` because Laravel cannot resolve the required security context on that specific model instance unless it signals that it is an authenticatable entity.

**Best Practice:** Always use `Authenticatable` when your Eloquent model represents a user or any entity that requires involvement with the authentication system, as this ensures proper integration with Laravel's security features and structure. For all other generic data entities (like products, posts, settings), simply extend `Model`. Always refer to official documentation for the most up-to-date details on Eloquent relationships and model structure on [laravelcompany.com](https://laravelcompany.com).

## Conclusion

In summary, think of it this way: **`Model` is the base class for *everything* in your database; `Authenticatable` is a specialized contract for models that are part of the application's security and identity system.** By understanding this hierarchy, you can write more robust, predictable, and maintainable Laravel applications.
