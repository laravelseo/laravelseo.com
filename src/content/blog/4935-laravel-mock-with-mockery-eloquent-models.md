---
title: "Laravel mock with Mockery Eloquent models"
description: "Mastering Mocking in Laravel: Using Mockery with Eloquent Models As developers working with frameworks like Laravel, testing controller logic often requires..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

As developers working with frameworks like Laravel, testing controller logic often requires isolating the code under test from external dependencies, most notably the database operations handled by Eloquent models. When we want to test business logic without actually hitting the database, mocking becomes an indispensable tool. However, setting up mocks for complex objects like Eloquent models can introduce subtle pitfalls, as seen in dependency injection scenarios.

This post dives into a common challenge: effectively mocking Eloquent models using Mockery when testing Laravel controllers, and how to resolve issues like the `InvalidCountException`.

## The Challenge: Mocking Eloquent Dependencies

We are testing a `UserController` that relies on an injected `User` model. The goal is to verify that the controller correctly calls the necessary methods (like saving data) without performing actual database writes.

The initial setup attempts to mock the `User` model and then use `$this->app->instance('User', $this->mock)` to inject it into the application container for the test. While this approach is valid in some contexts, properly simulating Eloquent behavior—especially around saving data—requires careful attention to how the framework expects the object to behave during the request lifecycle.

The error you encountered, `Mockery\Exception\InvalidCountException : Method save() from Mockery_0_User should be called exactly 1 times but called 0 times`, signifies a mismatch between what your test *expects* the mocked method to do and what the controller *actually* executes when running through the testing harness. This usually points to one of two things: either the mock isn't correctly intercepting the call, or the execution flow bypasses the actual dependency resolution path that Mockery is monitoring.

## The Solution: Mocking Behavior vs. Mocking Instances

Instead of trying to inject a fully mocked Eloquent object directly into the controller constructor (which can complicate Laravel's service container binding), a cleaner approach for testing controllers is often to mock the *interaction* or the *service* that handles the persistence, or to use the application instance effectively.

For robust testing, especially when dealing with Eloquent, we must ensure that the mocked object behaves exactly as expected when methods are called. If you are testing the controller's logic flow rather than the model itself, mocking the result of a potential save operation is often more effective.

Here is a revised approach focusing on controlling the data flow and asserting the results:

```php
use Mockery;
use Tests\TestCase;
// Assuming necessary imports for your setup...

class UsersControllerTest extends TestCase {

    public function testStore() {
        // 1. Setup the mock for the persistence layer or model behavior
        $mockUser = Mockery::mock('App\Models\User'); // Use a more specific namespace if possible
        
        // We will mock the method that the controller ultimately calls, 
        // simulating success rather than trying to force Eloquent's internal save logic.
        $mockUser->shouldReceive('save')
                ->once()
                ->andReturn(true); // Simulate a successful save operation

        // 2. Bind the mock into the application container for dependency injection
        // This mimics how Laravel resolves dependencies.
        $this->app->instance('App\Models\User', $mockUser);

        // Prepare input data (Mocking Input::all() behavior indirectly)
        $data = [
            'username' => 'qwerety',
            'first_name' => 'asd',
            'last_name' => 'asd123',
            'email' => 'test@gmail.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ];

        // 3. Execute the action (simulating the request)
        $response = $this->postJson('users', $data); // Using Laravel testing helpers is often cleaner

        // 4. Assert the outcome based on the mocked return value
        $response->assertStatus(200);
        // You would assert that the controller returned 'true' or handled the response correctly
    }
}
```

## Best Practices for Eloquent Mocking in Laravel Tests

When dealing with Eloquent models, remember that you are often testing the *controller's orchestration logic*, not the deep internal mechanics of the Eloquent model itself.

1.  **Isolate Dependencies:** Focus on mocking the services or models that the controller *depends* on for data retrieval or persistence. If the controller calls `$user->save()`, mock that specific method to return the expected result (`true` for success, or throw an exception for failure).
2.  **Use `instance()` Carefully:** Using `$this->app->instance('ModelName', $mockObject)` is a powerful way to override bindings within your test environment, which closely mimics how Laravel resolves dependencies. Always ensure the mocked class exists and inherits correctly from Eloquent's expected structure if you are mocking methods specific to it.
3.  **Test the Flow:** The most critical step is asserting that based on the mocked response (e.g., `save()` returned `true`), the controller executed the correct conditional logic (`if ($validator->passes())`) and returned the desired HTTP response.

By focusing your mocks on controlling the *behavior* of the model during the transaction process, rather than trying to perfectly replicate the entire Eloquent lifecycle, you achieve faster, more reliable, and more maintainable tests. This practice is fundamental to writing solid code within the Laravel ecosystem, as demonstrated by the principles outlined on [laravelcompany.com](https://laravelcompany.com).

## Conclusion

Mocking Eloquent models with Mockery is a powerful technique for achieving true unit testing in Laravel. The key takeaway is shifting focus from trying to mock internal database mechanics to mocking the *interface* that the controller interacts with. By correctly setting up your dependencies and asserting on the mocked return values, you can ensure your controller logic is tested in complete isolation, leading to highly reliable application code. Happy testing!
