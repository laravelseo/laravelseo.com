---
title: "Laravel 8 not running newly created tests, and not picking up deleted tests"
description: "Decoding Laravel Testing: Why Your Feature Tests Aren't Showing Up Starting with a new framework, especially one as robust as Laravel, often brings a steep..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Starting with a new framework, especially one as robust as Laravel, often brings a steep learning curve, and testing is a crucial part of that journey. Many developers who dive into Laravel's testing suite encounter frustrating roadblocks, particularly when setting up feature tests or managing the test files themselves.

If you've run `php artisan make:test AccountCreation` and written your feature test, only to find that running `php artisan test` ignores it, or if deleting an old test throws an error, you are not alone. This is rarely a bug in Laravel itself; rather, it usually stems from misunderstandings about how PHPUnit—Laravel's underlying testing engine—discovers and executes tests based on specific file structure conventions.

As a senior developer, I can assure you that the solution lies in adhering to established conventions. Let’s break down why this happens and how to ensure your Laravel feature tests are picked up correctly.

## The Mystery of Test Discovery in Laravel

The core confusion usually revolves around the difference between where you place your test files and what commands you use to run them. When you execute `php artisan test`, Laravel relies on PHPUnit's discovery mechanism to scan specific directories for classes that extend `Tests\TestCase`.

### Feature Tests vs. Unit Tests Structure

For feature tests (which interact with the HTTP layer, like testing routes or controllers), the convention dictates placing these files inside the `tests/Feature` directory. If you follow this structure, PHPUnit is correctly configured to scan that folder when you run the standard Artisan command.

The issue often arises if the file naming conventions are slightly off, or if the test class doesn't properly extend the base `TestCase`.

Consider your example:

```php
// tests/Feature/AccountCreation.php
namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AccountCreation extends TestCase // Must extend the base TestCase class
{
    public function test_creates_user_account_successfully()
    {
        $response = $this->post('/api/account/create');
        $response->assertStatus(201);
    }
}
```

This structure is fundamentally correct. The key is ensuring the class inherits from `Tests\TestCase`. If you are running tests against a custom setup or if you’ve modified the default configuration, ensure your `phpunit.xml` file is correctly pointing to the test directories. This adherence to structure is vital for maintaining clean, scalable code, which aligns perfectly with the principles Laravel promotes regarding application architecture and testing methodologies, as discussed on the [Laravel Company website](https://laravelcompany.com).

## Resolving Errors When Deleting Tests

The error you encountered when trying to delete a default test file suggests that either PHPUnit or your IDE/editor is having trouble resolving the file path during the deletion operation. Generally, deleting tests directly from the filesystem (outside of using Artisan commands) can sometimes interfere with the test runner's internal state if it relies on certain file markers.

**The best practice is to manage your tests through the command line.** If you need to remove a test, use methods that integrate with the testing framework rather than direct filesystem manipulation:

1.  **Use Artisan for Cleanup:** Instead of manually deleting files, look into whether Laravel provides specific commands for managing test suites.
2.  **Rely on the Runner:** Let `php artisan test` handle execution and reporting. If a test fails or needs to be removed, fixing the code within the test class is a more robust approach than deleting the file itself.

## Conclusion: Building a Solid Testing Foundation

The experience of not seeing tests or encountering deletion errors highlights that testing setup in Laravel requires discipline. It’s less about running a special command and more about respecting the established conventions of the PHPUnit framework that Laravel leverages.

Always verify your directory structure (`tests/Feature`, `tests/Unit`) and ensure all your test classes correctly extend `Tests\TestCase`. By sticking to these foundational principles, you ensure that your tests are discoverable, executable, and maintainable. Embrace these best practices early on, and you will build a much more stable application foundation.
