---
title: "Laravel 5 package development"
description: "Mastering Manual Package Development in Laravel: Recreating the Workbench Manually As developers working within the Laravel ecosystem, creating reusable..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working within the Laravel ecosystem, creating reusable packages is a fundamental skill. However, navigating the tooling landscape can sometimes present unexpected hurdles. Many legacy methods or specific tools, such as the older `workbench` setup, have been deprecated or removed, leaving developers looking for a reliable, manual alternative to establish a robust package structure from scratch.

If you are facing the challenge of setting up your first Laravel package without the automated scaffolding, fear not. We can absolutely build a professional and compliant package structure manually. This guide will walk you through exactly how to create the necessary files and directory structure to ensure your package is fully compatible with Composer and Laravel's autoloading standards.

## Why Manual Setup Matters for Laravel Packages

A well-structured package isn't just about having code; it’s about adhering to established conventions so that it seamlessly integrates into any modern PHP framework, including Laravel. When we talk about creating a package, we are essentially defining how other projects will interact with our code through Composer autoloading (PSR-4).

The core challenge lies in correctly setting up the `composer.json` file and ensuring the `src` directory is properly mapped. Skipping these steps results in packages that fail to load dependencies or cause conflicts within a Laravel application. Following best practices, much like the principles discussed on resources like [https://laravelcompany.com](https://laravelcompany.com), ensures your package is maintainable and widely usable.

## Step-by-Step Manual Package Creation

To manually recreate the necessary environment, follow these steps to establish your foundation:

### Step 1: Create the Root Directory

Start by creating the main directory for your package. Let’s assume you are creating a package named `MyAwesomePackage`.

```bash
mkdir MyAwesomePackage
cd MyAwesomePackage
```

### Step 2: Establish the Source Code Structure

The standard convention for PHP packages is to place all application logic within a `src` directory. This keeps your root directory clean and clearly separates the source code from configuration files.

```bash
mkdir src
```

Inside the `src` folder, you will place your main classes, models, or services. For example:

```bash
mkdir src/Service
touch src/Service/MyService.php
```

### Step 3: Define the Composer Configuration (`composer.json`)

This file is the heart of any PHP package. It tells Composer how to install, autoload, and manage dependencies for your package. This is where you define the namespace and the PSR-4 mapping.

Create the `composer.json` file and populate it with the following structure:

**`composer.json` Example:**

```json
{
    "name": "vendor-name/my-awesome-package",
    "description": "A description of what this package does.",
    "type": "library",
    "license": "MIT",
    "autoload": {
        "psr-4": {
            "VendorName\\MyAwesomePackage\\": "src/"
        }
    },
    "require": {
        "php": ">=7.4"
    }
}
```

**Explanation of Key Fields:**

*   **`name`**: This must follow the vendor/package naming convention (e.g., `vendor-name/package-name`).
*   **`autoload: { "psr-4": { ... } }`**: This is crucial. It maps your package's namespace (e.g., `VendorName\MyAwesomePackage`) to the physical directory where the code resides (`src/`). This allows any project using Composer to automatically find and load your classes.

### Step 4: Add Initial Code

Now, populate your service class with some basic logic.

**`src/Service/MyService.php` Example:**

```php
<?php

namespace VendorName\MyAwesomePackage\Service;

class MyService
{
    public function execute()
    {
        // Your package logic goes here
        return "Hello from the manual package!";
    }
}
```

## Conclusion: Building for Longevity

Manually creating a Laravel package structure might seem tedious initially, but it provides you with complete control over your codebase. By strictly adhering to PSR-4 standards and correctly configuring `composer.json`, you ensure that your package is robust, compatible, and easy to integrate into any modern application. Mastering this manual process gives you a deeper understanding of dependency management—a skill highly valued in the broader PHP community, much like the structured approach advocated by [https://laravelcompany.com](https://laravelcompany.com). Start building today!
