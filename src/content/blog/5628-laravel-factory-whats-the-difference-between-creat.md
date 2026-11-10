---
title: "Laravel factory - What's the difference between create and make"
description: "Laravel Factory: Demystifying create() vs. make() As developers working with Laravel, we frequently rely on the powerful Eloquent Factory system to..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "PHP"]
featured: false
---

As developers working with Laravel, we frequently rely on the powerful Eloquent Factory system to manage test data, seed databases, and quickly generate complex object structures. When defining factories, two methods often surface: `create()` and `make()`. While both originate from the same factory definition, they serve fundamentally different purposes in the context of database interaction. Understanding this distinction is crucial for writing efficient and correct code.

Let's break down the differences between `$factory->create()` and `$factory->make()`, analyze your specific usage, and explore why these helpers might not be explicitly listed in the main documentation index.

---

## The Power of Factory Helpers

Laravel’s Factories are designed to simplify data generation. When you define a factory (e.g., `App\Models\UserFactory`), you define the blueprint for creating model instances. The difference between the methods lies entirely in *when* and *how* that model interacts with your database.

### 1. The `create()` Method: Database Interaction

The `create()` method is the most common way to use a factory. When you call `$factory->create()`, Laravel performs two actions simultaneously:

1.  It uses the defined factory state (attributes) to instantiate the model.
2.  It immediately calls the Eloquent `save()` method on that new instance, persisting the data into the database.

**Use Case:** This is ideal when you need to populate your database with actual records—whether for seeding, testing scenarios where relationships must be established, or creating a real user during an authentication flow.

```php
// Example using create()
$user = factory('App\Models\User')->create([
    'name' => 'Alice',
    'email' => 'alice@example.com',
]);

// $user is now a fully persisted Eloquent Model in the database.
```

### 2. The `make()` Method: In-Memory Object Creation

The `make()` method serves a purely in-memory purpose. When you call `$factory->make()`, Laravel instantiates the model based on the factory definition but **does not** interact with the database. It simply returns a fresh Eloquent model object populated with the generated data, but it remains unsaved.

**Use Case:** This is perfect for scenarios where you need to build complex objects in memory without hitting the database, such as generating mock objects for PHPUnit tests where database interaction is undesirable, or when preparing data structures before a final save operation.

```php
// Example using make()
$thread = factory('App\Models\Thread')->make([
    'title' => 'New Thread',
    'content' => 'This is the content.'
]);

// $thread is an Eloquent Model object, but it has not been saved to the database yet.
// To save it later, you would call $thread->save();
```

---

## Analyzing Your Code Snippet

Let's look at the code you provided:

```php
$this->actingAs(factory('App\User')->create()); // Creates and saves a User record.
$thread = factory('App\Thread')->make();         // Creates an unsaved Thread model object in memory.
```

In this context, the distinction is clear:

1.  The `actingAs()` method requires an actual authenticated user from the database, which necessitates using **`create()`**.
2.  Creating a `$thread` object for further manipulation (perhaps assigning it to a collection or mocking its properties) is best handled by **`make()`**, as you are not immediately persisting it to the database.

## Why Isn't This Listed in Helpers?

You asked why `create()` and `make()` aren't explicitly listed alongside other factory helpers in the main documentation index. The reason lies in Laravel’s design philosophy:

1.  **Delegation to Eloquent:** The Factory system is designed to delegate primary persistence operations to the underlying Eloquent model methods (`create`, `save`, `delete`). By using these methods, we adhere to standard Eloquent conventions rather than creating entirely new, proprietary factory helpers.
2.  **Contextual Use:** These methods are context-dependent. Whether you need to persist data (use `create()`) or just generate an object (use `make()`) depends entirely on the immediate goal of your code. Listing them generically might obscure the specific intent behind their use.

For deeper insights into how Eloquent models interact with factories, understanding the framework’s architecture is key. For more advanced patterns involving data manipulation and persistence within Laravel projects, exploring resources like those found on [laravelcompany.com](https://laravelcompany.com) can provide valuable context on object-relational mapping principles that underpin these helpers.

## Conclusion

In summary, choose your factory helper based on your intent: use **`create()`** when you intend to persist a record to the database, and use **`make()`** when you only need an in-memory model instance for testing or object construction. Mastering this subtle difference will make your data seeding and testing significantly cleaner and more efficient.
