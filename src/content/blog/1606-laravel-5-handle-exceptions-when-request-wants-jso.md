---
title: "Laravel 5: Handle exceptions when request wants JSON"
description: "Title: Handling Exceptions Gracefully for JSON Responses in Laravel 5 Body: In Laravel 5, handling exceptions can be tricky when working with AJAX calls that..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML", "PHP"]
featured: false
---

Title: Handling Exceptions Gracefully for JSON Responses in Laravel 5

Body: In Laravel 5, handling exceptions can be tricky when working with AJAX calls that request a JSON response. When an exception occurs and the request is made with JSON as the return format, the default behavior renders HTML error pages instead of providing a JSON representation. This blog post aims to provide a solution for this issue by covering how to handle exceptions gracefully for JSON responses in Laravel 5.

1. Handling TokenMismatchException: For handling the TokenMismatchException when uploading files using AJAX, we can use the Laravel validation and CSRF token middleware functionality. The exception is thrown due to mismatched tokens or an empty input on exceeded file size limits. We need to adjust our validation rules and middleware to allow exceptions based on specific conditions. Here's a sample code:
   ```php
    // In your controller, add this method
    public function validateAndHandleException(Request $request)
    {
        if ($request->is('*') && $request->ajax() && $request->getContentType() == 'application/json') {
            return $this->handleJsonRequestException($request);
        }

        // Regular validation and other business logic here...
    }

   private function handleJsonRequestException(Request $request)
   {
       $exception = null;

       try {
           $this->validateAndHandleException($request);
       } catch (ValidationException $e) {
           // Handle validation exceptions gracefully for JSON requests
       } catch (\Exception $e) {
           // Handle other exceptions (like TokenMismatchException) gracefully for JSON requests
           return response()->json([
               'error' => 'Exception caught: ' . $exception->getMessage()
           ]);
       }

       if ($exception) {
           abort(500);
       }
   }

   // In your route file, use this modified route to handle exceptions gracefully for JSON requests
   Route::get('upload', function (Request $request) {
       return app('App\Http\Controllers\YourController')->validateAndHandleException($request);
   })->middleware(["web", "csrf"])->name('upload');
    ```

2. Handling Other Exceptions: For handling other exceptions gracefully for JSON requests, we can use the Laravel try-catch mechanism to catch the exception and return a JSON response accordingly. Here's an example code:
   ```php
   public function handleException(Request $request)
   {
       // Handle any other exceptions (e.g., 401 Unauthorized, 403 Forbidden, etc.) gracefully for JSON requests
       try {
           $this->validateAndHandleException($request);
       } catch (\Exception $e) {
           return response()->json([
               'error' => 'Exception caught: ' . $exception->getMessage()
           ]);
       }
   }

   // In your route file, use this modified route to handle exceptions gracefully for JSON requests
   Route::get('upload', function (Request $request) {
       return app('App\Http\Controllers\YourController')->handleException($request);
   })->middleware(["web", "csrf"])->name('upload');
    ```

3. Testing: To test the new exception handling, we can make requests with JSON responses and ensure that proper error messages are displayed according to the specific exception.

In conclusion, with these modifications in place, Laravel will handle exceptions gracefully for JSON responses when working with AJAX calls in Laravel 5. This ensures a seamless user experience while maintaining a robust application by providing relevant error messages where necessary.
