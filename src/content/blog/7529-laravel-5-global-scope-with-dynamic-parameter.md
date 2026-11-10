---
title: "Laravel 5 Global Scope with Dynamic Parameter"
description: "Mastering Dynamic Constraints: Solving Global Scope Issues with Parameter Passing in Laravel As senior developers working with Eloquent, we constantly seek..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP", "Errors"]
featured: false
---

As senior developers working with Eloquent, we constantly seek ways to make our database interactions more flexible and reusable. One powerful feature of Laravel is Global Scopes, which allow you to define query constraints that are automatically applied to models. However, when we introduce dynamic criteria—such as filtering by a specific `manager_id`—we often run into hurdles regarding context and static methods.

This post dives deep into the common challenge of applying dynamic parameters within global scopes and provides a robust, idiomatic solution for achieving exactly what you described: dynamically scoping queries based on related model data.

## The Challenge: Dynamic Parameters in Static Global Scopes

The issue you encountered stems from how static methods operate in PHP and Eloquent. When you define a global scope using `static::addGlobalScope(new ManagerScope)`, the application calls this method without an instance context. Inside your scope class, attempting to access `$this->id` fails because there is no object instance (`$this`) representing the model being queried; it only exists within an Eloquent model instance.

Your goal is to execute a query like `where('manager', $model->id)`, but you need that `$model->id` value available inside the scope definition. Trying to inject this dynamic value directly into the static `boot()` method doesn't work because static methods cannot access instance properties of the model being queried.

## The Solution: Passing Context via Scope Instantiation

The correct approach is not to try and force data into a static method, but rather to pass the necessary context *when you create* or *apply* the scope. We achieve this by making your scope class accept the required dynamic parameter in its constructor. This adheres to object-oriented principles and keeps the logic clean and testable.

### Step 1: Modify the Global Scope Class

Instead of relying on static methods to inject data, we design our scope to be instantiated with the necessary ID.

Let's define a `ManagerScope` that expects the manager's ID upon creation:

```php
// app/Scopes/ManagerScope.php

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class ManagerScope implements Scope
{
    protected $managerId;

    /**
     * Create a new scope instance.
     *
     * @param  int  $managerId
     */
    public function __construct(int $managerId)
    {
        $this->managerId = $managerId;
    }

    /**
     * Apply the scope to a given Eloquent query builder.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $builder
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @return void
     */
    public function apply(Builder $builder, Model $model)
    {
        // Now we can safely use the injected property to constrain the query.
        $builder->where('manager_id', $this->managerId); 
    }
}
```

### Step 2: Applying the Dynamic Scope

Now, when you apply this scope in your scope definition (e.g., within a model's `boot` method or directly on a query), you instantiate it with the required ID.

If you are defining the global scope registration in the Manager Model, you can no longer use static methods to pass dynamic data here. Instead, you apply the scope when querying:

```php
// Example usage in a controller or repository:

use App\Models\Post;
use App\Models\Manager;

$manager = Manager::find(10); // Assume this is the manager we are filtering by

$posts = Post::where('manager_id', $manager->id)->get(); 
// Or, if you want to use the scope explicitly:
$posts = Post::withScope(new \App\Scopes\ManagerScope($manager->id))->get();
```

Notice how the dynamic parameter (`$manager->id`) is passed directly when instantiating `ManagerScope`. This keeps the scope class focused on *what* to filter by, rather than managing the context of *how* to find that data. This pattern aligns perfectly with best practices for building complex relationships and constraints in Eloquent, as promoted by resources like https://laravelcompany.com.

## Conclusion

The frustration you experienced is a common stumbling block when moving from simple static scope definitions to dynamic ones. By shifting the responsibility of providing context from the static method itself to the scope’s constructor, we unlock flexibility. This approach allows your global scopes to remain reusable while enabling the calling code to inject specific, dynamic parameters, resulting in cleaner, more maintainable, and highly adaptable Eloquent models. Embrace dependency injection principles even within your scoping logic for superior application design.
