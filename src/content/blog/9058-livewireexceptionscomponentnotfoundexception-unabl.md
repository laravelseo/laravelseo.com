---
title: "Livewire\\Exceptions\\ComponentNotFoundException - Unable to find component: [Livewire.Tasks-Board]"
description: "Decoding the Error: Solving Livewire\\Exceptions\\ComponentNotFoundException for Livewire Components As developers building dynamic applications with Laravel..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers building dynamic applications with Laravel and Livewire, we often encounter frustrating errors. One of the most common roadblocks is the `Livewire\Exceptions\ComponentNotFoundException`. This error signals that Livewire attempted to render a component based on a specified name but could not locate the corresponding class or view definition.

This post will dissect why you are seeing this exception when trying to use your newly created component, specifically focusing on the naming conventions and rendering syntax issues highlighted in your examples. We will walk through the correct implementation steps to ensure seamless integration of your Livewire components.

## Understanding the Root Cause

The `ComponentNotFoundException` is fundamentally a lookup failure. When you use the directive `@livewire('ComponentName')`, Livewire scans its registered components to find a class matching that name (usually mapped to a file structure). If the mapping is incorrect, or if the component hasn't been fully discovered by the framework, this exception is thrown.

In your specific case, the mismatch seems to stem from inconsistencies between how the component is named in PHP (`TasksBoard`) and how it is referenced in the Blade template (e.g., `Livewire.Tasks-Board`).

Let’s examine your setup:

**Component Class:**
```php
namespace App\Http\Livewire;

use Livewire\Component;

class TasksBoard extends Component // Class name is TasksBoard
{
    // ... component logic
}
```

When you use `php artisan make:livewire TasksBoard`, Laravel defaults the file structure to `app/Http/Livewire/TasksBoard.php`. Livewire typically expects components to be referenced using their fully qualified class name or a specific convention.

## Troubleshooting Your Attempts

Your attempts reveal several common pitfalls in Livewire referencing:

1.  **Attempt 3:** `@livewire('Livewire.Tasks-Board', ...)` – Using hyphens (`-`) is generally discouraged in PHP/Laravel naming conventions for classes and components, often leading to lookup failures unless explicitly configured otherwise.
2.  **Attempt 4 & 5:** `@livewire('Livewire.TasksBoard')` vs `@livewire('Livewire.Tasks-Board')` – The key is ensuring the name passed inside the quotes exactly matches how Livewire expects to resolve the component file path.

## The Correct Implementation Strategy

The most reliable way to reference a Livewire component is by using its fully qualified class name, often prefixed with `livewire.` if you are referencing it from a view context where that namespace mapping is necessary.

### Step 1: Refine the Component Class (Best Practice)

Ensure your component adheres strictly to PSR standards and Laravel conventions. The structure you provided is mostly correct, but we will ensure consistency.

**`app/Http/Livewire/TasksBoard.php`:**
```php
<?php

namespace App\Http\Livewire;

use Livewire\Component;

class TasksBoard extends Component
{
    public $tasks;

    public function mount()
    {
        // Ensure this logic is sound based on your actual data retrieval
        $this->tasks = auth()->user()->statuses()->with('tasks')->get();
    }

    public function render()
    {
        return view('livewire.tasks-board');
    }
}
```

### Step 2: Correctly Calling the Component in Blade

When calling a component from a Blade file, especially when it resides in the `Livewire` namespace, you typically reference it directly by its class name without excessive prefixes, letting Livewire handle the resolution.

**Blade File Example:**
Instead of trying to force a full path like `Livewire.TasksBoard`, simplify the call to just the component identifier:

```blade
@extends('layouts.app')

@section('content')

<div class="md:mx-4 relative overflow-hidden">
    <main class="h-full flex flex-col overflow-auto">
        {{-- Correct way to reference the component --}}
        @livewire('tasks-board') 
    </main>
</div>

@endsection
```

**Why this works:** Livewire is designed to automatically resolve components based on the class structure. When you use `@livewire('tasks-board')`, it looks for a class named `TasksBoard` within the appropriate namespace, which is exactly what Laravel/Livewire expects. This aligns with the principles of clean architecture promoted by frameworks like those found in the Laravel ecosystem.

## Conclusion

The `ComponentNotFoundException` is rarely about missing code; it's almost always about incorrect referencing conventions. By adhering to standard naming practices—using camelCase for classes and ensuring your Blade calls match Livewire’s expected component resolution—you can eliminate this error immediately. Always prioritize clarity and adherence to the framework's established patterns, as demonstrated by the robust structure provided by platforms like Laravel. Happy coding!
