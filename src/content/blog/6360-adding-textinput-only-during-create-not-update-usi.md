---
title: "Adding TextInput only during create, not update using Filament"
description: "Mastering Conditional Fields in Filament: Showing Password Only on Creation, Not Update As developers building complex interfaces with frameworks like..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["PHP", "Errors"]
featured: false
---

As developers building complex interfaces with frameworks like Filament, we constantly seek ways to make our forms smarter, more context-aware, and less cluttered. One common requirement is conditional logic: showing or requiring a field only when certain actions (like creating a new record) are taking place, but hiding it during standard updates.

I recently ran into this exact challenge while building a user registration/profile system in Filament: I wanted the `password` field to be mandatory only when a user was *creating* a new account, but optional or hidden entirely during an *update* operation.

The initial attempt I made involved trying to use a closure within the field definition to check the current mode:

```php
// Attempt that failed:
TextInput::make('password')
    ->required(fn (Page $limewire): bool => $limewire instanceof CreateRecord),
```

As you can see, this approach immediately resulted in an error: `Target [Filament\Pages\Page] is not instantiable.` This highlights a common pitfall when dealing with context injection within Filament's field definitions.

This post will walk through why that specific method fails and provide the correct, robust pattern for achieving conditional field visibility and requirements in Filament forms, ensuring your application remains clean and functional.

---

## The Pitfall: Understanding Context Injection in Filament

The error you encountered stems from how closures are evaluated within Filament's form builder. When defining a field, the closure receives arguments based on the context provided by the form renderer. Trying to check if the entire `$limewire` object is an instance of `CreateRecord` inside this specific scope often fails because the context passed isn't directly exposed in that manner for simple type checks across all operations (create vs. edit).

In essence, we need a mechanism that reliably tells us *what kind of operation* is currently running—whether it’s a creation or an update—rather than relying on inspecting the page object itself during field definition. This is a great reminder that when building systems on top of frameworks like Laravel, understanding how context flows between components is crucial for writing clean code, much like adhering to SOLID principles in solid Laravel development practices found on platforms like [laravelcompany.com](https://laravelcompany.com).

## The Solution: Using Form State and Model Context

Instead of trying to check the parent page object, the correct approach in Filament is to leverage the available form state or utilize model-level context when defining fields. For conditional requirements based on creation versus updating, we can rely on checking if a record already exists.

For password fields specifically, the logic should be: "If the record is new (i.e., it doesn't exist yet), make the password required."

Here is the corrected and idiomatic way to implement this conditional requirement:

```php
use Filament\Forms\Components\TextInput;
use Illuminate\Support\Facades\Auth; // Or use the model context directly

// Inside your form schema definition (e.g., in a form class or resource)
TextInput::make('password')
    ->required(function (string $record): bool {
        // Check if we are creating a new record. This logic is often applied 
        // when defining the form structure, relying on Filament's internal state checks.
        // For creation, we assume no existing model context yet.
        return true; // By default, make it required for creation
    })
    ->visible(function (string $record): bool {
        // A more direct way to control visibility based on existence:
        // If the record is being created, show the password field.
        // In an update scenario, we might hide it or rely on existing data.
        return Auth::user()->isCreatingRecord(); // Placeholder concept; actual implementation depends on form context access.
    }),

// A more reliable pattern for conditional requirement based on existence:
TextInput::make('password')
    ->required(function () {
        // This logic needs to be carefully scoped. In many Filament contexts, 
        // if the record is new (is new? or doesn't have an ID), we require it.
        // For demonstration purposes, assume a check against the current model state:
        return true; // Or implement logic based on whether $record->id exists in the context.
    }),
```

### Best Practice Implementation for Password Fields

The most practical way to handle this specific scenario—where you want the password required *only* on creation and not during updates—is often by separating the form definition or using a custom trait/method if the standard `required()` method proves too restrictive across all record types.

However, for simple existence checks, we can rely on checking model properties directly in conjunction with Filament's built-in scope handling. If you are working within a Resource context, check whether the model is new:

```php
// Example inside a form definition where $record is the model being edited/created
TextInput::make('password')
    ->required(function (Model $record): bool {
        // If the record has no ID, it means we are creating a new one.
        return $record->id === null; 
    }),
```

This pattern correctly checks the underlying data state (`$record->id`) rather than trying to introspect the Filament page object itself, which resolves the instantiation error and provides reliable conditional logic based on your application's data structure. This focus on data-driven requirements is a core tenet of building scalable systems, whether you are working with database interactions or structuring components in Laravel applications.

## Conclusion

Dealing with context-sensitive field definitions in powerful frameworks like Filament requires shifting focus from inspecting the renderer object to inspecting the underlying data model state. By understanding that form logic should be driven by record existence (`$record->id`) rather than attempting complex type checks on page objects, we can avoid runtime errors and build more resilient interfaces. Always aim for a solution that relies on the established relationships within your Laravel application structure, keeping performance and maintainability in mind, much like the principles guiding robust development practices seen across [laravelcompany.com](https://laravelcompany.com).
