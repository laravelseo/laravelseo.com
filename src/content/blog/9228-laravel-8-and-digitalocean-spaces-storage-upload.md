---
title: "Laravel 8 and Digitalocean spaces storage upload"
description: "Mastering DigitalOcean Spaces Uploads with Laravel 8: Solving S3 Endpoint DNS Errors Migrating file storage for modern applications often involves..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Migrating file storage for modern applications often involves integrating cloud object storage solutions like DigitalOcean Spaces. When building a robust system with Laravel 8, using the `league/flysystem-aws-s3-v3` package is the standard approach. However, configuring this setup to point correctly to non-standard endpoints like DigitalOcean Spaces can introduce subtle but frustrating network errors, especially around DNS resolution.

This post dives deep into a common issue encountered when uploading files to DigitalOcean Spaces using Laravel and Flysystem, focusing on why you see errors like `Domain name not found` and how to resolve it definitively.

## The Setup: Bridging Laravel and S3 Compatibility

The provided configuration snippet demonstrates the intent perfectly:

```php
// composer.json dependencies (showing the package usage)
"laravel/framework": "^8.54",
"league/flysystem-aws-s3-v3": "^1.0" 
```

And the crucial filesystem configuration in `filesystems.php`:

```php
'spaces' => [
   'driver' => 's3',
   'key' => env('SPACES_ACCESS_KEY_ID', '===AAACESS KEY==='),
   'secret' => env('SPACES_SECRET_ACCESS_KEY', '===BBBSECRECT KEY==='),
   'region' => env('SPACES_DEFAULT_REGION', 'sgp1'),
   'bucket' => env('SPACES_BUCKET', 'laravel-spaces'),
   'url' => env('SPACES_URL', 'https://laravel-spaces.sgp1.cdn.digitaloceanspaces.com'),
   'endpoint' => env('SPACES_ENDPOINT', 'https://sgp1.digitaloceanspaces.com')
],
```

This setup correctly leverages the S3 driver, but success hinges entirely on how Flysystem and the underlying AWS SDK handle custom endpoints provided by DigitalOcean Spaces.

## Decoding the Error: Why DNS Resolution Fails

The error you encountered—`Aws\S3\Exception\S3Exception with message 'Error executing "PutObject" on "https://laravel-spaces.s3.sgp1.amazonaws.com/thumb.png"; AWS HTTP error: cURL error 6: Could not resolve: laravel-spaces.s3.sgp1.amazonaws.com (Domain name not found)`—is a classic networking problem.

The core issue is that the AWS SDK attempts to construct a URL based on standard S3 conventions, but when you use a custom `endpoint` (as required for DigitalOcean Spaces), the library needs explicit instructions on how to map the request internally. The error indicates that the system cannot resolve the constructed hostname because it's trying to connect directly to a standard AWS region endpoint instead of the specific DO Spaces CDN path.

### Why Append S3 and AmazonAWS.com to the URL?

When dealing with S3-compatible services like DigitalOcean Spaces, you are essentially using an API layer that mimics S3 but routes through a custom host. The SDK needs to know *not* to use the standard AWS public endpoint (`s3.amazonaws.com`) for the host resolution, but rather to route the traffic via your specified `endpoint`.

The problem arises when the configuration is ambiguous or if the driver logic doesn't correctly substitute the base URL provided by the `endpoint` into the request path construction. In this case, the library defaults to trying to resolve a standard AWS domain name before applying the custom endpoint context, leading to a DNS failure.

## The Solution: Correctly Configuring the Endpoint

The solution lies in ensuring that the `endpoint` configuration correctly dictates the base address for all S3 operations. For DigitalOcean Spaces, the required setup is usually straightforward but requires precision in environment variable management.

Instead of relying on the standard structure implicitly, ensure your endpoint configuration is robust and explicitly points to the DO Spaces host structure.

**Best Practice Implementation:**

1.  **Verify Endpoint Consistency:** Ensure `SPACES_ENDPOINT` (e.g., `https://sgp1.digitaloceanspaces.com`) is the *only* base URL used for all S3 driver operations, including bucket and object paths.
2.  **Use Environment Variables Strictly:** Never hardcode these values. Rely exclusively on environment variables as shown in your initial setup.

If you are still facing issues after setting the endpoint correctly, it often means the specific version of the Flysystem driver or the AWS SDK is interacting poorly with a highly customized host structure. In complex scenarios like this, testing connectivity directly using tools like `curl` against the configured endpoint is invaluable:

```bash
# Test connectivity to the defined endpoint
curl -v https://sgp1.digitaloceanspaces.com/thumb.png
```

If the direct `curl` command succeeds, but the Laravel application fails, the issue is definitively within the PHP driver's implementation of URL construction. Ensure you are using the latest stable versions for both Laravel and Flysystem, as framework updates often refine these lower-level integrations, promoting better architectural consistency within the package ecosystem.

## Conclusion

Uploading to DigitalOcean Spaces via a Laravel 8 application is entirely achievable, provided you master the intricacies of S3 compatibility and custom endpoints. The error reported is almost always a DNS resolution failure stemming from an incorrect assumption about the base S3 URL being used during the SDK call. By carefully defining and strictly adhering to your `endpoint` configuration, you can ensure that Flysystem correctly routes file operations, allowing your application to seamlessly handle storage without these frustrating network errors. Happy coding!
