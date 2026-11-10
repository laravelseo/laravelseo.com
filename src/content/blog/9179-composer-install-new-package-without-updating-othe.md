---
title: "composer - install new package without updating other packages"
description: "Composer: Installing New Packages Without Disrupting Existing Dependencies As developers working with PHP and large ecosystems like Laravel, managing..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working with PHP and large ecosystems like Laravel, managing dependencies through Composer is a daily routine. We often encounter situations where we need to introduce a new library or package into our project, but we are wary of accidentally triggering massive updates to other, stable packages that we haven't tested yet.

You've hit on a very common point of confusion: how to add a new requirement without forcing a destructive `composer update`. Let’s break down exactly what commands do and the correct approach for isolating dependency installation.

## Understanding `install` vs. `update`

The core of this issue lies in understanding the difference between `composer install` and `composer update`. Both commands interact with your `composer.lock` file, but they serve fundamentally different purposes regarding your dependencies.

### The Role of `composer install`

When you run `composer install`, Composer reads the `composer.lock` file and installs *exactly* the versions specified there. If your `composer.json` only lists packages that are already locked (or if you just added a new requirement that isn't yet reflected in the lock file), running `install` will result in "Nothing to install or update." This is because it strictly adheres to what is already recorded, ensuring environment consistency across development, staging, and production environments.

### The Danger of `composer update`

As you correctly suspected, `composer update` is designed to resolve constraints defined in `composer.json` against the latest available versions on Packagist. When you run an `update`, Composer looks at every package listed and attempts to find the newest compatible version, which often leads to updating transitive dependencies—the packages required by your direct dependencies. This can introduce subtle breaking changes into your codebase that you haven't accounted for, making it a risky operation without thorough testing.

## The Solution: Using `composer require`

To add a new package while keeping all existing dependency versions locked and untouched, the correct tool is `composer require`. This command is specifically designed to fetch a new package and update both your `composer.json` file (adding the new requirement) *and* the `composer.lock` file (recording the installation details for that specific package).

When you use `require`, Composer focuses solely on adding the requested dependency and its immediate, necessary dependencies, leaving other existing packages untouched unless they are directly involved in resolving constraints related to the new package.

### Practical Example

Let's assume you have an existing project structure:

**Initial `composer.json`:**
```json
{
    "require": {
        "php": ">=8.1",
        "laravel/framework": "^10.0"
    }
}
```

If you want to add a new package, say `monolog/monolog`, without updating Laravel or any other existing dependencies:

**The Correct Command:**
```bash
composer require monolog/monolog
```

After running this command, Composer performs the following actions:
1. It fetches the latest stable version of `monolog/monolog`.
2. It adds `"monolog/monolog": "^3.0"` (or similar constraint) to your `require` section in `composer.json`.
3. It updates the `composer.lock` file to record the exact versions installed, including Monolog and any new dependencies it requires.

Crucially, because you did not use `update`, the existing constraints on `laravel/framework` remain exactly as they were, ensuring stability. This pattern is essential for maintaining predictable environments, which is a cornerstone of robust application development, much like adhering to best practices when building systems based on frameworks like those found on [laravelcompany.com](https://laravelcompany.com).

## Conclusion: Maintaining Dependency Integrity

The takeaway is simple: **Use `composer require` when adding new packages and `composer install` when deploying or setting up a fresh environment.** Reserve `composer update` for deliberate maintenance sessions where you intend to review potential breaking changes across your entire dependency tree. By mastering this distinction, you ensure that your project dependencies remain stable, reproducible, and free from unexpected updates.
