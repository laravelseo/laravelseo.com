---
title: "Laravel 5 User Model not found"
description: "Solving the Laravel Eloquent Mystery: Why Your Model Disappears After Moving It Moving files around in a large application, especially when dealing with..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Moving files around in a large application, especially when dealing with namespaces and class loading, can often lead to frustrating errors. As a senior developer, I’ve seen countless instances where code seems correct but fails at runtime due to subtle issues in dependency management and autoloading.

Today, we are diving into a very specific, yet common, problem: the dreaded `Class not found` error when dealing with Eloquent Models after restructuring your application directory. You’ve moved your `User` model, updated the namespace, and configured Composer mappings, but the system still can't find it. Let’s diagnose exactly what you might have missed.

## The Anatomy of the Error: Autoloading and PSR-4

The error message `FatalErrorException in EloquentUserProvider.php line 122: Class '\App\User' not found` is fundamentally an autoloading failure, not necessarily a problem with your Eloquent logic itself.

Laravel, like most modern PHP frameworks, relies on Composer to map namespaces to physical file locations using the PSR-4 standard. When you use `use App\User;`, PHP looks at the autoloader to find the corresponding file. If the autoloader doesn't know where to look for `App\User`, it throws this fatal error.

Your setup involved moving the model to `app/Models` and updating namespaces. The key challenge lies in ensuring that your `composer.json` correctly reflects these new directory structures.

## Diagnosing the Misalignment: Composer Configuration Deep Dive

You mentioned having configured your autoloading in `composer.json`:

```json
"autoload": {
    "classmap": [
        "database",
        "app/Modules",
        "app/Models"
    ],
    "psr-4": {
        "App\\": "app/",
        "Modules\\": "app/Modules/"
    }
},
```

While this configuration looks reasonable, the issue often lies in how these mappings interact with the file system and how Laravel's default setup expects things to be organized.

When you move a core model like `User` into a dedicated `Models` directory, the standard convention is to ensure that any class within that directory uses the corresponding namespace prefix defined by the root.

### The Likely Missed Step: Namespace Consistency

The most common pitfall here is the discrepancy between where the file physically resides and how it is being referenced in the structure. If your model file is located at `app/Models/User.php`, its namespace *must* be `App\Models`.

If you simply changed the namespace inside the file to `namespace App\Models;` but didn't adjust the Composer PSR-4 mapping correctly, or if the initial composer setup was slightly off, the autoloader fails to resolve the path correctly.

## The Correct Fix: Realigning Structure and Configuration

To resolve this, we need to ensure absolute consistency between your file structure, your namespace declarations, and your Composer configuration.

### Step 1: Verify File Structure

Ensure your file path strictly adheres to the mapping you defined in `composer.json`. If you are using the convention where all application code resides under the `app` directory, then moving the model to `app/Models` is correct.

**File Path:** `app/Models/User.php`
**Namespace inside the file:** `namespace App\Models;` (This must match your configuration.)

### Step 2: Re-evaluate PSR-4 Mappings

The line `"App\\": "app/"` tells Composer that any class starting with `App\` should be found within the `app/` directory. Since our model is in `app/Models`, this mapping works perfectly, provided the file exists and is correctly named.

If you are using Laravel's default setup where models live under `app/Models` and use the `App\Models` namespace, no further changes to the `psr-4` block might be necessary if you stick to standard conventions. The error often arises when custom module autoloading (like the `"Modules\\": "app/Modules/"` entry) conflicts with core application classes.

### Best Practice: Utilizing Laravel Conventions

For maximum stability and adherence to framework best practices, especially when working within the Laravel ecosystem, it is highly recommended to stick to the default structure unless you have a very specific modular reason otherwise. For core Eloquent models, keeping them in `app/Models`
