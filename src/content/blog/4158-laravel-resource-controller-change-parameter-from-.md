---
title: "Laravel: Resource Controller change parameter from ID to Slug"
description: "Laravel: Changing Resource Controller Parameters from ID to Slug As developers grow their applications, a common challenge emerges: managing clean,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Errors"]
featured: false
---

As developers grow their applications, a common challenge emerges: managing clean, human-readable URLs while maintaining the powerful structure of RESTful APIs. When you start using `Route::resource()`, Laravel defaults to basing all route parameters on the Eloquent model's primary key, which is typically the `id`. This works perfectly for internal operations but becomes cumbersome when dealing with user-facing slugs or tokens.

This post dives into why you are encountering `404 Not Found` errors when trying to use `{slug}` instead of `{id}`, and provides a robust, developer-focused solution for restructuring your routes in Laravel.

## The Default Behavior: Why You Are Seeing 404s

When you define routes using `Route::resource('/categories', 'CategoryController')`, Laravel automatically generates seven standard routes (index, create, store, show, edit, update, destroy). For the `show` route, it expects a parameter named `{category}` which maps directly to the primary key (`id`) of the corresponding category record.

When you try accessing `/categories/my-awesome-slug`, Laravel looks for a category with the ID equal to `'my-awesome-slug'`. Since this usually doesn't exist (unless you manually set the slug as the primary key), it returns a `404 Not Found` error. This behavior is intentional—Laravel enforces consistency based on its default conventions.

## The Solution: Customizing Route Parameters for Slugs

To achieve clean URLs using slugs or tokens, we need to bypass the standard resource routing mechanism slightly and define custom routes that explicitly use the desired parameter name in the URL. We shift from relying solely on `Route::resource()` for everything to defining specific actions separately.

### Step 1: Ensure Your Model Supports Slugs (The Foundation)

Before routing, ensure your Eloquent model is set up correctly. You should add a `slug` field and ensure it's indexed and unique in your database migration.

```php
// Example Migration Snippet
Schema::create('categories', function (Blueprint $table) {
    $table->id(); // Primary Key (ID)
    $table->string('name');
    $table->string('slug')->unique(); // The field we want to use in the URL
    $table->timestamps();
});
```

### Step 2: Redefining Routes for Custom Parameters

Instead of relying on the automatic `Route::resource()`, you define the standard CRUD routes, and then separately define custom routes that utilize your slugs. This gives you explicit control over the parameter names.

In your `routes/api.php` or `routes/web.php` file, modify your routes as follows:

```php
use App\Http\Controllers\CategoryController;

// Standard Resource Routes (Still using ID internally for creation/management)
Route::resource('/categories', CategoryController::class);

// Custom Route for showing by Slug
Route::get('/categories/{slug}', [CategoryController::class, 'showBySlug']);

// Optional: If you still need to show by ID explicitly
Route::get('/categories/{id}', [CategoryController::class, 'showById']);
```

### Step 3: Implementing the Custom Controller Methods

Now, in your `CategoryController`, you must implement the methods corresponding to these new routes. Notice how the method signature now accepts the parameter name you defined in the route file (e.g., `{slug}`).

```php
namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // ... existing index, store, update, destroy methods ...

    /**
     * Display the category by its unique slug.
     */
    public function showBySlug(string $slug)
    {
        // Find the record using the custom 'slug' parameter
        $category = Category::where('slug', $slug)->firstOrFail();

        return response()->json($category); // Or return view('categories.show', $category);
    }

    /**
     * Display the category by its ID (for compatibility).
     */
    public function showById($id)
    {
        $category = Category::findOrFail($id);
        return response()->json($category);
    }
}
```

## Conclusion: Control is Key in Laravel Routing

The transition from simple primary key routing to dynamic, human-readable routing is a fundamental step in building professional web applications. While `Route::resource()` is fantastic for scaffolding CRUD operations quickly, understanding how to augment these routes with custom parameters gives you the necessary control. By explicitly defining your custom routes and ensuring your controller methods accept those named parameters, you move beyond Laravel's defaults and build a highly flexible and elegant API structure, which aligns perfectly with the principles of clean architecture advocated by teams building robust systems on platforms like https://laravelcompany.com. Master this technique, and you unlock true power in managing your application's URL structure.
