---
title: "How to send files with Guzzle without loading them into memory"
description: "How to Send Files with Guzzle Without Loading Them Into Memory When dealing with large file uploads in a web application, memory management becomes a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Content", "PHP", "Errors"]
featured: false
---

When dealing with large file uploads in a web application, memory management becomes a critical concern. As a senior developer, I often encounter situations where simple synchronous file operations lead to fatal memory exhaustion errors, especially when processing multiple large files simultaneously. This is particularly true when bridging local server operations (like reading files from the disk) and external HTTP requests using libraries like Guzzle.

The problem you are facing—`Allowed memory size of ... bytes exhausted`—stems directly from reading entire file contents into PHP variables before sending them over the network, which consumes massive amounts of RAM. We need a strategy that streams the data rather than buffering it entirely in memory.

This guide will walk you through the correct, memory-efficient way to handle multipart file uploads with Guzzle, ensuring your application remains stable even when dealing with multi-megabyte files.

## The Pitfall: Loading Files into Memory

Your current approach involves iterating through uploaded files and using `file_get_contents($file->path())` to read the entire binary content of each file into a string before packaging it for Guzzle’s `multipart` request:

```php
// Potentially memory intensive code snippet
foreach ($files as $key => $file) {
    $filesPayload[] = [
        'name'     => $key,
        'contents' => file_get_contents($file->path()), // <-- Memory hog here!
        'filename' => $file->getClientOriginalName(),
    ];
}
```

When you have many files, concatenating all their contents into `$filesPayload` in memory quickly exceeds the PHP memory limit. This pattern is fundamentally inefficient for large data transfer.

## The Solution: Streaming with Guzzle and Multipart Form Data

The most robust solution is to leverage Guzzle's ability to handle file streams directly within the multipart request structure, avoiding the need to load all contents into a single PHP array first. Instead of pre-calculating the content, we instruct Guzzle where the file data resides on the server.

While Guzzle’s standard `multipart` handling often expects data in the form of an array (as you were doing), for truly massive files, the most memory-safe approach is to use PHP stream wrappers and let the underlying mechanism handle the transfer, or ensure that the data being sent is manageable chunks rather than monolithic strings.

However, if we stick to the standard multipart format where the file itself is the body of the request, we must ensure we are using the correct Guzzle structure for file uploads *instead* of embedding the content directly into the payload array. Since you are dealing with files already on the server (like those uploaded via Laravel), we can often leverage the `multipart` option to point Guzzle toward the physical file streams if possible, or use a library wrapper that handles stream reading efficiently.

For this specific scenario, where the goal is sending *files*, the most memory-efficient way within the Guzzle framework is often to ensure that PHP reads the file in chunks during the request phase, rather than buffering it entirely before the network call.

### Optimized Implementation Example

Instead of loading everything into a massive payload array, we can focus on creating the boundary information for each file and letting Guzzle handle the stream reference (or using simpler data if the API supports direct file path references).

If you must pass the content, use PHP streams throughout:

```php
// In your Laravel Controller method

use GuzzleHttp\Client;

/* @var \Illuminate\Http\Request $request */
$files = $request->file(array_keys($request->file())); // Get uploaded files

$client = new Client([
    'base_uri' => 'https://your-external-api.com',
]);

// When using multipart/form-data for files, Guzzle expects the file stream 
// or file path information within the payload structure.
$multipartData = [];

foreach ($files as $file) {
    // Instead of file_get_contents(), we prepare the necessary parts.
    // For large files, passing the file stream handle directly (if possible) 
    // or referencing the path is often better than reading it fully into memory first.
    $multipartData[] = [
        'name'     => $file->getClientOriginalName(),
        // Pass the file object/path for Guzzle to handle streaming if supported, 
        // or use a stream wrapper if dealing with raw streams.
        'file_stream' => fopen($file->getRealPath(), 'r'), // Use the stream resource directly
    ];
}

try {
    $response = $client->post('upload-endpoint', [
        'multipart' => $multipartData,
    ]);
    // Handle response...
} catch (\Exception $e) {
    // Handle error...
}
```

**Key Takeaway:** By using `fopen()` to obtain a file stream resource and including that resource handle in the multipart array, you instruct Guzzle (and PHP) to manage the data transfer as streams rather than bulk loading it into memory for every file. This shifts the heavy lifting of buffering from your application layer to the underlying system resources, drastically reducing peak memory usage.

## Conclusion

Handling large file uploads efficiently requires a shift in paradigm: move away from monolithic memory loading towards stream-based processing. By understanding how Guzzle interacts with PHP streams and leveraging resource handles (`fopen`) within the `multipart` request structure, you can successfully send multiple large files without causing memory exhaustion errors. Always prioritize streaming when dealing with I/O operations like file transfers; this practice is fundamental to building scalable applications, much like adhering to best practices seen in robust frameworks like Laravel.
