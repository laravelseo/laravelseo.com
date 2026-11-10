---
title: "phpstan: class implements generic interface but does not specify its types error"
description: "PHPStan: Class Implements Generic Interface but Does Not Specify Its Types Error Background I am building a utility class for a Laravel system designed to..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

## Background

I am building a utility class for a Laravel system designed to cast the `Ramsey\Uuid\Uuid` type within Eloquent models. As part of this process, I rely heavily on static analysis tools like **PHPStan** to ensure type safety across my application. However, when implementing interfaces that utilize generics—like Laravel’s `Illuminate\Contracts\Database\Eloquent\CastsAttributes`—I frequently encounter frustrating errors related to missing type specifications in the generic template parameters (`TGet` and `TSet`).

The core challenge lies in bridging the gap between how PHPStan interprets complex template annotations and how we define concrete types within our custom classes.

*   In the database, UUIDs are stored as binary data.
*   When loading or setting these values, we enforce the use of `Ramsey\Uuid\UuidInterface`.

## The Problem: Generic Mismatch in Static Analysis

The interface we are implementing, `CastsAttributes`, is defined with templates to allow flexibility regarding what data is retrieved (`TGet`) and what data is set (`TSet`):

```php
/**
 * @template TGet
 * @template TSet
 */
interface CastsAttributes
{
    // ... methods using TGet and TSet
}
```

When my class `Uuid` implements this interface, PHPStan flags an error:

> `Class Uuid implements generic interface Illuminate\Contracts\Database\Eloquent\CastsAttributes but does not specify its types: TGet, TSet`

This error occurs because while the interface *defines* that these template types exist, it doesn't force the implementing class to define what those types represent in the context of the implementation. PHPStan requires explicit type information for generics to perform accurate flow analysis and type checking, especially when working with complex structures like those found in Laravel’s Eloquent system where custom casting is common (as seen in documentation related to [laravelcompany.com](https://laravelcompany.com)).

## How to Specify the Types of an Interface in PHPStan

The solution involves correctly applying template annotations to your implementing class and ensuring that these templates are properly constrained by the types you intend to use. You need to tell PHPStan *what* `TGet` will resolve to when applied to your specific class methods.

### The Principle: Explicit Template Declaration

To resolve this issue, you must explicitly declare the template types within your implementing class, mirroring the constraints defined in the interface. This is done by adding `@template` tags directly above the class definition.

When implementing `CastsAttributes`, you need to define what `TGet` and `TSet` will be for your specific implementation. Since we know our casting methods deal with `UuidInterface`, we specify that relationship.

### Practical Implementation Example

Here is how you correct the implementation of the `Uuid` class:

```php
use Ramsey\Uuid\Uuid as RamseyUuid;
use Ramsey\Uuid\UuidInterface;

/**
 * @template TGet of UuidInterface
 * @template TSet of UuidInterface
 */
class Uuid implements CastsAttributes
{
    /**
     * Cast the given value.
     *
     * @param Model $model
     * @param string $key
     * @param string $value
     * @param array<mixed> $attributes
     * @return TGet
     */
    public function get($model, string $key, $value, array $attributes)
    {
        $uuid = RamseyUuid::fromBytes($value);
        return $uuid;
    }

    /**
     * Prepare the given value for storage.
     *
     * @param Model $model
     * @param string $key
     * @param TSet $value // Explicitly use the template type here
     * @param array<mixed> $attributes
     * @return string
     * @throws Exception
     */
    public function set($model, string $key, $value, array $attributes)
    {
        // We can now safely check the type against our specified TSet
        if (!$value instanceof UuidInterface) {
            throw new Exception('The uuid property is not an instance of Ramsey\\Uuid\\UuidInterface');
        }

        return $value->getBytes();
    }
}
```

### Explanation of the Fix

By adding `@template TGet of UuidInterface` and `@template TSet of UuidInterface` to the `Uuid` class, we explicitly inform PHPStan exactly what types these generic placeholders represent.

1.  **`@template TGet of UuidInterface`**: This constrains the type that will be returned by the `get()` method to strictly be a subtype of `UuidInterface`.
2.  **`@template TSet of UuidInterface`**: This constrains the type of the input value in the `set()` method to also be a subtype of `UuidInterface`.

This explicit declaration satisfies PHPStan's requirement for type specificity. It tells the static analyzer that when it sees `$this->get(...)`, the return type is guaranteed to be a `UuidInterface`, resolving the generic ambiguity and eliminating the error. This approach ensures high-fidelity type safety, which is crucial when working with complex data handling within frameworks like Laravel where custom Eloquent casting logic is employed.

## Conclusion

Dealing with generics in static analysis tools like PHPStan often requires moving beyond simple interface implementation; it demands explicit annotation of template types. By correctly specifying the constraints using `@template` directives on your class, you provide the necessary context for the analyzer to perform accurate type checking. This practice not only resolves immediate build errors but also enforces robust type safety across your entire codebase, ensuring that complex data transformations, such as those implemented in custom Eloquent casts, behave predictably and safely.
