---
title: "Request header field Content-Type is not allowed by Access-Control-Allow-Headers in flight response"
description: "Mastering CORS: Resolving \"Content Type is not allowed\" Errors Between Angular and Laravel As developers building modern full stack applications, we..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Errors"]
featured: false
---

As developers building modern full-stack applications, we constantly navigate the complexities of cross-origin communication. When connecting a frontend framework like Angular to a backend API built with Laravel, one of the most common stumbling blocks is dealing with Cross-Origin Resource Sharing (CORS) policies. The error you are encountering—"Request header field Content-Type is not allowed by Access-Control-Allow-Headers in in flight response"—is a classic symptom of a misconfigured CORS setup on the server side, specifically within your Laravel API.

This post will dissect why this error occurs, how it relates to HTTP headers, and provide the practical steps necessary to resolve it, ensuring seamless communication between your Angular application and your Laravel backend.

## Understanding the CORS Barrier

The issue fundamentally stems from browser security mechanisms designed to prevent malicious websites from making unauthorized requests to other domains. This is known as the Same-Origin Policy. When your Angular application (running on `http://localhost:4200`) tries to fetch data from your Laravel API (running on `http://localhost/fmfb_hr/public/api`), the browser initiates a preflight request (an OPTIONS request) to check if the server permits this cross-origin interaction.

The specific error message indicates that the response headers sent back by your Laravel server—specifically the `Access-Control-Allow-Headers` directive—do not explicitly permit the header your Angular client is sending, which in this case is related to `Content-Type`. While setting `Content-Type: application/json` is standard practice for JSON APIs, the CORS middleware must be configured to accept this information.

## The Laravel Solution: Configuring CORS Properly

Since the error originates from how the server responds, the fix must be implemented in your Laravel configuration rather than solely in the Angular code. You need to ensure that your CORS setup explicitly allows the necessary headers for requests.

In a typical Laravel setup using packages like `fruitcakey/laravel-cors`, you configure this within the `config/cors.php` file. The key is ensuring that the headers allowed on the response match what the client expects.

Here is how you typically ensure broad compatibility for handling JSON data:

```php
// config/cors.php

return [
    // ... other settings

    'allowed_methods' => ['*'], // Allows GET, POST, PUT, DELETE etc.
    'allowed_origins' => ['*'], // Adjust this to your Angular domain in production!
    'allowed_headers' => ['*'], // Setting '*' allows all headers for testing purposes initially.
                               // For stricter security, list specific headers:
                               // ['Content-Type', 'Authorization'],

    'exposed_headers' => ['*'],

    'max_age' => 3600,
];
```

By setting `'allowed_headers' => ['*']` (or explicitly listing `Content-Type`), you instruct Laravel to include the necessary CORS response headers that satisfy the browser's security checks. This configuration ensures that when Angular sends its request with the `Content-Type: application/json` header, the server responds affirmatively, resolving the in-flight error. For deeper dives into API security and robust cross-origin handling within the Laravel ecosystem, exploring resources from [laravelcompany.com](https://laravelcompany.com) is highly recommended.

## Reviewing the Angular Client Code

While the primary fix is on the server, it's important to review the client-side code to ensure best practices are followed. Your provided Angular service snippet handles the request correctly:

```typescript
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
// ... other imports

@Injectable()
export class AuthService {
    private BASE_URL: string = 'http://localhost/fmfb_hr/public/api';
    private headers: Headers = new Headers({'Content-Type': 'application/json'});
    
    constructor(private http: Http) {}

    login(user): Promise<any> {
        let url: string = `${this.BASE_URL}/login`;
        // Setting the headers here is correct for specifying the payload type.
        return this.http.post(url, user, {headers: this.headers}).toPromise();
    }
}
```

The Angular code correctly sets the `Content-Type` header to `application/json`. The fault lies in the server's inability (or failure) to echo back the necessary CORS permissions for that specific request structure.

## Conclusion

Resolving this particular CORS error is a lesson in full-stack security: the client and server must agree on the rules of interaction. For interactions between Angular and Laravel, always treat the server configuration as the single source of truth for cross-origin policies. By meticulously configuring your CORS middleware in Laravel to permit the necessary headers, you ensure that your API functions correctly, providing a robust foundation for any application you build.
