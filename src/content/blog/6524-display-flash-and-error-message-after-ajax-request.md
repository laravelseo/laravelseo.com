---
title: "display flash and error message after ajax request Laravel"
description: "Display Flash and Error Messages After AJAX Requests in Laravel As a senior developer working with Laravel, we frequently encounter scenarios where user..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer working with Laravel, we frequently encounter scenarios where user feedback is needed immediately after an asynchronous action, typically handled via AJAX. When you perform an update or submission via an AJAX call, the server successfully processes the request and sets session flashes (like success messages) or validation errors. The challenge lies in reliably retrieving this information on the client side to display it gracefully without a full page reload.

This guide will walk you through the complete process of sending flash messages and validation errors from your Laravel controller via AJAX and displaying them correctly in your Blade view.

## The Laravel Foundation: Session Flashes and JSON Responses

The key to making this work is understanding how Laravel manages session data and how we package that information for the client.

In your controller, after a successful operation (like an update), you use `session()->flash('message', 'Your shop has been updated')` or set validation errors on the model. When returning a JSON response via AJAX, you must explicitly send this session data back to the client.

As seen in your example controller:

```php
public function postUpdate (Request $request)
{
    // ... validation and update logic ...

    if ($success) {
        session()->flash('message', 'Your shop has been updated');
        session()->flash('message_class', 'alert alert-success fade in');
    } else {
        // Handle errors if necessary, though usually validation errors are handled differently
    }

    return Response::json([
        'success' => true,
        'message' => session('message'), // Retrieve the flashed message
        'message_class' => session('message_class') // Retrieve the class for styling
    ]);
}
```

By returning a JSON object containing these session keys, you effectively bridge the server state to the client request. This pattern is crucial when building dynamic applications, aligning perfectly with the robust architecture championed by developers exploring solutions on `https://laravelcompany.com`.

## Implementing Robust AJAX Handling (JavaScript)

The JavaScript side needs to be prepared to parse this JSON response and act upon the data it receives. We must handle both the `success` and `error` callbacks meticulously.

Your provided AJAX snippet shows the basic structure, but we need to ensure that when a request succeeds, we use the returned message to update the DOM instead of just reloading the page.

Here is an enhanced approach for handling the AJAX call:

```javascript
$(".update-form").submit(function(s) {
    s.preventDefault();

    const formData = new FormData(this); // Or use .serialize() if preferred
    const url = "advertiser/update";

    $.ajax({
        type: "POST",
        url: url,
        data: formData,
        processData: false, // Important when sending FormData
        contentType: false, // Important when sending FormData
        success: function(response) {
            // 1. Handle Success Response from the server
            if (response.success) {
                // Display the success message received from Laravel
                $('#status-message').html(response.message);
                $('#status-message').addClass(response.message_class);

                $('.modal-backdrop').remove();
                $('body').load('advertiser'); // Reload the relevant section if needed
            }
        },
        error: function(xhr, status, error) {
            // 2. Handle Error Response (e.g., validation failure or server error)
            let errorMessage = 'An unknown error occurred.';

            if (xhr.responseJSON && xhr.responseJSON.errors) {
                // If the response contains specific validation errors from Laravel
                errorMessage = 'Validation Failed: ' + JSON.stringify(xhr.responseJSON.errors);
            } else if (xhr.responseJSON && xhr.responseJSON.message) {
                // Handle generic error messages returned by your controller
                 errorMessage = xhr.responseJSON.message;
            }

            $('#status-message').html(errorMessage).addClass('alert alert-danger');
        }
    });
});
```

Notice how the `success` function now explicitly checks the response (`response.success`) and uses the returned data (`response.message`, `response.message_class`) to dynamically update the HTML elements on the page, rather than just reloading the entire view.

## Displaying Messages in Blade (HTML)

Finally, the display layer must be structured to check for the presence of session flashes and validation errors before rendering any content. Your provided HTML structure is excellent because it uses Blade directives (`@if`) to conditionally render these messages cleanly.

The core strength here is checking `Session::has('message')` for success alerts and `$errors->has()` for validation feedback:

```html
<div>
    {{-- Display Success/Flash Messages --}}
    @if (Session::has('message'))
        <div class="{{ Session::get('message_class') }}">
            <a href="#" class="close" data-dismiss="alert">&times;</a>
            <strong>Note!</strong> {{ Session::get('message') }}
        </div>
    @endif

    {{-- Display Validation Errors --}}
    @if ($errors->has())
        <div class="alert alert-danger fade in">
            <a href="#" class="close" data-dismiss="alert">&times;</a>
            <p>The following errors have occurred:</p>
            <ul>
                @foreach($errors->all() as $error)
                    <li>{{$error}}</li>
                @endforeach
            </ul>
        </div>
    @endif
</div>
```

This structure ensures that if the AJAX call succeeds and returns a message, the user sees it instantly. If the AJAX fails due to validation errors (which Laravel automatically populates in the session), this block displays the detailed error list. This separation of concerns—Server handles data, Client handles interaction, Blade handles presentation—is fundamental to building scalable applications on Laravel.

## Conclusion

Displaying flash messages and errors after an AJAX request is a standard yet critical pattern in modern web development. By correctly structuring your controller to return session data as JSON, implementing robust success/error handling in JavaScript, and using conditional rendering in Blade, you create a seamless and highly responsive user experience. Remember that mastering these asynchronous interactions ensures that your Laravel applications are not only functional but also intuitive for the end-user.
