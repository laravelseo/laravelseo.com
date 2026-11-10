---
title: "How to uninstall Laravel Passport"
description: "How to Safely Uninstall Laravel Passport When Migrating to JWT I’ve reached a point in my development where I’ve decided to move away from token based..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Performance", "Errors"]
featured: false
---

I’ve reached a point in my development where I’ve decided to move away from token-based authentication provided by Laravel Passport and transition entirely to JSON Web Tokens (JWT). This is often done for simplicity, performance, or architectural preference. However, trying to use the standard command, `composer remove laravel/passport`, results in frustrating errors, as demonstrated below:

```
[Symfony\Component\Debug\Exception\FatalThrowableError]
  Class 'Laravel\Passport\Passport' not found

Removal failed, reverting ./composer.json to its original content.
```

This situation highlights a common pitfall when removing large, feature-heavy packages in Laravel projects. The issue isn't just the package files themselves; it’s the lingering references within the application's service container, configuration files, and route definitions that still point to classes that no longer exist.

As a senior developer, I know that simply deleting the vendor directory is insufficient. A complete migration requires a multi-step cleanup to ensure your application doesn't crash during runtime or generate stale errors post-removal. Here is the correct, safe procedure for completely removing Laravel Passport and preparing your application for the JWT transition.

## Why Standard Removal Fails

When you run `composer remove`, Composer correctly removes the package files from `vendor/` and updates `composer.json`. However, Laravel’s core framework still has internal mappings or service providers registered that expect Passport classes to exist. If you skip cleaning up these application-level artifacts, the system throws a fatal error when it attempts to discover routes or load services, leading to the "Class not found" exception.

## The Comprehensive Uninstallation Procedure

To ensure a clean slate, we need to manually address every layer of the Passport installation: Composer dependencies, configuration, migrations, and application code.

### Step 1: Remove Composer Dependencies

First, execute the standard command to remove the package dependency from your project’s manifest:

```bash
composer remove laravel/passport
```

This handles the primary dependency removal, but we must proceed to clean up the Laravel-specific artifacts manually.

### Step 2: Clean Up Configuration and Routes

Passport heavily relies on configuration and route definitions. You must manually inspect and remove these entries:

1.  **Configuration:** Open your `config/auth.php` file. Look for any references or sections related to Passport tokens, scopes, or grant types and remove them entirely.
2.  **Routes:** Review all files within your `routes/api.php` (or wherever you define token endpoints). Delete all routes associated with token issuance, token verification, and user management that Passport introduced.

### Step 3: Drop Migrations

Passport introduces its own database tables for managing tokens and permissions. These must be removed to avoid schema conflicts when starting fresh with a JWT setup:

1.  Locate your migration files (usually in `database/migrations`).
2.  Identify and delete the migrations related to Passport (e.g., those starting with `xxxx_create_client_tokens` or similar).
3.  Run the migration rollback command if you are unsure about which ones to delete:
    ```bash
    php artisan migrate:rollback --path=/database/migrations
    ```

### Step 4: Clear Caches and Autoloading

After removing code, you must force Laravel to re-index everything:

```bash
php artisan cache:clear
php artisan config:clear
composer dump-autoload
```

## Conclusion

Migrating from Passport to JWT is a significant architectural shift, but by following this comprehensive three-step process—removing Composer dependencies, manually cleaning configuration and routes, and dropping related migrations—you ensure a truly clean transition. This methodical approach prevents runtime errors and guarantees that your application environment is ready for the new authentication system. Remember, good structure is key; just as maintaining clean code is vital when working with frameworks like Laravel, understanding these underlying mechanics ensures robust development practices, aligning with the principles of building scalable applications on platforms like [laravelcompany.com](https://laravelcompany.com).
