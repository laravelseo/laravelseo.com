---
title: "Laravel: How to verify if model was changed"
description: "Laravel: How to Verify If a Model Was Actually Changed Before Saving It As developers working with Eloquent in Laravel, efficiency is paramount. We want our..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

As developers working with Eloquent in Laravel, efficiency is paramount. We want our code to be clean, performant, and avoid unnecessary database operations. A common scenario arises when handling form submissions: we only want to persist changes to the database if the incoming data is genuinely different from what is already stored. The question we often face is: how do we reliably detect if a model has been modified before calling the Eloquent `save()` method?

The initial approach, relying on checking the `updated_at` timestamp, is functional but can become cumbersome and less explicit. Let’s explore why that happens and uncover a more robust, developer-friendly pattern for change detection in Laravel.

## The Pitfall of Relying Solely on Timestamps

You correctly identified that comparing timestamps—for instance, checking if `$user->updated_at` matches the timestamp before the update—is one workaround. While it technically works, it introduces several drawbacks:

1.  **State Management Overhead:** You must manually manage and store a reference point (the original timestamp) in your controller or service layer for every model you interact with.
2.  **Indirect Detection:** It detects *if* the timestamp was updated, not necessarily *what* data fields were modified. If an update happens via a different mechanism that bypasses Eloquent's standard saving flow, this check might fail to catch the true intent of the operation.

The desire for a simple `$model->save()` returning `true` or `false` is intuitive, but unfortunately, Eloquent’s core methods are designed more for persistence than change detection within a single call. As detailed in the official documentation on [Eloquent saving and updating models](https://laravelcompany.com/docs/5.5/eloquent#inserting-and-updating-models), the focus is on executing the save operation, not reporting the delta back to the caller directly.

## The Recommended Approach: Comparing Attributes Before Saving

Since Eloquent doesn't provide a direct boolean flag for "changes detected," the most explicit and reliable method lies in comparing the incoming request data against the current model attributes *before* invoking `save()`. This pattern forces you, the developer, to explicitly define what constitutes a change.

Here is how we can implement this cleanly within our application logic:

```php
use Illuminate\Http\Request;
use App\Models\User; // Assuming we are working with a User model

class UserController extends Controller
{
    public function update(Request $request, User $user)
    {
        // 1. Start by comparing the incoming request data with the current model attributes
        $changes = [];
        
        if ($request->has('title')) {
            $changes['title'] = $request->input('title');
        }
        if ($request->has('email')) {
            $changes['email'] = $request->input('email');
        }

        // 2. Check if any attributes are actually different before saving
        if (!empty($changes)) {
            // Apply the changes to the model instance
            $user->fill($changes);
            
            // 3. Execute the save operation
            $user->save();
            
            return redirect()->back()->with('success', 'User updated successfully.');
        }

        // If $changes is empty, no database operation occurs.
        return redirect()->back()->with('warning', 'No changes detected to save.');
    }
}
```

### Why This Pattern is Superior

This approach moves the responsibility of change detection from an unreliable side effect (timestamps) to a deliberate comparison of input data.

1.  **Clarity:** The code explicitly states: "I am checking if the incoming data differs from the current state." This is far easier for other developers (and your future self) to read and maintain than relying on implicit timestamp logic.
2.  **Efficiency:** If no attributes have changed, we bypass the costly database write entirely. This directly addresses your goal of avoiding unnecessary operations.
3.  **Control:** You control exactly which fields trigger a save operation based on business rules, rather than relying on Eloquent's internal state flags.

## Conclusion

While the dream of a simple `$model->save(check_if_changed)` method is appealing, robust application design demands explicit checks. For verifying model changes in Laravel, the most practical and maintainable solution is to implement a pre-save comparison logic by comparing incoming request data against the current model attributes before calling `save()`. This ensures efficiency, clarity, and adherence to best practices when managing your data layer with Eloquent.
