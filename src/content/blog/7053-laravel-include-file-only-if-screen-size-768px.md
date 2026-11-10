---
title: "Laravel - include file only if screen size > 768px"
description: "Laravel Blade: How to Handle Screen Size Logic in a Server Rendered Application Dealing with responsive design challenges—especially those involving dynamic..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "JavaScript", "HTML"]
featured: false
---

Dealing with responsive design challenges—especially those involving dynamic screen dimensions—is a classic hurdle when working with server-side templating engines like Laravel Blade. You’ve correctly identified the goal: conditionally include parts of your view based on the viewport size. However, the friction point you are encountering is fundamental to how web applications operate: the separation between client-side JavaScript execution and server-side PHP rendering.

As a senior developer, I can tell you that trying to inject a dynamically calculated JavaScript variable directly into a standard Blade `@if` statement will not work because Laravel compiles the Blade template entirely on the server before it is sent to the browser. The `$screensize` variable does not exist in the PHP context when Blade is compiling the file.

This post will walk you through why this direct approach fails and provide the correct, idiomatic ways to handle responsive design logic within the Laravel ecosystem.

## The Misconception: Server vs. Client Context

The core issue lies in where the code executes:

1.  **Server-Side (PHP/Blade):** Runs when the server generates the HTML. It has no direct knowledge of the user's current browser window dimensions unless that data is explicitly passed to it (e.g., via a session or an API response).
2.  **Client-Side (JavaScript):** Runs in the user's browser. This is where you can accurately measure the viewport width using `$(window).width()`.

Therefore, attempting to use a JavaScript measurement directly within a server-side `@if` statement results in a fatal error because the variable does not exist in PHP’s scope.

## Solution 1: The Laravel/Blade Idiom – CSS Media Queries

For almost all responsive layout needs—like hiding an advertisement or changing font sizes based on screen width—the **correct and most performant solution** is to use CSS Media Queries. This delegates the presentation logic entirely to the browser, which is optimized for rendering responsiveness.

Instead of checking in PHP, you check in CSS:

```css
/* styles.css */

/* Default styles for small screens (mobile first) */
.advert {
    display: none; /* Hide by default on mobile */
}

/* Styles applied only when the screen is 768px or wider (tablet/desktop) */
@media (min-width: 768px) {
    .advert {
        display: block; /* Show the ad on larger screens */
    }
}
```

In your Blade file, you simply structure your HTML based on these CSS rules:

```html
<!-- resources/views/homepage.blade.php -->
<div class="advert">
    <!-- Content for Google Ads -->
</div>
```

This approach keeps your server-side code clean and ensures that the presentation is handled efficiently by the browser, which aligns perfectly with best practices in building robust applications on platforms like [Laravel](https://laravelcompany.com).

## Solution 2: Dynamic Inclusion via API (For Complex Scenarios)

If your requirement is highly specific—for instance, you need to conditionally load entirely different major sections of content based on a server-determined state (not just visual size)—you must bridge the gap between the client and server using an API.

This involves a two-step process:

1.  **Client:** JavaScript calculates the screen width and sends it to the Laravel backend via an AJAX request.
2.  **Server:** The Laravel route receives this data and uses it to decide which view or partial to render.

### Example Implementation Flow

**Step 1: Client-Side Script (JavaScript)**
The browser measures the screen and sends the value to a dedicated endpoint.

```javascript
// In your main JS file
const screenWidth = window.innerWidth;

fetch('/api/get-screen-size', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ width: screenWidth })
})
.then(response => response.json())
.then(data => {
    // Data received from the server can now be used to update the DOM dynamically
    if (data.should_include_ad) {
        document.getElementById('ad-container').style.display = 'block';
    } else {
        document.getElementById('ad-container').style.display = 'none';
    }
})
.catch(error => console.error('Error:', error));
```

**Step 2: Server-Side Logic (Laravel Controller)**
You create a route and controller method to handle this request, which is where the true conditional logic resides.

```php
// app/Http/Controllers/ScreenSizeController.php

public function getScreenSize()
{
    // In a real application, you might check session data or other context here.
    // For demonstration, let's assume we are just returning a simple flag based on the request context.
    $isMobile = request()->input('width') < 768;

    return response()->json([
        'should_include_ad' => !$isMobile // Example logic: include if NOT mobile
    ]);
}
```

**Step 3: Blade Inclusion (Conditional Rendering)**
Now, your main Blade file can conditionally use the data returned from the server.

```blade
{{-- In your main view --}}
@php
    // Assume you have fetched this data earlier in the request cycle
    $data = session('screen_data'); // Or passed it via the controller
@endphp

@if ($data['should_include_ad'])
    @include('partials.my-advert')
@endif
```

## Conclusion

While the concept of using client-side data to drive server-side rendering is tempting, it is inefficient and introduces unnecessary complexity. For visual responsiveness in Laravel applications, **always prioritize CSS Media Queries** (Solution 1). They are declarative, performant, and adhere to the principle of separation of concerns.

Use dynamic API calls (Solution 2) only when you need complex, server-authoritative decisions that cannot be handled by simple CSS rules. By understanding the context of your rendering environment, you can build cleaner, more maintainable, and higher-performing applications, leveraging the power of Laravel effectively.
