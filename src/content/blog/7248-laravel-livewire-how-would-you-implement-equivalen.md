---
title: "Laravel livewire: How would you implement equivalent to Vue's v-if v-else"
description: "Laravel Livewire: Implementing Vue's v if/v else Equivalents As developers transitioning between front end frameworks like Vue and server side reactive..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "HTML", "PHP"]
featured: false
---

As developers transitioning between front-end frameworks like Vue and server-side reactive solutions like Laravel Livewire, a common point of friction is understanding how to achieve conditional DOM rendering. Vue’s directives like `v-if` and `v-else` provide a declarative way to manage component visibility based on state. When moving to Livewire, we need to adapt this concept to Livewire's server-side rendering paradigm.

This post will walk through exactly how you implement the equivalent of Vue's conditional rendering in a Livewire component, addressing the exact scenario you presented.

## The Core Difference: State vs. Structure

The fundamental difference lies in *where* the logic resides. In Vue, `v-if` controls the **structure** of the DOM based on reactive state. In Livewire, the server (PHP) determines the final HTML output for a component, and Livewire handles the differential updates to the client.

Your attempt using `wire:model="!active"` is focused on *data binding*—telling Livewire how to synchronize a single variable between the server and the client. However, it does not control the actual presence or absence of an entire HTML block in the template, which is the job of `v-if`.

To achieve conditional rendering in Livewire, we must leverage standard PHP logic within the Blade view file to conditionally output the necessary HTML elements based on the properties managed by the component.

## The Livewire Solution: Leveraging Blade Directives

The most direct and idiomatic way to replicate `v-if`/`v-else` in a Livewire context is by using standard Blade `@if` directives directly within your component's view file. Since Livewire components re-render on every interaction, the PHP logic running on the server dictates which HTML gets sent to the browser.

Let's look at how we correct your example:

### 1. The Component Class (PHP)

First, ensure your component manages its state correctly. This part remains standard PHP class logic.

```php
// app/Http/Livewire/Sample.php

namespace App\Http\Livewire;

use Livewire\Component;

class Sample extends Component
{
    public bool $active = true; // State variable

    public function toggle()
    {
        $this->active = !$this->active;
    }

    public function render()
    {
        return view('livewire.sample');
    }
}
```

### 2. The Blade View (HTML/Blade)

In your `sample.blade.php`, we use the `$active` property to conditionally output the HTML structure. This ensures that when a method is called, the entire block of conditional content is re-evaluated on the server before being sent to the client.

```html
{{-- resources/views/livewire/sample.blade.php --}}

<div>
    {{-- Equivalent to v-if="active" --}}
    @if ($active)
        <div>Active things</div>
    @else
        {{-- Equivalent to v-else --}}
        <div>Inactive things</div>
    @endif

    <button wire:click="toggle">Toggle</button>
</div>
```

### Why This Works Better

By using `@if`, you are instructing the server (PHP) to decide which block of HTML to generate. When you click the button, Livewire sends an AJAX request to the server. The PHP logic executes, `$this->active` flips its value, and the entire `render()` method runs again, generating the correct conditional structure before sending the updated HTML back to the client.

This pattern is highly effective for controlling structural elements in Livewire components. For more complex scenarios involving component-level rendering or deeply nested structures, you can also conditionally render entire sub-components using the same `@if` logic. This approach aligns perfectly with the philosophy of building robust applications with Laravel and Livewire, especially when managing complex state interactions, as advocated by the Laravel team.

## Conclusion

While Vue offers a highly intuitive syntax via directives, Livewire requires us to map that declarative concept onto its server-side rendering engine. The equivalent of `v-if`/`v-else` in Livewire is not a specific directive, but rather the powerful combination of **PHP conditional logic within Blade templates**. By focusing on controlling the output structure from the server, we harness Livewire's core strength: synchronizing state and updating the DOM efficiently without manual JavaScript manipulation. Mastering this pattern is key to building dynamic and maintainable applications with Laravel Livewire.
