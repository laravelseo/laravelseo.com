---
title: "How to manually refresh in Livewire"
description: "Mastering Livewire Events: How to Manually Refresh Components from the Backend As developers working with Livewire, one of the most common points of..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript"]
featured: false
---

As developers working with Livewire, one of the most common points of confusion lies in understanding how component-to-component communication works, especially when dealing with server-side actions and state updates. You've hit a classic scenario: dispatching an event from one part of your application (like a controller method or one component) and expecting another component to automatically react and refresh itself.

The core issue you are facing is often a misunderstanding of where the "refresh" logic should reside in a Livewire architecture. While Livewire excels at handling client-side interactions triggered by user events (like button clicks), server-initiated state changes need explicit listening mechanisms.

Let’s dive into why your current setup might be failing and how to correctly implement robust, manual component refreshing using Livewire's event system.

## The Livewire Event Mechanism Explained

When you use `$this->dispatch('event_name')->to('component_name');`, you are successfully sending a message across the wire. This message is processed by the Livewire framework on the server and delivered to the specified component instance. However, simply dispatching the event does not automatically trigger a full re-render of that component unless it is explicitly set up to listen for that signal.

If your `shopping-cart` component isn't actively listening for the `'basketUpdated'` event, it will receive the data but won't know *how* or *when* to update its view state, leading to the appearance that nothing happened.

## The Solution: Implementing Event Listeners

The solution is straightforward: the receiving component must explicitly define listeners for the events it cares about. This ensures that when an event is dispatched from anywhere in your application (whether a controller, another component, or a service), the target component knows exactly what to do with the information.

You achieve this by using the `#[On]` attribute within your Livewire component class.

### Step-by-Step Implementation

Here is how you would modify your `ShoppingCart` component to correctly handle the update triggered by the `add()` method:

```php
// app/Http/Livewire/ShoppingCart.php

use Livewire\Attributes\On;
use Livewire\Component;

class ShoppingCart extends Component
{
    // Define the listener for the event dispatched from other components
    #[On('basketUpdated')]
    public function handleBasketUpdate()
    {
        // This method is executed whenever 'basketUpdated' is dispatched to this component.
        // Now, you can manually trigger a refresh or reload data here.

        // Example: Reloading the basket data from the database based on the event context
        $this->loadBasketData(); 
        
        // If necessary, you can emit another event or update public properties
        $this->dispatch('refresh'); // Optional: dispatch a local refresh signal if needed
    }

    public function render()
    {
        return view('livewire.shopping-cart');
    }
    
    /**
     * Placeholder method to simulate data loading after the event is received.
     */
    protected function loadBasketData()
    {
        // In a real application, you would fetch the latest basket data here.
        \Log::info('ShoppingCart updated via event.');
        // Example: $this->basket = Basket::whereCustomerId($this->user->id)->first();
    }
}
```

### Integrating with Your Dispatcher

Your dispatcher method remains clean and focused on sending the signal:

```php
// Inside your controller or parent component method
public function add($value): true|LaravelNotify
{
    // ... logic to add product ...

    // Event to refresh shopping cart component
    $this->dispatch('basketUpdated')->to('shopping-cart');
    return true;
}
```

## Best Practices for State Management

When dealing with complex state updates across multiple Livewire components, remember the principle of separation of concerns. Avoid putting complex business logic directly into event handlers. Instead, use events purely as communication channels to trigger specific, well-defined actions within the receiving component.

For managing data persistence, ensure your underlying Eloquent models are properly utilized. When refreshing a component, you should always re-fetch the required data from the database rather than trying to manipulate in-memory variables that might be stale. This aligns perfectly with the principles of structured application design found throughout the Laravel ecosystem, particularly when building complex features on top of frameworks like [Laravel](https://laravelcompany.com).

## Conclusion

You were not missing anything; you simply needed to establish a listener on the receiving component. By implementing the `#[On('event_name')]` attribute in your Livewire class, you transform an invisible data transmission into an actionable event that triggers specific, controllable logic within your component. This pattern allows for powerful, decoupled communication between components, making your Livewire applications much more responsive and manageable.
