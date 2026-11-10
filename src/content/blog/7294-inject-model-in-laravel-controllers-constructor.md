---
title: "inject model in laravel controllers constructor"
description: "Injecting Models into Laravel Controllers: A Deep Dive into Dependency Injection As a senior developer working with the Laravel ecosystem, one of the most..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a senior developer working with the Laravel ecosystem, one of the most fundamental architectural decisions we make is how we handle dependencies. When building robust applications, the concept of Dependency Injection (DI) is central to achieving clean, maintainable, and testable code. This post addresses your question about injecting Eloquent Models directly into controller constructors and explores the best practices for avoiding repetition in your application logic.

## The Case for Constructor Injection

You asked if injecting a model class into a controller's constructor is a good practice:

```php
public function __construct(Rule $rules)
{
    $this->rules = $rules;
}
```

From a technical standpoint, **yes, using constructor injection is an excellent practice.** It adheres to the Dependency Inversion Principle (DIP) and promotes loose coupling. Instead of letting the controller instantiate its dependencies internally (tight coupling), you are explicitly declaring what the class needs to function. This makes your code easier to understand, test, and maintain.

However, simply injecting a raw Eloquent Model into every controller constructor is often an anti-pattern if you aim to avoid repetition. While technically possible, it leads to controllers that become bloated with business logic—a violation of the Single Responsibility Principle (SRP).

## The Pitfall: Overloading Controllers with Logic

If you inject a model directly and then use it repeatedly within the controller methods to fetch data or perform complex operations specific to that route, you run into problems:

1.  **Tight Coupling:** The controller becomes tightly coupled to the Eloquent model structure.
2.  **Testability Issues:** Testing the controller requires mocking complex database interactions, making unit tests cumbersome.
3.  **Violation of SRP:** The controller’s job should be managing HTTP requests and responses, not orchestrating complex business rules involving multiple models.

## The Best Approach: Introducing Service Layers

To solve the problem of repetition while maintaining clean controllers, the best practice is to introduce an abstraction layer—specifically, **Service Classes** or **Repository Patterns**. Instead of injecting the raw Eloquent Model into the controller, you inject a service that *knows how* to interact with that model.

This pattern shifts the responsibility for data retrieval and complex business logic out of the controller and into dedicated classes, adhering closely to Laravel's philosophy of separating concerns.

### How to Implement the Service Pattern

1.  **Create a Service Class:** This class will handle all the necessary interactions with your Eloquent Models.
2.  **Inject the Service:** The controller only needs to know about the service interface, not the underlying database mechanics.

#### Example Implementation:

Let's assume you are fetching a user and need some pre-processing logic.

**1. The Repository/Service Layer (e.g., `UserController` or `UserRepository`):**

```php
// app/Services/UserRepository.php
namespace App\Services;

use App\Models\User;

class UserRepository
{
    public function findAndPrepareUser(int $userId)
    {
        $user = User::with('posts')->findOrFail($userId);
        // Add complex business logic here (e.g., calculating derived fields)
        return $user;
    }
}
```

**2. Injecting the Service into the Controller:**

Now, your controller becomes very thin and highly testable:

```php
// app/Http/Controllers/UserController.php
namespace App\Http\Controllers;

use App\Services\UserRepository; // Import the service
use Illuminate\Http\Request;

class UserController extends Controller
{
    protected $userRepository;

    // Inject the dependency via the constructor
    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function show(int $id)
    {
        // The controller delegates the heavy lifting to the service layer
        $user = $this->userRepository->findAndPrepareUser($id);

        return response()->json($user);
    }
}
```

## Conclusion

Injecting dependencies via the constructor is a foundational best practice in Laravel development. However, to effectively avoid repetition and maintain high architectural quality, **do not inject Eloquent Models directly into controllers.** Instead, leverage dedicated Service or Repository classes. By doing this, you ensure your controllers remain focused on handling HTTP flow, while your services manage the complex data interactions, leading to code that is significantly cleaner, more scalable, and easier to test—exactly what a senior developer strives for when building robust Laravel applications, as championed by resources like https://laravelcompany.com.
