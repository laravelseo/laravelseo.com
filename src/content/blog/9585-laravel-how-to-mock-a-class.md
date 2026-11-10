---
title: "Laravel: how to mock a class"
description: "Laravel: How to Mock a Class – Mastering Dependency Injection Testing Are you running into confusion about mocking classes within the context of Laravel..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Are you running into confusion about mocking classes within the context of Laravel testing? You are definitely not alone. Many developers find that the official Laravel documentation often focuses on framework-specific features like facades, jobs, and events, leaving the foundational principles of object-oriented testing—like mocking dependencies—somewhere else.

This post will dive deep into the correct approach for mocking classes in PHP/Laravel, addressing your specific scenario involving dependency injection, and guiding you toward robust testing practices.

## The Philosophy: Why Interfaces Rule Mocking

Before diving into the code, we must address a fundamental principle of good object-oriented design: **Dependency Inversion**. When you want to test a class (Class A), you should not rely on it directly instantiating its dependencies (Class B). Instead, Class A should depend on an abstraction—an interface.

Your example illustrates this perfectly:

```php
class A
{
  protected $B;
  public function __construct($classB)
    {
        $this->B = $classB; // Depends directly on concrete class B
    }
}
// ... and you want to pass a mock of B here.
```

If Class A depends directly on `ClassB`, testing becomes tightly coupled. If you want to swap out `ClassB` for a mock during testing, you must ensure that this swapping is possible. The solution is to define what `ClassB` *does*, not what it *is*.

By defining an interface, we decouple the consumer (Class A) from the implementation details of the dependency:

```php
interface MyInterface
{
    public function methodToTest();
}

class B implements MyInterface
{
   public function methodToTest() { /* actual logic */ }
}

class A
{
  protected $B;
  public function __construct(MyInterface $classB) // Now depends on the interface!
    {
        $this->B = $classB;
    }
    // ... methods that use $this->B
}
```

By depending on `MyInterface`, you can easily provide any object that implements that interface—be it a real implementation or a mock. This is the cornerstone of effective unit testing, which aligns perfectly with the principles discussed when building robust applications on frameworks like Laravel, as emphasized by the principles found at [laravelcompany.com](https://laravelcompany.com).

## The Tool: Mockery for Class Mocking

Since you are working in a PHP environment (which is the foundation of Laravel), the standard tools for mocking are **PHPUnit** combined with a sophisticated mocking library like **Mockery**. While PHP has built-in mechanisms, libraries like Mockery offer much cleaner, more expressive syntax for setting expectations and defining mock behaviors.

### How to Implement the Mock

To test Class A, we will create a mock object that implements `MyInterface`. This mock will stand in for the real Class B, allowing us to control exactly what methods return when Class A calls them.

Here is how you would set up your test using PHPUnit and Mockery:

```php
use PHPUnit\Framework\TestCase;
use Mockery;

class ATest extends TestCase
{
    public function testAUsesMockedDependency()
    {
        // 1. Create the Mock object implementing the interface
        $mockB = Mockery::mock(MyInterface::class);

        // 2. Define the behavior of the mock (Expectation setting)
        // Tell the mock exactly what method should return when called.
        $mockB->shouldReceive('methodToTest')
              ->once() // Expect this method to be called exactly once
              ->andReturn('Mocked Result');

        // 3. Inject the Mock into Class A
        $a = new A($mockB);

        // 4. Test the interaction with the mock
        $result = $a->someMethodThatUsesB(); // Assume Class A has a method that calls B's method

        // Assert that the result reflects the mocked data
        $this->assertEquals('Mocked Result', $result);
    }
}
```

## Conclusion: Testing Dependencies Effectively

The confusion you experienced stems from focusing too narrowly on framework features and not enough on core PHP testing principles. When testing classes in Laravel, whether they are Service Classes, Controllers, or Eloquent Repositories, the strategy remains the same: **Dependency Injection paired with Mocking**.

Always strive to inject interfaces rather than concrete classes to maximize testability. By leveraging tools like Mockery within your PHPUnit tests, you gain complete control over your dependencies, ensuring that your tests focus purely on the logic of the class under test, making your application significantly more stable and maintainable. Mastering this approach is crucial for building enterprise-grade Laravel applications.
