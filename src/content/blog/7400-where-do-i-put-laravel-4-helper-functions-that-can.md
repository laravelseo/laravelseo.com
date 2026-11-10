---
title: "Where do I put Laravel 4 helper functions that can display flash messages?"
description: "Where to Put Laravel Helper Functions: Displaying Flash Messages Effectively As developers transitioning from frameworks like CodeIgniter, the question of..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As developers transitioning from frameworks like CodeIgniter, the question of where to store reusable utility functions—the "helpers"—is often the first point of confusion in a new Laravel project. In CI, placing these methods in a dedicated `helpers` folder was straightforward. In Laravel, however, we embrace a more object-oriented and service-driven architecture. Where should your custom logic live?

This post will dive into the best practices for placing helper functions in Laravel, specifically focusing on displaying flash messages, providing you with a robust, scalable solution rather than just a file location.

## The Laravel Philosophy vs. Traditional Helpers

Laravel heavily promotes the use of Service Containers and Eloquent relationships to manage application logic. While Laravel does support traditional helper files, relying solely on them for complex view logic can lead to tightly coupled code that is hard to test and maintain.

For simple presentation logic like displaying flash messages, we have several architectural options. The choice depends on the complexity of your application and how reusable you need the function to be across different controllers or views.

## Option 1: Using Blade Directives (The Most Laravel Way)

Before diving into file structure, the most "Laravel" approach is often to keep presentation logic directly within the Blade files themselves, leveraging the framework's built-in features. For flash messages, this is incredibly clean and avoids cluttering your application files with monolithic helper functions.

In your main layout file (e.g., `resources/views/layouts/app.blade.php`), you can easily define a block to display session data:

```blade
{{-- resources/views/layouts/app.blade.php --}}

@if (session()->has('error'))
    <div class="alert alert-danger">
        {{ session('error') }}
    </div>
@endif

@if (session()->has('success'))
    <div class="alert alert-success">
        {{ session('success') }}
    </div>
@endif

@yield('content')
```

**Why this is often preferred:** It keeps the view layer self-contained. When you are focusing on features like Eloquent and routing, keeping presentation logic separate in Blade makes the code more readable and easier for frontend developers to manage. If you are building complex applications, understanding how Laravel manages views is crucial, much like understanding the underlying principles discussed at https://laravelcompany.com.

## Option 2: Custom View Composers or Service Classes (The Scalable Way)

If your helper function needs to perform more complex logic—for instance, checking specific session keys, formatting the message based on user roles, or interacting with a service layer before displaying it—it is best placed outside of the view layer. This is where true reusability shines.

We can achieve this by creating a **View Composer** or a dedicated **Service Class**.

### Example: Implementing a Flash Message Service

Instead of putting logic into a global helper file, create a service class to handle session interaction.

**Step 1: Create the Service Class**
Create a class in `app/Services/FlashMessageService.php`:

```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Session;

class FlashMessageService
{
    public function getMessages(): array
    {
        $messages = [];
        if (Session::has('error')) {
            $messages[] = ['type' => 'danger', 'text' => Session::get('error')];
        }
        if (Session::has('success')) {
            $messages[] = ['type' => 'success', 'text' => Session::get('success')];
        }
        return $messages;
    }
}
```

**Step 2: Register the Service**
Bind this service into the Service Container, typically in a Service Provider (e.g., `AppServiceProvider.php`):

```php
use App\Services\FlashMessageService;

public function register()
{
    $this->app->bind(FlashMessageService::class, function ($app) {
        return new FlashMessageService();
    });
}
```

**Step 3: Use the Service in Your Controller or View**
Now, any controller or view can easily access this logic. For example, in your controller:

```php
use App\Services\FlashMessageService;

class PostController extends Controller
{
    protected $flashService;

    public function __construct(FlashMessageService $flashService)
    {
        $this->flashService = $flashService;
    }

    public function store(Request $request)
    {
        // ... logic to save data ...
        session()->flash('success', 'Post created successfully!');
        return redirect()->back();
    }
}
```

And in your Blade view, you can call the service:

```blade
@php
    $messages = app(FlashMessageService::class)->getMessages();
@endphp

@foreach ($messages as $message)
    <div class="alert alert-{{ $message['type'] }}">
        {{ $message['text'] }}
    </div>
@endforeach
```

## Conclusion

While placing simple utility functions in a helper file might seem familiar, for modern Laravel development, the preferred method is to leverage its built-in architecture. For displaying flash messages, we recommend either keeping the display logic directly in the Blade files or abstracting the data retrieval into dedicated **Service Classes**. This approach ensures your code remains testable, adheres to SOLID principles, and scales seamlessly as your application grows, making it a much stronger foundation than relying on traditional global helper functions.
