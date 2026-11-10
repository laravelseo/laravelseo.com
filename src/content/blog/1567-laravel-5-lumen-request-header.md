---
title: "Laravel 5 / Lumen Request Header?"
description: "Title: Accessing and Storing HTTP Request Headers in Laravel/Lumen Controllers Body: In this article, we'll explore how to access and store information sent..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Content", "PHP"]
featured: false
---

Title: Accessing and Storing HTTP Request Headers in Laravel/Lumen Controllers
Body:

<p>In this article, we'll explore how to access and store information sent in an HTTP request through headers in Laravel 5 and Lumen applications. We will focus on the Controller layer of your application and provide practical examples to help you understand better.</p>

Firstly, let's establish a clear understanding of what a header is. An HTTP header contains metadata about the request or the response that takes place between a client (web browser) and a server (Laravel/Lumen). Headers are essential for identifying different aspects of each request, such as request method, content type, authentication information, etc.

To access headers in Laravel 5, you can use the `Request::header()` method. This function takes a header name as an argument and returns its value. If the requested header doesn't exist or has no assigned value, it will return null. However, as shown in your example, this may not work for all cases.

<p>In your particular case, you might want to store a received header in a PHP variable so that you can use it later within your application. To achieve this, we suggest using the Illuminate\Http\Request class as shown below:</p>

```php
use Illuminate\Http\Request;

public function index(Request $request)
{
    // Assign header value to a PHP variable
    $pubapi = $request->header('pubapi');

    // Use the assigned value in your controller, for example:
    echo "The value of 'pubapi' is: " . $pubapi;
}
```

<p>By using the Request class, you can easily access and manipulate headers directly within your controller. Remember that the Controller acts as an intermediary layer between the HTTP requests and the application logic, allowing you to perform different actions like validations, authorizations, or customizing responses.</p>

<p><strong>Note:</strong> If you are using Lumen, the process remains almost identical. The only difference is that you don't need to import the Request class since Lumen already does it for you. So in a Lumen application, simply create your controller and use the $request variable inside it as shown above.</p>

<p><strong>Conclusion:</strong></p>

In conclusion, to access and store HTTP request headers in Laravel/Lumen controllers, we recommend using the Illuminate\Http\Request class. This approach ensures cleaner code, improved readability, and greater flexibility when working with requests. Remember that it's always a good practice to use PHP variables to store essential information for future use within your application. We hope this article helps you better understand the concepts of headers in Laravel applications and inspires further exploration of these powerful tools.
