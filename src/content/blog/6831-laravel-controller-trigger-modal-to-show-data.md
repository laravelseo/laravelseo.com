---
title: "Laravel controller trigger modal to show data"
description: "Laravel Controller Triggering Modals to Show Data: The AJAX Approach As a senior developer working with Laravel, we often encounter scenarios where we need..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "JavaScript", "HTML"]
featured: false
---

As a senior developer working with Laravel, we often encounter scenarios where we need to display detailed information without forcing the user to navigate away from the current context. Your challenge—displaying item details within a modal instead of redirecting to a new page—is extremely common and points toward optimizing the User Experience (UX).

While your existing setup using standard controller methods (`show`) works perfectly for traditional web navigation, achieving dynamic, in-page interactions like showing data in a modal requires shifting from a server-side rendering approach to an **Asynchronous JavaScript and XML (AJAX)** approach. Simply copying the Blade view into a modal body fails because the modal doesn't have access to the necessary data stream; it needs that data delivered dynamically via an API call.

This post will walk you through the correct, modern Laravel way to trigger a modal based on controller logic using AJAX, which is a foundational pattern for building highly interactive applications, much like what you explore when learning about robust application design principles at [laravelcompany.com](https://laravelcompany.com).

## Why Traditional Redirection Isn't Ideal for Modals

Your current `show` method correctly fetches the data and returns a full Blade view:

```php
public function show(SubOrder $order)
{
    $items = $order->items;
    return view('sellers.order.show', compact('items'));
}
```

When you link to this route (`route('seller.orders.show', $subOrder)`), the browser makes a full HTTP request, the server renders an entirely new HTML page, and the browser navigates away. For modals, we want to keep the user on the original page while fetching only the required data needed for the modal content.

## The Solution: Controller as an API Endpoint

The key is to refactor your controller so that the `show` method no longer returns a view, but instead returns raw JSON data. This turns your controller into a powerful API endpoint, which is one of Laravel's greatest strengths.

### Step 1: Modify the Controller for JSON Response

We will change the `show` method to return the item details as a JSON response.

```php
use Illuminate\Http\Request;
// ... other necessary imports

class SubOrderController extends Controller
{
    // ... index method remains the same

    public function show(SubOrder $order)
    {
        $items = $order->items;

        // Instead of returning a view, return the data as JSON
        return response()->json($items);
    }
}
```

### Step 2: Update the Blade View (The Trigger)

Now, in your `index` blade file, instead of linking to a standard route, we will use an event listener that triggers JavaScript to make an AJAX request. We'll place the data-fetching logic inside a JavaScript function triggered by a button click.

In your `index` view, you would modify the table row to trigger this action:

```html
{{-- Inside your index blade file --}}
@forelse ($orders as $subOrder)
    <tr>
        <td>{{$subOrder->created_at}}</td>
        <td>
            {{-- Add a data attribute to identify which order we need --}}
            <button 
                type="button" 
                class="btn btn-warning btn-sm" 
                data-order-id="{{ $subOrder->id }}"
                onclick="fetchOrderDetails({{ $subOrder->id }})"
            >
                Detail Pesanan
            </button>
        </td>
    </tr>
@empty
    {{-- ... --}}
@endforelse
```

### Step 3: Implement the JavaScript (The Fetch)

This is where we use JavaScript to intercept the click, call the route defined by your controller method, and handle the response.

```javascript
function fetchOrderDetails(orderId) {
    // Use Axios or the native Fetch API to make an AJAX request
    fetch(`/api/orders/${orderId}`) // Assuming you set up a route like this
        .then(response => response.json())
        .then(data => {
            // data will be the JSON array of items returned from the controller
            populateModal(data);
        })
        .catch(error => {
            console.error('Error fetching order details:', error);
            alert('Failed to load order details.');
        });
}

function populateModal(items) {
    // This function takes the received data and populates your modal HTML
    const modalBody = document.getElementById('modal-body');
    let html = '<table><thead><tr><th>Nama Barang</th><th>Jumlah</th><th>Harga</th></tr></thead><tbody>';
    
    items.forEach(item => {
        html += `
            <tr>
                <td>${item.nama}</td>
                <td>${item.pivot.jumlah}</td>
                <td>${item.pivot.harga}</td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    modalBody.innerHTML = html;
}
```

### Step 4: Define the Route

For this AJAX call to work, you need a dedicated route that points to your `show` method and handles JSON responses (often handled via Laravel's resource controllers or API routes).

```php
// In your routes/web.php
Route::get('/orders/{order}/details', [SubOrderController::class, 'show'])->name('seller.orders.details'); 
// Note: You might need to adjust the route structure based on how you organize your API endpoints for best practice.
```

## Conclusion

By shifting your controller methods to return JSON instead of full Blade views, you transform your Laravel application into a flexible data provider. This separation of concerns—where the controller handles data logic and presentation (JSON), and the frontend handles dynamic display (JavaScript/AJAX)—is the professional standard for building modern, responsive interfaces. Utilizing these techniques ensures that your application remains fast, interactive, and adheres to best practices for scalable development, making your Laravel projects robust and maintainable, as championed by [laravelcompany.com](https://laravelcompany.com).
