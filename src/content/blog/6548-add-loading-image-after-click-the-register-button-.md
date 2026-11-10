---
title: "Add loading image after click the `register` button in Laravel 8"
description: "Adding Loading States for Asynchronous Operations in Laravel 8 As a senior developer, I frequently encounter scenarios where an action initiated by a user..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "PHP"]
featured: false
---

As a senior developer, I frequently encounter scenarios where an action initiated by a user requires significant processing time—like deploying an application to a new server or processing large data sets. Providing immediate feedback to the user during this wait is crucial for a good experience. When building applications with Laravel, managing these asynchronous operations effectively is key to creating robust and responsive systems.

This post will guide you through implementing a loading indicator after a form submission in your Laravel 8 application, specifically addressing the scenario where clicking the `register` button triggers an external deployment process.

## Understanding the Problem: Synchronous vs. Asynchronous Flow

Your current setup relies on a traditional HTTP redirect: the user clicks "Register," the server processes the request (which includes calling an external deployment API), and then it redirects to a new URL. If this deployment takes several seconds, the user sees nothing but a blank screen or a slow transition, leading to frustration.

The solution involves recognizing that long-running tasks should be handled **asynchronously** rather than blocking the user's browser request entirely. We need a way to tell the user, "We are working on it," while the backend handles the heavy lifting in the background.

## Strategy 1: Handling Long Operations with Queues (The Best Practice)

For operations like server deployment, the most robust Laravel pattern is to use **Queues**. Instead of performing the deployment directly inside your controller method, you push a job onto a queue. The user receives an immediate response, and a background worker handles the slow task.

### Step 1: Offload the Work to a Queue

In your `RegisterController`, instead of executing the deployment logic directly, dispatch the action to a queue. This keeps your web request fast and responsive.

```php
// RegisterController.php (Example Modification)

use App\Actions\CreateTenantAction;
use Illuminate\Support\Facades\Bus; // Import Bus facade if using Jobs

public function submit(Request $request)
{
    $validatedData = $this->validate($request, [
        'domain' => 'required|string|unique:domains',
        // ... other validations
    ]);

    // 1. Store initial data (if necessary)
    // 2. Dispatch the heavy task to a queue
    CreateTenantAction::dispatch($validatedData['email'], $validatedData['domain']);

    // 3. Return an immediate response to the user
    return redirect()->route('register.success')->with('status', 'Registration initiated. Deployment in progress.');
}
```

### Step 2: Implement Loading Feedback via Redirect

Since the actual deployment happens later, you need a clear redirection path that signals the process is underway. You can use session flashes to store the status and display the loading message on the next page.

## Strategy 2: Visualizing the Wait with Blade

To provide the visual loading state, we will manage this state across your redirect flow. We will use server-side variables (session data) to hold the status before redirecting.

### Modifying `register.blade.php` for Loading States

In your view, you can check for a session variable set by the controller and display the loading component.

```html
@extends('layouts.central')

@section('content')

    {{-- Check if a status message exists from the previous request --}}
    @if (session('status'))
        <div class="p-4 mb-4 text-sm text-green-700 bg-green-100 border border-green-400 rounded-lg" role="alert">
            {{ session('status') }}
        </div>
    @endif

    <div>
        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div class="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
                {{-- The form remains the same --}}
                <form action="{{ route('central.tenants.register.submit') }}" method="POST">
                    @csrf
                    {{-- ... input fields (name, domain, email, password) ... --}}

                    <div class="mt-6">
                        <span class="block w-full rounded-md shadow-sm">
                            <button type="submit" class="btn">
                                Register
                            </button>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    </div>

@endsection
```

### Step 3: Displaying the Loading Spinner on the Success Page

When you redirect to the success page (e.g., `register.success`), this is where you explicitly show a loading spinner while waiting for the background job to complete, or if you are blocking synchronously, you place the spinner *before* the final redirection.

If you must wait synchronously (less ideal), you would manually set a flag in your controller and redirect:

```php
// RegisterController.php (Synchronous Example - Use with Caution)
public function submit(Request $request)
{
    // ... validation ...

    // Start the process that will take time
    $data['password'] = bcrypt($data['password']);
    
    // Simulate a long wait if necessary for demonstration, though queues are better.
    sleep(5); 

    // Redirect immediately after the 'work' is done
    return redirect()->to('/success')->with('status', 'Registration complete!');
}
```

In your success view (`success.blade.php`), you would implement a spinner:

```html
@section('content')
    <div class="text-center mt-20">
        {{-- Show loading indicator while waiting for the result --}}
        <div class="animate-spin rounded-full h-16 w-16 text-blue-600 mx-auto">
            <span class="sr-only">Loading...</span>
        </div>
        <p class="mt-4 text-lg font-medium text-gray-900">Processing your registration...</p>
    </div>
@endsection
```

## Conclusion

For modern, scalable Laravel applications, especially those involving external services or deployment steps, moving away from synchronous blocking is essential. By leveraging **Laravel Queues** to handle the heavy lifting in the background and using **Session Flashes** to communicate status updates to the user interface, you can successfully implement a professional-looking loading experience. Remember, focusing on asynchronous patterns is what separates basic functionality from enterprise-grade development, aligning perfectly with the principles taught by developers at [laravelcompany.com](https://laravelcompany.com).
