---
title: "How to make column data clickable with link in yajra datatable laravel 5.7"
description: "How to Make Column Data Clickable with Links in Yajra DataTables in Laravel As a senior developer working with the Laravel ecosystem, we often encounter..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML"]
featured: false
---

As a senior developer working with the Laravel ecosystem, we often encounter scenarios where we need to bridge the gap between robust backend data processing (like using Yajra DataTables with server-side processing) and dynamic frontend interactivity. The desire to make table rows or specific cells clickable links is very common, as it significantly enhances user experience by allowing direct navigation rather than relying solely on form submissions.

The challenge arises because standard HTML link generation (`<a href="...">`) works perfectly fine in a static view, but when using Yajra DataTables with `serverSide: true`, the data is fetched via AJAX. This means the dynamic links must be generated during the server-side response and correctly mapped back to the table columns.

This guide will walk you through the correct, idiomatic way to achieve clickable links in your Yajra DataTables implementation within a Laravel environment.

## The Core Concept: Server-Side Rendering for Dynamic Links

When using server-side processing, your controller is responsible for generating *all* the data that the frontend needs to draw the table. To create dynamic links, we must modify the data returned by the controller so that instead of just returning raw IDs, we return the fully constructed URL within the response payload.

The core issue in your initial setup is that while you are correctly loading data via AJAX, the DataTables library itself only renders what it receives. We need to ensure the `data` being supplied to the columns contains the full link structure.

## Implementation Steps for Clickable Rows

We will leverage Eloquent relationships and Laravel's helper functions within your controller to build these URLs efficiently.

### 1. Refine the Controller Logic

Instead of just returning raw model data, you should preprocess the data to include the desired link format. We will focus on making the `id` column clickable.

In your `UsersController`, modify the method responsible for fetching the data:

```php
use Yajra\DataTables\Facades\DataTables;
use App\Models\User; // Assuming you are using Eloquent Models

public function yajraDT()
{
    $data = User::select('id', 'first_name', 'last_name', 'email', 'gender')
        ->join('roles', 'users.role_id', '=', 'roles.id') // Example of joining for richer data
        ->selectRaw("users.id, users.first_name, users.last_name, users.email, users.gender")
        ->where('is_active', true)
        ->get();

    // Return the data using DataTables::of()
    return DataTables::of($data)->make(true);
}
```

**Note on Laravel Best Practices:** Remember that robust applications rely heavily on clean Eloquent models and proper routing, as demonstrated by the principles discussed in [Laravel documentation](https://laravelcompany.com). Proper structuring of your data retrieval ensures scalability for complex features like this.

### 2. Adjusting the Frontend Data Mapping

Since you are using `serverSide: true`, the links need to be handled by manipulating how DataTables maps the columns, or by defining a custom rendering function within the view that accesses the ID from the received data.

In your `index.blade.php`, when defining the columns, instead of just mapping the raw data, you will use JavaScript to dynamically construct the link based on the cell's content.

For example, if we assume the AJAX response gives us an array of user objects:

```javascript
$('#tableDT').DataTable({
    processing: true,
    serverSide: true,
    ajax: '{{ url('users/yajraDT') }}',
    columns: [
        { data: 'id', name: 'id', orderable: false, searchable: false }, // Keep ID separate for linking
        { 
            data: 'first_name', 
            name: 'first_name',
            // Custom rendering function to create the link
            render: function(data, type, row) {
                return '<a href="/users/' + row.id + '">' + data + '</a>';
            }
        },
        { data: 'last_name', name: 'last_name' },
        { data: 'email', name: 'email' },
        { data: 'gender', name: 'gender' }
    ]
});
```

By using the `render` function within the column definition, you instruct DataTables to execute custom JavaScript logic for that specific cell. This allows you to inject the desired HTML structure—in this case, an anchor tag (`<a>`) wrapping the data and pointing to the correct route based on the row's ID.

## Conclusion

Making column data clickable links in a Yajra DataTables setup is fundamentally about shifting the responsibility of link generation from static Blade views to dynamic server-side processing. By ensuring your controller returns the necessary identifiers and then utilizing DataTables' powerful `render` feature on the frontend, you achieve clean separation of concerns. This approach keeps your Laravel application modular and highly performant, adhering to the principles of building scalable applications as championed by frameworks like Laravel.
