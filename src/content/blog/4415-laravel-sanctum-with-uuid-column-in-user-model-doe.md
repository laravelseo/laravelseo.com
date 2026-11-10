---
title: "Laravel Sanctum with uuid column in User model doesn't save tokenable_id"
description: "Laravel Sanctum with UUIDs: Solving the tokenable id Integrity Constraint Violation As developers increasingly move towards distributed systems and..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers increasingly move towards distributed systems and microservices, using Universally Unique Identifiers (UUIDs) as primary keys in Eloquent models has become a common pattern. This provides better cross-database compatibility and avoids sequential ID collisions. However, integrating this pattern with complex authentication systems like Laravel Sanctum—which relies heavily on Eloquent relationships and polymorphic associations—can introduce unexpected database integrity errors.

This post dives deep into a specific pain point: why using UUIDs for primary keys in the `User` model seems to break the token creation process within Laravel Sanctum when defining custom morphing relationships. We will analyze the setup, diagnose the cause of the `tokenable_id` error, and provide the robust solution.

## The Setup: UUIDs and Polymorphic Tokens

The scenario you are facing involves a sophisticated setup:
1.  **UUID Primary Key:** Your `User` model uses a UUID for its primary key (`uuid`).
2.  **Custom Token Model:** You extend Sanctum’s functionality by creating a custom `PersonalAccessToken` model that uses `morphTo` to link back to the user via polymorphic associations (`tokenable_id`, `tokenable_type`).
3.  **Morphing Definition:** Your custom token model correctly defines the relationship:

    ```php
    public function tokenable()
    {
        return $this->morphTo('tokenable', 'tokenable_id', 'uuid');
    }
    ```

This setup is logically sound for polymorphic relationships. The problem arises not from the *logic* of the relationship, but from the *database constraints* and how Laravel/Eloquent interacts with non-standard primary keys during insertion.

## Diagnosing the Error: Why `tokenable_id` Fails

When you execute `$user->createToken($user->email)->plainTextToken`, Sanctum attempts to create a record in the `personal_access_tokens` table. This insertion requires populating the `tokenable_id` and `tokenable_type` columns.

The error message:
`SQLSTATE[23000]: Integrity constraint violation: 1048 Column 'tokenable_id' cannot be null`

This indicates that while the column exists, the value being inserted is somehow failing validation, likely because of how your UUID primary key interacts with foreign key constraints or when Eloquent attempts to resolve the relationship path during the mass assignment.

The root cause is often a mismatch in expected data types between the parent model's ID type (UUID) and the foreign key column defined on the related table (`personal_access_tokens`). Even though UUIDs are unique, database systems require specific handling for them when used as foreign keys or morph targets.

## The Solution: Ensuring Type Consistency and Casting

The fix involves ensuring that the columns intended to hold UUID values are correctly typed in your migrations and that Eloquent is aware of these types. Since you are using UUIDs, we need to ensure that both the `users` table and the `personal_access_tokens` table handle this data properly.

### Step 1: Verify the User Migration (The Parent)

Ensure your `users` table migration correctly defines the primary key as a UUID type, which you have already done:

```php
Schema::create('users', function (Blueprint $table) {
    $table->uuid('uuid')->primary(); // Correctly defining the PK as UUID
    // ... other fields
});
```

### Step 2: Adjust the Token Migration (The Child)

This is where the critical adjustment happens. When using morphing with non-standard IDs, ensure that the foreign key column (`tokenable_id`) in your `personal_access_tokens` table is also defined as a `uuid`.

Modify your token migration to use `uuidMorphs()` correctly, ensuring the target columns reflect the UUID structure:

```php
Schema::create('personal_access_tokens', function (Blueprint $table) {
    $table->id(); // Keep a standard BIGINT ID for the internal PK if you want one, or rely solely on morphing.
    // If relying purely on morphing for the link:
    $table->uuidMorphs('tokenable'); // This correctly sets up the polymorphic relationship columns (tokenable_id and tokenable_type) as UUIDs.
    $table->string('name');
    $table->string('token', 64)->unique();
    $table->text('abilities')->nullable();
    $table->timestamp('last_used_at')->nullable();
    $table->timestamps();
});
```

By explicitly using `$table->uuidMorphs('tokenable')`, you instruct the database to create `tokenable_id` and `tokenable_type` as UUID columns, aligning with your primary key structure in the `users` table. This resolves the integrity constraint violation because the system now expects valid UUIDs for linkage, rather than standard integer IDs that might be causing conflicts or type mismatches during insertion.

## Conclusion

Integrating advanced features like UUID primary keys with established packages like Laravel Sanctum requires careful attention to database schema design. The error you encountered is a classic case of data type mismatch between the parent model's ID format and the foreign key columns in related tables. By ensuring that your migrations explicitly use `uuidMorphs()` for polymorphic relationships, you establish the necessary structural integrity, allowing Sanctum to successfully create tokens linked to your UUID-based users.

For more advanced insights into database interactions and Eloquent relationships, always refer to the official documentation at [https://laravelcompany.com](https://laravelcompany.com). Mastering these details is key to building robust and scalable applications with Laravel.
