---
title: "Laravel 5.2 & AJAX - Display success message after redirect"
description: "Laravel 5.2 & AJAX: Displaying Success Messages After Redirection As developers building dynamic applications with frameworks like Laravel, handling..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "PHP"]
featured: false
---

As developers building dynamic applications with frameworks like Laravel, handling asynchronous operations via AJAX alongside traditional server-side redirects requires careful orchestration. When you are dealing with CRUD systems, form validation, and modal interactions—as you are with your Bootstrap setup—the challenge often lies in ensuring that session-based feedback (like success messages) flows correctly across the boundary of an AJAX request and a subsequent page load.

This post will analyze the scenario you described, diagnose why your current approach might be inconsistent, and provide a robust, modern solution using Laravel principles to flawlessly display success messages after an asynchronous operation.

## The Challenge: Bridging AJAX and Session Flash Data

You are implementing a sophisticated pattern: opening a form in a modal, validating it client-side (or server-side via AJAX), saving data, and then expecting the server to redirect with a success message.

Your current setup correctly uses Laravel's session flashing mechanism:

**Controller Snippet:**
```php
public function store(CustomerRequest $request)
{
    Customer::create($request->all());

    return redirect('customers')
        ->with('message', 'New customer added successfully.')
        ->with('message-type', 'success');
}
```
This redirects the user and sets session data. The view then correctly checks `Session::has('message')` to display the alert.

The issue arises when this redirect is triggered by an AJAX call that immediately reloads the page (`location.reload()`). While reloading the page *should* pick up the session data, relying solely on a full reload for success feedback in an AJAX context is inefficient and can lead to race conditions or unexpected behavior if the AJAX flow changes.

## The Solution: Handling Success via JSON Responses

The most robust way to handle success notifications in an AJAX workflow, especially when dealing with complex form submissions, is to shift the responsibility of the response entirely to the server via a JSON response, rather than relying on redirects for every interaction. This keeps the client-server communication cleaner and allows you to control exactly what the client receives.

Instead of redirecting immediately upon success, the controller should return a structured JSON response. The client-side JavaScript then handles displaying the message without forcing a full page reload.

### Step 1: Modify the Controller for AJAX Response

We will remove the `redirect()` and instead return a JSON object indicating success or failure.

```php
use Illuminate\Http\Request;

public function store(CustomerRequest $request)
{
    $customer = Customer::create($request->all());

    // Return a structured JSON response instead of redirecting
    return response()->json([
        'success' => true,
        'message' => 'New customer added successfully.',
        'type' => 'success'
    ], 200); // HTTP Status Code 200 OK
}
```

### Step 2: Update the JavaScript Logic

The AJAX call now needs to check the JSON response status. If successful, it will extract the message and dynamically update the DOM (the success alert) instead of reloading the page.

**Revised JavaScript Example:**

```javascript
$.ajax({
    type: "POST",
    url: url,
    data: data,
    dataType: 'json', // Expecting JSON response
    cache: false,
    contentType: contentType,
    processData: false
})
.done(function(response) {
    // Success Handling: Process the message received from the server
    if (response.success) {
        displaySuccessMessage(response.message, response.type);
    } else {
        // Handle other potential API errors if they exist
        console.error("Server reported an error:", response.message);
    }
})
.fail(function(jqXHR, textStatus, errorThrown) {
    // Error Handling: Handle server-side errors (e.g., 422 Unprocessable Entity)
    var errorDetails = $.parseJSON(jqXHR.responseText);
    console.error("AJAX Error:", textStatus, errorThrown);

    if (jqXHR.status === 422) {
        // Handle validation errors from the server if needed
        // ... logic to display form errors back into the modal ...
    } else {
        alert('An unexpected error occurred.');
    }
});

// Function to dynamically update the success alert in the view
function displaySuccessMessage(message, type) {
    // Assuming you have a container element for alerts on your page
    var alertDiv = $('#success-alert'); 
    
    alertDiv.removeClass('alert-danger alert-info').addClass('alert-{{ type }} alert-dismissable').html(
        '<button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button>' + message
    );
    // Optionally hide it after a few seconds
    setTimeout(function() {
        alertDiv.fadeOut('slowly', 500, function() {
            alertDiv.empty();
        });
    }, 5000);
}
```

## Conclusion: Adopting the API Mindset in Laravel

The shift from relying on server-side redirects for AJAX feedback to returning structured JSON responses is a fundamental best practice in modern web development, especially within the Laravel ecosystem. When building APIs or complex interactive interfaces, treat your controller methods as endpoints that serve data, not just navigation instructions.

By adopting this "API mindset," you decouple the client's interaction from the server's immediate navigational flow. This makes your application cleaner, more scalable, and easier to debug. As you continue to build sophisticated systems on Laravel, remember that leveraging Eloquent for data management and structuring responses via JSON is key to mastering the power of this framework. For more insights into efficient Laravel development, explore resources like [https://laravelcompany.com](https://laravelcompany.com).
