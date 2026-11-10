---
title: "Laravel morph table with morph field id size larger than one"
description: "Laravel Morph Table with Morph Field ID Size Larger Than One: Handling UUIDs in Polymorphic Relationships As developers building modern applications on..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP", "Errors"]
featured: false
---

As developers building modern applications on Laravel, we constantly face scenarios where database design choices clash with evolving data standards. Polymorphic relationships, managed by Eloquent's `morphs` feature, are incredibly powerful for flexible data modeling, but they expose underlying database constraints when dealing with non-standard primary keys like UUIDs instead of simple auto-incrementing integers.

This post will walk you through the exact problem you are encountering—the data truncation error when trying to store a UUID in a standard integer `tokenable_id` column—and provide a robust, developer-focused solution for adapting your Laravel schema to handle modern UUIDs seamlessly.

---

## The Problem: Integer vs. UUID Mismatch in Polymorphic Tables

You have correctly identified the conflict. Your `personal_access_tokens` table uses the standard polymorphic setup:

```php
$table->morphs('tokenable'); // Creates tokenable_id (bigint) and tokenable_type (string)
```

When you switch your `User` IDs from an auto-incrementing integer to a UUID (e.g., `uuid` or `string`), the database expects `tokenable_id` to be an integer. When Laravel attempts to insert a 36-character UUID string into that `bigint` column, the database throws a warning (`Data truncated`) because it cannot fit the data type.

The error message you see:
`SQLSTATE[01000]: Warning: 1265 Data truncated for column 'tokenable_id' at row 1`

This happens because `tokenable_id` is defined as a numeric type, and it simply cannot hold the arbitrary string format of a UUID. While this is a database limitation, we need to fix it within the Laravel migration structure.

## The Solution: Migrating to Native UUID Types

The solution lies in changing the data type of `tokenable_id` from an integer (`bigIncrements`) to a type that natively supports UUIDs, such as `uuid` (available in PostgreSQL and modern MySQL versions) or a `string`.

Since you are dealing with polymorphic relationships, storing the ID directly is still beneficial for indexing and foreign key relationships. We will adjust the migration accordingly.

### Step 1: Updating the Migration File

Instead of using `bigIncrements`, we will use the specific UUID type provided by your database. For this example, assuming a modern PostgreSQL or MySQL setup, we define the ID as a native UUID type.

Here is how you should rewrite your `personal_access_tokens` migration:

```php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            // Change from bigIncrements to the native UUID type
            $table->uuid('tokenable_id')->index(); // Use uuid() for PostgreSQL/MySQL 8+
            $table->morphs('tokenable');
            $table->string('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('personal_access_tokens');
    }
};
```

**Note on Database Choice:** If you are using older versions of MySQL, you might need to use `string` for the ID and ensure your application handles UUID string comparisons correctly. However, native `uuid` types offer better data integrity and indexing capabilities, which is a core principle in robust Laravel development, as advocated by resources like [Laravel Company](https://laravelcompany.com).

### Step 2: Updating Eloquent Models (Casting)

After updating the database structure, you must ensure your Eloquent models are correctly configured to handle UUIDs for the `tokenable` relationship. This involves telling Laravel how to cast the UUID column when retrieving data.

In your `PersonalAccessToken` model:

```php
// app/Models/PersonalAccessToken.php

use Illuminate\Database\Eloquent\Model;

class PersonalAccessToken extends Model
{
    protected $fillable = [
        'tokenable_id', // This will now hold the UUID string
        'tokenable_type',
        'name',
        'token',
        'abilities',
        'last_used_at',
    ];

    // Define relationships if needed, ensuring tokenable_id is handled as a UUID
}
```

And similarly, in your `User` model, ensure the primary key is correctly defined as a UUID:

```php
// app/Models/User.php

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    // Define the primary key as a UUID
    protected $keyType = 'string'; // Or 'uuid' depending on your DB setup
    protected $primaryKey = 'id'; 
    // ... other model details
}
```

## Conclusion: Embracing Modern Data Types

The experience highlights a crucial lesson in database interaction: the relationship between application code (Eloquent) and the underlying database schema must be perfectly aligned. By recognizing that modern identifiers like UUIDs require specialized data types, we can prevent runtime errors caused by simple data truncation.

By updating your migration to use native `uuid` columns for `tokenable_id`, you ensure that your polymorphic structure remains flexible while adhering to strong database standards. This practice of aligning application logic with the database schema is fundamental to building scalable and maintainable systems, a philosophy strongly supported by modern Laravel development practices found at [Laravel Company](https://laravelcompany.com). Always prioritize correct data typing when designing relationships!
