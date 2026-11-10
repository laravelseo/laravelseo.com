---
title: "Laravel Livewire: load livewire component with button click"
description: "Mastering Dynamic Component Loading in Livewire: Switching Components with Button Clicks As developers working with Laravel and Livewire, one of the most..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

As developers working with Laravel and Livewire, one of the most powerful features we leverage is the ability to dynamically manage UI based on user interaction. The scenario you've described—switching between different Livewire components based on button clicks—is a perfect demonstration of how Livewire’s event-driven architecture can create highly interactive and decoupled interfaces.

While the official documentation might not explicitly detail component *replacement*, the key lies in mastering how components communicate via events (`$emit` and `$listeners`). This guide will walk you through the architectural pattern required to achieve this dynamic loading seamlessly.

## The Core Mechanism: Events and State Management

To switch between components, we need a central source of truth (state) that dictates which component should be rendered at any given moment. When a button is clicked, it shouldn't directly load a new component; instead, it should emit an event that signals the parent component to update its internal state, which in turn triggers the rendering of the correct Livewire component.

The magic happens through two main concepts:
1. **Emitting Events (`$emit`):** The child component (where the button lives) tells the parent component *what* action occurred.
2. **Listening for Events (`$listeners`):** The parent component listens for these emitted events and updates its state property accordingly.

## Step-by-Step Implementation

Let's structure the example using a hypothetical parent component that controls which child is displayed.

### 1. Define the Child Components (The Views)

First, ensure your components are set up to listen for specific external signals, although in this swapping scenario, they primarily focus on rendering their content based on received props.

**Example: `UserIsExpired` Component**
```php
// app/Livewire/UserIsExpired.php
class UserIsExpired extends Component
{
    // We don't need to listen for 'expired' here if the parent controls the state, 
    // but keeping listeners is good practice for future expansion.
    protected $listeners = ['expired' => null];    
    
    public function render()
    {
        return view('livewire.user-is-expired');
    }
}
```

### 2. The Parent Component (The Controller)

The parent component will hold the state variables (`$active`, `$pending`, `$expired`) and use methods to handle the received events, updating the state before rendering the appropriate child. This is where the dynamic loading occurs.

In the parent's Blade file:

```html
<div>
    {{-- Buttons emit the event that triggers the state change in the parent --}}
    <button wire:click="setActive">Active</button>
    <button wire:click="setPending">Pending</button>
    <button wire:click="setExpired">Expired</button>

    {{-- Conditional Rendering based on State --}}
    @if ($active)
        <livewire:user-is-active :active="$active"/>
    @elseif ($pending)
        <livewire:user-is-pending :pending="$pending"/>
    @elseif ($expired)
        <livewire:user-is-expired :expired="$expired"/>
    @endif
</div>
```

And in the parent's Livewire class, you define methods to handle the emissions:

```php
// Parent Component Class Example (e.g., ParentComponent.php)
class ParentComponent extends Component
{
    public $active = false;
    public $pending = false;
    public $expired = false;

    // Method called when 'Active' button is clicked
    public function setActive()
    {
        $this->active = true;
        $this->pending = false;
        $this->expired = false;
    }

    // Method called when 'Pending' button is clicked
    public function setPending()
    {
        $this->pending = true;
        $this->active = false;
        $this->expired = false;
    }

    // ... and so on for setExpired()
    
    public function render()
    {
        return view('livewire.parent-component');
    }
}
```

## Best Practices and Conclusion

This pattern effectively decouples your UI interactions from the component logic, which is a core principle of good application design. When building complex applications on Laravel, understanding how to manage state across components using Livewire's event system makes development much cleaner and more maintainable. For deeper dives into architectural patterns within the Laravel ecosystem, exploring resources like those provided by [laravelcompany.com](https://laravelcompany.com) is highly recommended.

By utilizing `$emit` from the child view and corresponding state mutations in the parent component, you achieve a dynamic content swapping mechanism that scales well for any future requirements. This approach ensures your application remains responsive and adheres to modern front-end principles.
