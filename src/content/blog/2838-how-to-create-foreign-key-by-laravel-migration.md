---
title: "How to create foreign key by Laravel migration?"
description: "How to Create Foreign Keys in Laravel Migrations: Establishing Relational Integrity As developers working with relational databases, understanding how to..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP"]
featured: false
---

As developers working with relational databases, understanding how to enforce data integrity—specifically using foreign keys—is fundamental. When structuring an application with Laravel, migrations are the perfect tool for defining this structure directly in your database schema. This guide will walk you through the exact process of setting up a one-to-many relationship between two tables (like Posts and Comments) using Laravel migrations.

## Understanding Referenced Keys vs. Foreign Keys

Before diving into the code, let’s clarify the terminology:

1.  **Referenced Key (Primary Key):** This is the column in the "parent" table (`posts.id`). It uniquely identifies each record.
2.  **Foreign Key:** This is the column in the "child" table (`comments.post_id`) that points back to a specific record in the parent table. The foreign key establishes the link and enforces referential integrity across the database.

To connect your `posts` table to your `comments` table, you must ensure that the `post_id` in the `comments` table *must* correspond to an existing `id` in the `posts` table. Laravel migrations handle this mapping beautifully.

## Step-by-Step Migration Implementation

Let’s assume we have two separate migration files: one for creating the `posts` table and another for creating the `comments` table.

### 1. The Parent Table Migration (`create_posts_table`)

First, we create the table that will serve as the reference point. It is crucial that this primary key is defined correctly.

```php
// database/migrations/..._create_posts_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id(); // This automatically creates the primary key 'id'
            $table->string('title');
            $table->text('content');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
```

### 2. The Child Table Migration (`create_comments_table`) - Implementing the Foreign Key

Now, in the second migration, we define the `comments` table and establish the relationship by defining the foreign key column and applying the constraint. Modern Laravel strongly encourages using the `foreignId()` helper, which automatically sets up unsigned big integer columns and creates the necessary index for performance.

```php
// database/migrations/..._create_comments_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id(); // Primary key for comments table
            
            // This is the Foreign Key column that references the posts table
            $table->foreignId('post_id')
                  ->constrained() // Laravel automatically sets up the constraint reference
                  ->onDelete('cascade'); // Define what happens when a post is deleted

            $table->text('body');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
```

## Deep Dive: The Power of `foreignId()` and Constraints

The key to making this work seamlessly lies in the use of Eloquent’s schema-aware methods, specifically `foreignId()->constrained()`.

When you call `$table->foreignId('post_id')->constrained()`, Laravel intelligently infers:
1.  It creates a column named `post_id` (or whatever you name it).
2.  It sets the column type to match the primary key of the referenced table (usually `bigIncrements`).
3.  Most importantly, it adds the necessary `FOREIGN KEY` constraint to the database schema, ensuring that no comment can be created with a non-existent `post_id`.

This approach is far superior to manually writing raw SQL for foreign key constraints, as it keeps your migrations clean and aligned with Laravel’s conventions. Following these principles helps ensure your data structure is robust, which aligns perfectly with the design philosophy promoted by the team at [laravelcompany.com](https://laravelcompany.com).

## Conclusion

By correctly structuring your Laravel migrations to define primary keys in one table and corresponding foreign keys in another, you establish a robust relational link between your data. Always prefer using Laravel’s built-in schema helpers like `foreign
