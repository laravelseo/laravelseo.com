---
title: "How can I send a DELETE request when a button is clicked?"
description: "How Can I Send a DELETE Request When a Button is Clicked in Laravel? As developers working with the Laravel ecosystem, we frequently need to bridge the gap..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "JavaScript", "HTML"]
featured: false
---

As developers working with the Laravel ecosystem, we frequently need to bridge the gap between static HTML forms and dynamic backend operations. A very common requirement is making an action—like deleting a record—triggered by a simple user interaction, such as clicking a button on a table row. When dealing with RESTful interactions in Laravel, this involves setting up the correct routing on the server side and handling asynchronous requests using JavaScript on the client side.

This guide will walk you through the complete process of sending a `DELETE` request from a frontend button to your Laravel Resource Controller, ensuring security and proper data handling.

## The Backend Foundation: Setting Up the DELETE Route

Before we write any JavaScript, the backend must be perfectly configured to receive the `DELETE` request. In Laravel, this is handled by defining a route that points to your controller method, which in turn uses Eloquent to perform the deletion.

Assuming you are using a Resource Controller (e.g., `UserController`), your routes should look something like this in `routes/web.php`:

```php
use App\Http\Controllers\UserController;

Route::resource('users', UserController::class);
// This automatically defines routes for index, create, store, show, edit, update, destroy.
```

The crucial part is the `destroy` method within your controller. This method will handle the incoming `DELETE` request.

```php
// app/Http/Controllers/UserController.php

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function destroy(User $user)
    {
        // Find the user by ID and delete the record from the database
        $user->delete();

        // Return a JSON response indicating success
        return response()->json(['message' => 'User deleted successfully']);
    }
}
```

By defining a route structure like `Route::resource`, Laravel automatically maps the HTTP `DELETE` verb to the corresponding controller method (in this case, `destroy`). This adheres to RESTful principles and is a core concept when building robust APIs with Laravel.

## The Frontend Implementation: Sending the Request via JavaScript

To trigger this deletion upon a button click, we must use JavaScript's asynchronous capabilities, typically the `fetch` API or Axios, as standard HTML forms cannot directly execute these requests without page reloads.

The most important aspect here is handling the **CSRF token**. Laravel automatically protects routes against Cross-Site Request Forgery by requiring a CSRF token. When sending dynamic AJAX requests from a browser to a Laravel application, you must include this token in the request headers or body.

Here is an example using the modern `fetch` API:

```javascript
document.addEventListener('DOMContentLoaded', function() {
    // Assume you have a button associated with a specific user ID
    const deleteButton = document.getElementById('delete-btn-' + user_id); 

    if (deleteButton) {
        deleteButton.addEventListener('click', function(event) {
            event.preventDefault(); // Stop default action if it's an anchor tag
            
            // 1. Get the CSRF token from the meta tag or cookie
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

            // 2. Define the URL for the DELETE request
            const deleteUrl = `/users/${user_id}`; // Adjust this path based on your route definition

            fetch(deleteUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    // Include the CSRF token for security
                    'X-CSRF-TOKEN': csrfToken 
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // Assuming your controller returns JSON
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                alert('Record successfully deleted!');
                // Refresh the table or update the UI here
            })
            .catch(error => {
                console.error('Error during deletion:', error);
                alert('Error: Could not delete record.');
            });
        });
    }
});
```

**HTML Setup Note:** Remember to ensure your HTML includes the CSRF token meta tag for this to work correctly across all requests:

```html
<meta name="csrf-token" content="{{ csrf_token() }}">
```

## Conclusion

Sending a `DELETE` request triggered by a button click in a Laravel application is a standard pattern that combines server-side routing, Eloquent model interaction, and asynchronous JavaScript. By correctly setting up your `destroy` method in the controller to handle the deletion and ensuring you securely pass the CSRF token via your AJAX request headers, you can successfully implement dynamic data manipulation on the frontend. Mastering this interplay between Laravel's MVC structure and modern JavaScript APIs is key to building powerful, responsive web applications. For more deep dives into Eloquent and routing within Laravel, I highly recommend exploring official resources like [laravelcompany.com](https://laravelcompany.com).
