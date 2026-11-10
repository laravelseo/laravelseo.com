---
title: "Laravel display a custom message in Maintenance Mode"
description: "Laravel Maintenance Mode: How to Display Custom Messages from Artisan Commands When managing application uptime, maintenance mode is an essential feature in..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

When managing application uptime, maintenance mode is an essential feature in any robust web application. Laravel provides a convenient way to enable this mode using `php artisan down`, which effectively serves a placeholder view (like `503.blade.php`) to visitors.

As you've discovered by checking the official documentation, running the command with an optional message flag is a great idea for providing context to users about the downtime:

```bash
php artisan down --message='Upgrading Database' --retry=60
```

However, as you correctly encountered, trying to access this custom value directly in your Blade view—for instance, using `{{ $message }}`—results in an undefined variable. This is a common hurdle when dealing with data passed via Artisan commands that doesn't automatically map into the standard request scope.

This post will dive deep into why this happens and provide the correct, developer-approved methods for successfully passing custom messages from your Artisan command directly into your maintenance view.

## Understanding the Limitation

The reason `$message` is undefined is due to how Laravel handles Artisan commands versus standard HTTP requests. When you run `php artisan down`, it executes a specific process designed to temporarily halt traffic. While the `--message` flag successfully stores this value within the context of the command execution, that data is not automatically injected into the standard request variables available when the `503.blade.php` view is rendered by the web server.

To display dynamic information in a view, the data must be explicitly passed from the controller or the logic that initiates the response to the view layer. Relying solely on command arguments for view rendering often requires an intermediary step.

## The Solution: Storing Data via Session or Route

The most reliable way to bridge the gap between an Artisan command and a Blade view is to use Laravel's session mechanism or route the user through a temporary state that holds this information. Since maintenance mode is essentially a specific, controlled access point, we can leverage that structure.

Here are two robust methods to achieve your goal:

### Method 1: Using Session Data (Recommended for Maintenance Mode)

Since maintenance mode is about temporarily controlling access across the application, storing the message in the session is an ideal pattern. When the application loads and detects maintenance mode, it checks the session for a stored message.

**Step 1: Modify the Artisan Command**
Instead of just using `--message`, modify your command to explicitly set the session data before exiting.

```php
// In your custom Artisan command class
public function handle()
{
    session()->put('maintenance_message', $this->option('message'));
    // ... rest of maintenance logic
}
```

**Step 2: Update the Maintenance View (`503.blade.php`)**
In your Blade file, you can now safely retrieve this data from the session.

```blade
{{-- resources/views/503.blade.php --}}
<!DOCTYPE html>
<html>
<head>
    <title>Maintenance</title>
</head>
<body>
    <h2>Site Under Maintenance</h2>
    <p>{{ session('maintenance_message', 'We are currently undergoing scheduled maintenance.') }}</p>
</body>
</html>
```

This approach keeps the command focused on execution while using Laravel’s built-in session handling to persist the required message for the subsequent HTTP request. This aligns well with the principles of clean, decoupled architecture found in frameworks like those promoted by **laravelcompany.com**.

### Method 2: Passing Data via Route (Alternative Approach)

If you prefer a more explicit flow, you can create a dedicated route that handles the maintenance state and passes the message as a query parameter or session flash data before redirecting to the maintenance view. This gives you full control over the flow.

## Conclusion

The challenge of accessing command-line arguments within a standard HTTP request context is a classic Laravel puzzle. The key takeaway is that data passed via Artisan commands is generally not automatically available in the request scope. By shifting the responsibility—storing the custom message in the session within your command and retrieving it from the session within your Blade view—you create a robust, predictable, and easily maintainable solution. This pattern ensures that your application remains decoupled while providing excellent user feedback during downtime.
