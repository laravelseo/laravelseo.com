---
title: "wire:click call two methods at once"
description: "Mastering Multi Action Events in Livewire: How to Call Two Methods at Once As a senior developer working with reactive frameworks like Livewire,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "HTML", "PHP"]
featured: false
---

As a senior developer working with reactive frameworks like Livewire, understanding how to orchestrate complex interactions within a single user event is crucial. You've encountered a very common hurdle: wanting to trigger multiple distinct actions—like emitting an event *and* calling component methods—from a single `wire:click` directive.

The reason your attempts have failed is rooted in how Livewire processes the HTML attributes versus how PHP methods are executed. Direct chaining of directives or method calls within a single attribute string doesn't map cleanly to Livewire’s event-driven architecture.

This post will break down why those attempts don't work and provide the robust, idiomatic solutions for achieving multi-action triggers in your Livewire components.

---

## The Pitfall of Direct Chaining in `wire:click`

When you write something like:
`<button wire:click="method1(); method2()">`

Livewire interprets this as executing whatever is inside the quotes as a single JavaScript expression or string, which doesn't allow for sequential execution of unrelated component methods directly within that attribute. Your attempts to call `$emitTo()` and component methods like `setItem()` simultaneously failed because they are fundamentally two separate concerns: **Event Emission** (frontend action) and **State Mutation** (backend logic).

## Solution 1: The Recommended Approach – Emit Everything via Payload

The most robust and maintainable way to handle multiple actions is to consolidate all necessary information into a single event payload. This keeps your frontend clean and allows your backend component to handle the complex, conditional logic required for both actions.

Instead of trying to call two methods directly in the HTML attribute, you emit an event containing all the data needed.

### Example Implementation

Assume you want to show a modal *and* set a specific item based on the book ID when a button is clicked.

**In your Livewire Component (PHP):**

```php
use Livewire\Attributes\On;

class BookComponent extends Component
{
    public $bookId;

    public function showAssignModal(int $id)
    {
        // Logic to prepare data for the modal display
        $this->dispatch('show-assign-modal', bookId: $id);
    }

    public function setItem(int $itemId)
    {
        // Logic to update the item state
        $this->updateItem($itemId);
    }

    public function updateItem($id)
    {
        // Actual database or component state update logic
        session()->flash('message', "Item ID {$id} successfully set.");
    }

    public function render()
    {
        return view('livewire.book-component');
    }
}
```

**In your Blade View (HTML):**

Here, we only trigger the primary event (`show-assign-modal`) and pass the required data (`$bookId`) within it. The subsequent action (`setItem`) is handled entirely by listening to that emitted event.

```html
<button wire:click="showAssignModal({{ $book->id }})">
    Open Modal and Set Item
</button>
```

**In your Parent Component (or the view where you listen for events):**

You listen for the emitted event and execute the necessary logic sequentially.

```html
{{-- Listen for the custom event --}}
<div wire:ignore.self>
    <script>
        document.addEventListener('show-assign-modal', (event) => {
            // 1. Action 1: Handle the modal display (if needed, though Livewire handles this often)
            console.log('Modal requested:', event.detail);

            // 2. Action 2: Call a separate method on the component instance
            // This requires finding the component instance and calling its method.
            Livewire.dispatch('setItem', event.detail.bookId);
        });
    </script>
</div>
```

## Solution 2: Using Synchronized Events (Advanced)

If you absolutely need to chain actions *within* the Livewire flow without relying on external JavaScript listeners, you can rely purely on emitting events and having the primary handler dispatch a secondary event. This is cleaner than trying to force method calls directly into `wire:click`.

1.  **Primary Click:** Emit Event A.
2.  **Listener:** When Event A is received, execute Method B immediately.

This pattern delegates the sequential logic entirely to your backend component, which is where it belongs. It aligns perfectly with the principles of state management promoted by frameworks like those found at [laravelcompany.com](https://laravelcompany.com).

## Conclusion: Embrace Event-Driven Architecture

Stop trying to force sequential method calls into a single HTML attribute. Livewire excels when you treat user interactions as **events**. By emitting a well-structured event that contains all necessary context, you create decoupled, testable, and highly maintainable code. Let the backend component manage the flow of data between actions rather than trying to dictate the execution order in the frontend markup. This approach scales beautifully as your Livewire applications grow in complexity.
