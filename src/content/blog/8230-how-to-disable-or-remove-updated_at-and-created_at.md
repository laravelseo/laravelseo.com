---
title: "How to disable or remove updated_At and Created_at when returning data"
description: "How to Hide created at and updated at When Returning API Data in Laravel As developers working with Eloquent and building robust APIs, dealing with..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working with Eloquent and building robust APIs, dealing with default timestamps is a very common requirement. We often need to expose specific data points to the client while keeping internal auditing fields like `created_at` and `updated_at` hidden for security or presentation purposes.

The issue you encountered—trying to use `unset()` on the result of an Eloquent query—is a frequent stumbling block. While seemingly straightforward, manipulating the structure of Eloquent collections directly can often lead to unexpected behavior, especially when dealing with nested relationships.

This post will explore why simple methods fail and present the most professional, scalable solutions for cleanly omitting timestamps when returning data from your Laravel application.

## The Pitfall of Direct Manipulation

When you retrieve data using Eloquent, the timestamps are automatically attached to the resulting models or collection. When you return this data directly via a controller method, the framework serializes everything that is present in the model. Simply calling `unset()` on the collection variables usually affects the PHP array structure but doesn't necessarily redefine how Laravel serializes the output, leading to the timestamps still being included in the final JSON response.

Your current approach:
```php
// This approach often fails for complex Eloquent relationships
public function places()
{
    $placeType = PlaceType::with('places')->where('id', 1)->get();
    return response()->json(['placeType' => $placeType]);
}
```
This returns the full Eloquent models, including all their default fields. To achieve a clean separation between your database model and your API contract, we need to intercept the data *before* it is sent to the client.

## The Recommended Solution: Laravel API Resources

The most idiomatic and powerful way to control the shape of your JSON response in Laravel is by using **API Resources**. These classes act as a dedicated layer between your Eloquent models and the final output format, giving you complete control over which attributes are exposed. This practice aligns perfectly with the principles of clean architecture that Laravel promotes (as discussed on the [Laravel Company website](https://laravelcompany.com)).

By defining a Resource class, you explicitly define what data should be included for a specific endpoint, ensuring that sensitive or unnecessary fields like timestamps are never accidentally exposed.

### Step-by-Step Implementation using API Resources

Let's assume you have `PlaceType` and the relationship to `Places`. We will create a resource for the `PlaceType` model.

**1. Create the Resource:**
Generate a new resource class:
```bash
php artisan make:resource PlaceTypeResource
```

**2. Define the Resource Logic:**
In your `PlaceTypeResource.php`, you define exactly what attributes are returned. You simply omit the timestamp fields.

```php
// app/Http/Resources/PlaceTypeResource.php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\Resource;

class PlaceTypeResource extends Resource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'icon' => $this->icon,
            'status' => $this->status,
            // Notice: created_at and updated_at are intentionally omitted here!
        ];
    }
}
```

**3. Use the Resource in the Controller:**
Now, in your controller method, instead of returning the raw Eloquent collection, you return the resource object, which handles the transformation for you.

```php
// app/Http/Controllers/PlaceTypeController.php

use App\Models\PlaceType;
use App\Http\Resources\PlaceTypeResource;

class PlaceTypeController extends Controller
{
    public function places()
    {
        $placeType = PlaceType::with('places')->where('id', 1)->get();

        // Use the collection method to transform the results into resources
        return response()->json($placeType->map(function ($type) {
            return new PlaceTypeResource($type);
        }));
    }
}
```

This approach is superior because it separates the concerns: your model handles data persistence, and your Resource handles data presentation. This separation makes your code cleaner, easier to maintain, and more predictable for API consumers.

## Conclusion

For managing data exposure in a Laravel API, relying on explicit transformation layers like API Resources is the best practice over direct manipulation of Eloquent collections. It moves you away from fragile methods like `unset()` and establishes a robust contract for your API endpoints. By adopting this pattern, you ensure that your application remains clean, scalable, and adheres to high standards for data integrity.
