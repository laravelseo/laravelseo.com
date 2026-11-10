---
title: "How to add _token csrf globally on Laravel Inertia?"
description: "How to Add CSRF Token Globally on Laravel Inertia As developers working with modern full stack frameworks like Laravel and Inertia, managing state and..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript"]
featured: false
---

As developers working with modern full-stack frameworks like Laravel and Inertia, managing state and security tokens efficiently is crucial. When building SPAs with Inertia, a common hurdle arises: ensuring that the Cross-Site Request Forgery (CSRF) token—which is essential for protecting state-changing requests—is consistently available across all your Vue components without tedious manual passing.

The solution lies not in reinventing the wheel, but in correctly leveraging Laravel’s session and middleware capabilities to inject this data into the Inertia context globally.

## The Challenge of Manual Token Passing

In your initial approach, you correctly identified that every time a form submission occurs (like a login), you need access to the token:

```javascript
// Example from your post
Inertia.post('/login', {
    email: form.email,
    password: form.password,
    _token: props.auth.csrf // Manually passing it
});
```

While this works for specific operations, relying on manually extracting and passing the token in every component leads to code duplication, reduces maintainability, and increases the risk of forgetting the token on less obvious routes. We want a solution where the token is available automatically whenever an Inertia request is initiated.

## The Global Solution: Leveraging Middleware Sharing

The best practice for global data sharing in Laravel applications is through the application's middleware pipeline. Since Inertia relies entirely on standard HTTP requests handled by Laravel, we can inject necessary session data into the request object before it reaches the view layer.

The key is modifying the `share` method within your custom Inertia middleware to package essential user and security information directly into the props passed to the frontend. This ensures that all components receive the required context without needing explicit passing from parent components.

### Step 1: Enhancing the `HandleInertiaRequests` Middleware

Your existing setup in `app/Http/Middleware/HandleInertiaRequests.php` is already on the right track. The secret lies in ensuring you are correctly fetching and structuring the session data. When setting up shared data, we define exactly what data Inertia should expose to all frontend views.

Here is an optimized structure focusing purely on sharing authentication necessities:

```php
namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * Defines the props that are shared by default.
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            // Session data for status messages (as you already have)
            'session' => [
                'status' => fn () => $request->session()->get('status'),
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],

            // User authentication data
            'auth' => [
                'user' => $request->user() ? $request->user() : null,
                'permissions' => $request->user() ? $request->user()->getPermissionArray() : [],
                // *** THE GLOBAL CSRF TOKEN INJECTION ***
                'csrf' => $request->session()->token(), 
            ],

            // Route data (useful for navigation)
            'route' => function () use ($request) {
                return [
                    'params' => $request->route()->parameters(),
                    'query' => $request->query(),
                ];
            },
        ]);
    }
}
```

By placing `$request->session()->token()` directly into the `auth` array as `'csrf'`, you make this token immediately available to *every* Inertia page and component upon loading.

## Step 2: Consuming the Global Token in Vue Components

With the data globally shared via middleware, your Vue components no longer need to receive the token from a parent component or manually construct it on every POST request. Instead, they simply destructure the properties provided by Inertia.

In your `login.vue` file, you can now cleanly access the token directly:

```vue
<script setup>
import { reactive } from 'vue';

// Destructure props received from Inertia
const props = defineProps({
    auth: Object // Expecting the shared data structure
});

// Define form state
const form = reactive({
    email: '',
    password: '',
});

// Submit method
const submit = () => {
    // Send data to the server, using the globally injected token
    Inertia.post('/login', {
        email: form.email,
        password: form.password,
        _token: props.auth.csrf // Accessing the globally shared token
    });
}
</script>
```

## Conclusion

By centralizing security and user context within your Laravel middleware—specifically using the `share` method to inject session data like the CSRF token—you establish a robust, scalable pattern for Inertia applications. This approach adheres to the principle of separation of concerns: the backend handles security and context injection, while the frontend focuses purely on presentation. As you continue building complex applications, adopting these centralized patterns will save significant development time and enhance overall code quality, aligning perfectly with the principles of modern Laravel development found at [laravelcompany.com](https://laravelcompany.com).
