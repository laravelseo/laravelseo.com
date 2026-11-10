---
title: "React js - Laravel 5: Using csrf-token in POST method"
description: "React.js and Laravel CSRF: Mastering Token Passing for AJAX Requests As developers working with the Laravel ecosystem, we often encounter situations where..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "JavaScript", "HTML"]
featured: false
---

As developers working with the Laravel ecosystem, we often encounter situations where the security measures implemented by the framework—like Cross-Site Request Forgery (CSRF) protection—interact with modern, dynamic frontend frameworks like React. The challenge you are facing is very common: how do we securely pass the Laravel CSRF token from the server-rendered view into an asynchronous JavaScript request initiated by React?

This post will walk you through the correct, secure, and practical method for handling CSRF tokens when performing POST requests via AJAX in a Laravel/React setup.

## The Misconception: Why Standard Form Tokens Fail with AJAX

Your attempt to use `$('meta[name="csrf-token"]').attr('content')` is actually the correct approach for retrieving the token from the HTML, but understanding *why* it might fail or seem problematic is key.

When you embed a standard HTML form and submit it, the browser automatically handles sending the hidden field (`csrf-token`) along with cookies, which Laravel validates.

However, when you use `fetch()` or `axios` to make an AJAX request, you are bypassing this automatic form submission process. For CSRF protection to work on these requests, Laravel requires that the token be explicitly sent in a custom HTTP header rather than relying solely on session cookies (which is the default for cookie-based CSRF).

## The Solution: Passing the Token via Custom Headers

The recommended practice for securing AJAX requests in Laravel is to leverage the token exposed by Blade view files and place it directly into a custom request header. This works seamlessly with any frontend framework, including React.

### Step 1: Exposing the Token in the Blade View

First, ensure your main layout file (where your React application is rendered) includes the necessary meta tag. Laravel automatically generates this token for you:

```html
<meta name="csrf-token" content="{{ csrf_token() }}">
```

This line makes the token accessible globally to any JavaScript running on the page. This setup is fundamental to secure interactions within the Laravel framework, as detailed in the official documentation from [laravelcompany.com](https://laravelcompany.com).

### Step 2: Retrieving and Sending the Token in React

In your React component, you no longer need to rely on the DOM manipulation inside the submission function if you are using a library like `fetch`. You simply read the value of that meta tag once when setting up your request headers.

Here is how you correctly structure your `submit` function:

```javascript
const submit = () => {
  // 1. Retrieve the token from the DOM element
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  // 2. Perform the AJAX request, sending the token in the header
  fetch('/words', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      // Crucially, send the token via the X-CSRF-TOKEN header
      'X-CSRF-TOKEN': csrfToken 
    },
    body: JSON.stringify({
      word: this.state.word || ''
    })
  })
  .then((response) => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then((data) => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error during submission:', error);
  });
};
```

### Step 3: Backend Validation in Laravel

On the Laravel backend, because you are sending the token via a custom header, you need to configure your route or controller to validate it. By default, Laravel handles this if you use the `VerifyCsrfToken` middleware on your routes, which automatically checks the incoming request token against the session value.

Ensure your route is protected:

```php
Route::post('/words', [YourController::class, 'store'])->middleware('csrf');
```

This ensures that any POST request hitting this endpoint must contain a valid CSRF token header for the request to be processed successfully.

## Conclusion

The key takeaway is that when moving from traditional form submissions to modern asynchronous AJAX calls in Laravel, you shift the responsibility of passing security tokens from hidden form fields to HTTP headers. By reading the token from the exposed meta tag and explicitly setting it in the `X-CSRF-TOKEN` header during your `fetch` call, you achieve a secure and robust interaction between your React frontend and your Laravel backend. This approach ensures that CSRF protection remains fully intact while supporting dynamic data handling essential for modern Single Page Applications.
