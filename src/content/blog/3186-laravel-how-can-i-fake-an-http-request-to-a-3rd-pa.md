---
title: "Laravel: How can I fake an http request to a 3rd party & mock json response"
description: "Laravel: How to Fake External HTTP Requests and Mock JSON Responses I’m hearing this a lot in the testing world: when you start working with external APIs,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

I’m hearing this a lot in the testing world: when you start working with external APIs, mocking those requests can feel like an advanced trick. You're struggling to figure out the best way to test interactions that don't involve your local application routes, especially when dealing with third-party services. If you've encountered this same challenge, know that you are not alone.

Testing HTTP interactions is a crucial skill, and Laravel provides powerful tools to handle exactly this scenario. This guide will walk you through the most effective method for using Laravel's `Http` facade to fake requests to external URLs and assert the JSON responses you expect.

## Understanding the Challenge with External Requests

The core difficulty arises when your code makes an actual network call outside of your application boundaries (e.g., calling `https://www.example.com`). While mocking routes within your Laravel application is straightforward using `Http::fake()`, mocking external calls requires telling the HTTP client *where* to intercept the request.

Your controller snippet shows a common pattern:

```php
$http = Http::withHeaders([...])
    ->get('https://www.example.com/third-party-url');
// ... then you want to mock this result in your test.
```

When testing, we don't want the test suite to actually hit `example.com`. We need Laravel’s HTTP client layer to intercept that call and return a predefined response instead.

## The Solution: Domain-Based Faking with `Http::fake()`

The key to mocking external requests lies in using the domain matching feature within the `Http::fake()` method. Instead of trying to fake every possible URL, you specify which hostnames or domains should be intercepted by the fake mechanism.

For testing interactions with a specific third-party service, you target that domain directly. This allows Laravel's HTTP client to intercept requests destined for that host and serve the mocked response defined in your test.

Here is how you structure the setup:

```php
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ThirdPartyTest extends TestCase
{
    /** @test */
    public function test_external_api_response_is_mocked()
    {
        // 1. Define the fake response for the target domain.
        // We specify that any request going to github.com should return a specific JSON payload.
        Http::fake([
            'github.com/*' => Http::response([
                'type' => 'example',
                'id' => 123456,
                'attributes' => [
                    'email' => 'mock@test.com',
                    'uuid' => 'mock-uuid',
                    'created_at' => now()->toDateTimeString(),
                    'updated_at' => now()->toDateTimeString(),
                ]
            ], 200, ['Headers']),
        ]);

        // 2. Execute the code that performs the external request.
        $response = $this->callRoute('api/my-resource'); // Assuming this calls your controller logic

        // 3. Assert the outcome based on the mocked data.
        $response->assertStatus(200);
        $response->assertJson([
            'type' => 'example',
            'id' => 123456,
            'attributes' => [
                'email' => 'mock@test.com',
                'uuid' => 'mock-uuid',
                'created_at' => $this->anything(), // Use Laravel's assertion helpers for date/time if needed
                'updated_at' => $this->anything(),
            ],
        ]);
    }
}
```

### Deconstructing the Mocking Technique

1.  **Targeting the Domain:** The crucial part is `['github.com/*' => ... ]`. This tells Laravel: "If any HTTP request is made to a URL starting with `github.com`, intercept it." The wildcard (`*`) ensures that any path (e.g., `/api/users`, `/repos/user-name`) on that domain will be caught.
2.  **Providing the Response:** Inside the array, you define the exact structure of the mocked response: the actual JSON data, the HTTP status code (e.g., `200`), and any necessary headers. This mimics exactly what a real API call would return.

This technique is incredibly powerful because it allows you to simulate complex external dependencies without ever leaving your test environment. For deeper insights into dependency mocking within Laravel, understanding how facades interact with services is key, as detailed in the official documentation at [laravelcompany.com](https://laravelcompany.com).

## Best Practices for External Service Mocking

While domain-based faking works perfectly for simple external calls, keep these best practices in mind:

*   **Be Specific:** Only fake the exact endpoints you intend to test. Do not use overly broad wildcards if possible; be specific about the hostnames.
*   **Layered Testing:** For complex applications, consider mocking the *service layer* (the repository or service class that handles the HTTP call) rather than directly faking the facade in your feature tests. This keeps your tests focused on business logic, not just networking plumbing.
*   **Use `Http::fake()` Strategically:** Reserve direct facade faking for unit testing specific routing/middleware interactions, and use dedicated mock objects or service mocks when testing complex data transformations that rely on external inputs.

## Conclusion

Mocking third-party HTTP requests in Laravel feature tests is entirely achievable by leveraging the domain matching capabilities of `Http::fake()`. By correctly setting up the expected response structure—status code, body content, and headers—you can isolate your application logic from external network instability and ensure your tests are fast, reliable, and focused. Master this technique, and you’ll significantly improve the robustness of your Laravel testing suite.
