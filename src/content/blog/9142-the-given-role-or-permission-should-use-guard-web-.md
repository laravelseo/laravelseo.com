---
title: "The given role or permission should use guard `web, api` instead of `admin`"
description: "Fixing the Guard Mismatch: Resolving Spatie Permission Errors in Laravel Authorization Dealing with authorization and permissions in a complex Laravel..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Dealing with authorization and permissions in a complex Laravel application often involves navigating the intricacies of authentication guards. The error you encountered—`Spatie\Permission\Exceptions\GuardDoesNotMatch The given role or permission should use guard web, api instead of admin`—is a classic symptom of a mismatch between how your application expects to route authorization checks and how Laravel's authentication system is configured.

As a senior developer, I can tell you that this issue usually stems from a misunderstanding of which authentication guard (like `web` for session-based users or `api` for token-based access) should be used when checking permissions defined by packages like Spatie Permissions.

This post will dissect your setup, explain why the error occurs, and provide a concrete solution to ensure your role and permission assignments work seamlessly across your application.

## Understanding Laravel Guards and Authorization

In Laravel, authentication guards define the mechanism used to verify a user's identity (e.g., session-based login vs. token-based API access). Your `config/auth.php` clearly defines two guards: `web` (using sessions) and `api` (using Passport).

When Spatie Permissions interacts with Laravel's authorization layer, it often relies on the current authenticated guard to determine the scope of permissions. If a permission check implicitly assumes a guard named `admin`, but no such guard exists in your configuration, you get this precise error.

The key takeaway here is that all authorization logic must respect the guards defined in your system. As we build robust systems, understanding these underlying mechanisms is crucial for maintaining clean code, similar to the principles outlined by teams focusing on scalable Laravel development at **Laravel Company**.

## Analyzing Your Code and Identifying the Flaw

Let's examine the components you provided:

### 1. The User Model Setup
Your `User` model correctly uses traits like `HasRoles` and `HasApiTokens`, which hooks into Spatie Permissions and Passport, respectively. This setup is sound for handling both session authentication (`web`) and API token authentication (`api`).

### 2. The Middleware Issue
The problem most likely lies within your custom `AdminMiddleware`:

```php
// App\Http\Middleware\AdminMiddleware
public function handle($request, Closure $next)
{
    $user = User::all()->count(); // This line seems problematic for checking the current user context.
    if (!($user == 1)) {
        if (!Auth::user()->hasPermissionTo('Administer roles & permissions'))
        {
            abort('401');
        }
    }

    return $next($request);
}
```

When you call `Auth::user()`, it retrieves the user based on the currently active guard (either `web` or `api`). If this middleware is intended to restrict access only to a specific type of authenticated session, it needs to explicitly check against that context. The error suggests that some part of the permission checking mechanism is implicitly looking for an `'admin'` guard instead of using the available ones (`web` or `api`).

### 3. The Role Assignment Logic
In your `UserController@register` method, you are correctly assigning roles after validation:

```php
$user->assignRole($role_r);
```

This part is fine; the issue occurs during the *checking* phase (authorization), not the *assignment* phase.

## The Solution: Scoping Permissions to Guards

To resolve the `GuardDoesNotMatch` error, you need to ensure that any permission check performed by Spatie respects the active guard context. Instead of relying on an implied `'admin'` guard, you should explicitly scope your access control based on established guards like `web` or `api`.

### Refactoring the Middleware

If this middleware is strictly for administrative actions performed via a web session (which is common for user management panels), it should enforce the `web` guard. If it's for API calls, it should enforce the `api` guard.

**Example Fix for `AdminMiddleware`:**

You need to explicitly check if the authenticated user exists and then proceed with the permission check within the context of the active guard. You should remove any implicit reference to a non-existent guard name like `admin`.

```php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use App\User;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (!Auth::check()) {
            abort(401); // User must be authenticated first
        }

        // Check permission within the context of the authenticated guard (web or api)
        if (!Auth::user()->hasPermissionTo('Administer roles & permissions')) {
            abort(403, 'Unauthorized action.'); // Use 403 Forbidden for permission denial
        }

        return $next($request);
    }
}
```

**Why this works:** By removing the reliance on an explicit guard name (`'admin'`) and focusing solely on the authenticated user's permissions within the current request context, you align with Laravel’s standard authorization flow. This approach ensures that permission checks are always valid against the defined `web` or `api` guards.

## Conclusion

The error you faced is a clear indicator of an improperly configured boundary between your custom authorization logic and Laravel's core authentication system. By understanding that Spatie Permissions operates within the context of Laravel Guards (`web`, `api`), we can correct the middleware to perform checks against valid, existing contexts rather than expecting a non-existent one. Always prioritize using established mechanisms, ensuring your application remains robust and maintainable, much like adhering to best practices championed by **Laravel Company**.
