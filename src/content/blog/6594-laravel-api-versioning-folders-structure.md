---
title: "Laravel API versioning folders structure"
description: "Mastering Laravel API Versioning: Folder Structure and Model Strategy API versioning is a critical aspect of building scalable and maintainable software. As..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "PHP"]
featured: false
---

API versioning is a critical aspect of building scalable and maintainable software. As applications grow, you inevitably need to evolve your endpoints without breaking existing client integrations. For developers new to this, understanding how to structure your code—specifically controllers, models, and routes—is just as important as understanding the routing mechanism itself.

Let’s dive into your specific questions regarding folder structure and model organization when implementing API versioning in Laravel.

## 1. Is the Proposed Folder Structure True? (Controllers)

The folder structure you proposed for organizing controllers is a perfectly valid and often recommended approach, especially when dealing with distinct versions of an API that might have significantly different business logic or data contracts.

```
/app
  /controllers
    /Api
      /v1
        UserController.php  // Logic specific to API version 1
      /v2
        UserController.php  // Logic specific to API version 2
```

**The Verdict:** Yes, this structure is true and highly effective for achieving clear separation of concerns based on versioning.

### How This Works with Routing

This folder structure pairs perfectly with Laravel's route grouping feature. The key is defining the prefix in your routes to map the versioned URL to the specific controller.

For example, using your structure:

```php
// routes/api.php

Route::group(['prefix' => 'v1'], function () {
    // This route points to the v1 controller logic
    Route::get('user', 'Api\v1\UserController@index');
    Route::get('user/{id}', 'Api\v1\UserController@show');
});

Route::group(['prefix' => 'v2'], function () {
    // This route points to the v2 controller logic
    Route::get('user', 'Api\v2\UserController@index');
    Route::get('user/{id}', 'Api\v2\UserController@show');
});
```

This method ensures that when a request hits `/api/v1/user`, it is handled exclusively by the logic defined within `Api\v1\UserController`. This keeps version-specific code isolated, making it much easier to manage migrations, dependencies, and eventual deprecation of older versions. As we explore more advanced architectural patterns in Laravel, like implementing Service Layers, maintaining this separation becomes even more crucial for clean architecture.

## 2. Folder Structure for Models and Events: Should I Make a Model for Every Version?

This is where the distinction between **API versioning** (the public contract) and **data modeling** (the database structure) becomes vital. The short answer is: **No, you should generally avoid duplicating your core Eloquent models for every API version.**

### The Principle of Shared Models

Models (like `User`, `Post`, etc.) represent the fundamental data entities in your application. If Version 1 and Version 2 of your API are both dealing with a "User," they are likely operating on the same underlying database schema. Duplicating models for every version leads to significant maintenance overhead: you have to update the same logic across multiple files, increasing the risk of inconsistency.

### Best Practice: Shared Models and Adapters

The best practice is to keep your Eloquent models centralized and agnostic of the API version. Instead of duplicating the model, focus on abstracting the *data transformation* or *response formatting* specific to each version within your controllers or dedicated Service Layer.

**Recommended Structure:**

1.  **Keep Models Centralized:** Your `app/Models` directory should contain your core models (e.g., `User.php`).
2.  **Use Controllers for Adaptation:** The controller logic is responsible for deciding *how* to present the data based on the requested version.

If Version 2 requires a field that Version 1 does not, you might introduce **API Resources** or **DTOs (Data Transfer Objects)** rather than changing the core Eloquent model structure itself. API Resources are excellent tools within Laravel for shaping the final JSON output without modifying your database schema unnecessarily.

### Example: Using API Resources

Instead of duplicating `UserController` logic into `v1` and `v2` controllers with separate models, you can keep one controller and use resources to handle version-specific responses:

```php
// app/Http/Controllers/Api/UserController.php (Shared Controller)

class UserController extends Controller
{
    public function index(Request $request)
    {
        $user = User::find($request->input('id'));

        // Versioning logic happens here or in the Response layer
        if ($request->header('Accept') === 'application/vnd.myapp.v1+json') {
            return new UserV1Response($user); // Custom DTO/Resource for V1 structure
        } elseif ($request->header('Accept') === 'application/vnd.myapp.v2+json') {
            return new UserV2Response($user); // Custom DTO/Resource for V2 structure
        }

        // Fallback or error handling
    }
}
```

This approach keeps your models clean, adheres to the Single Responsibility Principle (SRP), and allows you to evolve your API contract gracefully. For deep dives into building robust data pipelines in Laravel, understanding how Eloquent interacts with these patterns is key, much like grasping the core principles discussed on resources for a solid foundation.

## Conclusion

Versioning an API is about managing expectations while maintaining a stable backend. The folder structure for controllers should prioritize separation based on versioning if the logic truly diverges significantly. However, for models and business logic, favor centralization. Use your controllers as the gatekeepers to adapt shared data into the specific contract required by each API version, leveraging Laravel's powerful features like route prefixes and API Resources to achieve a clean, scalable, and maintainable architecture.
