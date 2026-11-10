---
title: "Datatable send current page number"
description: "Mastering Server Side Pagination with DataTables: Sending the Current Page Number Correctly As a senior developer, I frequently encounter scenarios where we..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript"]
featured: false
---

As a senior developer, I frequently encounter scenarios where we need to bridge the gap between dynamic client-side interactions (like pagination) and robust server-side data retrieval. One common challenge arises when trying to pass context information, such as the current page number, from the frontend JavaScript layer back to the backend API.

I recently encountered an issue while implementing server-side processing for a DataTables instance where I tried to overwrite a variable (`pgno`) within the `infoCallback` function and send it via the AJAX request. While the client-side alert worked perfectly, the backend request returned null for this parameter.

This post will diagnose why this happens and provide a robust, industry-standard solution for correctly sending the current page number to your Laravel backend when using DataTables with server-side processing.

---

## The Pitfall: Scope and Asynchronous Communication

The core problem often lies in how JavaScript variables are scoped and how they are synchronized with the asynchronous AJAX call. In the provided example, while you successfully modified the `pgno` variable within `infoCallback`, there might be a timing issue or scope limitation preventing that value from being reliably included in the final `data` payload sent to the server.

When dealing with complex libraries like DataTables, it is crucial to ensure that all necessary state information is explicitly gathered and passed directly within the AJAX configuration rather than relying on global variable overwrites.

## The Solution: Explicitly Gathering Data for AJAX

The most reliable method is to calculate the required data *within* the scope of the callback and ensure that this calculated value is used directly when defining the `data` object for your AJAX call. We need to make sure the page number is explicitly tied to the request being made.

Here is a refactored approach that ensures the page information is correctly captured and sent:

```javascript
function fill_datatable(status='', csrf_token) {
    // Initialize pgno outside, or let it be calculated inside the callback context
    let currentPgno = 1; // Start at page 1 for DataTables indexing

    table = $('.tb_scoin_available').DataTable({
        "processing": true,
        "serverSide": true,
        "ordering"  : false,
        "infoCallback": function( settings, start, end, max, total, pre ) {
            // Calculate the current page number (DataTables uses 1-based indexing)
            currentPgno = settings.start + 1;
            return currentPgno; // Return the calculated value
        },
        "ajax":{
            "url": base_url+'/adminPath/management_scoin/ajaxGetScoinAvailable',
            "type": "POST",
            // Pass the dynamically calculated page number directly here
            "data":{ 
                _token: csrf_token, 
                status : status,
                pgno : currentPgno // Use the variable calculated above
            }
        },
        "columnDefs": [ { orderable: false} ],
        "columns": [
            // ... column definitions remain the same
            { "data": "no" },
            { "data": "created_at" },
            { "data": "serial_scoin" },
            { "data": "unit_scoin" },
            { "data": "unit_scoin_desc" },
            { "data": "unit_scoin_sc" },
            { "data": "unit_scoin_idr" },
        ],
    }); 
}
```

### Key Takeaways from the Refactor:

1.  **Explicit Calculation:** Instead of relying on overwriting a variable that might suffer scope issues, we explicitly calculate `currentPgno` inside the `infoCallback`.
2.  **Direct Payload:** We ensure that this calculated value (`currentPgno`) is directly injected into the `"data"` object of the AJAX request. This guarantees that the server receives the intended page number as a distinct parameter, rather than relying on implicit context.

## Backend Considerations with Laravel

When building APIs in frameworks like Laravel, adhering to clean Request/Response patterns is paramount. When your backend receives a POST request containing `pgno`, you should treat it as explicit input data, not inferred state.

In your controller method handling the AJAX request (e.g., `/adminPath/management_scoin/ajaxGetScoinAvailable`), ensure that you are explicitly casting and validating this input:

```php
// Example Laravel Controller Snippet
public function ajaxGetScoinAvailable(Request $request)
{
    // Validate incoming data
    $request->validate([
        'status' => 'required|string',
        'pgno' => 'required|integer', // Ensure it is an integer
    ]);

    $status = $request->input('status');
    $pageNumber = (int) $request->input('pgno');

    // Use pagination logic based on $pageNumber to fetch data from the database.
    // This pattern aligns perfectly with Laravel's Eloquent ORM principles, 
    // where data fetching is explicitly managed by request parameters.
    $data = Scoin::where('status', $status)
                ->skip(($pageNumber - 1) * $perPage) // Example pagination logic
               ->take($perPage)
               ->get();

    return response()->json(['data' => $data]);
}
```

By treating every piece of information sent over the wire as explicit input, you create a more stable and maintainable system. This approach mirrors the structured data handling that Laravel encourages, making debugging significantly easier. For advanced API design and database interactions within Laravel, always prioritize clear parameter passing to ensure your application logic remains predictable, much like how powerful tools in the Laravel ecosystem are designed to work together seamlessly.

## Conclusion

Successfully implementing server-side pagination with DataTables hinges on reliable communication between the client and the server. By avoiding reliance on implicitly overwritten variables and instead explicitly calculating and passing the required context—like the page number—directly within the AJAX configuration, you ensure data integrity regardless of asynchronous timing issues. This practice leads to cleaner code on both the frontend and backend, providing a robust foundation for building scalable applications, whether you are using vanilla JavaScript or leveraging powerful frameworks like Laravel.
