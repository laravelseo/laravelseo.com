---
title: "Laravel 9 Sail error service \"laravel.test\" is not running container"
description: "Mastering Autoloading: Resolving PSR 4 Conflicts in Your Laravel Application When setting up or working with modern PHP frameworks like Laravel, dependency..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

When setting up or working with modern PHP frameworks like Laravel, dependency management via Composer is foundational. However, as seen in application logs, even seemingly minor inconsistencies in file structure can halt crucial processes like package discovery and autoloading, leading to errors that interrupt the development flow.

This post dives into a common pitfall—the compliance issues related to PSR-4 autoloading—and provides a comprehensive guide on how developers can diagnose and resolve these conflicts effectively, ensuring their application adheres to modern PHP standards.

---

## Understanding the Autoloading Hurdle (The PSR-4 Standard)

The log snippet we are examining points directly to an issue:
`Class App\Http\Resources\Api\v1\AddressResource located in ./app/Http/Resources/Api/V1/AddressResource.php does not comply with psr-4 autoloading standard. Skipping.`

This error signals a mismatch between how PHP (and Composer) expects namespaces to be structured and how the actual file paths are defined. PSR-4 is a widely accepted standard that dictates how classes should be mapped to namespaces, ensuring that autoloaders can reliably find any class in your project without manual configuration.

In essence, when you use tools like Composer, Laravel relies entirely on these standards to map namespaces to physical directories. If the structure deviates, the system flags it as non-compliant and skips necessary steps, halting the build process. This is a critical area that requires strict adherence for smooth operations, much like understanding the core principles behind robust frameworks found at **[laravelcompany.com](https://laravelcompany.com)**.

## Diagnosing and Fixing PSR-4 Violations

Resolving this issue involves auditing your application's directory structure against the expectations of Composer and the framework itself. Here is a step-by-step approach:

### 1. Audit Your Namespace Structure

The primary fix is ensuring that your file paths perfectly mirror the namespace declarations. For Laravel applications, classes within the `app` directory should follow strict conventions.

**Incorrect/Non-Compliant Structure (as implied by the error):**
If your file path is `./app/Http/Resources/Api/V1/AddressResource.php`, but the class definition inside the file might reference a namespace that doesn't map cleanly, the autoloader fails.

**Correct PSR-4 Compliant Structure:**
Ensure that the directory structure maps directly to the namespace hierarchy established in your `composer.json`. For resource classes, ensure they reside within their intended application namespaces.

### 2. Review Composer Configuration

If the issue persists, you need to verify your `composer.json` file. The PSR-4 mapping defines which base namespace maps to which directory prefix. While Laravel sets up defaults, custom packages or complex structures can introduce conflicts if not managed correctly.

For most standard Laravel setups, the core application classes are already mapped correctly, but any custom resource files that fall outside the expected structure must be explicitly handled or moved into appropriate namespaces (e.g., within `App\Http\Resources`).

### 3. Address Specific Resource Files

When dealing with specific resources like `AddressResource`, check if it is placed in a location that conflicts with Laravel's standard resource discovery paths. If you are creating a new API resource, ensure the path respects the established conventions for API controllers and resources as outlined in best practices promoted by **[laravelcompany.com](https://laravelcompany.com)** for building scalable applications.

## Conclusion: Building Robust Applications

The process demonstrated in the logs highlights that application stability isn't just about writing functional code; it’s about adhering to established standards. PSR-4 autoloading is the contract between your application code and the tools that manage it. By meticulously checking namespace compliance and directory structures, developers can prevent these frustrating build errors and ensure their Laravel projects run smoothly from deployment through local development. Always prioritize structured organization when working within the powerful ecosystem provided by the **[laravelcompany.com](https://laravelcompany.com)** community.
