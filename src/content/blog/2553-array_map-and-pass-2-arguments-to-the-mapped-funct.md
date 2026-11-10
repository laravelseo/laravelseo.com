---
title: "array_map and pass 2 arguments to the mapped function - array_map(): Argument #3 should be an array"
description: "Mastering array map: Passing Multiple Arguments and Callables in Object Oriented PHP As senior developers, we often deal with inheritance and abstract..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As senior developers, we often deal with inheritance and abstract methods when building flexible systems. When you try to use powerful built-in functions like `array_map` within these contexts, unexpected errors can pop up, especially concerning how context (like `$this`) is passed to the callback function.

Today, we are diving into a specific snag: the error `array_map(): Argument #3 should be an array`, which often arises when trying to map collections using methods from an abstract class structure in PHP or Laravel applications. I will walk you through why this happens and provide robust solutions to correctly pass multiple arguments and object context to your mapped functions.

## The Root of the Problem: Understanding `array_map` Signatures

The error message is highly specific. It tells us that the third argument provided to `array_map` (the callback function) was expected to be an array, but it received something else.

Recall the signature for `array_map()`:
```php
array_map(callable $callback, array $array, array ...$arrays): array
```
The first argument is the callable, the second is the array to iterate over, and subsequent arguments are optional arrays you want to map over (if mapping multiple arrays).

In your original code structure:
```php
return array_map([$this, 'transform'], $items, $format);
```
You are attempting to pass a method reference (`[$this, 'transform']`) as the callback. While this is valid for simple functions, when dealing with object methods and complex inheritance scenarios, PHP's internal handling of how it resolves the context within `array_map` can become ambiguous or strictly enforce array input for callbacks when multiple arguments are involved, leading to the error you encountered.

## Solution 1: Using Closures for Context Preservation (The Recommended Approach)

The most idiomatic and robust way to solve this is by using an anonymous function or a closure. Closures allow you to explicitly capture the `$this` context from the class instance, ensuring that the `transform` method is called correctly within the scope of the current object.

We modify the call inside `transformCollection` to use a closure:

```php
abstract class Transformer {

    /**
     * Transform a collection of items
     *
     * @param array $items
     * @param bool $format
     * @return array
     */
    public function transformCollection(array $items, $format): array
    {
        // Solution: Use an arrow function/closure to bind the method call.
        return array_map(function ($item) use ($format)
