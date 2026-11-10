---
title: "How to update laravel 8 to 9?"
description: "The Definitive Guide: How to Seamlessly Update Laravel from Version 8 to 9 Migrating a major version of a framework like Laravel is an exciting step,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "PHP", "Errors"]
featured: false
---

Migrating a major version of a framework like Laravel is an exciting step, bringing you access to new features, performance improvements, and modern syntax. However, moving from Laravel 8 to Laravel 9 requires more than just running a single command; it demands careful planning, dependency management, and thorough testing. As a senior developer, I want to ensure this process is smooth, safe, and free of runtime errors.

This guide will walk you through the exact steps, focusing on how to manage your dependencies using Composer, ensuring your application transitions successfully.

## Understanding the Migration Process

Before diving into the code, it is crucial to understand that framework updates are rarely a simple file replacement. When moving between major versions (like Laravel 8 to 9), there are often breaking changes in the underlying PHP, framework structure, or dependency versions.

The primary tool for managing these changes is **Composer**. Composer handles the updating of all required packages and dependencies across your entire project, which is why understanding your `composer.json` file is the starting point.

### What to Check in `composer.json`

When updating Laravel, the core lines you need to focus on are those defining your required PHP version and the Laravel package itself. While I cannot see your specific file linked in the prompt, generally, these are the critical sections:

```json
{
    "name": "laravel/laravel",
    "description": "The Laravel Framework.",
    "type": "project",
    "license": "MIT",
    "require": {
        "php": "^8.0",         // This needs to be updated if you are moving PHP versions concurrently
        "laravel/framework": "^8.0", // This is the package we want to upgrade
        // ... other dependencies
    },
    "require-dev": {
        // ... development dependencies
    }
}
```

**The Key Takeaway:** The version constraint for `laravel/framework` needs to be updated from `^8.0` to `^9.0`. More importantly, ensure the `php` requirement reflects the minimum PHP version required by Laravel 9 (which is typically PHP 8.0 or newer).

## Step-by-Step Update Procedure

Follow these steps precisely to ensure a successful migration:

### Step 1: Backup Your Project
**Always start with a safety net.** Before executing any major dependency updates, create a full backup of your current project files and, critically, your database. This allows you to revert immediately if an issue arises during the process.

### Step 2: Update `composer.json`
Manually edit your `composer.json` file. Change the version constraint for Laravel framework from v8 to v9.

### Step 3: Execute the Composer Update Command
Use the standard Composer update command. This command will read your updated `composer.json`, resolve all new dependencies, and download the necessary files.

```bash
composer update --with-all-dependencies
```

The `--with-all-dependencies` flag is highly recommended as it ensures that any related packages (like Symfony components or other Laravel ecosystem tools) are also brought up to compatible versions.

### Step 4: Address Potential Breaking Changes
After the Composer update completes, you must review the official migration guides for breaking changes between Laravel 8 and 9. Pay close attention to changes in service providers, facades, and any changes related to Eloquent or routing that might have been introduced in the new version. For deeper context on framework evolution, always refer back to resources like [laravelcompany.com](https://laravelcompany.com).

### Step 5: Run Migrations and Test
Once dependencies are updated, run your database migrations to ensure your schema remains intact:

```bash
php artisan migrate
```

Finally, thoroughly test every critical feature of your application—routing, authentication, form submissions, and data retrieval—to confirm that the update was successful across the board.

## Conclusion

Updating Laravel is a manageable task when approached methodically. By treating Composer as your central manager, carefully reviewing your `composer.json`, and prioritizing backups, you can transition from Laravel 8 to 9 smoothly. Remember: testing is non-negotiable. A successful migration is one where the new features are added without breaking existing functionality. Happy coding!
