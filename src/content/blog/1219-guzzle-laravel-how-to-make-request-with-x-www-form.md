---
title: "Guzzle - Laravel. How to make request with x-www-form-url-encoded"
description: "Title: Guzzle Laravel. How to Make Requests with x www form url encoded Data Introduction: Handling API interactions is an essential part of modern web..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Title: Guzzle - Laravel. How to Make Requests with x-www-form-url-encoded Data

Introduction:
Handling API interactions is an essential part of modern web development, which often involves sending data in different formats. In this blog post, we will discuss the process of making HTTP requests using Guzzle, a PHP library for making HTTP requests, and how to send data in x-www-form-url-encoded format with Laravel. We will also highlight a common mistake when converting form_params from an array of key-value pairs to JSON objects that can lead to invalid API requests, and provide a solution to avoid such errors.

Body:
1. Making HTTP Requests with Guzzle
   To make HTTP requests using Guzzle, we create a new instance of the client class within our code. The following example shows how to use Guzzle's post() method to send an x-www-form-url-encoded request:

```php
<?php
public function test() {
    $client = new \GuzzleHttp\Client();

    try {
        $res = $client->post('http://example.co.uk/auth/token', [
            'headers' => [
                'Content-Type' => 'application/x-www-form-urlencoded',
            ],
            'json' => [
                'client_id' => 'SOMEID',
                'client_secret' => '9999jjjj67Y0LBLq8CbftgfdreehYEI=',
                'grant_type' => 'client_credentials'
            ]
        ]);

        $res = json_decode($res->getBody()->getContents(), true);
        dd($res);
    } catch (\GuzzleHttp\Exception\ClientException $e) {
        $response = $e->getResponse();
        $result = json_decode($response->getBody()->getContents());

        return response()->json(['data' => $result]);
    }
}
```

2. Common Mistakes When Converting Form_params to JSON Objects
   In the example provided above, we are sending data using JSON format. However, when converting a form_params array (which is an association of key-value pairs) to JSON objects, we may sometimes face issues due to inconsistencies in the data structure. This could lead to errors such as "invalid_clientId" or API responses with incorrect formats.

Solution:
To avoid these problems and ensure compatibility between form_params and JSON format, follow these best practices:

1. Convert key-value pairs into a single array of objects: Transform the form_params array into an array of objects with each object containing the key-values pair as properties. This will maintain the expected structure while preserving consistency in data representation.
2. Validate and sanitize user input: Perform input validation to ensure that only allowed values are accepted by your application. This prevents potential vulnerabilities caused by incorrect or malicious inputs.
3. Use a library for handling form_params conversion: If you prefer using libraries, consider utilizing one like the FormRequest class in Laravel, which automatically handles converting request data into arrays or objects. This approach helps maintain consistent data structures across different applications and frameworks.

Conclusion:
Making HTTP requests with Guzzle is an essential skill for modern web development. To make successful API interactions, carefully consider the data structure you are using in your application. By following the best practices discussed above, you can avoid common mistakes and ensure smooth communication between your system and external APIs.
