---
title: "Run PHPUnit rather than Pest"
description: "Run PHPUnit rather than Pest: Managing Mixed Test Suites in Modern PHP Projects As a senior developer working on large, evolving codebases, managing test..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Technical SEO", "PHP", "Errors"]
featured: false
---

As a senior developer working on large, evolving codebases, managing test infrastructure is often more complex than writing the tests themselves. When projects adopt modern testing frameworks like Pest alongside established tools like PHPUnit, conflicts inevitably arise. The scenario you describe—having a mix of legacy PHPUnit test classes and new Pest-style tests—is extremely common in migration or large-scale refactoring efforts.

The core issue lies in how these two systems manage the command-line interface (CLI) execution and expectations. Let's dive into why this happens and how developers can successfully run both ecosystems side-by-side without fighting the test runner itself.

## Understanding the Conflict: Pest vs. PHPUnit CLI

You are encountering a predictable friction point. When you execute `php vendor/bin/phpunit`, it is designed to invoke the standard PHPUnit bootstrap process. However, when Pest is installed and set up, it often hooks into the global execution path or modifies how the shell interprets test commands. The error message you receive—`Pest\Exceptions\InvalidPestCommand: Please run [./vendor/bin/pest] instead`—is Pest asserting its control over the testing environment, effectively telling you that if you want to run tests in this context, you must use the Pest CLI.

This isn't necessarily an incompatibility; it’s a clash of command expectations. Pest is designed as a high-level wrapper around PHPUnit, aiming for developer experience (DX). When you try to invoke the underlying tool directly, Pest intercepts the request and redirects you to its preferred execution method.

## Strategy 1: Coexistence Through Configuration

The solution isn't usually to force one system to completely replace the other, but rather to configure them so they can coexist harmoniously. The key lies in managing your primary configuration file, typically `phpunit.xml`.

If you are using a framework like Laravel (where testing conventions are highly standardized), ensure your test configuration remains the single source of truth for *which* tests should be executed, regardless of which runner is invoked.

You can define separate test suites within your configuration file:

```xml
<!-- phpunit.xml -->
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="https://schema.phpunit.de/9.3/phpunit.xsd"
         executionMode="covered">

    <testsuites>
        <!-- Suite for legacy PHPUnit tests -->
        <testsuite name="legacy_phpunit">
            <directory>tests/Legacy</directory>
        </testsuite>
        <!-- Suite for Pest-style tests (if they are structured under a specific directory) -->
        <testsuite name="pest_tests">
            <directory>tests/Pest</directory>
        </testsuite>
    </testsuites>

    <!-- ... other configurations -->
</phpunit>
```

By structuring your directories this way, you allow both tools to read the same configuration file but target logically separated test files. This approach keeps the flexibility of Pest while maintaining the robustness of PHPUnit for specific legacy or complex setups.

## Strategy 2: Independent Execution

Since running them in a single monolithic command is proving problematic, the most reliable developer practice is to treat them as separate execution paths. Instead of trying to execute both simultaneously via a shared script, run each suite independently based on your workflow needs.

For example, if you need to run all legacy tests:
```bash
./vendor/bin/phpunit --filter 'Legacy'
```

If you need to run the modern Pest suite:
```bash
./vendor/bin/pest
```

This method bypasses the command conflict entirely. It acknowledges that PHPUnit and Pest are tools, and they should be invoked as such, rather than assuming one must inherently control the execution of the other. This principle of modularity is fundamental to building scalable applications, much like adhering to robust architectural patterns found in Laravel development.

## Conclusion: Pragmatism Over Purity

In complex environments, developer experience often requires pragmatic compromises. While Pest offers fantastic syntactic sugar and speed for new test development, PHPUnit remains a powerful, deeply integrated standard with unparalleled flexibility, especially when dealing with intricate setup requirements or specific annotations that might be necessary for legacy codebases.

Don't let the CLI conflict halt your progress. Embrace the separation: use Pest for the bulk of your modern testing needs, and rely on native PHPUnit commands for those corner cases where its explicit control is required. By separating concerns via smart configuration and execution strategies, you ensure that both tools serve their purpose effectively.
