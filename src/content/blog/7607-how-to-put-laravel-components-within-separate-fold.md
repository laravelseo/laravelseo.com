---
title: "How to put laravel components within separate folders"
description: "How to Put Laravel Components Within Separate Folders: Mastering Component Organization As developers working with large applications in Laravel, managing..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working with large applications in Laravel, managing the structure of reusable components is crucial for maintainability. We often find ourselves needing to group related UI elements—like different forms or modals—into logical folders within our `app/View/Components` directory. The challenge arises when we want to call these grouped components elegantly, something beyond the simple `<x-component-name>`.

This post addresses the common scenario: how to structure your Laravel components so you can call them in a more intuitive way, like `<x-modals-login>`, instead of having to list every single file.

## The Challenge: Component Discovery vs. Grouping

When Laravel performs component discovery, it primarily looks for files matching the convention within the `app/View/Components` directory. If you structure your components this way:

```php
// app/View/Components/Modal.php (Base component)
namespace App\View\Components;

class Modal extends Component
{
    public function __construct($slot)
    {
        $this->slot = $slot;
    }
    // ...
}

// app/View/Components/Modals/Login.php
namespace App\View\Components\Modals;

class Login extends Component
{
    // ... component logic
}
```

While Laravel can find `app/View/Components/Modals/Login.php`, the component calling mechanism defaults to using the full path or requires explicit definition for grouping. Simply calling `<x-login>` won't work because Laravel doesn't automatically recognize the directory structure as a single, composite component named `modals-login`.

## The Solution: Utilizing Wrapper Components and Composition

The most robust solution is to use composition and create a dedicated **Wrapper Component** or **Container Component** to handle the grouping logic. Instead of trying to force Laravel to discover deep folder structures directly for simple calls, we use PHP logic within a parent component to assemble what we need.

### Step 1: Define the Base Component (The Container)

We keep your base modal structure clean, focusing only on its core responsibility.

```php
// app/View/Components/Modal.php
namespace App\View\Components;

class Modal extends Component
{
    public function __construct($slot)
    {
        $this->slot = $slot;
    }

    public function render()
    {
        return view('components.modal', ['slot' => $this->slot]);
    }
}
```

### Step 2: Create the Grouping Component (The Wrapper)

We introduce a new component that acts as the gateway for your grouped modals. This component will manage which specific modal content is rendered based on the input slot.

```php
// app/View/Components/Modals/GroupedModal.php
namespace App\View\Components\Modals;

use Illuminate\View\Component;

class GroupedModal extends Component
{
    public $content;

    public function __construct($content)
    {
        $this->content = $content;
    }

    public function render()
    {
        // Here we dynamically load the specific modal content passed in.
        return view('components.modals.grouped-modal', [
            'modal_content' => $this->content,
        ]);
    }
}
```

### Step 3: Implementing the View File

In your Blade file, you now call the wrapper component, passing the specific content it needs to display:

```blade
{{-- Instead of trying to call <x-login>, we call our new wrapper --}}
<x-modals-login :content="$data">
    {{-- Content for the login modal goes here --}}
</x-modals-login>
```

## Why This Approach Works Best

This methodology moves complexity from Laravel's component discovery mechanism into your PHP logic, which gives you precise control. When building complex systems, especially those involving nested UI patterns, composition over strict file naming conventions is often more flexible. It ensures that the component calling convention remains predictable while allowing maximum flexibility in how you organize your source files. This pattern aligns with best practices for scalable architecture, similar to how dependency injection principles are applied within the Laravel ecosystem, as you explore further on [laravelcompany.com](https://laravelcompany.com).

## Conclusion

While Laravel excels at simple component discovery, complex grouping requires a layer of abstraction. By implementing wrapper components—like `GroupedModal`—you can effectively manage and call related components in a clean, intuitive manner (e.g., `<x-modals-login>`). This strategy separates the organizational structure from the calling syntax, leading to cleaner code and easier maintenance as your application grows.
