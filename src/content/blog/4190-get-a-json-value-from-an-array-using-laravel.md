---
title: "Get a JSON value from an array using Laravel"
description: "Extracting Geospatial Data from JSON Arrays: A Laravel Guide As developers working with external APIs, especially those dealing with complex geospatial data..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Google", "Errors"]
featured: false
---

As developers working with external APIs, especially those dealing with complex geospatial data like Google Maps Geocoding services, we often run into challenges parsing deeply nested JSON structures. Getting a simple latitude or longitude value hidden within an array of results can quickly lead to frustrating errors like "trying to access the property of a non-object."

This post will walk you through the common pitfalls when handling this type of response and provide a robust, developer-friendly solution using PHP principles, which integrate seamlessly into a Laravel application.

## The Challenge: Navigating Nested JSON Data

You are attempting to extract coordinates from a structure that looks like this (as provided in your example):

```json
{
   "results": [
      {
         "geometry":{
            "location":{
               "lat":57.1912463,
               "lng":-2.1790257
            }
         },
         // ... other fields
      }
   ],
   "status":"OK"
}
```

The error you encountered (`trying to access the property of a non-object`) almost always happens because you are attempting to chain object properties (`->`) before confirming that the preceding value actually exists or is an object. When using `json_decode()`, if you pass it a string, the result is a PHP object (or array), and subsequent navigation must be carefully validated.

## Why Direct Access Fails

Your attempt:
```php
json_decode($response)->results->geometry->location->lat
```
Fails because `json_decode()` converts the JSON string into a PHP structure. If `$response` is intended to hold the raw JSON *string*, you must decode it first. Even if you decode it correctly, if an API call fails or returns an unexpected structure (e.g., `status: "ZERO_RESULTS"` instead of `"OK"`), attempting to access nested keys like `results` will fail because those keys won't exist on the root object.

## The Solution: Safe and Thorough Parsing

The key to reliable data extraction is defensive programming—checking for the existence of every layer before trying to access its contents. We must check if the decoding was successful, and then safely traverse the resulting array or object.

Here is the correct, robust way to handle this in a Laravel environment:

### Step 1: Decode the JSON Safely

Always check the result of `json_decode()` for errors before proceeding.

```php
$jsonString = $response; // Assume $response holds the raw string from the API call

$data = json_decode($jsonString, true); // Use 'true' to get associative arrays instead of objects (often easier in PHP)

if (json_last_error() !== JSON_ERROR_NONE) {
    // Handle decoding errors gracefully
    throw new \Exception("JSON decoding failed: " . json_last_error_msg());
}

// Now $data is a PHP array (or object, depending on the second argument to json_decode)
```

### Step 2: Safely Navigate the Array

Since we are dealing with an array of results (`results`), we need to ensure that the `results` key exists and that it contains at least one element before trying to access the latitude.

```php
if (isset($data['results']) && is_array($data['results']) && !empty($data['results'])) {
    // Get the first result from the array
    $firstResult = $data['results'][0];

    // Now safely access the deeply nested location data
    $latitude = $firstResult['geometry']['location']['lat'] ?? null;
    $longitude = $firstResult['geometry']['location']['lng'] ?? null;

    if ($latitude !== null && $longitude !== null) {
        echo "Latitude: " . $latitude . ", Longitude: " . $longitude;
    } else {
        echo "Could not find latitude or longitude in the result.";
    }
} else {
    // Handle cases where no results were returned (e.g., status was 'ZERO_RESULTS')
    echo "No location data found for this request.";
}
```

## Laravel Context and Best Practices

When integrating external API logic into a Laravel application, the best practice is to encapsulate this parsing logic within a dedicated Service or Model class rather than handling it directly in a Controller. This promotes separation of concerns, making your code cleaner and easier to test—a core principle when building robust applications with **Laravel** components.

Instead of manually decoding strings everywhere, consider using Laravel's built-in HTTP client, which often handles JSON responses automatically, or leverage Eloquent models if you are storing the results in a database. For raw external services, ensuring your data consumption layer is resilient to bad data formats is paramount. This defensive approach aligns perfectly with the philosophy of building stable systems, much like enforcing strict contracts in Laravel development.

## Conclusion

Extracting complex data from external JSON APIs requires moving beyond simple chained property access. By implementing robust error checking—verifying the successful decoding, checking for the existence of array keys (`results`), and ensuring nested objects exist before accessing their properties—you transform fragile code into resilient software. Always prioritize defensive coding when dealing with third-party data to prevent runtime errors and ensure a smooth user experience.
