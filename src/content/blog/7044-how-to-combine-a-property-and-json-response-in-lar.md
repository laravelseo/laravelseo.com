---
title: "How to combine a property and json response in Laravel + Swagger?"
description: "How to Combine Properties and JSON Responses in Laravel + Swagger: Mastering API Documentation As senior developers working with Laravel, we constantly deal..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "HTML", "PHP"]
featured: false
---

As senior developers working with Laravel, we constantly deal with building robust APIs. A crucial part of maintaining a healthy codebase is ensuring that our documentation accurately reflects the actual behavior of our endpoints. When using tools like Swagger (or OpenAPI) alongside Laravel, combining simple properties (like a token) and complex JSON objects (like user details) within a single API response requires careful structuring in your annotations.

This post dives into the specific challenge you faced: correctly documenting a response that contains both primitive data and nested JSON structures using Laravel controllers and Swagger annotations. We will walk through why certain combinations fail and provide the canonical solution for creating clear, machine-readable documentation.

## The Challenge: Mixing Data Types in Swagger Annotations

When you return a mixed payload—for instance, a string token alongside an entire user object—you need to define this structure precisely within your `@OA\Response` annotation. The difficulty often arises because `swagger-php` expects specific definitions for every part of the response body, especially when dealing with nested schemas referenced via `ref`.

Your attempt to nest `@OA\JsonContent(ref="#/components/schemas/UserResource")` directly alongside a simple property like `@OA\Property(property="user", ...)` is conceptually correct, but the exact syntax and nesting level must adhere strictly to the OpenAPI specification rules that Swagger tools parse.

## The Solution: Constructing Complex Response Schemas

The most robust way to handle mixed data types in an API response documentation is to treat the entire response body as a single, cohesive schema object. Instead of scattering annotations across multiple properties, we define the structure of the *entire* expected JSON payload within the `@OA\JsonContent` block for that specific response code.

Here is the corrected approach for your login endpoint scenario:

### 1. Define Your Schemas Separately

Ensure you have clearly defined your reusable schemas in your `components` section of the Swagger file (e.g., `LoginRequest` and `UserResource`). This separation keeps your documentation DRY (Don't Repeat Yourself).

### 2. Annotate the Response Precisely

For a successful login response, we define the content of the response body as one main JSON object. Inside that object, we list the properties (`token` and `user`) and define their respective types/contents.

```php
/**
 * @OA\Response(
 *     response="200", 
 *     description="Successful login and token issuance",
 *     @OA\JsonContent(
 *         type="object",
 *         @OA\Property(
 *             property="token",
 *             type="string",
 *             format="uuid", // Or appropriate format
 *             description="Authentication token"
 *         ),
 *         @OA\Property(
 *             property="user",
 *             ref="#/components/schemas/UserResource", // Reference the complex user schema here
 *             description="Details of the logged-in user"
 *         )
 *     )
 * )
 */
public function store(LoginRequest $request)
{
    $request->authenticate();

    // Logic to create token and retrieve user data
    $user = $request->user();
    $token = $user->createToken($request->email)->plainTextToken;

    return response()->json([
        "token" => $token,
        "user" => $user // Return the actual Eloquent model or an array representation
    ]);
}
```

### Why This Works Better

By placing all properties (`token` and `user`) *inside* a single `@OA\JsonContent` block, you are telling Swagger that the entire response body conforms to one structure. The nesting of the complex object reference (`UserResource`) becomes a property value within that main response schema, which is how OpenAPI correctly interprets nested JSON structures for documentation generation.

This methodology aligns perfectly with good API design principles, ensuring that your endpoint documentation reflects exactly what the client receives, adhering to the structured approach often seen in modern Laravel development practices found on sites like [laravelcompany.com](https://laravelcompany.com).

## Conclusion: Documentation as Code

Combining simple data and complex JSON responses in Swagger documentation is less about forcing annotations together and more about defining a clear, hierarchical structure for the expected payload. By treating your response body as a single schema object and using `@OA\Property` to define both primitive values and references to reusable component schemas, you achieve accurate, readable, and maintainable API documentation. Always prioritize clarity in your annotations; this ensures that your code and its documentation work in perfect harmony.
