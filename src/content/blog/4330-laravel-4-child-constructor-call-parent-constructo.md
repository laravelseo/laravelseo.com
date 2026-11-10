---
title: "Laravel 4 - Child constructor call parent constructor with dependency injection"
description: "Laravel 4 Dependency Injection: The Art of Constructor Chaining in Inheritance As developers working with object oriented languages like PHP and frameworks..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working with object-oriented languages like PHP and frameworks like Laravel, managing dependencies through constructor injection is a cornerstone of building maintainable and testable applications. When we introduce class inheritance—a necessity for creating reusable components like base controllers—we often encounter subtle challenges related to maintaining the integrity of the dependency chain.

This post dives into a specific scenario encountered when extending base classes in older Laravel-style applications, focusing on how to handle constructor calls efficiently when mixing parent and child dependencies.

---

## The Inheritance Dilemma in Dependency Injection

We begin with the setup you described: a base controller that relies on injected services, and derived controllers that extend it.

In your example, the `AdminController` correctly utilizes Laravel's IoC container to receive necessary services (`$auth`, `$message`, `$module`) via its constructor. This ensures that any class extending it inherits the foundational logic for accessing these dependencies.

```php
class AdminController extends BaseController {

    public function __construct(UserAuthInterface $auth, MessagesInterface $message, ModuleManagerInterface $module)
    {
        $this->auth = $auth;
        $this->user = $this->auth->adminLoggedIn(); // Example usage of injected dependency
        $this->message = $message;
        $this->module = $module;
    }
}
```

When a child class, such as `UsersController`, extends this base, it automatically inherits the methods and properties of the parent. However, when we introduce our own constructor in `UsersController` to inject its specific dependencies (e.g., `$users`), we immediately run into an issue: the parent's setup logic is bypassed unless we explicitly call `parent::__construct()`.

The core problem arises from managing the flow of dependencies: how do we ensure that the base class initializes itself correctly *before* the child class sets up its unique properties?

## The Mechanics of `parent::__construct()`

You asked if PHP offers a way to chain both constructors without explicitly calling `parent::__construct()`. The short answer is no. In standard PHP object-oriented programming, there is no inherent mechanism for automatically chaining constructor calls across inheritance boundaries; this explicit call is the language's defined mechanism for invoking the parent class's constructor.

When you define a child class constructor, it becomes responsible for initializing *all* necessary objects—both its own unique dependencies and the inherited ones. By calling `parent::__construct(...)`, you delegate the responsibility of initializing the base class properties back to the parent, ensuring that all setup logic defined in `AdminController` is executed first.

The perceived inefficiency comes from the repetition: we are forced to pass the exact same set of parent dependencies (`$auth`, `$message`, `$module`) into every child constructor, even if those dependencies are already managed by the container.

## A Refined Approach: Centralizing Dependency Passing

While explicitly listing all parent dependencies seems messy, it is actually a crucial contract in systems built on explicit dependency injection. It forces clarity about what a subclass requires to function correctly within its parent's context.

Instead of focusing on avoiding the call, let's focus on structuring how we pass these inherited dependencies cleanly. The goal isn't to eliminate `parent::__construct()`, but to make the *intent* clearer and ensure that the base class setup is honored.

Here is the refined implementation demonstrating the correct pattern:

```php
class UsersController extends AdminController {

    public function __construct(UsersManager $users, UserAuthInterface $auth, MessagesInterface $message, ModuleManagerInterface $module)
    {
        // 1. Execute the parent constructor to initialize inherited properties (user, message, module)
        parent::__construct($auth, $message, $module);

        // 2. Initialize the child's specific dependencies
        $this->users = $users;
    }

    public function home()
    {
        // Accessing parent-initialized properties is now safe
        if (!$this->user) {
            return Redirect::route('admin.login');
        }
        $messages = $this->message->getMessages(); // Accessing message via parent setup
        return View::make('users::home', compact('messages'));
    }
}
```

Notice how the logic flows: by calling `parent::__construct()`, we guarantee that `$this->user` is correctly populated by the base class's initialization, resolving the potential errors you were facing. This pattern ensures that the dependency injection mechanism remains robust, which aligns perfectly with the principles of SOLID design often promoted in modern Laravel development, ensuring your code remains flexible and testable—a core focus when building complex systems on platforms like those supported by **https://laravelcompany.com**.

## Conclusion

The quest to avoid calling `parent::__construct()` stems from a desire for cleaner, less repetitive code. However, in dependency injection scenarios involving inheritance, explicit method chaining is the most reliable and idiomatic way in PHP to maintain object state integrity across class hierarchies. By embracing this pattern, we ensure that base classes properly initialize their inherited state before specialized child classes add their unique logic. Always prioritize correctness and clear contract definition over perceived syntactic brevity when dealing with core object mechanics.
