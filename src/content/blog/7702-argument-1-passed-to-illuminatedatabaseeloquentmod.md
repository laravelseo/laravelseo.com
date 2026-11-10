---
title: "Argument 1 passed to Illuminate\\Database\\Eloquent\\Model::__construct() must be of the type array, object given,"
description: "Solving the Eloquent Constructor Error: Handling Session Data in Laravel Models As a senior developer, I frequently encounter situations where custom logic..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer, I frequently encounter situations where custom logic clashes with the expectations of powerful frameworks like Laravel and Eloquent. The error you are facing—`Argument 1 passed to Illuminate\Database\Eloquent\Model::__construct() must be of the type array, object given`—is a classic symptom of mismatched expectations between your custom class design and how Laravel's Object-Relational Mapper (ORM) expects models to be initialized.

This post will dissect why this error occurs in your `Cart` model, analyze the flaw in your current approach, and provide a robust, idiomatic solution for managing session-based data within your application.

## The Anatomy of the Error

The error originates from how you are attempting to initialize an Eloquent Model (`Cart`) using a custom constructor:

```php
$cart = new Cart($oldCart); // $oldCart is likely an object retrieved from the session, or null.
```

When you extend `Illuminate\Database\Eloquent\Model`, Eloquent expects its models to be initialized in a specific manner, especially when dealing with data hydration. While custom constructors are allowed, they must adhere to the expected input types. Passing an arbitrary object where an array is expected causes this strict type checking to fail immediately upon instantiation.

Furthermore, your custom constructor implementation:

```php
public function _construct($oldCart)
{
    if ($oldCart) {
        $this->items = $oldCart->items; // Assuming $oldCart is an object here
        // ...
    }
}
```

This logic tries to access properties (`->items`) on the passed argument, suggesting you expect `$oldCart` to be an object. However, based on the error message, Laravel's internal mechanisms are failing because they anticipate array input when dealing with complex hydration or data passing in this context.

## Best Practice: Decoupling Session Data from Eloquent Models

The core principle we must enforce here is **Separation of Concerns**. Eloquent models are designed to represent database entities; session data, temporary state, and request payloads should be handled by dedicated classes or simple DTOs (Data Transfer Objects). Attempting to force a transient session object into the rigid structure of an Eloquent model creates unnecessary complexity and fragility.

Instead of making your `Cart` model responsible for managing session state initialization via its constructor, we should separate the concerns:

1.  **Session Management:** Keep all cart data purely in the session.
2.  **Business Logic:** Create a dedicated service or class to handle the actual manipulation (adding items, calculating totals).
3.  **Eloquent Model:** Use Eloquent models strictly for interacting with the database.

## Refactoring the Cart Logic

We should refactor your `Cart` class to function as a plain data container that holds the state, rather than an Eloquent model that manages its own persistence via a flawed constructor.

Here is how you can restructure your logic:

### 1. Redefining the Cart Class (DTO Approach)

We will remove the inheritance from `Model` and focus on pure object behavior for session management.

```php
// app/Cart.php

class Cart
{
    public $items = [];
    public $totalQty = 0;
    public $totalPrice = 0;

    public function __construct($initialData = null)
    {
        if ($initialData) {
            // Initialize from session data if provided
            $this->items = $initialData['items'] ?? [];
            $this->totalQty = $initialData['totalQty'] ?? 0;
            $this->totalPrice = $initialData['totalPrice'] ?? 0;
        }
    }

    public function add($item, $id)
    {
        // Logic remains focused on manipulating the in-memory array
        $storedItem = ['qty' => 0, 'price' => $item['price'], 'item' => $item];

        if (array_key_exists($id, $this->items)) {
            $storedItem = $this->items[$id];
        }
        $storedItem['qty']++;
        $storedItem['price'] = $item['price'] * $storedItem['qty'];
        $this->items[$id] = $storedItem;
        $this->totalQty++;
        $this->totalPrice += $item['price'];
    }

    public function toArray()
    {
        // Method to easily serialize the object back to an array for session storage
        return [
            'items' => $this->items,
            'totalQty' => $this->totalQty,
            'totalPrice' => $this->totalPrice,
        ];
    }
}
```

### 2. Updating the Controller Logic

Now, your controller becomes responsible for loading, manipulating, and saving the state, which is much cleaner.

```php
// app/Http/Controllers/ProductController.php

use App\Cart; // Import the new Cart class
use Illuminate\Support\Facades\Session;

public function getAddToCart(Request $request, $id)
{
    $product = Product::find($id);
    
    // 1. Retrieve existing cart data from session
    $oldCartData = Session::has('cart') ? Session::get('cart') : null;
    
    // 2. Initialize the Cart object, passing only necessary data (or null)
    $cart = new Cart($oldCartData);

    // 3. Perform the business logic on the object
    $cart->add($product, $product->id);

    // 4. Store the finalized result back into the session as an array
    Session::put('cart', $cart->toArray());
    
    return redirect()->route('shop.index');
}
```

## Conclusion

The error you encountered was a strong signal that we needed to align our class design with Laravel's expectations, especially when dealing with Eloquent components. By treating your `Cart` object as a pure data structure—a Data Transfer Object (DTO)—and delegating the persistence and session handling to the Controller layer, we eliminate the conflict with the Eloquent constructor requirements. This separation results in cleaner, more maintainable code, aligning perfectly with the principles of robust application development found within frameworks like **Laravel**. Always strive for clear boundaries between your data models and your application flow when building complex features.
