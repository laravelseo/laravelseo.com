---
title: "onclick get data from database using ajax laravel"
description: "Dynamically Populating Tables: Getting Data from Laravel via AJAX As senior developers, one of the most satisfying tasks is bridging the gap between a robust..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "HTML", "PHP"]
featured: false
---

As senior developers, one of the most satisfying tasks is bridging the gap between a robust backend API and a dynamic frontend experience. Loading data from a database into a user interface in real-time, without requiring a full page reload, is the essence of modern web development. Today, we will walk through exactly how to achieve this using Laravel for the backend and AJAX (specifically with jQuery) for the interactive frontend.

The goal here is to take an ID clicked in a dropdown list, send that ID via an asynchronous request (AJAX) to a specific route, receive the resulting data from the Laravel controller, and dynamically insert that data into an HTML table below.

## The Architecture: Backend and Frontend Synergy

Achieving this requires perfect synchronization between your server-side logic and client-side scripting. We need to ensure the controller provides clean JSON data, and the JavaScript knows how to consume that JSON and manipulate the Document Object Model (DOM).

### 1. The Laravel Backend (Controller Logic)

Your provided controller function is well-structured for fetching a single record based on an ID. This method acts as our API endpoint.

```php
// Example Controller Method
public function calcList($id)
{
    // Assuming you are using Eloquent models, this fetches the design record
    $design = design::select( `design_no`, `design_name`, `weight_length`, `quantity`, `design_image`, `des2`, `des3`, `des4`, `des5`, `des6`, `des7` )
        ->where('id', $id)
        ->first(); // Use first() to get a single model instance

    if (!$design) {
        return response()->json(['error' => 'Design not found'], 404);
    }

    // Return the data as a JSON response
    return response()->json($design);
}
```

**Best Practice Note:** When building APIs in Laravel, focus on returning clean JSON responses. As you learn more about powerful tools like Laravel, understanding how to structure Eloquent queries efficiently is key to building fast and scalable applications, much like the principles found at [laravelcompany.com](https://laravelcompany.com).

### 2. The Frontend Interaction (AJAX Request)

Your AJAX setup correctly targets the endpoint and handles the necessary security headers (CSRF token), which is excellent practice for any Laravel application.

```javascript
$(document).ready(function() {
    $('.designList').click(function() {
        // Set up AJAX headers for Laravel security checks
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        var id = $(this).attr("data-id");
        
        $.ajax({
             type: "POST",
             url: "/calc_list/" + id, // Target the controller method
             success: function(results) {
                 // The server returned JSON in the 'results' variable
                 console.log(results); 
                 populateTable(results); // Call the function to build the table
             },
             error: function(xhr) {
                 console.error("AJAX Error:", xhr.responseJSON);
             }
        }); 
    });
});
```

### 3. Building the Dynamic Table (The Crucial Step)

The console log shows you received a JSON object, which likely looks something like: `{"design_no": "D101", "design_name": "Example Design", ...}`. Now, we must iterate over this array and inject it into the HTML table structure.

We will create a function to handle this population dynamically.

```javascript
function populateTable(data) {
    // 1. Clear any existing rows in the table body
    $('#dataTableBody').empty();

    // 2. Iterate over the received array (results)
    $.each(data, function(index, item) {
        // 3. Create a new row (<tr>) for each data item
        var row = '<tr>';
        
        // 4. Populate the row with table data (<td>)
        row += '<td>' + item.design_no + '</td>';
        row += '<td>' + item.design_name + '</td>';
        row += '<td>' + item.weight_length + '</td>';
        // Add more fields as needed...
        
        row += '</tr>';
        
        // 5. Append the newly created row to the table body
        $('#dataTableBody').append(row);
    });
}
```

## Conclusion

By successfully combining a well-defined RESTful endpoint in your Laravel controller with dynamic data fetching via AJAX and precise DOM manipulation using jQuery, you can create highly interactive user experiences. This process demonstrates the core principle of modern full-stack development: separating concerns—the backend handles data persistence and business logic (Laravel), and the frontend handles presentation and interaction (JavaScript). Mastering this synergy is fundamental to building powerful applications, and it’s a skill that truly sets you apart in the development community.
