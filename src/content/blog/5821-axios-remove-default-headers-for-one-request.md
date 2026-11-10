---
title: "Axios remove default headers for one request"
description: "Axios Header Management: How to Temporarily Bypass Default Headers for Specific Requests As developers integrating with external APIs, we often run into..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Google"]
featured: false
---

As developers integrating with external APIs, we often run into frustrating issues related to Cross-Origin Resource Sharing (CORS) policies. A common blocker is the presence of default headers—like `X-Requested-With` or CSRF tokens—that are automatically attached by libraries or boilerplate code, causing conflicts when interacting with services like the Google Maps API.

This post addresses a very specific scenario: how to selectively remove or override these default headers for *one* Axios request without permanently altering your application's global defaults.

## The Pitfall of Deleting Defaults

You correctly identified that simply using `delete axios.defaults.headers.common['X-Requested-With']` seemed like a direct solution. However, this approach is generally discouraged in modern application development for several reasons. When you modify `axios.defaults`, you are changing the global configuration for *every subsequent request* made by that instance of Axios throughout your entire application.

If you only need to bypass these headers for a single, specific API call—perhaps one that requires raw CORS interaction—deleting them globally causes unintended side effects elsewhere in your codebase. We want targeted solutions, not global sledgehammers.

## The Correct Approach: Request-Specific Headers

The robust and recommended way to handle request-specific modifications is by passing the headers directly within the configuration object of the individual request. This ensures that the defaults remain intact for all other operations while allowing you to inject or omit specific headers only where needed.

Axios is designed to allow this granular control, making it the perfect tool for solving these temporary header conflicts.

### Implementing Conditional Header Removal

Instead of modifying `axios.defaults`, we can define a custom configuration object for the failing request and explicitly define only the headers necessary for that interaction. If you need to remove specific default headers, you simply omit them from your custom header definition.

Here is how you would modify your problematic Axios GET request:

```javascript
// Assume this is your standard setup causing CORS issues
import axios from 'axios';

const mapApiUrl = 'https://maps.googleapis.com/maps/api/place/geocoding?address=...';

async function getLocationWithCustomHeaders() {
    try {
        const response = await axios.get(mapApiUrl, {
            // Define only the headers strictly necessary for this call
            headers: {
                'Accept': 'application/json',
                // We explicitly omit X-Requested-With and X-CSRF-TOKEN here
            }
        });
        console.log('Location Data:', response.data);
    } catch (error) {
        console.error('Error fetching location:', error);
    }
}

geoLocationWithCustomHeaders();
```

### Why This Works Better

By passing the `headers` object directly to the request call, you are creating a temporary scope. The headers defined inside this block only apply to that specific execution context. Your global Axios defaults remain untouched, ensuring that future requests—whether they interact with your internal services or other external APIs—behave according to your intended configuration.

## Best Practices for API Interaction

When building robust applications, especially those dealing with backend interactions (like fetching data from a service), understanding request and response handling is crucial. This principle of controlling precisely what information is sent and received is central to secure and maintainable API design. When you are designing APIs or interacting with complex services, ensuring that your authentication and request metadata are handled explicitly rather than relying on global defaults makes debugging significantly easier. For developers working within the Laravel ecosystem, understanding how requests are constructed and authenticated is key to building reliable services.

In summary, avoid modifying `axios.defaults` for temporary fixes. Instead, leverage Axios's native ability to pass a configuration object with request-specific headers. This technique provides the necessary control, solves immediate CORS issues gracefully, and adheres to best practices for maintaining clean, predictable application state.
