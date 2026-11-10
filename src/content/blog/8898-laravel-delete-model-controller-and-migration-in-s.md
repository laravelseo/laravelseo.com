---
title: "Laravel delete model, controller and migration in single artisan command?"
description: "Laravel Delete Model, Controller, and Migration in a Single Artisan Command? The Truth About Rollbacks As developers working within the Laravel ecosystem, we..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working within the Laravel ecosystem, we constantly seek ways to streamline our workflow. One common desire, especially when prototyping or iterating rapidly, is the wish for an "undo" button—a single Artisan command that can gracefully delete all related files (Model, Controller, Migration) created by a single command like `php artisan make:model MyModel -mcr`.

The short answer is: **No, Laravel does not provide a built-in, atomic command like `php artisan destroy:model MyModel` that automatically handles the deletion of associated Model files, Controller stubs, and Migration files simultaneously.**

However, understanding *why* this is the case and what the correct developer workflow is is just as important. This post will dive into the technical reality, explain the best practices for managing these artifacts, and show you how to achieve the desired rollback effect effectively.

---

## Why No Single `destroy` Command? The Philosophy Behind Laravel Structure

Laravel prioritizes data integrity and clear separation of concerns. When you run `make:model -mcr`, you are generating files that represent distinct architectural components:

1.  **Migrations:** These define the structure of your database. Deleting this requires reversing the database state, which is handled by migration rollback commands (`php artisan migrate:rollback`).
2.  **Models:** These are Eloquent classes defining data relationships and business logic.
3.  **Controllers:** These handle incoming HTTP requests and interact with the models.

If a single command were to delete these files, it would introduce significant risk. A simple file deletion doesn't guarantee that all associated database changes (if any) have been correctly reversed, potentially leading to a corrupted state in your application. Therefore, Laravel favors explicit, controlled commands over broad, potentially destructive actions. This philosophy aligns with the robust architecture promoted by the [Laravel Company](https://laravelcompany.com).

## The Correct Way to Rollback: Focusing on Migrations

The most critical element you need to manage when "deleting" a feature is the database structure defined in your migrations. If you want to completely remove the feature associated with `MyModel`, you must reverse the changes made to the database schema first.

### Step 1: Reverting the Database Structure

To undo the creation of the table associated with your model, use the standard migration rollback command:

```bash
php artisan migrate:rollback
```

If you ran multiple migrations in sequence, you might need to specify how many steps back you want to go. This ensures that the underlying data structure is removed, which is the foundation of any successful deletion process.

### Step 2: Deleting the Application Files

Once the database changes are safely rolled back, you can manually delete the generated files. This provides explicit control over what is being removed from your project directory:

```bash
# Manually delete the model file
rm app/Models/MyModel.php

# Manually delete the migration file
rm database/migrations/xxxx_create_my_models_table.php

# Delete any related controller files
rm app/Http/Controllers/MyModelController.php
```

While this requires manual steps, it is safer and more transparent than relying on an abstract command that attempts to manage the complex interaction between the file system and the database schema simultaneously.

## Best Practice: Using Scaffolding for Iteration

For rapid iteration where you frequently need to start over, consider using scaffolding tools or project management practices rather than relying solely on destructive commands. If you are prototyping, it is often better to keep a version history of your migrations and allow yourself to easily revert the database state without fear of accidentally deleting core application files.

## Conclusion

While the dream of a single `destroy:model` command is appealing for efficiency, adhering to Laravel's principles of explicit control leads to more stable applications. By focusing on rolling back migrations first and then managing file deletions manually, you ensure that your database integrity remains intact while achieving the desired outcome of removing a feature from your codebase. Always prioritize data safety when performing structural changes in Laravel.
