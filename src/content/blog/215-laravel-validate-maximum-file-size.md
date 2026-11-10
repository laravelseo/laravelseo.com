---
title: "Laravel: Validate maximum File size?"
description: "Title: Validating Maximum File Size in Laravel A Comprehensive Guide Introduction: In web applications that involve file uploads, it's essential to set..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Errors"]
featured: false
---

Title: Validating Maximum File Size in Laravel - A Comprehensive Guide

Introduction:
In web applications that involve file uploads, it's essential to set limits on the size of the files being uploaded by users. In Laravel, you can easily validate this through the built-in input validation rules. This blog post will guide you on how to create a custom rule for setting maximum file sizes and dealing with various cases.

Step 1: Understanding the current approach
You've tried using two approaches - `'file' => 'size:500'` and `'file' => 'size:>=500'`. The first one checks if the file size is exactly 500 kB. However, it doesn't validate for files bigger than that. The second approach seems to be less restrictive as it allows files even larger than 500 kB to pass validation. You need a more precise solution.

Step 2: Creating a custom rule
To achieve what you desire, you will create a custom rule. Laravel offers several methods to define custom rules. In this case, we'll use the `make()` method from the Validator class.

<pre><code>use Illuminate\Validation\Rule;
$validator = Validator::make($request->all(), [
    'file' => Rule::custom(function ($attribute, $value, $fail) {
        if (filesize($value) > 500 * 1024) {
            $fail('The file size is too large.');
        }
    })
]);
</code></pre>

In this code snippet:
- We create a new custom rule by extending the Rule class.
- The function accepts three parameters: attribute, value, and fail.
- First, we validate that the file size is larger than 500 kB (which is 500 * 1024 bytes).
    - Using `filesize()` will return the actual file size in bytes, which we convert to kilobytes here.
- If the file size is greater than 500 kB, we use the fail function to display an appropriate error message.
- Finally, we pass this custom rule in the validation array and call `Validator::make()` as usual.

This approach ensures that files larger than 500 kB will have their uploads handled by your application's error handling process (e.g., displaying an error message or redirecting to a different page).

Step 3: Improving the solution for better performance and memory usage
When dealing with large file sizes, you may encounter issues related to memory usage and execution time. You can optimize your code by using Laravel's `chunkMemory` method and PHP's `allow_url_fopen` setting.

<pre><code>use Illuminate\Support\Facades\Storage;
$validator = Validator::make($request->all(), [
    'file' => Rule::custom(function ($attribute, $value, $fail) {
        if (Storage::disk('local')->chunkMemory(1024 * 1024)
            ->putFile($attribute, $value)) {
            Storage::disk('local')->deleteDirectory(
                Storage::getPathPrefix() . 'app/temp/' . uniqid('', true)
            );
        } else {
            $fail('The file size is too large.');
        }
    })
]);
</code></pre>

In this code snippet:
- We import the chunkMemory method from Laravel's Storage facade.
- We use the `chunkMemory` method to ensure that the uploaded file can fit within a specific memory limit (1 MB or 1024 * 1024 bytes) before performing further operations.
    - If successful, we store the file in temporary storage using a unique folder name to avoid conflicts with existing uploads.
- We then attempt to delete this temporary directory after finishing the chunking and validation process.
- Finally, if the file is too large and exceeds the defined memory limit, we call `fail()` as before.

Conclusion:
In summary, validating maximum file size in Laravel can be achieved using a combination of built-in validation rules and custom rule creation. By following these steps and optimizing for optimal performance, you'll ensure your application handles large file uploads efficiently while still providing error handling when files exceed the specified limits.
