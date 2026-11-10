---
title: "Laravel 5.7 email verification expiration time"
description: "Customizing Email Verification Expiration in Laravel 5.7: A Developer's Guide When working with authentication systems in Laravel, customizing default..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

When working with authentication systems in Laravel, customizing default behaviors—such as setting expiration times for email verification links—is a common requirement. As you've observed, looking at the standard configuration files like `config/auth` often reveals settings related to password resets (`password_resets`), but there isn't an immediately obvious global setting for the email verification token expiration time.

This post will dive into why this setting is handled differently in Laravel and how you, as a developer, can implement granular control over the validity period of your email verification links.

## Understanding Laravel's Approach to Verification

The reason you cannot find a direct `expire` setting for email verification within `config/auth` stems from how Laravel manages its core authentication features. Unlike password resets, which rely on predefined system flows, email verification is often tied directly to the specific token or session data generated during the process.

In many standard Laravel setups, especially when using scaffolding tools or packages that handle email verification (like Laravel Breeze or Jetstream), the expiration logic is usually managed at the level of the Eloquent model itself or within custom route/controller logic rather than a single configuration file entry. This keeps the core configuration clean while allowing for flexible, context-specific rules.

If you are extending these features, you will typically be interacting with underlying Eloquent models that store the verification status and timestamps. To customize expiration, we need to look at the actual data persistence layer.

## Implementing Custom Expiration Logic

Since there isn't a single configuration key for this specific timing, the solution lies in controlling the timestamps stored in your database tables. Let’s assume you have a `users` table or a related verification table where the token and expiration date are stored.

### Step 1: Database Schema Consideration

Ensure your relevant model or table includes fields to track the validity of the link. For email verification, this typically involves storing the token and a timestamp for when that token expires.

```php
// Example structure in your User model or Verification Token Model
class User extends Authenticatable
{
    // ... other properties

    protected $fillable = [
        'email_verified_at', // Default Laravel field
        'verification_token',
        'expires_at',         // Custom field for expiration time
    ];
}
```

### Step 2: Controlling Expiration in the Controller

The actual control over when a link becomes invalid happens in your application logic—specifically, when you generate the token and when you validate it. You need to calculate the expiration time dynamically based on your desired duration (e.g., 24 hours).

When creating the verification request:

```php
use App\Models\User;
use Carbon\Carbon;

class VerificationController extends Controller
{
    public function sendVerificationEmail(User $user)
    {
        // Define expiration time, for example, 24 hours from now
        $expiresAt = Carbon::now()->addHours(24);

        $user->update([
            'verification_token' => Str::random(60), // Generate a unique token
            'expires_at' => $expiresAt,             // Set the expiration timestamp
        ]);

        $user->sendEmailVerificationNotification();

        return redirect()->back()->with('status', 'Verification link sent.');
    }
}
```

When validating the incoming request:

```php
public function store(Request $request)
{
    $user = User::where('verification_token', $request->token)->first();

    if (!$user) {
        return redirect()->back()->withErrors(['message' => 'Invalid token.']);
    }

    // Check if the token exists AND if the expiration time has passed
    if ($user->expires_at && $user->expires_at->isPast()) {
        // Token has expired, revoke it and return an error
        $user->delete(); // Or use a specific revocation method
        return redirect()->route('verification.error');
    }

    // If valid, mark as verified
    $user->markAsVerified();

    return redirect('/home');
}
```

## Conclusion: Developer Control is Key

In summary, while Laravel provides robust authentication scaffolding, customization of specific expiration policies like email verification requires diving into the Eloquent models and application controllers rather than relying solely on global configuration files. By managing timestamps directly within your database interactions using Carbon for time manipulation, you gain full control over the validity period of your user flows. This principle of controlling data persistence is central to building flexible applications, much like adhering to Laravel's principles outlined by the [Laravel Company](https://laravelcompany.com). Always remember that custom logic implemented in your application code will always supersede default configuration settings when it comes to runtime behavior.
