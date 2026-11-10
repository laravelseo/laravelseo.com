---
title: "Deployment on Laravel Forge throwing faker not found Exception"
description: "Solving the Deployment Headache: Why 'Faker\\Factory' Fails on Laravel Forge Deploying a Laravel application, especially within automated environments like..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Deploying a Laravel application, especially within automated environments like Laravel Forge, often introduces subtle dependency issues that can be incredibly frustrating. As a senior developer, I’ve seen countless instances where code works perfectly on my local machine but crashes during deployment, usually due to differences in how Composer handles dependencies across development and production contexts.

The specific error you are encountering—`Class 'Faker\Factory' not found`—is a classic symptom of an incorrect dependency installation scope during the deployment process. Let’s dive into why this happens and how we can fix it permanently.

## Understanding the Root Cause: Composer and `--no-dev`

The core of your issue lies in the command you are using within your Forge deployment script:

```bash
composer install --no-interaction --no-dev --prefer-dist
```

When you use the `--no-dev` flag with `composer install`, you are instructing Composer to **exclude** all packages listed under the `require-dev` section of your `composer.json` file. In your case, this means the `fzaninotto/faker` package, which is essential for generating fake data in your seeders and tests, is deliberately omitted from the production environment installation.

While this approach is excellent for creating lean, production-ready artifacts (keeping unnecessary testing tools out of the final build), it breaks down when you subsequently run Artisan commands like `php artisan db:seed`, as these commands often interact with classes found in those development dependencies. The system can resolve the application code but fails when trying to instantiate a class that Composer decided not to install.

## The Solution: Adjusting Deployment Dependencies

The solution is to separate the concerns of building the production environment versus running deployment-specific scripts like seeding or migrations. You need a strategy that installs the core application dependencies while ensuring necessary utility packages are available for runtime tasks.

There are two primary ways to approach this, depending on your exact needs:

### Option 1: Install All Dependencies (The Quick Fix)

For simple deployments where you just need everything installed without worrying about production build size, remove the `--no-dev` flag entirely from your deployment command:

```bash
git pull origin master
composer install --no-interaction --prefer-dist
php artisan migrate --force
php artisan db:seed --class="StaticDataSeeder"
```

By removing `--no-dev`, Composer installs all dependencies, including `fzaninotto/faker`. This ensures that when the Artisan command runs and attempts to load the Seeder class, the required Faker classes are present in the autoloader.

### Option 2: Use Separate Installation Steps (The Best Practice)

A more robust approach, especially for larger projects, is to separate your dependency installation into distinct steps within Forge. This allows you to control exactly what gets installed where it is needed.

1. **Install Production Dependencies:** Run `composer install --no-dev` first to get the lean production environment.
2. **Install Development/Runtime Dependencies:** After that, run a separate command (or use environment configuration) to ensure necessary runtime tools are available for seeding and testing within the deployment context.

For Laravel applications, ensuring your project structure is clean and adheres to best practices—like defining exactly what packages belong in production versus development—is key. The principles of robust dependency management taught by the Laravel team emphasize this separation. As you build out complex features, maintaining this distinction between `require` and `require-dev` becomes even more critical for smooth CI/CD pipelines.

## Conclusion

The error `Class 'Faker\Factory' not found` is a common pitfall when deploying Laravel applications using Composer, specifically related to how development dependencies are managed during deployment. By understanding the scope of your Composer commands—specifically the exclusion of `--no-dev`—you can prevent these runtime errors. For deployments on platforms like Laravel Forge, it’s always wise to test your dependency installation steps thoroughly. By adopting a clear strategy for installing dependencies, you ensure that your application runs seamlessly from development to production, making your deployment process reliable and predictable.
