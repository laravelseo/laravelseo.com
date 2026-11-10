---
title: "Laravel - Show error on the same page if login credentials are wrong"
description: "Laravel Login Errors: How to Show Validation Messages on the Same Page As a senior developer working with the Laravel ecosystem, I frequently see developers..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "PHP", "Errors"]
featured: false
---

As a senior developer working with the Laravel ecosystem, I frequently see developers running into initial hurdles when trying to implement custom error handling. Specifically, displaying validation errors directly next to the input fields on the login screen is a very common requirement.

The issue you are facing stems from trying to manually handle the flow and error messaging without leveraging Laravel’s powerful built-in validation and session flashing mechanisms. While your controller logic attempts to check credentials, it bypasses Laravel's intended structure for handling user input errors.

This post will walk you through the correct, idiomatic Laravel way to handle login failures and display those errors gracefully on the same page, ensuring a better user experience. We will move away from raw database checks in the controller and embrace Eloquent models and Request validation.

---

## The Pitfall of Manual Error Handling

Your current approach involves manually querying the database:

```php
$checkLogin = DB::table('admin')->where(['email' => $email, 'password' => $password])->get();
if(count($checkLogin) > 0) {
    echo "Login Successfull";
} else {
    return Redirect::route('admin-login')->with(); // Incorrect redirection logic for error display
}
```

While this *can* work, it is cumbersome, exposes database logic in the controller, and fails to utilize Laravel’s structured way of managing request data. When a login fails, we don't just want to redirect; we want the user to stay on the form and see exactly *why* they failed (e.g., "Invalid credentials").

## The Laravel Way: Validation and Session Flashing

The robust solution in Laravel involves using **Form Requests** or simply validating the request data directly within the controller using the `Validator` facade. This process automatically handles saving errors to the session, making them instantly available in your Blade view.

### Step 1: Define Validation Rules

First, ensure you are using proper Eloquent models and hashing for security. Never store plain passwords; always use `Hash` for verification.

In a production application, you would typically define these rules within a dedicated Form Request class. For simplicity here, we will demonstrate the concept in the controller context.

### Step 2: Implement Controller Logic with Validation

Instead of querying the database directly for an error message, we validate the input against what exists in the database using Eloquent. If validation fails, Laravel handles flashing the errors.

Here is how you can refactor your login logic to leverage Laravel's features correctly:

```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Redirect;

class AdminLoginController extends Controller
{
    public function login(Request $request)
    {
        // 1. Validate the incoming request data
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            // If validation fails, flash the errors back to the session
            return Redirect::route('admin-login')->withErrors($validator)->withInput();
        }

        // 2. Attempt to find the user using Eloquent (Best Practice)
        $user = \App\Models\Admin::where('email', $request->email)->first();

        // 3. Check credentials securely
        if ($user && Hash::check($request->password, $user->password)) {
            // Login successful! Redirect to dashboard.
            return Redirect::route('admin-dashboard');
        }

        // 4. If login fails (credentials do not match)
        // Flash a generic error message for security reasons (don't reveal if email exists or password was wrong).
        return Redirect::route('admin-login')->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->withInput();
    }
}
```

### Step 3: Displaying Errors in the View

Once you use `withErrors()` and `withInput()`, Laravel automatically populates the `$errors` variable in your view. You can then iterate over these errors to display them next to the relevant input fields.

Here is how you would adapt your Blade view to show validation messages for both email and password:

```html
<form method="POST" action="{{ route('admin-login-result') }}">
    @csrf

    {{-- Email Input --}}
    <div>
        <label for="email">Email</label>
        <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autofocus>

        {{-- Display specific email error --}}
        @error('email')
            <span class="help-block text-danger mt-1">{{ $message }}</span>
        @enderror
    </div>

    {{-- Password Input --}}
    <div>
        <label for="password">Password</label>
        <input id="password" type="password" class="form-control @error('password') is-invalid @enderror" name="password" required>

        {{-- Display specific password error (if any) --}}
        @error('password')
            <span class="help-block text-danger mt-1">{{ $message }}</span>
        @enderror
    </div>

    <button type="submit">Login</button>
</form>
```

## Conclusion

The key takeaway is that when building applications with Laravel, **rely on the framework's built-in tools** rather than reinventing validation and error handling logic. By using `Validator::make()` and flashing errors via `withErrors()`, you delegate the complex task of session management to Laravel, resulting in cleaner, more secure, and significantly more maintainable code. For deeper insights into how these components interact with Eloquent models, I highly recommend exploring resources on the official documentation found at [laravelcompany.com](https://laravelcompany.com).
