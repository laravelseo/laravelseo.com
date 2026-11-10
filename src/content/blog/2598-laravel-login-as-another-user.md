---
title: "Laravel login as another user"
description: "Laravel Impersonation: Allowing Superadmins to Log In as Other Users As developers building complex applications with hierarchical permissions, managing user..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

As developers building complex applications with hierarchical permissions, managing user roles and access levels is critical. When you introduce nested roles, such as a Superadmin who needs to delegate or temporarily act as another user (Admin or Normal), the challenge shifts from simple authentication to sophisticated authorization logic. This post dives into how you can architect this functionality within a Laravel application, moving beyond standard role checks to enable seamless user impersonation.

## Understanding the Challenge: Hierarchical Access Control

You have established a clear hierarchy: Superadmin > Admin > Normal. The requirement is: "How do I allow an authenticated superadmin user to log in as an admin or normal user with a click of a button?"

This isn't simply about logging into a different account; it’s about temporarily changing the *context* of the current session or request so that subsequent operations are performed under the permissions of the impersonated user. Simply swapping tokens is insecure and often impractical for application logic. The correct approach involves leveraging Laravel’s robust authorization system, combined with careful session management.

## The Developer Solution: Context-Aware Impersonation

Directly logging a Superadmin *as* another user requires manipulating the authenticated state safely. We will use Eloquent relationships to define the access rules and custom middleware to enforce these rules during the impersonation process.

### Step 1: Defining the Relationships (Eloquent)

First, ensure your models are properly linked. In Laravel, defining these relationships is key to querying permissions efficiently. The relationship between users and roles must be clearly defined. This practice of structuring data effectively is central to building scalable applications, much like adhering to the principles discussed on [laravelcompany.com](https://laravelcompany.com).

For this example, we assume the following structure:

```php
// App\Models\User.php
class User extends Authenticatable
{
    // ... existing code

    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }
}

// App\Models\Role.php
class Role extends Model
{
    protected $fillable = ['name'];

    public function users()
    {
        return $this->belongsToMany(User::class);
    }
}
```

### Step 2: Implementing the Impersonation Logic

The impersonation action should be handled by a dedicated controller method or service layer, not directly by manipulating the session globally. When a Superadmin clicks "Login as Admin," we perform the following sequence:

1.  **Identify Target:** Determine which user (ID) the Superadmin wants to impersonate.
2.  **Verify Permission:** Crucially, check if the current Superadmin has the authority (e.g., being a Superadmin) to access the target role's scope.
3.  **Session Swap:** If permission is granted, swap the authenticated user in the session context for the target user's ID and roles.

Here is a conceptual look at how this logic might reside within a controller:

```php
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class ImpersonationController extends Controller
{
    public function impersonate(Request $request, $targetUserId)
    {
        $superadmin = Auth::user();
        $targetUser = User::findOrFail($targetUserId);

        // 1. Security Check: Ensure the current user is a Superadmin
        if ($superadmin->role->name !== 'superadmin') {
            abort(403, 'Unauthorized action.');
        }

        // 2. Hierarchical Check (Optional but recommended): Ensure hierarchy allows access
        // In this simple case, Superadmin can impersonate anyone below them.
        if ($targetUser->role_id > $superadmin->role_id) {
             // This check ensures the user is attempting to log in as someone they are authorized to see.
             // For strict delegation, you might need more granular role checks here.
             return response()->json(['error' => 'Permission denied for this impersonation.'], 403);
        }

        // 3. Perform the Impersonation (Session Swap)
        Auth::login($targetUser);

        return response()->json([
            'message' => 'Successfully logged in as
