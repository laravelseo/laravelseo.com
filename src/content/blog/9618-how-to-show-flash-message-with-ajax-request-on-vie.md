---
title: "how to show flash message with ajax request on view?"
description: "How to Show Flash Messages with AJAX Requests on View: A Laravel Guide When building dynamic web applications, especially those utilizing AJAX for..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "JavaScript", "Errors"]
featured: false
---

When building dynamic web applications, especially those utilizing AJAX for asynchronous communication, managing user feedback—like success or error messages—becomes crucial. You've run into a very common scenario: you save data successfully via an AJAX request, but when the server responds, you want to display a notification without forcing a full page reload.

The approach you are currently using—saving messages to the session and then reloading the page (`window.location.reload()`)—works, but it breaks the smooth, dynamic experience that AJAX is designed to provide. A superior method involves embedding the message directly within the JSON response from your controller, allowing the frontend JavaScript to handle the display instantly.

As a senior developer working with the Laravel ecosystem, understanding how to manage state and communication across the request/response cycle is key. This guide will walk you through the professional way to handle flash messages with AJAX requests in Laravel.

## The Challenge: Session Flashes vs. Dynamic Responses

In traditional server-side rendering, using the Laravel session (`session()->flash('success', 'Message')`) followed by a redirect (the Post/Redirect/Get pattern) is the standard way to display messages after a form submission. This works because the browser fetches a completely new page, and the session data is immediately available upon loading.

However, with AJAX, the client-side JavaScript receives only the JSON response. If you rely on checking `Session::get()` on the next page load, the message disappears because no full reload occurred. The solution is to shift the responsibility of displaying the message from the server (via a redirect) to the client (via the immediate AJAX response).

## The Solution: Returning Messages in the JSON Response

Instead of just returning a simple success/failure status, your controller should package the flash messages into the JSON response. This makes the data immediately available to the frontend script that initiated the request.

### Step 1: Modifying the Controller

Your controller needs to capture the flash messages and return them as part of the successful response payload. We will use `ApiMessageController` to handle this cleanly, ensuring we send back exactly what the client needs.

In your controller method, instead of just returning a simple string response, you will construct an object that includes the success or error message.

```php
// Example modification in your Controller
public function contactDriver(Request $request)
{
    // ... (Validation and saving logic remains the same)

    if ($saveContact) {
        // Instead of just returning a string, return the message via your API helper
        $response = (new ApiMessageController())->saveresponse("Send Successfully");
    } else {
        $response = (new ApiMessageController())->failedresponse("Failed to send");
    }

    return response()->json($response); // Ensure you are returning a JSON response
}
```

### Step 2: Updating the AJAX Request

The JavaScript side must now handle the `success` callback by reading the data returned from the server and dynamically inserting the HTML alert into the DOM, eliminating the need for a page reload.

Here is how you update your AJAX call to handle the response dynamically:

```javascript
$.ajax({
    url: "{{url('/add_contact_driver')}}",
    type: 'POST',
    data: formData,
    dataType: 'json', // Expecting JSON back
    contentType: false,
    processData: false,
    success: function (response) {
        console.log('Response received:', response);

        // Check if the response contains a flash message and display it
        if (response.message) {
            const alertClass = response.success ? 'alert-success' : 'alert-danger';
            const message = response.message;

            // Dynamically create and insert the alert HTML into the view
            const html = `
                <div class="alert ${alertClass} alert-block" style="width:300px;">
                    <button type="button" class="close" data-dismiss="alert">×</button>
                    <strong>${message}</strong>
                </div>
            `;
            // Append the message to a designated container on your view
            $('#flash-messages').html(html); 
        }
    }, error: function (error) {
        console.log('Error during request:', error);
        // Handle network or server errors here too
    }
});
```

### Step 3: Updating the View (Blade Template)

Finally, your Blade view needs a designated spot where the JavaScript can inject these dynamic messages. You remove the reliance on checking `Session::get()` for this specific AJAX operation, as the data is now coming directly from the successful response.

In your view, you would simply have a container ready to receive the alerts:

```html
<!-- Place this container somewhere visible on your page -->
<div id="flash-messages">
    <!-- Messages will be injected here by JavaScript -->
</div>

<!-- Your main content follows... -->
<div class="row">
    <!-- ... rest of your form/content -->
</div>
```

## Conclusion

By transitioning from relying on server-side redirects to returning data directly in the AJAX response, you achieve a much cleaner, faster, and more modern user experience. This pattern is fundamental when building highly interactive applications with Laravel. It allows your application to communicate state immediately without disrupting the user's flow. Remember, mastering asynchronous communication is one of the core strengths of robust frameworks like Laravel, making complex interactions feel intuitive for the end-user. For deeper dives into structuring these API responses and Eloquent interactions within a Laravel context, exploring resources on [laravelcompany.com](https://laravelcompany.com) will provide excellent guidance.
