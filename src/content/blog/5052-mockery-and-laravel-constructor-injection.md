---
title: "Mockery and Laravel constructor injection"
description: "Mastering Mocking in Laravel: Constructor Injection and IoC Resolution As developers building packages or applications on the Laravel framework,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers building packages or applications on the Laravel framework, understanding how Dependency Injection (DI) interacts with testing tools like Mockery is crucial. When you rely on Laravel’s Service Container (IoC) to inject dependencies into your classes, mocking those dependencies during unit tests requires a nuanced approach. The issue you've encountered—a type error when injecting a Mock object into a constructor expecting a specific Eloquent Model—is extremely common and points directly to how the container resolves types versus what Mockery provides.

This post will dive deep into why this happens and show you the correct way to mock Eloquent models in Laravel unit tests, ensuring your tests are robust and accurately reflect real-world scenarios.

## The Conflict: Type Hinting vs. Mockery Objects

Your setup involves a `PersonRepository` constructor that strictly demands an instance of `PersonModel`:

```php
public function __construct(PersonModel $personModel)
{
    $this->personModel = $personModel;
}
```

When you use Mockery to create a mock object, even if it extends `PersonModel`, PHPUnit and the underlying container machinery see the actual type provided by Mockery (e.g., `Mockery\MockInterface` or a specific mock class) rather than the concrete `PersonModel` instance required by the constructor's type hint.

The error message you received perfectly illustrates this conflict:

> `Argument 1 passed to ...::__construct() must be an instance of Myname\Myapp\Models\PersonModel, instance of Mockery\CompositeExpectation given`

Laravel’s IoC container is designed to resolve concrete classes based on type hints. When you manually inject a mock object created by Mockery into the container via `$this->app->instance()`, the container struggles to reconcile the mocked type with the expected concrete type, leading to this runtime error during instantiation.

## The Solution: Binding and Substitution

The key to solving this lies not just in mocking the class, but in telling Laravel's IoC container *how* to substitute that dependency when it is requested. Since you are testing a repository that interacts with an Eloquent model, you should focus on binding the interface or ensuring the mock satisfies the contract expected by the system.

For complex setups involving Eloquent Models, especially in package development, relying solely on direct `instance()` calls can be brittle. A more robust approach is to leverage Service Providers to define these bindings explicitly. This aligns perfectly with Laravel's philosophy of explicit dependency management, which is a core principle behind frameworks like [Laravel](https://laravelcompany.com).

### Step 1: Define the Mock Correctly

First, ensure your mock object correctly implements all necessary methods, especially those referenced in the repository (like `find()`).

### Step 2: Using `bind` or `when` for Testing

Instead of trying to inject a raw Mockery object directly into the container for this specific test, we can use binding mechanisms available within the test scope to tell the container what class to resolve when it asks for `PersonModel`.

If you are testing the repository in isolation, you need to ensure that when the IoC resolves `PersonModel`, it receives your mock. While direct instance injection works in simple cases, a cleaner approach involves setting up the mock and then using a setup that mimics dependency resolution.

Here is how you can refactor your test structure to handle this cleanly by ensuring the container resolves the mocked object correctly:

```php
namespace Myname\Myapptests\unit;

use Mockery;
use Myname\Myapp\Models\PersonModel;
use Myname\Myapp\Repositories\PersonRepository;

class PersonRepositoryTest extends \Myname\Myapptests\TestCase
{
    /**
     * @test
     */ 
    public function it_returns_the_test_find()
    {
        // 1. Create the mock instance for the Model
        $mockPersonModel = Mockery::mock(PersonModel::class);
        
        // Define the expected behavior of the mocked method
        $mockPersonModel->shouldReceive('find')
                       ->with('var')
                       ->andReturn(null); // Or whatever result you expect

        // 2. Bind the mock instance into the container for this test scope.
        // This tells Laravel that whenever 'PersonModel' is requested, it should get $mockPersonModel.
        $this->app->instance(PersonModel::class, $mockPersonModel);

        // 3. Make the repository instance. IoC will now resolve PersonModel to the mock.
        $repo = $this->app->make(PersonRepository::class);
        
        // 4. Execute the test
        $result = $repo->testFunction('var');

        // Assertions follow...
        $this->assertNull($result);
    }
}
```

### Why This Works

By using `$this->app->instance(PersonModel::class, $mockPersonModel);`, you are explicitly telling the Laravel container: "For the duration of this test run, whenever any part of the application requests an object of type `PersonModel`, give them this specific mock object instead."

This bypasses the ambiguity that occurs when directly trying to force a Mockery artifact into a constructor expecting a concrete class. It respects the IoC contract while allowing you to inject controlled, fake dependencies for testing purposes. This practice is fundamental when unit testing classes that rely heavily on injected services, which is a core concept in building maintainable code, as emphasized by Laravel's focus on clean architecture.

## Conclusion

Mocking Eloquent Models via constructor injection requires understanding the separation between what Mockery creates and what the IoC container expects. The error arises from a type mismatch during dependency resolution. By using explicit binding methods like `$this->app->instance()` within your test setup, you instruct Laravel's container to substitute the required `PersonModel` with your controlled mock object. This ensures that your unit tests are accurate, isolated, and adhere to best practices for testing dependencies in a Laravel environment. Always strive for explicit dependency management; it leads to more predictable and robust applications.
