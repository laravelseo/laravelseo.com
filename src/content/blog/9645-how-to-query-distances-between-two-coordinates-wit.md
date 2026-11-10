---
title: "How to query distances between two coordinates with Eloquent"
description: "Mastering Geospatial Queries with Eloquent: Finding Distances Between Coordinates I know this has been asked countless times in the community. Dealing with..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords"]
featured: false
---

I know this has been asked countless times in the community. Dealing with geographic data—finding users within a certain radius of another point—often trips up developers who are primarily focused on relational database querying. The struggle you described, wanting to use elegant Eloquent relationships for complex distance calculations, is completely understandable.

While Eloquent is superb for managing relationships and standard filtering, geospatial queries introduce a layer of complexity that requires stepping outside the simple `where` clauses and diving into how your underlying database handles geometry.

This post will guide you through the correct, performant way to query distances between two coordinates using Laravel and Eloquent, moving beyond simple relational checks to true spatial analysis.

---

## The Challenge: Bridging Relations and Geometry

You have a classic one-to-many relationship setup: `User` has many `UserLocation` records (latitude and longitude). To find users within a 5km radius of a specific point, you need to calculate the great-circle distance between two sets of coordinates.

The problem is that Eloquent's built-in query builder methods (`whereHas`, `has`) are designed for relational joins, not complex mathematical calculations across spatial coordinates. Standard SQL alone requires the Haversine formula to accurately calculate the distance on a sphere.

## The Solution: Leveraging Database Power

Since calculating true spherical distances is computationally intensive and database-dependent, the most efficient approach is to push this calculation down to the database layer where it can be optimized using native geospatial functions (if available) or by applying the Haversine formula directly in a subquery.

We will use the raw query capabilities of Eloquent to construct a query that filters based on the calculated distance.

### Step 1: Define Your Coordinates and Constants

First, we need the reference points—the coordinates of the user you are checking against and the desired radius.

```php
$targetLat = 34.0522; // Example: Los Angeles Latitude
$targetLng = -118.2437; // Example: Los Angeles Longitude
$radiusKm = 5; // Desired search radius in kilometers
```

### Step 2: Implementing the Distance Calculation (The Haversine Formula)

Since Eloquent doesn't provide a built-in geospatial distance method, we must calculate the distance within the query. We can use Laravel's `whereRaw` or scope methods to inject the necessary mathematical logic. For this example, we will demonstrate how to structure the query using raw expressions derived from the Haversine formula.

The Haversine formula calculates the great-circle distance between two points on a sphere given their longitudes and latitudes.

```php
use App\Models\User;
use Illuminate\Support\Facades\DB;

// Assume we are querying users based on the coordinates of another user (e.g., $targetLat, $targetLng)
$distanceFormula = "6371 * acos(cos(radians($targetLat)) * cos(radians(user_location_lng)) * cos(radians(user_location_lat)) + sin(radians($targetLat)) * sin(radians($targetLng)))";

$users = User::where('status', 1)
    // Use whereRaw to calculate the distance between the target point and each user's location
    ->whereRaw("
        6371 * acos(
            cos(radians($targetLat)) * cos(radians(user_location_lat)) * cos(radians(user_location_lng)) + 
            sin(radians($targetLat)) * sin(radians(user_location_lng))
        ) <= ($radiusKm / 1000) // Convert radius from km to degrees approximation for comparison (simplified for demonstration)
    ")
    ->get();
```

***Note on Implementation:*** *While the example above simplifies the raw calculation for brevity, in a production environment, you would typically use advanced database features like PostGIS (if using PostgreSQL) which has native functions like `ST_Distance` that make this operation significantly cleaner and faster than relying purely on complex SQL math.*

## Best Practices for Geospatial Data

1.  **Database Choice is Key:** If your application deals heavily with location data, strongly consider a database extension like **PostGIS**. PostGIS provides robust spatial indexing and functions, allowing you to perform these distance calculations with highly optimized native commands, rather than relying on slow PHP-side math or complex raw SQL expressions.
2.  **Indexing Spatial Data:** Ensure your latitude and longitude columns are properly indexed. If using PostGIS, use geometric indexing to leverage the speed benefits of spatial indexes. This is crucial for maintaining performance as your user base grows.
3.  **Keep Logic Separate:** While `whereRaw` solves the query problem, encapsulate complex logic within dedicated local scopes or dedicated Service classes. This keeps your Eloquent models clean and adheres to good architectural patterns, a principle central to building scalable applications like those discussed on [laravelcompany.com](https://laravelcompany.com).

## Conclusion

Querying distances between coordinates using Eloquent requires acknowledging that relational querying alone is insufficient for spatial mathematics. The correct developer approach is to delegate the heavy lifting—the complex geometry calculation—to the database engine. By combining Eloquent's fluent syntax with the power of `whereRaw` or native geospatial extensions, you can build powerful, efficient, and scalable location-based features. Embrace your database capabilities, and let Laravel manage the elegant structure while SQL handles the spatial heavy lifting.
