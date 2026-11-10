---
title: "How to specify Lumen (or Laravel) version on new installation?"
description: "How to Specify Laravel Lumen Version on New Installations As developers, we often encounter scenarios where we need to work with specific versions of a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Errors"]
featured: false
---

As developers, we often encounter scenarios where we need to work with specific versions of a framework—whether it’s for compatibility reasons, dependency management, or replicating legacy environments. When working with Laravel and its lighter framework, Lumen, managing these version dependencies becomes crucial. Many newcomers run into the issue you described: attempting to install an older version, but Composer defaults to the latest release.

This guide will walk you through the correct, developer-centric method for forcing a specific Laravel Lumen version during a new project setup.

## The Problem with Default Installations

When you use simple commands like `lumen new blog` or `composer create-project laravel/lumen --prefer-dist`, these commands rely on Composer's default behavior. By default, Composer resolves to the latest stable release of the package unless you explicitly tell it otherwise. This is convenient for starting new projects but poses a significant hurdle when maintaining compatibility with older codebases or specific project requirements.

Your observation that simply running those commands doesn't work for specifying an older version (like Lumen 5.1 instead of the current 5.2) is correct because these simple calls prioritize freshness over historical accuracy. We need to leverage Composer's deeper capabilities to achieve version pinning.

## The Solution: Pinning Versions with Composer

The key to installing a specific version lies in manipulating how Composer resolves the dependency tree during the project creation process. Instead of relying on the framework’s built-in scaffolding commands, we must directly instruct Composer which version of the package to fetch.

### Method 1: Using `composer create-project` (The Recommended Approach)

The most robust way to ensure you get an exact version is to use the `composer create-project` command and explicitly specify the desired Lumen version alongside the package name.

To install a specific older version, such as Lumen 5.1, you need to target that release directly:

```bash
composer create-project laravel/lumen:5.1 my-legacy-project
```

**Explanation:**

*   `composer create-project`: This is the command used to create a new project from an existing package repository.
*   `laravel/lumen:5.1`: By appending the version number (`:5.1`) directly, you are telling Composer exactly which release artifact to download and install into the new directory structure.

This method bypasses the default installation logic that favors the latest stable release and forces the system to fetch the required historical version. This approach ensures that your project environment perfectly matches the constraints needed for compatibility, which is vital when dealing with older applications or specific ecosystem requirements, much like adhering to best practices outlined by the Laravel team at https://laravelcompany.com.

### Method 2: Using `composer require` (For Existing Projects)

If you are inside an existing project directory and need to update or lock dependencies to a specific version, you would use the `composer require` command with version constraints in your `composer.json` file. However, for *new* installations, Method 1 is superior.

To ensure stability across the entire Laravel ecosystem, understanding these dependency management tools is fundamental. As we build modern applications, precise control over versions ensures that future maintenance and deployment processes remain smooth.

## Conclusion

Specifying Lumen or Laravel versions on installation isn't achieved through simple scaffolding commands; it requires engaging directly with Composer. By utilizing the syntax within `composer create-project laravel/lumen:X.Y`, you gain granular control over your dependency stack, allowing you to precisely recreate environments using any required version. This practice is essential for development, testing, and maintaining compatibility across the vast landscape of PHP frameworks.
