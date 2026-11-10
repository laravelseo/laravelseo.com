---
title: "Laravel 5.2 Class not found but class is there with namespace"
description: "Resolving the Laravel Class Not Found Mystery: Mastering Namespaces and Autoloading As senior developers, we often encounter subtle yet frustrating errors..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As senior developers, we often encounter subtle yet frustrating errors when dealing with object-oriented programming (OOP) within frameworks like Laravel. One of the most common stumbling blocks is managing custom classes and namespaces—especially when trying to move from older conventions or complex directory structures into a modern, autoloaded system.

Today, we are diving deep into a specific issue encountered during a migration: trying to use namespaces for custom classes in Laravel 5.2, resulting in a `Class not found` error, even when the files seem to exist. This post will dissect why this happens and provide the definitive solution using PHP's autoloading principles.

## The Anatomy of the Error

The error you are facing—`FatalErrorException in additionalPCs.php line 4: Class 'App\Library\AdditionalPCs\additionalComputer' not found`—is a classic symptom of a mismatch between how PHP attempts to locate a class (via the `use` statement) and how Composer’s autoloader is configured to map file paths to namespaces.

When you use namespaces, the framework relies on PSR-4 autoloading rules defined in your `composer.json`. If a class is declared in the namespace `App\Library\AdditionalPCs\additionalComputer`, Composer expects that file to physically reside at the path `app/Library/AdditionalPCs/additionalComputer.php`.

The confusion often arises when developers place files outside the standard `app/` directory or mismanage the relative pathing within the namespace hierarchy.

## The Solution: Adhering to PSR-4 Autoloading

To fix this, we must ensure absolute consistency between your file system structure and your namespaces. For Laravel applications, all application-specific code should reside under the root `app/` directory.

Here is the correct approach to structuring your custom classes so that they are correctly recognized by the framework:

### 1. Correct File Structure

Assuming you want your namespace to be `App\Library\AdditionalPCs\additionalComputer`, your file structure must mirror this hierarchy exactly, starting from the `app/` directory:

```
app/
└── Library/
    └── AdditionalPCs/
        ├── additionalComputer.php  <-- The class definition resides here
        └── additionalPCs.php      <-- The subclass resides here
```

### 2. Correct Namespace and Class Definition

Inside these files, the namespace declaration must match the directory structure:

**`app/Library/AdditionalPCs/additionalComputer.php`**
```php
<?php
namespace App\Library\AdditionalPCs;

class additionalComputer 
{
    // Class definition goes here
}
```

**`app/Library/AdditionalPCs/additionalPCs.php`**
```php
<?php
namespace App\Library\AdditionalPCs;

class additionalPCs extends additionalComputer 
{
    public function display() {
        return $this->displayMenu();    
    }
}
```

### 3. Updating the `composer.json` (The Autoloader)

Your `composer.json` needs to map the base namespace (`App\\`) to the physical directory (`app/`). The structure you provided is largely correct, but ensuring all custom code adheres to this mapping is paramount for robust Laravel development.

```json
{
    "autoload": {
        "psr-4": {
            "App\\": "app/"
        }
    }
}
```

By setting `"App\\": "app/"`, Composer knows that any class starting with `App\` should be looked for within the `app/` directory. This setup allows the framework to automatically discover and load your classes when you use statements like `use App\Library\AdditionalPCs\additionalComputer;`. Implementing strict autoloading is a core principle of building scalable applications, much like adhering to Laravel's architectural standards found on [laravelcompany.com](https://laravelcompany.com).

## Conclusion: Consistency is Key

The error you experienced highlights a fundamental truth in modern PHP development: **consistency between your code structure and your autoloader configuration is non-negotiable.** Whether you are building a small script or a large framework, if you rely on namespaces for organization, you must meticulously ensure that the physical file paths align with the declared namespaces.

By structuring your custom classes within the `app/` directory and ensuring the namespace hierarchy mirrors that structure, you allow Composer to handle the heavy lifting of class discovery. This practice ensures that your application remains clean, maintainable, and robust, preventing these frustrating "Class not found" errors down the line. Always prioritize following established patterns when working with frameworks like Laravel.
