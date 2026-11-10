---
title: "Argument passed to function must be callable, array given"
description: "Decoding the Error: Why Collection::each() Fails When Calling Object Methods As senior developers, we often encounter frustrating runtime errors that seem..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As senior developers, we often encounter frustrating runtime errors that seem arbitrary. One common scenario involves trying to iterate over a collection and execute custom logic on each element, particularly when dealing with object methods within an application framework like Laravel. The specific issue you've encountered—where checking `is_callable()` passes but the actual execution throws a type error from `Collection::each()`—is a classic example of the subtle differences between PHP's runtime reflection capabilities and how specific library methods are designed to handle iteration arguments.

Let’s dive deep into why this happens, explore the correct idiomatic solutions, and ensure your code adheres to best practices when working with Laravel Collections.

## The Mystery Behind the Callable Check Failure

You are attempting to use an array containing an object reference and a method name (`[$this, 'doSomethingElse']`) as the callback argument for `Collection::each()`. While checking `is_callable()` returns `true` (because PHP recognizes that this structure represents an accessible method), the `Collection::each()` method imposes stricter type constraints on what it expects in that position.

The error message you received—"Argument 1 passed to Illuminate\Support\Collection::each() must be callable, array given"—tells us exactly what the method *expects*. It expects a standard function, an array of values, or an object implementing `IteratorAggregate`. It does not expect an array containing a mixed reference and string intended for deferred execution in this context.

This discrepancy highlights a fundamental difference between general PHP reflection (which checks if something *can* be called) and framework-specific API design (which checks if the argument fits its defined contract for iteration). When dealing with object methods, we need to provide the actual executable logic directly, not just the reference to the method itself.

## Idiomatic Solutions for Iteration

Instead of trying to force `Collection::each()` to handle complex object referencing arrays, the most robust and readable solutions involve using standard PHP closures or leveraging the Collection's built-in mapping functions.

### Solution 1: The Closure Approach (Recommended)

The cleanest way to execute custom logic on each item in a collection is by passing an anonymous function (closure). This forces you to define exactly what action should occur for every element, making the intent explicit and avoiding ambiguity about object references.

Here is how you would refactor your method to achieve the desired result:

```php
protected function doSomethingElse($element)
{
    $element->bar();
}

public function processDiscoveries()
{
    $discoveries = $this->findSomething();

    // Use a closure to execute the desired method on each item
    $discoveries->each(function ($discovery) {
        // The $discovery variable now holds the actual object instance
        $discovery->doSomethingElse(); 
    });
}
```

This approach is superior because it directly addresses the expectation of `Collection::each()`, providing a simple, executable function for each iteration. This aligns perfectly with the philosophy behind building robust systems, much like how relationships are handled in Eloquent models when interacting with data from the database via Laravel.

### Solution 2: Using `map()` for Transformation

If your goal is not just to execute side effects but to transform the collection into a new collection based on the operations performed, using `map()` is often more powerful and functional. It cleanly separates the iteration logic from the transformation logic.

```php
public function processDiscoveriesMapped()
{
    $discoveries = $this->findSomething();

    // Use map to return a new collection where each element has been modified
    $transformedDiscoveries = $discoveries->map(function ($discovery) {
        $discovery->doSomethingElse(); // Execute the method
        return $discovery; // Return the item for mapping continuity
    });

    // $transformedDiscoveries now holds the results
}
```

## Conclusion

The core takeaway here is that while PHP is flexible, framework methods like those provided by Laravel's `Illuminate\Support\Collection` are designed with specific contracts. When dealing with iteration and callbacks, it is best practice to adhere to those contracts by passing executable logic (closures) rather than attempting to pass complex object references as an array structure. By adopting closure-based iteration, you write code that is not only functional but also immediately understandable and robust against subtle type errors. Embrace these patterns, and your Laravel applications will be cleaner and more maintainable.
