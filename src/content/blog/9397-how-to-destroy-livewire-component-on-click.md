---
title: "How to destroy livewire component on click?"
description: "How to Destroy a Livewire Component on Click: Mastering Dynamic Deletions Building dynamic user interfaces with Livewire is incredibly powerful. You can..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Building dynamic user interfaces with Livewire is incredibly powerful. You can effortlessly manage complex data flows between your server-side PHP and your Blade view, making repetitive tasks like adding, editing, and—crucially—deleting items seamless.

One of the most common challenges developers face when using `@livewire` in a loop is handling deletions. Simply removing an element from the DOM isn't enough; you must ensure that the underlying server-side data (the component instance) is also removed to prevent ghost data and maintain application integrity.

This post will walk you through the correct, robust way to destroy or remove a Livewire component when a button is clicked, focusing on state management rather than direct DOM manipulation.

## The Livewire Approach to Deletion

When dealing with dynamic lists in Livewire, the fundamental principle is: **The parent component owns the state of the list.** The children components should not attempt to destroy themselves; instead, they should communicate their intent to the parent, and the parent should handle the actual removal.

If you try to delete a component directly from within its scope, it often leads to synchronization issues because Livewire needs to re-render the entire component tree based on the state changes.

### Step 1: Parent Component State Management

Your parent component must hold the definitive list of items. This is where the magic happens. Instead of relying solely on the loop structure for rendering, you should manage the data in a reactive property (an array) within the parent class.

**Parent Component Example (`ParentComponent.php`):**

```php
namespace App\Livewire;

use Livewire\Component;

class ParentComponent extends Component
{
    public $items = []; // This will hold all our dynamic items

    public function render()
    {
        return view('livewire.parent-component', [
            'items' => $this->items,
        ]);
    }

    /**
     * Method to handle the deletion request from a child.
     */
    public function removeItem($itemId)
    {
        // Filter the items array, keeping only those whose ID does NOT match the one to be removed.
        $this->items = array_filter($this->items, function ($item) use ($itemId) {
            return $item['id'] !== $itemId;
        });

        // Important: Dispatch a notification or refresh if necessary, although Livewire usually handles re-rendering automatically when properties change.
    }
}
```

### Step 2: Rendering the Loop and Passing Identifiers

In your Blade view, you iterate over the `$items` array from the parent component. Crucially, each child component must be initialized with a unique identifier so the parent knows exactly which item to target upon deletion.

**Parent Component View (`parent-component.blade.php`):**

```html
<div>
    @for($item of $items)
        {{-- Pass the item data and its unique ID --}}
        @livewire('dashboard.profile.garage-service-list-item', [
            'garage' => $item['garage'],
            'id' => $item['id'] // Passing the unique identifier!
        ])
    @endfor
</div>
```

### Step 3: Child Component Action (The Click Event)

Now, in the child component where the delete button resides, when clicked, it doesn't destroy itself. Instead, it emits an event or calls a public method on its parent, passing the unique ID of the item it wishes to remove.

**Child Component Example (`GarageListItem.php`):**

```php
namespace App\Livewire;

use Livewire\Component;

class GarageListItem extends Component
{
    public $id; // The ID of this specific item
    public $garage;

    // Method called when the delete button is pressed
    public function deleteItem()
    {
        // Emit an event back to the parent component, passing the current item's ID.
        $this->dispatch('removeItem', itemId: $this->id);
    }

    public function mount($id, $garage)
    {
        $this->id = $id;
        $this->garage = $garage;
    }

    public function render()
    {
        return view('livewire.garage-list-item');
    }
}
```

**Child Component View (`garage-list-item.blade.php`):**

```html
<div>
    <span>Garage: {{ $garage }} (ID: {{ $id }})</span>
    <button wire:click="deleteItem">Delete</button>
</div>
```

### Step 4: Handling the Event in the Parent (The Final Deletion)

Finally, back in the parent component view, you listen for the dispatched event and execute the state modification method defined earlier.

**Parent Component View (Listening for Events):**

```html
<div>
    @for($item of $items)
        {{-- Notice we are now listening for events on the child --}}
        @livewire('dashboard.profile.garage-service-list-item', [
            'garage' => $item['garage'],
            'id' => $item['id'],
            'wire:key' => $item['id'] // Using wire:key is critical for Livewire optimization!
        ])
    @endfor

    {{-- Listen for the custom event dispatched by the child --}}
    @livewire('removeItem', #[
        'event' => 'removeItem',
        'itemId' => $item['id']
    ])
</div>
```

And finally, in your parent component class, you define the method to process this incoming request:

```php
// Inside ParentComponent.php
public function removeItem($itemId)
{
    // ... (The array_filter logic from Step 1 goes here)
}
```

## Conclusion

Destroying a Livewire component is not about destroying the HTML; it’s about intelligently managing server-side state. By leveraging the parent component as the single source of truth for the list, passing unique identifiers down to the children, and using Livewire's event system (`$this->dispatch()`), you create a clean, maintainable, and highly reactive application. This pattern ensures that when an item is deleted, Livewire efficiently re-renders only what needs to change, adhering to best practices for building complex interactions with Laravel components. For deeper insights into architecture patterns like this, always refer back to the official documentation provided by [laravelcompany.com](https://laravelcompany.com).
