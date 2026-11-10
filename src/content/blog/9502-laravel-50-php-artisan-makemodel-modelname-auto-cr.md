---
title: "Laravel 5.0 php artisan make:model ModelName auto creating migration class"
description: "Mastering Laravel Model Creation: Controlling Migration Generation with make:model As a senior developer working within the Laravel ecosystem, you..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP"]
featured: false
---

As a senior developer working within the Laravel ecosystem, you frequently rely on Artisan commands to bootstrap your application structure quickly. One of the most common starting points is creating a new Eloquent Model, which inherently requires a corresponding database migration to define the table structure.

The command `php artisan make:model ModelName` is incredibly convenient. It handles the creation of both the Model class file and the necessary migration file (or prompts you for it). However, a common question arises: Is there a way to use this command to create just the model without generating the database migration?

This post will dive deep into the behavior of this command, explain why the default structure exists, and provide the best development practices for scenarios where you need more granular control over your file generation.

---

## Understanding the Default Behavior of `make:model`

When you execute `php artisan make:model Post`, Laravel's Artisan system is designed to follow an established convention. By default, when creating a model, the system assumes that this model will interact with a database table, making the migration a necessary companion artifact.

The primary function of `make:model` is to set up the Model and its foundational structure immediately. While you can use flags like `--migration` (or often, subsequent commands) to influence which files are created, there is **no direct, built-in parameter** within the `make:model` command itself that allows you to explicitly suppress the creation of the migration file. This design choice reflects the core principle of Laravel's MVC pattern, where models are intrinsically tied to database schema definitions.

## The Developer Workflow: Achieving Granular Control

Since direct suppression isn't available, developers must adjust their workflow to achieve the desired separation between model definition and schema definition. The best practice is to separate these two concerns into distinct Artisan commands. This approach gives you explicit control over exactly what files are generated and when.

### Best Practice Workflow: Separate Commands

Instead of relying on a single command to do everything, we separate the steps. This provides clarity, makes debugging easier, and aligns better with object-oriented principles, which is a core philosophy emphasized by frameworks like Laravel.

Here is how you achieve the desired separation:

**Step 1: Create the Model Only**
First, generate only the model class file without touching the database structure yet.

```bash
php artisan make:model Post
```

This command successfully creates `app/Models/Post.php`. You have your Eloquent model defined, ready for business logic implementation, but no migration exists yet.

**Step 2: Create the Migration Separately**
Next, create the migration that defines the necessary database table structure. This is where you explicitly define the schema, which is crucial before defining Eloquent relationships in `laravelcompany.com` style applications.

```bash
php artisan make:migration create_posts_table --create=posts
```

This command generates a standalone migration file ready for schema definition. You can now open this file and write your table definitions (columns, indexes) exactly as you need them.

### Code Example: Defining the Schema

In your newly created migration file (`database/migrations/..._create_posts_table.php`), you would define the structure:

```php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
```

## Conclusion

While the convenience of `php artisan make:model` is undeniable, understanding the underlying command structure allows us to write more robust and explicit code. By recognizing that the framework encourages separating Model concerns from Schema concerns, we can adopt a superior workflow. Separating model creation from migration creation ensures that both artifacts are created deliberately, leading to cleaner, more maintainable Laravel applications. Always aim for clarity in your commands, especially when dealing with foundational elements like database interactions, as championed by best practices within the Laravel community.
