---
title: "Update non-fillable field in Laravel Model"
description: "How to Update Non Fillable Fields in Laravel Models Safely As a senior developer working with Laravel, you are constantly balancing the need for powerful..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

As a senior developer working with Laravel, you are constantly balancing the need for powerful functionality with the paramount requirement of security. The scenario you've described—using `$fillable` to protect sensitive fields, but needing administrative access to update those very fields—is a classic architectural challenge. It forces us to look beyond simple mass assignment rules and implement proper authorization checks.

This post will walk you through why your initial setup is good, why it breaks down during updates, and the secure, idiomatic Laravel solution for managing granular field permissions.

---

## The Philosophy Behind `$fillable`: Security First

First, let's address your initial question: **Is omitting fields from the `$fillable` array the right decision?**

Absolutely, yes. It is the cornerstone of robust mass assignment protection in Laravel. By default, when you use methods like `User::create($data)` or implicitly allow updates via `$model->update($data)`, Laravel checks if the keys provided in the request data exist within the model's `$fillable` array. If a field is missing from `$fillable`, Eloquent will silently ignore any attempt to write to that column, effectively preventing accidental or malicious mass assignment. This practice adheres to the principle of least privilege and is highly recommended for securing your application, especially when dealing with sensitive data like `system_admin` flags.

## The Conflict: Authorization vs. Mass Assignment

Your problem arises when you introduce custom authorization (like middleware checking if a user is an admin). You correctly secured your route so only admins can access the update endpoint. However, once inside that route, the `$user->update($request->all())` call hits the model, and Eloquent still enforces the `$fillable` constraint.

The conflict is this:
1. **Authorization Check (Middleware):** Passes. The user *is* an admin.
2. **Mass Assignment Check (`$fillable`):** Fails for `system_admin`, preventing the update.

You need a mechanism that allows you to selectively bypass or override standard mass assignment rules based on context (i.e., the authenticated user's role).

## The Solution: Custom Logic and Explicit Updates

Since standard Eloquent mass assignment protection won't magically allow updates to fields outside `$fillable`, we must instead perform the update explicitly, relying on our existing authorization checks to gate the operation entirely.

The most secure approach is to **never trust the request data implicitly** and rely solely on explicit checks when dealing with sensitive fields.

Here is how you can refactor your controller logic to achieve this safely:

```php
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Gate; // Or Policies, depending on your setup

public function updateUser($userId, Request $request)
{
    $user = User::findOrFail($userId);
    $updateData = $request->only(['system_admin', 'some_other_field']); // Only pull the fields you expect updates for

    // 1. Authorization Check: Ensure the authenticated user is an admin.
    if (!Gate::allows('update-system-settings')) { // Assuming you have a Gate defined
        abort(403, 'Unauthorized action.');
    }

    // 2. Granular Update: Only update the fields that are explicitly allowed.
    // We manually check if the user is authorized to touch these specific fields.
    $user->update([
        'system_admin' => $request->input('system_admin'), // Explicitly allow this field, even if it wasn't in $fillable
        'some_other_field' => $request->input('some_other_field'),
    ]);

    return response()->json(['message' => 'User updated successfully'], 200);
}
```

### Why This Works Better

1. **Explicit Control:** Instead of relying on the model's `$fillable` list, you are explicitly listing *exactly* which fields are permitted to be changed in this specific context.
2. **Authorization First:** The authorization check (`Gate::allows(...)`) happens first. If the user isn't authorized, the process stops immediately.
3. **Security Maintained:** Even if your middleware is bypassed or a bug exists elsewhere, the final update logic still requires explicit administrative permission, ensuring that only authorized entities can modify these sensitive columns.

When dealing with complex authorization and data manipulation in Laravel, moving beyond simple mass assignment rules into custom service layers or using dedicated Policies (as promoted by the [Laravel Company](https://laravelcompany.com) ecosystem) provides a much cleaner, more maintainable structure for enforcing business logic.

## Conclusion

The core takeaway is that `$fillable` is an excellent tool for *preventing* accidental mass assignment, but it cannot be used to *grant* permission dynamically based on runtime context. For scenarios requiring conditional updates (like administrative settings), the safest pattern is to combine robust authorization checks (using Gates or Policies) with explicit, targeted updates in your controller logic. By taking this granular approach, you ensure that security remains your highest priority while still delivering the necessary administrative functionality.
