---
title: "use JWT Bearer token in swagger Laravel"
description: "Mastering JWT Bearer Tokens in Laravel Swagger: Solving the Authorization Puzzle As developers working with modern PHP frameworks like Laravel, integrating..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP", "Errors"]
featured: false
---

As developers working with modern PHP frameworks like Laravel, integrating robust authentication mechanisms—especially JSON Web Tokens (JWT)—with API documentation tools like Swagger/OpenAPI can sometimes present unexpected hurdles. Developers often run into issues where the documentation correctly defines the security scheme, but the interactive UI fails to pass the token correctly, resulting in frustrating errors like `token_not_provided`.

This post dives deep into why this happens when using L5-Swagger and JWT authentication, and provides a comprehensive solution to ensure your API documentation is fully functional and testable.

## The Misunderstanding: API Key vs. Bearer Token in OpenAPI

The core of the issue often lies in how you define the security scheme within your annotations versus what Swagger UI expects for token-based authentication.

You correctly started by defining an API Key scheme:

```php
/**
  @OAS\SecurityScheme(
      securityScheme="API Key Auth",
      type="apiKey",
      in="header",
      name="Authorization",
  )
 **/
```

While this works perfectly for simple API keys, JWTs use the **Bearer Token** scheme. A Bearer token is a specific type of HTTP scheme where the token itself follows the "Bearer" keyword, separated by a space, as the value of the `Authorization` header.

When you define your security scheme using `type="apiKey"`, Swagger UI expects a static key. For dynamic tokens like JWTs, we need to use the `type="http"` definition combined with the `scheme="bearer"` to properly signal that the client must provide a token in the standard HTTP Authorization header format.

## The Correct Implementation for JWT Bearer Tokens

To correctly configure Swagger documentation for JWT authentication, you must adjust your annotation to reflect the Bearer scheme:

```php
/**
  @OAS\SecurityScheme(
      securityScheme="JWT-Bearer", // Renamed for clarity
      type="http",                 // Specify that this is an HTTP scheme
      scheme="bearer",            // Define the bearer token type
      bearerFormat="JWT"          // Optional: Specifies the format of the token
  )
 **/
```

### Why This Fixes the `token_not_provided` Error

By setting `type="http"` and `scheme="bearer"`, you are instructing the Swagger UI generator to display the "Authorize" button expecting a token that adheres to the standard JWT bearer format (e.g., `Authorization: Bearer <your_jwt_token>`). This aligns the documentation with how real-world API consumers interact with JWTs, eliminating the generic "token not provided" error during interactive testing in Swagger UI.

## Integrating with Laravel Best Practices

This setup works seamlessly when integrated within a Laravel application. While L5-Swagger handles the OpenAPI specification generation, the actual authentication logic resides within your Laravel routes and controllers. Remember that robust security requires validating the token before allowing access to protected resources. For advanced concepts related to securing routes in a Laravel context, understanding middleware is crucial, as demonstrated by best practices found in projects built on Laravel principles, such as those emphasizing clean architecture and secure design principles.

### Example Route Protection (Context)

Your route definition must be protected by an authentication middleware that validates the JWT provided in the header:

```php
Route::middleware('auth:api')->group(function () {
    Route::get('/protected-data', function (Request $request) {
        // Token is validated here automatically by Laravel's Sanctum/Passport system
        return response()->json(['data' => 'Secret information for authenticated user']);
    });
});
```

## Conclusion: Documentation Meets Reality

The struggle between documentation and actual runtime behavior is a common theme in API development. The solution is always ensuring that the specification tool (Swagger) accurately mirrors the real-world security mechanism (JWT Bearer). By switching your `@OAS\SecurityScheme` definition from `type="apiKey"` to `type="http"` with `scheme="bearer"`, you bridge this gap.

This ensures that your API documentation is not just a static blueprint, but an interactive tool that accurately reflects the secure authentication workflow of your Laravel application. Happy coding!
