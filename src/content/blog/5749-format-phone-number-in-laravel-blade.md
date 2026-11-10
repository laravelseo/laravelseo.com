---
title: "Format phone number in Laravel Blade"
description: "Format Phone Numbers in Laravel Blade: A Developer’s Guide Is there a simple way to format a phone string for display in a Laravel Blade template? The short..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Is there a simple way to format a phone string for display in a Laravel Blade template? The short answer is yes, but the *best* way involves proper separation of concerns. While you can perform basic string manipulation directly within Blade, relying on your controller or Eloquent model to handle data transformation ensures cleaner, more maintainable, and reusable code—a core principle of robust application design, much like the philosophy behind frameworks like Laravel.

This guide will walk you through the most effective methods for taking a raw phone number, such as `'612345678'`, and displaying it in a human-readable format like `'612 345 678'` within your Blade views.

## The Principle: Format Data in the Backend

As senior developers, we adhere to the principle of keeping presentation logic (what the user sees) separate from business logic (how the data is processed). Therefore, the most robust solution involves formatting the phone number *before* it is passed to the Blade view. This keeps your Blade files clean and allows you to reuse the formatted string elsewhere in your application.

We will use PHP's powerful string functions within the controller or model layer to achieve this transformation.

### Method 1: Using String Manipulation (The Practical Approach)

For a simple, fixed format like the example provided, basic string manipulation using `mb_substr` and custom logic is highly effective in PHP. This method is fast and requires no external libraries for basic formatting.

Imagine you have retrieved `$user{'phone'} = '612345678'`. You need to insert spaces every three digits.

**Example Implementation (In your Controller):**

```php
// app/Http/Controllers/UserController.php

public function show($id)
{
    $user = User::findOrFail($id);
    $rawPhone = $user->phone; // Let's assume this is '612345678'

    // 1. Ensure the string is treated as multi-byte safe if necessary (good practice)
    $formattedPhone = '';

    // Split the string into chunks of 3 digits, starting from the end
    $parts = str_split(str_chunk($rawPhone, 3));

    // Reassemble the parts with spaces
    $formattedPhone = implode(' ', $parts);

    // Now pass this nicely formatted string to the view
    return view('users.profile', compact('user', 'formattedPhone'));
}
```

**Blade Display:**

In your Blade file, you simply output the pre-formatted variable:

```blade
<div>
    <p>Phone Number: {{ $formattedPhone }}</p>
</div>
```

### Method 2: Leveraging Laravel's Internationalization Features (The Scalable Approach)

For real-world applications dealing with international phone numbers, relying solely on manual string splitting can become brittle. A more scalable approach is to use a dedicated library or leverage built-in localization features if you are managing complex country codes and formats. While Laravel itself doesn't ship a specific phone number formatting class out of the box, understanding how to integrate external packages aligns with building powerful applications on the **Laravel** framework.

If your application requires handling numerous international formats (e.g., E.164 standards), integrating specialized packages can simplify this complexity significantly. This approach demonstrates how Laravel provides the structure for easily incorporating complex logic through its service layer architecture, ensuring that even complex tasks remain manageable and testable.

## Conclusion: Clean Code Wins

Formatting data is a common requirement, but handling it correctly separates concerns beautifully. Avoid embedding complex string manipulation directly into your Blade views. Instead, treat your controller as the gatekeeper of data integrity. By performing formatting logic in PHP before passing the data to Blade, you ensure that your views are purely focused on presentation, making debugging easier and future maintenance straightforward. Always strive for clean, organized code, which is what makes frameworks like Laravel so powerful for building scalable software.
