---
title: "How to Migrate and seed before the full test suite in Laravel with in memory database?"
description: "How to Migrate and Seed Before the Full Test Suite in Laravel with an In Memory Database Setting up a robust testing environment is crucial for maintaining..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance"]
featured: false
---

Setting up a robust testing environment is crucial for maintaining stable Laravel applications. When dealing with database migrations and seeding, developers often run into performance bottlenecks. If you execute `Artisan::call('migrate')` and `Artisan::call('db:seed')` inside every single test method's setup hook (like `$this->setUp()`), you are needlessly recreating and populating the database thousands of times, drastically slowing down your test suite.

This post dives into the correct, efficient way to handle large-scale database initialization for Laravel tests, specifically when utilizing in-memory SQLite databases, ensuring your testing remains fast and reliable.

## The Pitfall of Redundant Setup

The common approach of placing setup commands within `$this->setUp()` is intuitive but inefficient for large projects. While this guarantees that each test runs against a fresh state (which is good), it forces the entire migration process and data seeding to execute repeatedly.

You correctly noted the issue with `setUpBeforeClass()`. Often, methods like `createApplication()` or other framework bootstrapping steps reset the context in ways that prevent class-level setup from persisting across all test methods, especially when dealing with dynamic database connections. The core challenge is separating the *application bootstrap* from the *database state initialization*.

## The Efficient Solution: Class-Level Initialization

The solution lies in leveraging PHPUnit's lifecycle hooks to perform heavy, one-time operations that only need to happen once per test class execution, rather than once per test method. We achieve this by moving the migrations and seeding outside of the standard setup loop.

For large setups, we should focus on running these commands *before* any specific test methods are invoked, ensuring the database structure is ready before testing data interactions.

### Step 1: Setting up the In-Memory Connection

Since you are using an in-memory SQLite database for speed, ensure your test setup correctly configures this environment first. This often involves setting up the connection parameters within the base test class.

```php
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

class DatabaseTest extends BaseTestCase
{
    use RefreshDatabase; // Provides transactional rollback for simpler tests

    protected function setUp(): void
    {
        parent::setUp();
        // Standard setup runs here, but we will move heavy work to the class level.
    }

    /**
     * Run database migrations and seeders once before any test methods execute.
     */
    public static function setUpBeforeClass(): void
    {
        // Ensure the application is booted enough to run Artisan commands
        $app = require __DIR__ . '/../bootstrap/app.php';

        // 1. Run Migrations
        $this->artisan('migrate');

        // 2. Run Seeders (using JSON fixtures as you mentioned)
        // This ensures the database is populated with initial data for all tests.
        $this->artisan('db:seed', ['--class' => 'DatabaseSeeder']);
    }

    // ... rest of your tests
}
```

### Step 2: Why `setUpBeforeClass` Works Here

By using the static method `setUpBeforeClass()`, you execute the migration and seeding logic only once when the test class is loaded. This effectively pre-populates the in-memory SQLite database before any individual test methods (which rely on the framework booting) begin execution.

This approach delegates the heavy lifting to the class level, keeping your per-test setup clean, fast, and focused only on setting up specific test variables rather than rebuilding the entire schema repeatedly. This aligns with best practices for optimizing test performance, especially when working with complex Eloquent relationships, as discussed in modern Laravel development patterns.

## Conclusion

Migrating and seeding before the full test suite is not about finding a single magic command; it’s about correctly utilizing PHPUnit's lifecycle hooks to separate application bootstrapping from data initialization. By moving `migrate` and `db:seed` into the static `setUpBeforeClass()` method, you achieve significant performance gains without sacrificing the isolation required for robust testing. This strategy allows you to maintain a fast, reliable test suite while adhering to strong architectural principles within your Laravel application.
