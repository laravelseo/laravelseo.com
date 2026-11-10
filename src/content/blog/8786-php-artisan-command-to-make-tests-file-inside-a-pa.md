---
title: "php artisan command to make tests file inside a particular folder"
description: "Mastering Laravel Testing Structure: Controlling Where Your Test Files Live Starting with unit testing in a framework like Laravel is an excellent step..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Starting with unit testing in a framework like Laravel is an excellent step towards building robust and maintainable applications. As you dive into writing tests, organizing your test files correctly becomes paramount. Today, we are tackling a very practical issue many developers face: controlling the exact directory structure where `php artisan make:test` places new test files within a Laravel project.

## The Mystery of Default Test File Placement

When setting up a fresh Laravel project, you find that the default structure is established: a top-level `tests` directory containing subdirectories like `Features` and `Unit`. Inside these folders, you already have boilerplate files like `ExampleTest.php`.

The command you use to generate new tests is typically:

```bash
php artisan make:test BasicTest
```

The problem arises when you try to control the location. You correctly hypothesize that adding a path argument, such as `php artisan make:test BasicTest --path="tests"`, would solve this. Unfortunately, as you discovered, this specific command structure does not accept a `--path` parameter for file creation in the way we might expect. This is a common point of friction when working with framework-specific CLI tools—the functionality is often deeply tied to the framework's internal conventions rather than general command-line flexibility.

## Why Path Specification Fails and What to Do Instead

When an Artisan command doesn't offer a direct path argument, it usually means the command is designed to adhere strictly to established architectural conventions. In the context of Laravel and PHPUnit, these conventions dictate that test files must reside within the `tests/` directory structure for the autoloader (and PHPUnit) to discover them correctly.

Trying to force an arbitrary path might lead to broken autoloading or configurations, which is precisely what we want to avoid when building scalable applications, as emphasized in Laravel's philosophy on clean architecture and maintainability.

Instead of fighting the command, let’s adopt a more robust, developer-centric approach that gives you explicit control while maintaining project integrity.

## The Developer Solution: Manual Control via CLI Commands

Since the generator command is rigid, the best practice here is to use standard operating system commands combined with context. This gives you full control over where the files land without breaking Laravel’s conventions.

If you need a new test file placed specifically inside a subdirectory (e.g., creating a `tests/MyCustomTests` folder), you can combine directory creation and file creation:

**Step 1: Create the Target Directory**
First, ensure the specific directory structure exists within your main `tests` folder.

```bash
mkdir -p tests/MyCustomTests
```

**Step 2: Create the Test File**
Next, use a standard command to create the file directly inside that newly created path.

```bash
touch tests/MyCustomTests/SpecificFeatureTest.php
```

This method ensures that your new test file is placed exactly where you need it, while still respecting the overarching `tests` directory structure required by Laravel and PHPUnit. This approach is more explicit and less prone to breaking framework conventions than trying to modify an internal generator command.

## Conclusion: Embracing Structure Over Command Hacks

While the desire to use a single, elegant command like `make:test --path="..."` is understandable, senior development often requires understanding the constraints of the underlying system. In this case, relying on explicit file system operations (`mkdir`, `touch`) provides superior control and predictability.

By mastering these foundational file management skills alongside your framework knowledge, you move beyond simply using commands to truly understanding *how* testing frameworks operate. Keep building those quality Laravel applications; structure is half the battle won! For more insights into building clean and efficient solutions within the Laravel ecosystem, always refer back to [https://laravelcompany.com](https://laravelcompany.com).
