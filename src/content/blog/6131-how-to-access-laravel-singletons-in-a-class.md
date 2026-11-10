---
title: "How to access Laravel Singletons in a class?"
description: "How to Access Laravel Singletons in Custom Classes: Mastering Dependency Injection As developers working within the Laravel ecosystem, we heavily rely on the..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "PHP"]
featured: false
---

As developers working within the Laravel ecosystem, we heavily rely on the power of the Service Container and Dependency Injection (DI) to build scalable, testable, and maintainable applications. A core concept in this architecture is the use of singletons—objects that exist only once throughout the application lifecycle. While registering a singleton in a Service Provider is straightforward, accessing it within arbitrary custom classes can often become a stumbling block.

This post addresses the common scenario where you have registered a singleton but need to inject or retrieve it into classes that are not standard controllers or route definitions. We will explore the proper Laravel patterns for dependency management to solve this problem cleanly.

## The Problem with Direct Access

You have correctly identified the setup:

```php
// Service Provider registration
$this->app->singleton(MyClass::class);
```

And you know that standard routing or controller injection handles this seamlessly:

```php
class FooController extends Controller
{
    public function index(MyClass $myClass) // Handled by route binding
    {
        // ...
    }
}
```

The difficulty arises when you create a completely separate class, like your `Bar` example, and need to access this dependency within its constructor:

```php
class Bar {
   private $myClass;
   // ...
   public function __construct($a, $b) {
      $this->a = $a;
      $this->b = $b;
      $this->myClass = ... // How do I get the singleton here?
   }
}
```

Directly calling `$this->app(MyClass::class)` inside a constructor or method is technically possible, but it violates the principles of clean architecture and testability. We want to leverage Laravel's built-in container resolution rather than manually digging into the service locator.

## The Solution: Embracing Constructor Injection

The most robust and idiomatic way to handle dependencies in Laravel is through **Constructor Injection**. Instead of forcing your class to find its dependencies, you explicitly declare what it needs. This allows the Service Container to manage the entire dependency resolution process for you.

If `Bar` truly requires an instance of `MyClass`, it should demand that instance be provided when `Bar` is created.

### Step 1: Update the Dependent Class (`Bar`)

Modify your class to accept the dependency in its constructor.

```php
use App\Services\MyClass; // Assuming MyClass is in the services namespace

class Bar {
   private $myClass;
   private $a;
   private $b;

   // Inject the singleton dependency via the constructor
   public function __construct(MyClass $myClass, $a, $b) {
      $this->myClass = $myClass; // Now we have the resolved singleton
      $this->a = $a;
      $this->b = $b;
   }

   public function execute() {
       // Use the injected singleton
       $this->myClass->doSomething(); 
   }
}
```

### Step 2: Binding the Dependency (The Service Provider)

Ensure your Service Provider correctly binds `MyClass` as a singleton. This is where you ensure that whenever Laravel resolves `MyClass`, it gets the same instance every time.

```php
use Illuminate\Support\ServiceProvider;
use App\Services\MyClass;

class MyServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Registering as a singleton ensures only one instance exists globally.
        $this->app->singleton(MyClass::class, function ($app) {
            return new MyClass();
        });
    }

    public function boot()
    {
        // ...
    }
}
```

### Step 3: Resolving the Dependency (The Container in Action)

When you now instantiate `Bar`, Laravel's container automatically steps in. It sees that `Bar` requires an instance of `MyClass`. Because you registered `MyClass` as a singleton, the container resolves this dependency by fetching the single existing instance from the container. This is how Laravel’s IoC container shines—it handles the complex resolution behind the scenes, allowing your classes to remain focused on business logic rather than infrastructure plumbing. As detailed in the documentation on [Laravel's container resolution](https://laravelcompany.com/docs/5.2/container#resolving), this process is fundamental to how Laravel manages object lifecycles.

## Conclusion

Trying to manually access service providers or singletons using static calls (`$this->app(...)`) bypasses the safety and structure provided by Dependency Injection. By refactoring your classes like `Bar` to accept their required dependencies through the constructor, you shift the responsibility of dependency management to the framework. This approach ensures that your code remains decoupled, highly testable (you can easily mock `MyClass` when testing `Bar`), and fully leverages the power of Laravel's Service Container. Embrace DI; it is the cleanest path forward for building large-scale applications on the Laravel platform.
