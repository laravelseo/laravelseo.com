---
title: "Why isn't my nginx web server handling ttf fonts?"
description: "Why isn't my Nginx web server handling TTF fonts? A Deep Dive into CORS and MIME Types As a senior developer working with modern web stacks, we frequently..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Content", "Errors"]
featured: false
---

As a senior developer working with modern web stacks, we frequently encounter subtle but frustrating issues where seemingly correct HTTP configurations fail in complex cross-origin scenarios. One of the most common culprits involves serving static assets like web fonts, especially when dealing with Content Security Policies (CSP) and Cross-Origin Resource Sharing (CORS).

You are running into a classic conflict: your server seems to allow access via command-line tools like `curl`, but the browser is enforcing stricter security policies and blocking the request. Let's break down why this happens, focusing on the interaction between Nginx configuration, MIME types, and CORS headers when serving font files.

## The CORS vs. Direct Access Paradox

The error message you are seeing—`Access to font at '...' from origin 'http://www.second-example.com' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource`—is crucial. It tells us that the browser, operating under the Same-Origin Policy, is inspecting the response headers sent by your server before allowing the font to be loaded and used on a different domain.

The fact that `curl -I` successfully retrieves the `access-control-allow-origin: *` header indicates that Nginx *is* sending the necessary CORS permission for general requests. However, serving font files involves specific MIME types (`application/x-font-ttf`, etc.) which can sometimes bypass or complicate how the browser interprets these headers in a cross-origin context, especially if the server isn't explicitly configured to handle content negotiation correctly for those specific file extensions.

## Deconstructing the Nginx Configuration

Your attempt to configure Nginx to handle font types is correct in principle. You are trying to tell Nginx that these specific file types should be treated as fonts and allow cross-origin access.

Here is an analysis of your configuration snippet:

```nginx
location ~* .(gif|jpg|jpeg|png|ico|wmv|3gp|avi|mpg|mpeg|mp4|flv|mp3|mid|js|css|wml|swf|ttf|ttc|otf|eot|woff|woff2)$ {
    add_header Access-Control-Allow-Origin "*";
    expires max;
}
```

While this attempts to catch all relevant extensions, the issue often lies not just in *allowing* access, but ensuring that the specific MIME types are correctly mapped and that the font files themselves are served with the correct security context.

### The Role of MIME Types in Font Delivery

Web fonts require specific MIME types to be correctly recognized by the browser. If Nginx is serving the file without explicitly defining or prioritizing these types for the requested resource, the browser defaults to blocking it as a potential security risk, even if the CORS header is present elsewhere.

You correctly identified the necessary MIME mappings:

```
application/x-font-ttf           ttc ttf;
application/x-font-otf           otf;
application/font-woff                            woff;
application/font-woff2           woff2;
```

The solution often involves ensuring that your Nginx configuration doesn't just *add* a header, but correctly serves the file type based on its content and extension mapping.

## Practical Solution: Ensuring Correct MIME Handling

To resolve this conflict, we need to ensure two things are perfectly aligned: correct MIME type serving *and* robust CORS headers for static assets.

### 1. Refine the `types` Block (Best Practice)

Instead of using a broad `location` block that applies header logic everywhere, it is often cleaner to define specific mime types and ensure they are correctly handled by the server block or the specific location. If you are serving assets managed by Laravel, ensuring your asset pipeline handles these mappings correctly is key. For modern applications, leveraging frameworks like **Laravel** for routing and API design ensures that static file delivery remains secure and predictable.

### 2. Explicitly Handle Font MIME Types

Ensure your Nginx configuration explicitly maps the font files to their proper types within a more targeted setup. If you are using Laravel's asset broadcasting or serving static files, ensure these configurations don't conflict with the framework's internal handling.

A more robust approach often involves ensuring that when the content type is set (which is usually handled by the file extension and Nginx's `mime.types` settings), the CORS header is consistently applied for those specific resource types. Since you are using Laravel, ensure your storage setup is correctly configured to serve these files directly through the web server without intermediate proxy issues.

## Conclusion

The mystery behind why Nginx seems to allow access via `curl` but blocks it in the browser boils down to a subtle miscommunication between the server's HTTP header delivery mechanism and the browser's strict CORS security model, specifically concerning resource types like TTF files. By carefully aligning your MIME type definitions with your cross-origin headers, you can ensure that static assets, such as web fonts, are served securely and correctly across all domains. Always treat CORS not just as a header to be present, but as a fundamental requirement tied to the specific content being requested.
