---
title: "How to add accept application/json header for swagger-php OpenApi"
description: "Mastering API Documentation: How to Handle Headers and Validation Errors in Swagger with Laravel As developers building modern APIs, the bridge between..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

As developers building modern APIs, the bridge between documentation (like OpenAPI/Swagger) and actual runtime behavior is crucial. When using tools like L5-Swagger to document a Laravel REST API, we often encounter subtle mismatches between what the client sends and how the server processes the request, especially concerning content negotiation and validation errors. The issue you are facing—receiving a `200 OK` with internal errors instead of the expected `422 Unprocessable Entity` after validation failure—is a classic symptom of misaligned expectations between the documentation layer and the application logic.

This post will dive into why this happens and provide a comprehensive strategy for correctly configuring your API endpoints, ensuring robust error handling, and getting clean responses directly from your Swagger interface.

## Understanding Content Negotiation: `Accept` vs. `Content-Type`

The confusion often stems from the difference between two critical HTTP headers: `Content-Type` and `Accept`.

1.  **`Content-Type` (Request):** This header tells the server what format the *request body* is in. When sending JSON data to your endpoint, you must use `Content-Type: application/json`. This signals that the payload following the header is a JSON string.
2.  **`Accept` (Response Expectation):** This header tells the client what format it *expects* the server to return. For an API that strictly returns JSON data, setting `Accept: application/json` ensures the response body is delivered in that format.

In your example, while adding `-H "accept: */*"` might seem helpful, it doesn't explicitly tell Laravel how to serialize the validation errors correctly as a structured JSON response upon failure. The primary focus for successful data submission should remain on ensuring the request body is correctly formatted.

## Refining OpenAPI Annotations for Clarity

The evolution of OpenAPI standards means moving away from older definitions like `consumes` and `produces`. The modern approach, which aligns better with current Laravel practices, focuses squarely on defining the structure of the input and output schemas using `@OA\RequestBody` and `@OA\Response`.

When documenting your endpoint for data submission, ensure you clearly define the expected input schema:

```php
/**
 * @OA\Post(
 *     path="/subscribers",
 *     tags={"Subscribers"},
 *     summary="Create a new subscriber record",
 *     requestBody=@OA\RequestBody(
 *         description="Subscriber data to be created",
 *         required=true,
 *         @OA\MediaType(
 *             mediaType="application/json",
 *             @OA\Schema(
 *                 type="object",
 *                 @OA\Property(property="email", type="string", example="test@example.com")
 *             )
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Subscriber successfully created",
 *         @OA\JsonContent(ref="#/components/schemas/Subscriber")
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Validation failed",
 *         @OA\JsonContent(
 *             @OA\Schema(
 *                 type="object",
 *                 @OA\Property(property="errors", type="object") // Structure for validation errors
 *             )
 *         )
 *     )
 * )
 */
public function publicStore(SaveSubscriber $request)
{
    // ... logic
}
```

By explicitly defining the 422 response schema in your documentation, you instruct any tool consuming this specification (including Swagger UI generation) exactly what structure to expect when validation fails. This forces the documentation to reflect the desired API contract, which is fundamental to building reliable services, much like adhering to best practices discussed on sites like [laravelcompany.com](https://laravelcompany.com).

## Ensuring Correct 422 Error Handling in Laravel

The core issue of receiving a `200 OK` instead of a `422` during validation often points to how your controller method handles exceptions or validation failures. In standard Laravel applications, if you use Form Requests for validation, the framework is designed to automatically return a `422 Unprocessable Entity` response when validation fails.

If you are catching validation errors manually and returning a generic `200` response with error messages in the session, you bypass Laravel's built-in HTTP status code signaling mechanism. To fix this:

1.  **Rely on Form Requests:** Ensure all input validation is handled by dedicated Form Request classes. This keeps your controller clean and leverages Laravel’s robust error handling pipeline.
2.  **Return Appropriate Responses:** If you must handle errors manually, explicitly use `abort(422, 'Validation failed')` or return a JSON response using `response()->json([...], 422)`.

By ensuring the backend correctly signals the validation failure via the HTTP status code (422), the Swagger documentation will accurately reflect this behavior, leading to a much smoother and more reliable developer experience when testing your API.

## Conclusion

Successfully integrating Swagger with a Laravel application requires synchronizing three components: the request headers sent by the client, the OpenAPI annotations describing the contract, and the backend logic ensuring correct HTTP status codes are returned. By focusing on correct content negotiation (`Content-Type`), explicit schema definitions in your `@OA` annotations (especially for error responses), and adhering to Laravel’s structured validation patterns, you can eliminate these inconsistencies and build a truly professional and predictable API.
