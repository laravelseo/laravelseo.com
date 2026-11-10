---
title: "How to return simple Flash message with Inertia React & Laravel?"
description: "How to Return Simple Flash Messages with Inertia React & Laravel As developers building modern, full stack applications, one of the most common necessities..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "JavaScript", "PHP"]
featured: false
---

As developers building modern, full-stack applications, one of the most common necessities is communicating feedback—whether it’s a success notification, an error message, or a warning. When using a stack like Laravel and Inertia.js, managing these messages across redirects can sometimes feel like an extra hurdle. You need to pass data from your backend controller to your frontend components efficiently.

This guide will walk you through the most straightforward and idiomatic way to return simple flash messages from a Laravel controller and correctly display them in your Inertia React application.

## The Mechanism: Leveraging Laravel Sessions via Inertia

The beauty of using Laravel as the backend foundation for an Inertia application is that it seamlessly bridges the gap between server-side data (like session flashes) and client-side state (Inertia props). When you use the standard Laravel redirection method, Inertia automatically captures these flashed messages and makes them available to your frontend components.

The key lies entirely in how you structure your controller response. You don't need complex custom API calls; you just need to use Laravel’s built-in session handling.

### Step 1: Setting the Flash Message in the Controller (Laravel)

In your controller method, after performing an action (like form submission and redirection), use the `with()` method on the redirect response. This tells Laravel to store the provided data in the session flash, which Inertia will subsequently expose.

Here is how your controller should look:

```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

public function completeForm(Request $request)
{
    $request->validate([
        'commitment' => 'required|string',
        'partner' => 'required|string',
        'question' => 'required|string',
    ]);

    $user = Auth::user();
    
    // 1. Perform the necessary database updates
    $user->update([
        'partner' => $request->partner,
        'commitment' => $request->commitment,
        'question' => $request->question,
    ]);

    // 2. Redirect and attach the flash message using with()
    return redirect('/dashboard')->with('success', 'Your profile has been successfully updated!');
}
```

By calling `redirect()->with('success', 'Your message')`, Laravel stores this data in the session. Inertia intercepts this redirect, packages the session data, and embeds it into the component props sent to the frontend.

### Step 2: Fetching the Message on the Frontend (Inertia React)

In your Inertia React component (like `Dashboard.js`), the flashed data is automatically available within the `props` object passed from the server. You can destructure or access this data directly within your component logic.

Since Inertia handles flashing messages, they are typically accessible via a property named `flash` on the props object.

Here is how you would consume that message in your `Dashboard.js` file:

```javascript
export default function Dashboard(props) {
    // Destructure the flash data directly from props
    const { success } = props.flash; 

    // Or, if you prefer accessing it directly:
    // const message = props.flash.success; 

    return (
        <Empty
            auth={props.auth}
            errors={props.errors}
            header={/* ... header content ... */}
        >
            {/* Display the flash message if it exists */}
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{success}</span>
                </div>
            )}

            {/* Rest of your dashboard content */}
            <div className="mt-16 border-2 border-yellow-500 p-2">
                {/* ... rest of the form/content ... */}
            </div>
        </Empty>
    );
}
```

Notice how simple this is. Because Inertia bridges Laravel's session mechanism, you avoid writing any custom API endpoints just to handle transient feedback. This pattern demonstrates powerful integration between your backend logic and frontend presentation, which is central to modern web development principles taught by the community at places like [Laravel Company](https://laravelcompany.com).

## Conclusion

Returning flash messages in an Inertia/Laravel setup is remarkably straightforward. By relying on Laravel's standard `with()` and `redirect()->with()` methods, you leverage the existing session infrastructure. The frontend automatically receives this data through the Inertia props, allowing you to display success or error notifications without writing extra controller logic for every transient message. This approach keeps your code clean, efficient, and tightly integrated with the Laravel ecosystem.
