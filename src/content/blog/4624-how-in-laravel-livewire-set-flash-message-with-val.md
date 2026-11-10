---
title: "How in laravel-livewire set flash message with validation erros"
description: "How to Handle Validation Errors and Flash Messages in Laravel Livewire As developers building dynamic applications with Laravel and Livewire, we often find..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Errors"]
featured: false
---

As developers building dynamic applications with Laravel and Livewire, we often find ourselves navigating the intersection of traditional server-side validation and reactive component state management. When handling form submissions, especially logins or complex data entry forms, managing both session-based flash messages and specific field validation errors can become tricky.

The scenario you described—trying to use `session()->flash()` alongside standard Laravel validation errors within a Livewire context—is common. The issue usually stems from the context shift: traditional HTTP redirects manage session flashes perfectly, but Livewire components manage state internally. We need a strategy that bridges these two worlds effectively.

This guide will walk you through the correct, robust way to handle form validation failures and flash messages when working with Laravel Livewire.

## Understanding the Conflict: Session vs. Component State

Your attempt to use `session()->flash()` is the standard Laravel way to set transient messages that persist across redirects. However, when handling a submission *within* a Livewire component's lifecycle (especially if you are using Livewire's built-in form handling), relying solely on session flashes can lead to inconsistencies, as the error state needs to be tied directly to the component for proper rendering in the Blade view.

The core insight is this: **Livewire should manage the display of validation errors, not raw session data.**

## The Recommended Approach: Storing Errors in Component Properties

Instead of relying on flashing messages for validation outcomes, the most idiomatic Livewire approach is to store the validation errors directly as public properties within your component class. Livewire automatically reads these properties and renders them in the view using directives like `@error`.

Here is how you implement a robust submission handler:

### Step 1: Perform Validation and Store Errors Locally

In your Livewire component method, perform the validation. If validation fails, instead of flashing a message, populate an array or directly set error properties on the component itself.

```php
// app/Http/Livewire/Login.php

use Illuminate\Support\Facades\Validator;
// ... other imports

public function submit()
{
    $request = request();
    $loginRules = User::getUserValidationRulesArray('login');
    $validator = Validator::make($request->all(), $loginRules);

    if ($validator->fails()) {
        // 1. Store the errors directly on the component properties
        $this->addErrors($validator); 
        
        // 2. Stop execution and return, letting Livewire handle re-rendering
        return; 
    }

    // If validation passes, proceed with login logic...
    $user = Sentinel::findByCredentials(['email' => $this->form['email']]);
    if (empty($user)) {
        // Now we can use session flash for a general failure message if needed
        session()->flash('danger_message', 'User not found!');
        return;
    }

    // Successful login logic...
}

/**
 * Helper method to store errors in the component state.
 */
protected function addErrors($validator)
{
    // Store errors keyed by the field name (e.g., email, password)
    $this->errors = $validator->errors()->toArray();
}
```

### Step 2: Displaying Errors in the Blade View

Now, instead of checking `$errors->any()` and looping through session messages, you leverage Livewire's built-in error handling capabilities. Your view simply checks if the component has any stored errors.

In your `resources/views/livewire/auth/login.blade.php`, you can simplify the display significantly:

```html
<form class="form-login" wire:submit.prevent="submit">
    {{-- Display general error message from session (if needed, e.g., for 'User Not Found') --}}
    @if (session()->has('danger_message'))
        <div class="alert alert-danger">{{ session('danger_message') }}</div>
    @endif

    <div class="card">
        {{-- Display errors specific to the component state --}}
        @if ($errors->any())
            <div class="alert alert-danger">
                Please correct the errors below.
            </div>
            
            {{-- Loop through stored errors for field-specific feedback --}}
            <ul class="list-unstyled">
                @foreach ($errors as $field => $errorMessages)
                    @foreach ($errorMessages as $message)
                        <li>{{ $message }}</li>
                    @endforeach
                @endforeach
            </ul>
        @endif

        <div class="card-body card-block">
            {{-- Input fields remain the same, relying on wire:model.lazy --}}
            <dl>
                <dt>Email:</dt>
                <dd>
                    <input wire:model.lazy="form.email" name="email" id="email" class="form-control">
                    {{-- Livewire automatically checks for errors stored in the component state --}}
                    @error('form.email')
                        <div class="text-danger">{{ $message }}</div>
                    @enderror
                </dd>
                {{-- ... password field similarly ... --
