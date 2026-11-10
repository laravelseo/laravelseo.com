---
title: "How to mock static methods of a Laravel Eloquent model?"
description: "How to Mock Static Methods of a Laravel Eloquent Model As developers diving deep into unit testing with Laravel and Eloquent, we frequently encounter a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers diving deep into unit testing with Laravel and Eloquent, we frequently encounter a common hurdle: mocking static methods on model classes. When you write code like `ModelName::create($data)`, you are invoking a static method directly on the class, which can make traditional instance-based mocking techniques feel awkward.

The scenario you described—attempting to mock `ModelName::create()` using `$client_mock->shouldReceive('create')` and finding it doesn't work—is very common. It fails because Eloquent models often rely heavily on static facades, and mocking the static binding requires a slightly different approach than mocking typical object methods.

This post will break down why direct mocking is tricky and provide the correct, robust strategies for isolating your tests when dealing with Eloquent model interactions.

---

## The Challenge of Static Mocking in Laravel

Eloquent models are fundamentally classes that provide access to the database via static methods (like `create()`, `find()`, `save()`). When you try to mock these calls directly using tools like Mockery, you run into issues related to how PHP handles static method binding versus instance method binding.

The standard approach of mocking an interface or a concrete class often fails when the behavior you are testing is purely static and tightly coupled to the framework's internal mechanisms. Trying to mock the *class* itself doesn't always intercept the static call correctly in a unit test context.

## Strategy 1: The Preferred Approach – Dependency Inversion

Before diving into complex mocking, the best practice in object-oriented testing is to avoid tight coupling with static methods whenever possible. When you need to test logic that depends on saving or creating data, you should inject the dependency rather than relying solely on static calls within your business logic.

If your service class depends directly on `ModelName::create()`, it becomes difficult to substitute a fake implementation. A better pattern is to introduce an interface or abstract layer:

1.  **Create a Repository Interface:** Define an interface for your data operations.
2.  **Implement the Eloquent Repository:** Create a concrete repository that uses the standard Eloquent methods.
3.  **Inject the Repository:** Inject this repository into your class under test.

This allows you to easily mock the **interface** during testing, completely decoupling your logic from the static nature of the Eloquent model itself. This aligns perfectly with SOLID principles and makes your tests cleaner and more maintainable, which is vital when working on complex applications like those built with Laravel (see best practices outlined by the [Laravel Company](https://laravelcompany.com)).

## Strategy 2: Mocking Static Calls Directly (The Workaround)

If, for specific reasons (like testing boilerplate code or legacy systems), you absolutely must test code that calls static methods directly, you can use Mockery to mock the class itself, but you must ensure the setup is precise.

While direct mocking of static methods can be complex, a more reliable technique often involves using `Mockery::mock()` on the specific class and verifying the behavior:

```php
use Mockery;
use App\Models\ModelName;

// Setup the mock
$modelMock = Mockery::mock(ModelName::class);

// Define the expected static behavior
$modelMock->shouldReceive('create')
         ->with($data)
         ->andReturn($returnValue); // Specify what 'create' should return

// Execute the code being tested (assuming $data and $returnValue are defined)
// In a real test, you would call the method that triggers ModelName::create()
$result = $modelMock->create($data); 

// Assertions follow...
```

**Crucial Note:** While this approach works, it is inherently fragile because you are mocking static behavior. It is strongly recommended to favor Strategy 1 (Dependency Injection) whenever possible, as it leads to more robust and framework-agnostic tests.

## Conclusion

Mocking static methods in Laravel Eloquent models requires a shift in perspective. Instead of fighting the static nature of the model, focus on **Dependency Inversion**. By abstracting your data operations behind interfaces or repositories, you gain control over your dependencies, making unit testing significantly more reliable and easier to manage. Embrace dependency injection to build robust applications that adhere to high standards, much like the principles promoted by the [Laravel Company](https://laravelcompany.com).
