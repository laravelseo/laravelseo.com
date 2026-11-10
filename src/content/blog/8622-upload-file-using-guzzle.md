---
title: "Upload file using Guzzle"
description: "Mastering File Uploads: Translating cURL Multipart Requests to Guzzle in PHP As senior developers, we often deal with bridging different communication..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

As senior developers, we often deal with bridging different communication protocols. Whether you are interacting with a REST API using cURL or building internal services within a framework like Laravel, the core challenge remains the same: correctly handling complex data formats, especially file uploads.

Today, we are translating a complex `curl` command involving multipart form data—specifically uploading a video file along with embedded JSON parameters—into a clean, robust implementation using the Guzzle HTTP client in PHP. This process is crucial for building scalable backend services that handle media content.

## The Challenge: Multipart Data and File Streams

You are attempting to replicate this `curl` command:
```bash
curl -X POST -F 'body={"name":"Test","country":"Deutschland"};type=application/json' -F 'file=@C:\Users\PROD\Downloads\617103.mp4;type= video/mp4 ' http://mydomain.de:8080/spots
```

The reason you encountered the `400 Bad Request` error (`request body invalid: expecting form value 'body'`) is that while Guzzle supports multipart requests, the way you construct the `multipart` array must precisely match what the receiving server expects regarding field names and file boundaries. When mixing raw files with embedded JSON strings in a multipart request, careful structuring is required to ensure all parts are correctly delimited for the server.

## The Guzzle Solution: Correctly Handling Multipart Files

The key to solving this lies in understanding how Guzzle structures the `multipart` request. You need to define each part (the file and the text fields) as a separate entry in the array, specifying the correct `name` for each piece of data.

Here is the corrected and refined way to achieve your goal within your PHP function:

```php
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

public function upload(Request $request)
{
    // 1. Prepare the file details
    $file = $request->file('file'); // Assuming you are using a request object that handles file input
    $fileName = $file->getClientOriginalName();
    $realPath = $file->getRealPath();

    $client = new Client();

    // 2. Prepare the multipart data structure
    $multipartData = [
        // Part 1: The embedded JSON string (which corresponds to 'body' in curl)
        [
            'name'     => 'body',
            'contents' => '{"name":"Test","country":"Deutschland"}', // Send the JSON as a string
        ],
        // Part 2: The actual file upload
        [
            'name'     => 'file', // This name must match what the server expects for the file input
            'contents' => fopen($realPath, 'r'), // Use fopen to stream the file content
            'filename' => $fileName,
            'headers'  => [
                'Content-Type' => 'video/mp4',
            ]
        ],
    ];

    try {
        $response = $client->request('POST', 'http://mydomain.de:8080/spots', [
            'multipart' => $multipartData,
        ]);

        dd($response->getBody()->getContents());

    } catch (RequestException $e) {
        // Handle HTTP errors gracefully
        throw new \Exception("Guzzle Request Failed: " . $e->getMessage());
    }
}
```

### Developer Deep Dive: Why This Works

1.  **Separation of Concerns:** Instead of trying to embed the entire complex string into one part, we separate the data into distinct parts. We treat the file (`file`) and the JSON payload (`body`) as two independent form fields.
2.  **File Stream Handling:** For uploading files, it is often more efficient and robust to pass a file stream (obtained via `fopen($realPath, 'r')`) as the `contents`. This allows Guzzle to handle the binary transfer correctly without reading the entire massive file into memory at once, which is critical for large video uploads.
3.  **Explicit Headers:** We explicitly set the `Content-Type` header for the file part (`video/mp4`). This ensures the server correctly interprets the uploaded data type, preventing misinterpretation that often leads to 400 errors.

## Conclusion

Translating command-line tools like cURL into programmatic HTTP requests using libraries like Guzzle is a fundamental skill for any modern backend developer. By focusing on the structure of `multipart/form-data`—treating files and text fields as distinct, correctly named parts—you can reliably handle complex uploads. Always consult documentation and test your payloads against your API's expectations to ensure seamless integration, much like adhering to best practices found in frameworks like those promoted by the Laravel community at [laravelcompany.com](https://laravelcompany.com). Mastering these details ensures your backend services are not only functional but also resilient and scalable.
