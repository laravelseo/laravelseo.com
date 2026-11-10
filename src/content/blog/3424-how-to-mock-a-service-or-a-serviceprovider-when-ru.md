---
title: "How to mock a service (or a ServiceProvider) when running Feature tests in Laravel?"
description: "How to Mock a Service (or a ServiceProvider) when running Feature Tests in Laravel Testing complex applications built on dependency injection, like those..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Testing complex applications built on dependency injection, like those using Laravel, often presents a unique challenge: how do you isolate the code under test from its external dependencies? When your application relies on Service Providers to bind services as singletons, mocking these components during feature tests requires understanding and manipulating the Laravel Service Container.

The scenario you described—where controllers depend on services injected via Service Providers—is extremely common in larger Laravel applications. While this structure promotes good separation of concerns, it can make unit testing tricky if you are trying to test only the controller logic without executing the actual business logic within the service layer.

This post will walk you through the most effective, "Laravel way" to mock services and dependencies during feature testing, moving beyond simple mocking techniques to demonstrate how to control dependency resolution.

## The Challenge: Controlling Service Binding in Tests

When Laravel boots up for a test, it executes the Service Providers defined in your application. If your `App\Providers\Server\Users` explicitly binds `App\Services\Users` as a singleton, any controller requesting `UserService` will automatically receive that bound instance. To test your controller in isolation (e.g., testing its routing or response logic) without hitting the actual database calls within the service, you need to intercept this binding.

The confusion around using static calls like `App::bind()` stems from the fact that while traditional PHP might require explicit namespace resolution, Laravel provides specific mechanisms within the test environment to interact with the container directly.

## The Solution: Overriding Bindings via the Service Container

The core solution is to instruct the application's Service Container to use a mock implementation whenever a specific interface or concrete class is requested during the test execution. This allows you to inject your mock object directly into the controller’s constructor, bypassing the real service logic entirely.

### Step 1: Define an Interface (Best Practice)

Before mocking, always abstract your services behind interfaces. This adheres to SOLID principles and makes mocking much cleaner.

```php
// app/Services/UserServiceInterface.php
namespace App\Services;

interface UserServiceInterface
{
    public function getUsers(): array;
    public function createUser(array $data): bool;
}
```

### Step 2: Create the Mock Service

Create a dummy class that implements your interface and contains predictable, mocked behavior for testing purposes.

```php
// tests/MockServices/MockUserService.php
namespace Tests\MockServices;

use App\Services\UserServiceInterface;

class MockUserService implements UserServiceInterface
{
    public function getUsers(): array
    {
        // Return canned data instead of hitting the database
        return [
            ['id' => 1, 'name' => 'Test User'],
            ['id' => 2, 'name' => 'Mock User']
        ];
    }

    public function createUser(array $data): bool
    {
        // Simulate a successful creation without actual database interaction
        return true;
    }
}
```

### Step 3: Bind the Mock in Your Test Setup

In your feature test class, you use the `$this->app` facade (which is available within testing contexts) to override the binding for the duration of the test. This tells Laravel: "Whenever anything asks for `UserServiceInterface`, give it this mock instead."

```php
use Tests\MockServices\MockUserService;
use App\Services\UserServiceInterface;

class UserControllerTest extends TestCase
{
    /**
     * Set up the mock service before each test runs.
     */
    protected function setUp(): void
    {
        parent::setUp();

        // Override the binding for the interface to inject our mock
        $this->app->bind(UserServiceInterface::class, new MockUserService());
    }

    public function testGetUsersReturnsMockedData()
    {
        // Now, when the controller tries to resolve UserService, it gets MockUserService.
        $response = $this->json('GET', '/v1/users');

        $response->assertStatus(200);
        // Assert against the data returned by the mock, not the real database
        $response->assertJson(['ok' => true]); 
    }
}
```

## Why This Approach Works and Laravel Philosophy

This technique works because it directly manipulates the Service Container—the heart of how Laravel manages dependencies. When you bind an interface to a concrete class within a test scope, you are effectively telling the container to resolve that dependency using your mock object instead of the one registered by your original Service Provider. This keeps your feature tests fast, isolated, and deterministic.

As emphasized in Laravel documentation, understanding the Service Container is key to mastering framework development. Whether it’s binding Eloquent models or mocking external API calls, controlling the bindings allows you to write highly testable code. For deeper dives into dependency management within Laravel applications, always refer back to the official resources at [laravelcompany.com](https://laravelcompany.com).

## Conclusion

Mocking services in Laravel feature tests is less about finding a single magic function and more about understanding how the framework resolves dependencies. By leveraging `$this->app->bind()`, you gain precise control over the service resolution process, allowing you to substitute complex business logic with simple mocks. This practice ensures your tests focus purely on testing the intended flow of your controller without the overhead or side effects of actual service execution.
