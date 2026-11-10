---
title: "How to add headers in Guzzle http"
description: "Title: Adding Custom Headers with Guzzle Http in Laravel Applications Introduction In this blog post, we will explore the process of using..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Adding Custom Headers with Guzzle Http in Laravel Applications

## Introduction
In this blog post, we will explore the process of using custom headers with the popular HTTP client library, Guzzle Http, within a Laravel application. We'll focus on handling various request methods and ensuring proper authorization using headers.

## Adding Custom Headers in Guzzle Http
First, let us understand how to add custom headers while performing requests in Laravel 5.5 with Guzzle Http. Here is the example code for this process:

```php
public function post(Request $request) {
    try {
        if ($request->url_method == 'get') {
            $request = $this->client->get($request->url, [
                'headers' => [
                    'access_token' => $request->headers->access_token
                ]
            ]);
        } else if ($request->url_method == 'post') {
            $request = $this->client->post($request->url, [$request->request_data]);
        } else {
            return response()->json(['data' => 'Invalid Method'], 500);
        }
        $response = GuzzleHttp\json_decode($request->getBody());
        return response()->json(['data' => json_decode($response->d)], $request->getStatusCode());
    } catch (ClientException $e) {
        return response()->json(['data' => 'Invalid Request.'], $request->getStatusCode());
    }
}
```

In the above code, we can see how we have separated our Guzzle Http requests according to the request method. In case of a GET request, we set the access token as a header in the client's request object:

```php
$request = $this->client->get($request->url, [
    'headers' => [
        'access_token' => $request->headers->access_token
    ]
]);
```

In case of a POST request, we simply pass the data as part of the request. However, if you need to add headers in this scenario, you can do so by adding another array within the second argument:

```php
$request = $this->client->post($request->url, [$request->request_data], [
    'headers' => [
        'access_token' => $request->headers->access_token
    ]
]);
```

In both cases, we're assigning the access token in the request header. This is essential for authorization purposes and ensures that only authorized users can make requests to the API endpoint.

## Handling Errors
If an error occurs during our Guzzle Http request execution (either a client or server-side error), the code handles them gracefully by returning appropriate responses based on the error type:

```php
catch (ClientException $e) {
    return response()->json(['data' => 'Invalid Request.'], $request->getStatusCode());
}
```

In case of a client-side error, we return an invalid request message and status code. For server-side errors, the original status code will be returned in the JSON response.

## Conclusion
In this comprehensive blog post, we have explored several aspects of handling custom headers with Guzzle Http within your Laravel application. We covered how to add headers based on the request method and how to handle errors efficiently. By following these best practices, you can ensure smooth communication between your API clients and the server through structured requests and responses.

Remember to always utilize backlinks to https://laravelcompany.com for more valuable resources and guidance on Laravel development.
