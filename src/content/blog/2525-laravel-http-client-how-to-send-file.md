---
title: "Laravel HTTP client - How to send file"
description: "Mastering File Transfers in Laravel: Sending Files via the HTTP Client As a developer working with APIs, one of the most common hurdles is correctly..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP"]
featured: false
---

As a developer working with APIs, one of the most common hurdles is correctly serializing complex data types like files when making external requests. You've successfully received a file on your server (e.g., inside a controller method), but when you try to send that same file to an API endpoint using methods like `Http::post()`, the file data mysteriously disappears.

This post will dive deep into why this happens and provide a robust, developer-focused solution for correctly sending `multipart` file data across HTTP requests using Laravel's HTTP client.

## The Challenge: Why Simple POST Fails for Files

When you receive a file upload in a Laravel controller, the framework handles parsing the raw request body to extract the file stream into the `$request->file()` collection.

```php
public function storeBlog(Request $request)
{
  // $request->file('image') now holds the uploaded file instance.
}
```

When you then call an external API using a simple `Http::post($url, $data)`, Laravel's HTTP client defaults to sending standard `application/json` or `application/x-www-form-urlencoded` data. It does not automatically know how to serialize the raw file stream into the required `multipart/form-data` structure that external APIs expect when dealing with file uploads. This is a fundamental difference between receiving input and constructing output.

## The Solution: Encoding Data as Multipart Form-Data

To successfully send files, you must explicitly tell the HTTP client to package your data using the `multipart/form-data` encoding type. This encoding allows you to send binary file contents alongside standard text fields within a single request.

The key is to construct a structure that mimics a traditional HTML form submission. Instead of passing just an array of strings, you need to pass an array of files and fields.

### Step-by-Step Implementation

Here is how you correctly package your received file for transmission:

1.  **Identify the File:** Retrieve the file object you wish to send from your initial request.
2.  **Construct the Payload:** Create a new `Request` object or an array structure that includes both text fields and file streams.
3.  **Send via HTTP Client:** Use the appropriate method on the Laravel `Http` facade to handle the multipart encoding.

Since the Laravel HTTP client relies on underlying Guzzle, which handles complex request construction, you generally need to use stream manipulation or dedicated file handling methods when dealing with files. While direct access to raw streams can be complex, the most practical approach involves ensuring your data is formatted correctly for the endpoint you are calling.

For sending a single file, you typically construct the payload by manually setting up the request body as multipart. If you are building the request programmatically, ensure the file content is read from the temporary location where Laravel stored it (using `storeAs` or equivalent principles).

Here is a conceptual example demonstrating the principle:

```php
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;

class FileSender
{
    public function sendFileToApi(Request $request, string $apiUrl): void
    {
        if (!$request->hasFile('image')) {
            throw new \Exception("No file found to send.");
        }

        $file = $request->file('image');
        $fileName = $file->getClientOriginalName();

        // 1. Prepare the data for multipart transmission
        $multipartData = [
            'filename' => $fileName, // Standard text field
            'file' => $file,         // The file instance itself
        ];

        // 2. Send the request using the 'multipart' method
        try {
            $response = Http::withFormData('multipart')
                            ->post($apiUrl, $multipartData);

            // Handle the response
            if ($response->successful()) {
                return $response->json();
            } else {
                throw new \Exception("API call failed: " . $response->status());
            }
        } catch (\Exception $e) {
            // Log error or handle exceptions gracefully
            throw $e;
        }
    }
}
```

Notice the use of `Http::withFormData('multipart')`. This directive signals to the underlying HTTP client that the body content should be encoded as `multipart/form-data`, correctly handling the boundaries and encoding necessary for file transmission. This structured approach ensures that your binary data is properly framed and sent, making external API interactions seamless.

## Conclusion

Sending files via an HTTP client requires moving beyond simple parameter passing. By understanding the necessity of `multipart/form-data` encoding, you gain control over how complex data is serialized. When integrating with external services—whether it’s an internal microservice or a third-party API—always verify the required content type for file uploads. Mastering this technique, as demonstrated when working with Laravel's HTTP
