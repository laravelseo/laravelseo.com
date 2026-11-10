---
title: "afterStateUpdate on Repeater not working filament laravel"
description: "Mastering Inter Component Communication: Fixing afterStateUpdated Issues in Filament Repeaters Hello fellow developers! As we dive into building complex..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

Hello fellow developers! As we dive into building complex forms with Filament, especially when utilizing powerful components like the Repeater, we often run into subtle issues related to state management. A very common scenario I see is trying to make fields outside a repeater update based on changes inside it, typically using `afterStateUpdated`.

Today, we are tackling a specific pain point: why updates from within a Filament Repeater don't seem to propagate correctly to external calculations in the parent form structure. Let’s break down the likely cause and implement a robust solution.

## The Challenge: State Synchronization Across Components

You are attempting to use `afterStateUpdated` on repeater fields (like selecting a product) to trigger updates in a separate section that calculates totals. While this approach seems logical, state synchronization in complex Livewire/Filament forms requires careful handling of how data flows between nested components and their parent controllers.

The issue often stems from the timing or scope of the update. When you modify an item within a repeater, Livewire updates the repeater's internal state, but relying solely on `afterStateUpdated` on the child component might not immediately trigger a cascading recalculation in the parent form unless explicitly told to re-evaluate the entire set of related data.

## The Solution: Centralizing State Updates with Hydration and Collection Access

The most reliable way to handle cross-component calculations is to ensure that your calculation function executes whenever *any* relevant state change occurs, and it accesses the complete, current state of the form data. We can leverage `afterStateHydrated` on the parent section, combined with a carefully designed method for updating totals.

In your specific case, since you are dealing with a collection within the repeater, the calculation logic needs to re-read that entire collection *whenever* any field inside it changes. The key is ensuring the function responsible for calculating `subtotal` and `total` has access to the full form state provided by Livewire.

### Refactoring the Logic for Reliability

Instead of relying solely on cascading updates from the repeater, we should ensure our calculation method explicitly reads the data from the entire parent model instance passed into it. This pattern is crucial when dealing with complex relational data in Laravel applications (as we often do when working with Eloquent models and relationships found in frameworks like Laravel).

Here is how you can structure your code to make the totals update reliably:

1.  **Keep Repeater Fields Reactive:** Ensure all fields inside the repeater use `reactive()` or are implicitly reactive, allowing Livewire to track changes efficiently.
2.  **Use `afterStateUpdated` for Triggering:** Use this on the *repeater itself* (or a parent field) to signal that a change has occurred, triggering a full re-evaluation of the totals section.
3.  **Rely on Parent State Access:** The function calculating the totals should access the complete state passed via `$get` and `$set`.

Let's refine your `updateTotals` logic to be more explicit about reading the repeater data:

```php
public static function updateTotals(Get $get, Set $set): void
{
    // 1. Get the entire repeater collection state from the input
    $products = $get('products');
    $taxes = $get('taxes', 0); // Ensure taxes exists, default to 0 if missing

    if (is_array($products)) {
        // Retrieve prices for all selected products using Eloquent relationships
        // This step pulls the necessary data from the database via the relationship.
        $productIds = collect($products)->pluck('product_id');
        
        // Fetch prices efficiently using whereIn
        $priceData = Product::whereIn('id', $productIds)->pluck('price', 'id');

        // Calculate subtotal based on the selected products and quantities
        $subtotal = 0;
        foreach ($products as $item) {
            $productId = $item['product_id'];
            $quantity = (int)$item['amount'];

            if ($productId && isset($priceData[$productId])) {
                $subtotal += $priceData[$productId] * $quantity;
            }
        }

        // Update the state with the new calculated values
        $set('subtotal', number_format($subtotal, 2, '.', ''));
        $set('total', number_format($subtotal + ($subtotal * ($taxes / 100)), 2, '.', ''));
    } else {
        // Handle case where repeater is empty
        $set('subtotal', '0.00');
        $set('total', '0.00');
    }
}
```

By ensuring the calculation function explicitly reconstructs the necessary data (by fetching prices based on the `product_id`s from the `$get('products')` array), we decouple the update trigger from the direct state flow and make the calculation self-sufficient, regardless of subtle timing issues in complex component interactions. This adherence to clear data flow is a core principle in building maintainable applications, much like adhering to good practices when
