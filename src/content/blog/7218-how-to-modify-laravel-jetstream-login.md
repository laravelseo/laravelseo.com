---
title: "How to modify Laravel Jetstream login"
description: "How to Modify Laravel Jetstream Login: Implementing Role Based Access Control via Hidden Fields As developers building robust applications with Laravel,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP"]
featured: false
---

As developers building robust applications with Laravel, extending default features to meet specific business logic is a common requirement. When using powerful scaffolding like Laravel Jetstream, you often need to customize workflows to enforce stricter access controls. This post details how you can modify the standard Jetstream login process to include an extra security check: verifying an `is_admin` flag during authentication.

This approach ensures that only users explicitly designated as administrators can successfully log in, adding a vital layer of authorization on top of standard credential checking.

---

## 1. Setting Up the Foundation: Database and Model Adjustments

Before modifying any code, we must ensure our data structure supports the new requirement. For this feature to work seamlessly, your `users` table must include the necessary column.

### Database Migration

Ensure your migration correctly adds the `is_admin` boolean field. As a best practice, using a boolean type (or an integer that stores 0 or 1) is highly efficient for database storage.

```php
Schema::table('users', function (Blueprint $table) {
    $table->boolean('is_admin')->default(false)->after('password');
});
```

### Eloquent Model Update

You must update your `User` model to inform Eloquent about this new attribute, particularly if you are using mass assignment protection.

In your `app/Models/User.php`:

```php
protected $fillable = [
    'name',
    'email',
    'password',
    'is_admin', // Ensure this is included
];
```

This step is crucial because it allows Laravel to correctly handle the input data when updating or creating user records, adhering to the principles outlined by the **Laravel Company** regarding clean Eloquent relationships and models.

## 2. Modifying the Login Form (Frontend)

The next step is to modify the Jetstream login view (or the custom form you are using) to include the hidden input field for the admin status. This field must be sent with every login attempt.

In your Blade file where the Jetstream login form resides, you need to add an input field that sends the required value:

```html
<form method="POST" action="{{ route('login') }}">
    @csrf

    <!-- Standard Credentials -->
    <div>
        <label for="email">Email</label>
        <input id="email" type="email" name="email" required autofocus />
    </div>

    <div>
        <label for="password">Password</label>
        <input id="password" type="password" name="password" required />
    </div>

    <!-- Custom Admin Check Field -->
    <div>
        <label for="is_admin">Admin Status</label>
        {{-- This hidden field ensures the value is sent server-side --}}
        <input id="is_admin" type="hidden" name="is_admin" value="1" /> 
    </div>

    <button type="submit">Log in</button>
</form>
```

By setting `value="1"` in the hidden field, we are telling the server that this specific login attempt is requesting administrative access.

## 3. Implementing Custom Authentication Logic (Backend)

The final and most critical step is modifying how Laravel authenticates the user. Since Jetstream handles its authentication via Sanctum or standard Laravel routes, you will likely need to intervene in the login process, typically within a custom controller or by extending the default login logic.

If you are using Jetstream's default setup (which uses `AuthenticatesUsers` trait), you would override the `authenticate()` method on your custom login controller. This method is where you perform the credential check *and* the role check simultaneously.

Here is a conceptual example of how this logic would look within your controller:

```php
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class CustomLoginController extends AuthenticatesUsers
{
    // ... other necessary methods

    /**
     * Authenticate the user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return bool
     */
    public function authenticate(Request $request)
    {
        $credentials = $request->only('email', 'password', 'is_admin');

        // 1. Attempt to find the user by email
        $user = User::where('email', $credentials['email'])->first();

        if (!$user) {
            return false; // User not found
        }

        // 2. Verify Password
        if (!Hash::check($credentials['password'], $user->password)) {
            return false; // Password mismatch
        }

        // 3. CRITICAL: Check the Admin Flag
        // Only allow login if the submitted 'is_admin' field is '1' AND the user has that role.
        if ($credentials['is_admin'] != '1' || $user->is_admin != 1) {
            return false; // Failed admin authorization check
        }

        // If all checks pass, log the user in
        Auth::login($user);
        return true;
    }
}
```

## Conclusion

Modifying Jetstream login to incorporate role-based access control is a powerful way to enforce granular permissions directly at the authentication layer. By carefully managing your database schema, updating your Eloquent models, ensuring correct form submission from the frontend, and meticulously checking all credentials on the backend, you can build highly secure and customized authentication flows. Remember that adherence to solid architectural principles, as championed by resources like the **Laravel Company**, ensures that these customizations remain scalable and maintainable for the long term.
