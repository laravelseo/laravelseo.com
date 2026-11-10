---
title: "How to test file upload with laravel and phpunit?"
description: "How to Test File Uploads with Laravel and PHPUnit: Faking Uploads Successfully Testing file uploads in a Laravel application, especially within functional..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Testing file uploads in a Laravel application, especially within functional tests using PHPUnit, is a common hurdle for developers. You want to validate your business logic—such as image resizing, validation rules, or storage mechanisms—without actually relying on an external filesystem or a user uploading a real file. The challenge often lies not just in creating the `UploadedFile` object, but in ensuring that Laravel's request handling layer correctly recognizes this mocked data when methods like `Input::hasFile()` are called.

As a senior developer, I can tell you that simply instantiating an `UploadedFile` class within your test method often fails to satisfy the framework's internal checks because these checks rely on the state of the incoming HTTP request stream, not just the existence of a local PHP object.

Here is a comprehensive guide on how to correctly fake file uploads for robust testing in Laravel.

## Understanding the Problem: Request State vs. Local Objects

Your attempt involved creating an `UploadedFile` instance:

```php
$uploadedFile = new Symfony\Component\HttpFoundation\File\UploadedFile(
    $local_file, // File path on disk (which doesn't exist in the test environment)
    'large-avatar.jpg',
    'image/jpeg',
    null,
    null,
    true
);
```

While this object is valid in isolation, when your controller code calls `Input::hasFile('file')`, Laravel is checking the contents of the request that *would have arrived* from a browser. Since you are not simulating the full HTTP request cycle, these input checks fail.

## The Solution: Injecting the Request Payload

To successfully test file uploads, you must simulate the entire request payload. Instead of manually creating the `UploadedFile` object and passing it directly as an array parameter to your action, you need to inject this file data into the request object that your controller method will process.

The most effective way to achieve this in Laravel testing is by using the `Illuminate\Http\UploadedFile` class correctly within a test setup, ensuring the mocked file object is attached to the request state.

### Step-by-Step Implementation

We will modify the approach to ensure the file input is registered correctly before calling the controller action. This often involves setting up the request data explicitly.

**1. Prepare the Mock File:**
Ensure your test file exists, as Laravel's framework often checks for the existence of the path when dealing with certain file operations, even in tests.

**2. Simulate the Request Data:**
Instead of just passing the object to the controller action, you need to simulate how that object would appear within the request structure. For testing file uploads specifically, ensure you are manipulating the `request()` object or the underlying input stream if necessary.

A cleaner approach, particularly when dealing with validation and input checks like `Input::hasFile()`, is often to use Laravel's built-in request mocking capabilities, though for raw file handling in functional tests, direct manipulation of the request body simulation is key.

**Revised Example for Functional Testing:**

If you are testing a controller method that accepts a file via `request()->file('file')`, you should ensure your test request simulates this input correctly.

```php
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class FileUploadTest extends TestCase
{
    // ... setup methods ...

    public function testResizeMethodWithMockedFile()
    {
        $this->prepareCleanDB();
        $this->createAccessableCompany();

        //
