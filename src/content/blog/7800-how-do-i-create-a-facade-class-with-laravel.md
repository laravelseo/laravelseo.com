---
title: "How do I create a facade class with Laravel?"
description: "How Do I Create a Facade Class with Laravel? Decoding Static Errors in Your Facade Implementation Creating facades is one of the most powerful features..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

Creating facades is one of the most powerful features Laravel offers, providing a clean, static interface to classes that are typically managed through the Service Container. However, as you’ve discovered, implementing them correctly involves more than just extending a base class; it requires understanding how Laravel manages dependencies and static calls.

If you encountered the error `Non-static method Mynamespace\Foo::method() should not be called statically` when trying to use your facade, it signals a fundamental misunderstanding of how facades interact with the underlying model or class. Let’s break down what went wrong, review the correct implementation pattern, and ensure you leverage Laravel's power effectively.

## The Concept Behind Laravel Facades

A Laravel Facade is essentially a static proxy. It allows you to access services or models (like `DB` or `Cache`) from anywhere in your application using a static call, rather than needing to inject the dependency into every single class constructor. This pattern abstracts away the complexity of Dependency Injection (DI), making code cleaner.

When you extend `Illuminate\Support\Facades\Facade`, you are telling Laravel that this class should act as an entry point for accessing something registered in the service container. The core mechanism relies on the `getFacadeAccessor()` method, which tells the facade what key to look up in the container when resolving the facade.

## Debugging Your Specific Issue: Static vs. Instance Methods

The error you received stems from a conflict between how static methods are called and how the underlying class (`Foo`) is defined. Facades themselves are static entry points, but the actual functionality resides in an *instance* of the underlying class.

Your initial setup was very close, but the issue likely arose because you were trying to call a non-static method directly on the facade class itself: `Foo::method()`. A facade is not the model or class; it's just a gateway. The actual methods must be called on an instance obtained *through* the facade mechanism.

### The Correct Facade Implementation Pattern

To fix this, you need to ensure that when you call a method via the facade, Laravel correctly resolves and invokes the appropriate object. While the specific structure depends heavily on what `Foo` represents (a simple model or a service class), the standard approach involves ensuring the methods are accessible through the façade's resolution process.

Here is a corrected, robust example demonstrating how to set up a basic facade:

**1. The Underlying Class (`app/models/Foo.php`):**
This class should contain the actual business logic and instance-based functionality.

```php
<?php
namespace Mynamespace;

class Foo
{
    public function method()
    {
        // This is an instance method, not static.
        return "Hello from the Foo instance!";
    }
}
```

**2. The Facade Class (`app/Facades/FooFacade.php`):**
This class extends `Facade` and tells Laravel which dependency to resolve.

```php
<?php
namespace Mynamespace;

use Illuminate\Support\Facades\Facade;

class FooFacade extends Facade
{
    // This method tells the Facade what key to look up in the container.
    protected static function getFacadeAccessor()
    {
        return 'foo'; // Maps the facade to the binding registered in config/app.php
    }
}
```

**3. Registering the Binding (`app/config/app.php`):**
You must map the façade name to the actual class you want it to represent.

```php
// In app/config/app.php, within the 'aliases' array:
'aliases' => [
    // ... other aliases
    'Foo' => Mynamespace\FooFacade::class, // Map the alias to your facade class
],
```

**4. Usage:**
When you use it in a controller or service, you access it statically:

```php
use Mynamespace\FooFacade;

// Correct usage: Accessing the method via the facade instance
$result = FooFacade::method(); 
// Output: Hello from the Foo instance!
```

## Conclusion: Facades as a Gateway to DI

The confusion you experienced highlights that facades are not just simple wrappers; they are sophisticated tools built on top of Laravel’s powerful Dependency Injection system. Instead of trying to make the facade class itself static and operational, treat it as a gateway. It exists solely to provide static access to an object managed by the container.

By properly defining `getFacadeAccessor()` and ensuring your underlying classes follow standard OOP principles (having instance methods), you can successfully create facades that enhance code readability without sacrificing the benefits of proper dependency management. Always remember, for complex applications, leveraging service containers, as promoted by resources like those on [laravelcompany.com](https://laravelcompany.com), is the most scalable approach.
