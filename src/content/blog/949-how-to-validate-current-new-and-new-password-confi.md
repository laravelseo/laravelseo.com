---
title: "How to validate current, new, and new password confirmation in Laravel 5?"
description: "Title: Validating Current, New, and Confirmation Passwords in Laravel 5 Body: In a web application using Laravel 5, password validation is essential for..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML", "PHP"]
featured: false
---

Title: Validating Current, New, and Confirmation Passwords in Laravel 5

Body: In a web application using Laravel 5, password validation is essential for ensuring user security and protection from unauthorized access. To validate current, new, and confirmation passwords effectively, you need to follow proper best practices while keeping the code concise and readable. This blog post aims at explaining how to implement this validation in your Laravel project with detailed examples and tips.

Firstly, create two methods in 'UserController' for handling user profile password changes: one for rendering the edit form ('getProfilePassword') and another for processing the submitted password data ('postProfilePassword'). The view code can be designed as a standard HTML form with appropriate input fields to collect the current, new, and confirmation passwords.

Here is an example of how you could implement these controllers:

```php
public function getProfilePassword(Request $request) {
    return view('profile/password', ['user' => Auth::user()]);
}

public function postProfilePassword(Request $request) {
    $user = Auth::user();

    $this->validate($request, [
        'old_password'          => 'required',
        'password'              => 'required|min:4',
        'password_confirmation' => 'required|confirmed'
    ]);

    // Only update the password if all conditions are met
    if ($request->input('new_password') === $request->input('password_confirmation')) {
        $user->password = Hash::make($request->input('new_password'));
        $user->save();
    }
}
```

In the 'validate' method, you specify validation rules for each field. The old password is required, and the new password must be at least 4 characters long. For confirming the new password, 'confirmed' rule will ensure that the new password confirmation matches with the entered password. Note that you should only update the user's password if both the new_password and password_confirmation match each other.

However, Laravel's validation rules do not check against the user's current password. You can add an extra custom rule to ensure this by extending your 'UserController':

```php
use Illuminate\Validation\Factory;

class UserController extends Controller {
    // ...

    protected $validator;

    public function __construct(Request $request, Factory $factory) {
        parent::__construct($request);

        $this->validator = $factory->make(
            array('password' => $request->input('current_password')),
            array(),
            ['password.custom' => 'The specified password does not match the current one.'],
            array('password' => 'required|min:4')
        );
    }

    public function postProfilePassword(Request $request) {
        // ...

        if ($this->validator->fails()) {
            return back()->withErrors($this->validator)->withInput();
        }

        // Save the password after validation is successful
        // ...
    }
```

In this example, you create a new validator with custom rules, making sure the current_password matches the entered one. If the validation fails, it redirects users back to the form page with errors and input values intact. In your view template, replace the 'old_password' field with 'current_password'.

By following these steps, you can effectively validate user passwords in Laravel 5 applications, ensuring a secure and reliable user experience for your web application users.
