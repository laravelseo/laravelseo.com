---
title: "Laravel Controller Dependency Injection"
description: "Mastering Dependency Injection in Laravel Controllers: Where Does That $user Come From? As developers aiming for cleaner, more testable code in Laravel,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers aiming for cleaner, more testable code in Laravel, mastering Dependency Injection (DI) is a crucial step. The goal—keeping controllers lean by delegating data fetching and business logic to dedicated repositories—is excellent architectural practice. However, when implementing this pattern, it’s easy to get tripped up on *where* the actual data resides during the injection process.

This post dives into your specific confusion regarding dependency injection in Laravel controllers, explaining the flow of control and how services like repositories are injected versus the actual data they manage.

## Understanding Dependency Injection (DI) in Laravel

Dependency Injection is a core principle of Object-Oriented Programming (OOP) where objects receive their dependencies from an external source rather than creating them internally. In Laravel, this is facilitated by the Service Container, which manages how classes are instantiated and what services they require.

When you inject a `UserRepository` into your controller's constructor:

```php
public function __construct(UserRepository $user)
{
    $this->user = $user;
}
```

You are not injecting the *data* (the actual user record); you are injecting an *interface* or a *service* (the `UserRepository`) that knows *how* to fetch that data. This adheres perfectly to the Single Responsibility Principle (SRP): the controller’s job is handling HTTP requests, and the repository’s job is handling data persistence logic.

## Deconstructing the `$user` Mystery

Your confusion stems from conflating the injection of a service with the execution of a database query. The reason you don't see `$user` directly injected into the controller is because the framework separates the concerns:

1.  **Controller (Presentation Layer):** Handles the request and delegates tasks.
2.  **Repository (Data Access Layer):** Handles all interactions with the database.
3.  **Model (Data Structure Layer):** Represents the data structure itself.

In your example, the controller asks for the `UserRepository`. The repository is responsible for knowing *how* to retrieve a user based on an ID or context. It is inside this repository that the actual database call happens.

### Example Flow: From Request to Data

Let's look at how the data flow actually works, demonstrating separation of concerns:

**1. The Controller (Request Handler):**
The controller receives the request and uses the injected repository to ask for the necessary data.

```php
use App\Repositories\Frontend\Access\User\UserRepository;

class ProfileController extends Controller
{
    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function showProfile(int $userId)
    {
        // The controller delegates the fetching to the injected repository.
        $user = $this->userRepository->find($userId); 
        
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        return response()->json($user);
    }
}
```

**2. The Repository (Data Logic):**
The repository is where the actual logic for finding the user resides, interacting with Eloquent models internally.

```php
// Example UserRepository implementation
class UserRepository 
{
    protected $model;

    // Dependency Injection for the Eloquent Model itself
    public function __construct(User $userModel)
    {
        $this->model = $userModel;
    }

    public function find(int $id)
    {
        // This is where the actual database query happens.
        return $this->model->find($id); 
    }
}
```

Notice that the `UserRepository` depends on the `User` Eloquent Model. The controller only depends on the `UserRepository`. This layered approach, focusing on abstracting data access behind repositories, is a powerful pattern supported by Laravel's principles found in the official documentation on building robust applications.

## Best Practices for Advanced DI

When you are dealing with complex dependencies, consider these best practices:

1.  **Inject Interfaces:** Always inject interfaces (like `UserRepositoryInterface`) rather than concrete classes. This decouples your controller from specific implementations, making testing much easier and allowing you to swap out database systems later without touching the controller code.
2.  **Route Model Binding:** For fetching a single model by ID directly in a route definition, Laravel offers Route Model Binding. Instead of injecting a repository just to fetch one user, let Laravel handle the retrieval automatically:

    ```php
    // In your routes file
    Route::get('/user/{user}', [ProfileController::class, 'show'])
        ->middleware('auth')
        ->uses(ProfileController::class . '@show') // Laravel resolves the User model automatically
    ```

By understanding that Dependency Injection is about injecting *behavior* (services/repositories) rather than *data*, you can build controllers that are truly slim, highly decoupled, and extremely testable. Keep leveraging the power of the Laravel service container to manage these relationships efficiently!
