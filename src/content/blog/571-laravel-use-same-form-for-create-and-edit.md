---
title: "Laravel use same form for create and edit"
description: "Title: Simplifying Form Creation for Create and Edit Operations with Laravel Introduction In this comprehensive blog post, we'll discuss how to use one form..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Links", "HTML"]
featured: false
---

Title: Simplifying Form Creation for Create and Edit Operations with Laravel

Introduction
In this comprehensive blog post, we'll discuss how to use one form for both create and edit actions in a Laravel application while minimizing the amount of code required for each scenario. By implementing this technique, you can reduce repetitive coding and ensure standardization across your forms. You'll also find relevant code examples, best practices, and natural backlinks to https://laravelcompany.com throughout the content.

Creating Dynamic Forms with Laravel
To create a single form for both creating and editing operations, you can make use of dynamic forms using Laravel's validation rules and request objects. This approach relies on an extensive usage of PHP's `isset()` function, which will be explained later. Let's break down the steps involved in making this happen:

1. Create a base form file that contains all common fields needed for both create and edit modes (e.g., `base_form.blade.php`)
2. Include any additional fields specific to either create or edit mode in separate components within your base form file (e.g., `create_specifics.blade.php` and `edit_specifics.blade.php`)
3. Use the Laravel's validation rules to ensure that all required data is present for both modes
4. Implement a middleware or route model binding to set the appropriate mode based on the request (either 'create' or 'edit')
5. Utilize Laravel's Request objects and PHP's `isset()` function to check if specific fields are available for creating or editing data

Implementation Steps
Now that we understand the overall process of creating dynamic forms, let's walk through the code examples for each step:

1. Create a base form file (base_form.blade.php) and include common fields:
```html
<form method="post" action="{{ route('route-name') }}">
    @csrf

    <!-- Common fields for both create and edit modes -->
    <input type="text" name="username" value="{{ old('username', isset($user) ? $user->username : '') }}" />
    <!-- Other common fields go here -->
</form>
```
Here, the `old()` helper ensures that the form displays any previously entered values. The second argument of the `old()` helper will either be the value of the field when editing an existing record or an empty string for create mode.

2. Include additional specific fields in separate components:
For example, you can have two files - 'create_specifics.blade.php' and 'edit_specifics.blade.php'. These files will include the fields that are relevant only for either creating or editing records.

3. Use Laravel's validation rules in your forms:
Add validations to ensure that all essential data is present, regardless of whether you're in create or edit mode:
```php
public function rules()
{
    $rules = [
        'username' => 'required|min:3|max:20',
        'password' => 'required|confirmed|min:8|max:255',
        'email' => 'required|email|unique:users,email,' . (isset($user) ? $user->id : null), // for edit mode, check for uniqueness except the current record
    ];

    if (!empty(request()->input('mode')) && request()->input('mode') === 'create') {
        $rules = array_merge([
            'confirm_password' => 'required',
        ]);
    }

    return $rules;
}
```
This example demonstrates how you can dynamically add additional validations based on the current form mode. The code also includes a check to ensure that specific fields are only present in create mode.

4. Implement route model binding or middleware for mode detection:
Route Model Binding:
```php
Route::resource('/users', UserController::class);

// in your controller
public function update(User $user, Request $request)
{
    // code to edit user record
}

public function store(Request $request)
{
    // code to create new record
}
```
Middleware:
```php
Route::middleware('modeCheck')->group(function () {
    Route::resource('/users', UserController::class);
});

// in your middleware class
public function handle($request, Closure $next)
{
    if ($request->input('mode') === 'create') {
        return redirect()->route('some-other-route'); // redirect to create form as it's not relevant for edit mode
    }

    return $next($request);
}
```
Both approaches allow you to easily detect the current form mode and take appropriate actions.

5. Use PHP's `isset()` function with Request objects:
To check if a specific field was submitted, use Laravel's Request objects in conjunction with PHP's `isset()` function:
```php
// create mode:
if (isset($request->input('confirm_password')) && $request->input('confirm_password') === request()->input('password')) {
    // confirm password validation passed
}

// edit mode:
if (isset($user) && isset($request->input('new_password'))) {
    if ($user->password !== $request->input('current_password')) {
        return redirect()->back()->withErrors(['passwords_mismatch' => 'Current password does not match.']);
    }
}
```
These examples demonstrate how you can check the presence of specific fields based on the form mode and take appropriate actions.

Conclusion
By following these steps, you can achieve a simplified process for creating forms that support both create and edit operations in Laravel. This approach reduces repetitive coding while ensuring consistent form functionality across your application. For more detailed tutorials and best practices, refer to the resources and documentation provided by the Laravel community at https://laravelcompany.com.
