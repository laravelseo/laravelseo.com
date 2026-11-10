---
title: "How to make a delete request with Laravel"
description: "Mastering Deletions in Laravel: Avoiding MethodNotAllowedHttpException When Bypassing Resource Controllers As developers working with the Laravel ecosystem,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP", "Errors"]
featured: false
---

As developers working with the Laravel ecosystem, managing CRUD operations—especially deletions—is a fundamental task. While Laravel provides elegant solutions through Resource Controllers, there are times when you need custom logic or specific control over how a deletion is executed. If you attempt to bypass the standard RESTful conventions and define your own delete route, you often run into unexpected HTTP exceptions, like the `MethodNotAllowedHttpException` you encountered.

This post will dive into why this happens, provide the correct architectural approach for handling deletions in Laravel without relying solely on Resource Controllers, and show you how to structure your application for cleaner, more robust code.

---

## The Pitfall: Why Do We Get MethodNotAllowedHttpException?

The `MethodNotAllowedHttpException` indicates that the HTTP method being sent by the client (in this case, a form submission) does not match any defined route handler for that specific URI.

In your example setup:
```php
Route::delete('/deleteTag/{tag}','Controller2@deleteTag');
```
While this route *looks* correct for a DELETE request, the error often arises when mixing manual route definitions with standard form submissions. When you use an HTML form with `method="delete"`, the request is sent directly to that endpoint. The exception suggests that either the routing setup isn't perfectly aligned with the expected input, or there are middleware conflicts preventing the request from reaching the intended controller method correctly in this specific context.

The core issue isn't just the route definition; it's often how we structure resource management in Laravel.

## The Idiomatic Laravel Approach: Eloquent Deletion

For deleting a single model instance by its ID, the most efficient and robust way in Laravel is to leverage Eloquent’s built-in methods, keeping your controller logic clean and adhering to the principles discussed on the [Laravel Company website](https://laravelcompany.com).

Instead of creating a separate route just for deletion, we can often handle this directly within the model or a dedicated service layer.

### Step 1: Refactoring the Controller Logic

Let's refine your controller method to ensure it correctly fetches and deletes the record using standard Eloquent practices. This eliminates complex manual lookups in the controller itself.

```php
use App\Models\Tag;
use Illuminate\Http\Request;

class TagController
{
    public function deleteTag(Request $request, Tag $tag)
    {
        // 1. Authorization Check (Crucial Step!)
        // Ensure the authenticated user is authorized to delete this tag.
        $this->authorize('delete', $tag); 

        // 2. Perform Deletion
        $tag->delete();

        // 3. Redirect
        return redirect()->route('dashboard'); // Use named routes for cleaner redirection
    }
}
```

### Step 2: Defining the Route Correctly

If you are not using Resource Controllers, defining a specific route is fine, but it must be robust. Ensure your route definition explicitly targets the model instance if possible, or use standard RESTful conventions where applicable.

If you insist on a custom DELETE route for non-resource controllers, ensure your controller method accepts the necessary parameters cleanly. For simple deletions, sometimes passing the ID directly via the URL parameter and letting the controller fetch it is cleaner than relying solely on the `$tag` model binding within the route itself if you are bypassing standard conventions.

A simpler, more direct approach for deletion often involves using the model's static methods:

```php
// In your custom controller method:
public function destroy(Tag $tag)
{
    $tag->delete();
    return redirect()->back()->with('success', 'Tag was successfully deleted.');
}

// Route definition:
Route::delete('/tags/{tag}', [TagController::class, 'destroy'])->name('tags.destroy');
```

## Handling the Frontend Submission Safely

The `MethodNotAllowedHttpException` often points to an issue with the request itself rather than just the route definition. When submitting a form that performs a destructive action (like DELETE), always use appropriate security measures:

1.  **Use CSRF Tokens:** Always include `@csrf` in your HTML form. This is Laravel's primary defense against Cross-Site Request Forgery attacks.
2.  **Use POST for Deletions (Alternative Strategy):** While `DELETE` requests are RESTful, some developers find using a standard `POST` request to an endpoint that handles the deletion (often called "soft deletion" or action routing) easier to manage with session handling and middleware than pure HTTP verbs, especially when dealing with complex form data.

For your specific scenario, sticking to the dedicated `DELETE` route defined above, coupled with proper authorization checks within the controller, is the most secure and idiomatic Laravel practice. It ensures that every deletion request is validated and authorized before any database changes occur, providing the stability you need when building complex applications on the [Laravel platform](https://laravelcompany.com).

## Conclusion

Bypassing Laravel's built-in Resource Controllers requires meticulous attention to route definitions and controller method signatures. The `MethodNotAllowedHttpException` is a signal that the HTTP request did not align with the expected path or verb combination. By focusing on clear, authenticated routes and leveraging Eloquent methods directly within your controllers, you ensure that your deletion logic is not only functional but also secure and maintainable. Always prioritize authorization checks when dealing with destructive operations like deletion.
