---
title: "Model and table name conventions Laravel"
description: "Master the Map: Model and Table Naming Conventions in Laravel As developers working with the Laravel ecosystem, one of the first hurdles we face is..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

As developers working with the Laravel ecosystem, one of the first hurdles we face is establishing consistent conventions for our database structure. How should we name our Eloquent Models, and how should those models map to their corresponding database tables? A poorly defined convention leads to brittle code, confusion during development, and significant maintenance headaches down the line.

This post dives deep into the best practices for naming models and tables in Laravel, using your scenario—dealing with a `users` table and a related `user_address` table—as our starting point.

## The Golden Rule: Eloquent Naming Conventions

Laravel strongly encourages convention over configuration. This means adhering to established naming patterns simplifies development immensely because it allows developers to immediately understand the structure of your application without needing extensive documentation for every single class or column.

The fundamental rule in Laravel is this: **Models should represent tables, and they should be plural.**

If you have a table named `users`, your Eloquent Model should be named `User`. This convention is deeply ingrained in how Eloquent works, simplifying interactions with the database. When you call `$user = User::find(1)`, Laravel automatically knows to look for the `users` table.

### Anatomy of a Relationship

When dealing with related data, such as your scenario involving `users` and `user_addresses`, we rely on foreign keys to establish relationships rather than embedding table names directly into the model properties.

The approach you hinted at—trying to use properties like `$table = "user_address"` within the Model—is generally discouraged for standard Eloquent usage. Eloquent is designed to infer these mappings based on standard conventions and defined relationships.

## Implementing Relationships Correctly with Migrations

Instead of trying to force table names into the model class, the correct place to define your structure and relationships is in your **Migrations** and within the **Model** itself using Eloquent's relationship methods.

### Step 1: Define the Tables via Migrations

Your migrations are responsible for defining the actual database schema. They ensure that your table names follow standard snake_case conventions (e.g., `users`, `user_addresses`).

```php
// database/migrations/..._create_user_addresses_table.php

Schema::create('user_addresses', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade'); // This establishes the link to the users table
    $table->string('street');
    $table->string('city');
    // ... other address fields
});
```

Notice how we use `foreignId('user_id')`. This explicitly creates a foreign key column named `user_id` in the `user_addresses` table, linking it back to the primary key of the `users` table. This is how relational databases enforce integrity.

### Step 2: Define the Model and Relationships

Your models then define *how* those tables relate to each other. The model itself should only contain business logic and relationships, not direct database mapping properties.

In your `User` model, you would define a one-to-one or one-to-many relationship:

```php
// app/Models/User.php

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Model
{
    /**
     * Defines the relationship where a User has many Addresses.
     */
    public function addresses(): HasMany
    {
        // Eloquent assumes the related table is 'user_addresses' by default if we follow conventions,
        // but explicitly defining it ensures clarity.
        return $this->hasMany(UserAddress::class);
    }
}
```

By using Eloquent relationships (`hasMany`, `belongsTo`), you are leveraging Laravel’s powerful ORM capabilities. This is far superior to manually managing table names within the model properties, as it keeps your code clean and highly extensible. As detailed by the team at [laravelcompany.com](https://laravelcompany.com), focusing on these Eloquent relationships ensures your application scales effectively.

## Conclusion

To summarize, when structuring your Laravel application:

1.  **Tables:** Use plural snake\_case (e.g., `users`, `user_addresses`). Define them strictly in your database migrations.
2.  **Models:** Name them using the singular convention (e.g., `User`, `UserAddress`).
3.  **Relationships:** Do not store table names inside the model properties. Instead, define explicit Eloquent relationships (`hasMany`, `belongsTo`) within the models to manage the connection between tables dynamically.

By adhering to these conventions, you build a codebase that is not only functional but also intuitive, maintainable, and adheres to the best practices promoted by the Laravel framework.
