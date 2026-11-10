---
title: "How to add an alert on Laravel 5?"
description: "How to Add a Success Alert After Deleting Data in Laravel As developers, we often deal with operations where success or failure needs to be communicated..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "PHP", "Errors"]
featured: false
---

As developers, we often deal with operations where success or failure needs to be communicated clearly to the user. When you execute a destructive action like deleting a record, simply redirecting the user back is functional, but it leaves them wondering if the operation actually succeeded. A good user experience demands immediate feedback.

This post will walk you through the best, most idiomatic way to display an alert after successfully deleting data in your Laravel application, moving beyond simple redirects to provide meaningful feedback.

## The Problem with Basic Redirection

In your provided code snippet:

```php
public function hapus(Request $request, $id)
{
    DB::table('kelompok')
        ->where('id', $id)
        ->delete();
    return redirect()->back(); // This only redirects, no alert is shown.
}
```

While `return redirect()->back()` successfully sends the user back to the previous page, it doesn't inherently provide a visible notification that the deletion was successful. For critical actions, we need a mechanism to store this success message temporarily and display it on the next request.

## The Laravel Solution: Session Flashing

The most common and lightweight way to handle transient messages like success or error notifications in Laravel is by utilizing the Session flashing mechanism. This method ensures that the message is only displayed once, right after the redirect, making the flow clean and efficient.

### Step-by-Step Implementation

To implement a successful alert, you need to leverage the `session()` helper to flash data.

**1. Modify the Controller Method:**
After successfully performing the database operation (the deletion), you will store a success message in the session before redirecting.

```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GroupController extends Controller
{
    public function hapus(Request $request, $id)
    {
        // 1. Perform the database operation (Deletion)
        $deleted = DB::table('kelompok')
                     ->where('id', $id)
                     ->delete();

        // Optional: Check if a row was actually deleted for better error handling
        if ($deleted) {
            // 2. Flash the success message to the session
            session()->flash('success', 'Data berhasil dihapus!');
        } else {
            // Handle case where ID was not found
            session()->flash('error', 'ID tidak ditemukan.');
        }

        // 3. Redirect back
        return redirect()->back();
    }
}
```

**2. Display the Alert in the View:**
Now, on the view that receives the redirect (usually the form page or the index page), you check for the existence of these flashed session variables and display them using Blade directives. This is where you create your popup alert.

In your Blade file:

```blade
{{-- Check for success message --}}
@if (session('success'))
    <div class="alert alert-success">
        {{ session('success') }}
    </div>
@endif

{{-- Check for error message (for failed deletions) --}}
@if (session('error'))
    <div class="alert alert-danger">
        {{ session('error') }}
    </div>
@endif

{{-- Rest of your form or page content --}}
<h2>Group Management</h2>
{{-- ... rest of the HTML ... --}}
```

## Best Practices and Advanced Alternatives

While the Session Flashing method is perfect for simple alerts, as an experienced developer, you should also consider more robust solutions for complex applications.

### 1. Using Laravel Notifications

For larger applications or scenarios where notifications need to be sent across different parts of the system (like email notifications or real-time updates), leveraging Laravel's built-in **Notifications** system is superior. Instead of flashing a string, you dispatch an event that triggers a formal notification class. This keeps your controllers focused purely on business logic and separates presentation logic into dedicated classes. You can find excellent guidance on structuring these patterns when exploring advanced topics in the Laravel ecosystem, such as those discussed on [laravelcompany.com](https://laravelcompany.com).

### 2. Using Frontend Libraries (Tailwind/Alpine)

For a truly modern "popup alert" experience, you should combine server-side session flashing with modern frontend JavaScript frameworks. You can use Alpine.js or Tailwind CSS to dynamically render the HTML alert block based on whether `session('success')` exists. This gives you full control over styling and interaction, making your alerts visually appealing and interactive.

## Conclusion

Adding feedback after a critical operation like deletion is not just about functionality; it’s about user experience. By mastering **Session Flashing**, you establish a reliable pattern for communicating success or failure across redirects in Laravel. For simple cases, this method is efficient. For complex applications, scaling up to use Laravel Notifications provides the necessary architecture to keep your code clean, maintainable, and highly scalable. Always aim for clear communication between your backend logic and your frontend presentation!
