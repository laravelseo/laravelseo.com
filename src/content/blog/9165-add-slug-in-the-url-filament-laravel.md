---
title: "Add slug in the URL filament Laravel"
description: "Adding Clean Slugs to URLs in Filament Laravel Applications As developers building feature rich applications with Laravel and Filament, one of the most..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers building feature-rich applications with Laravel and Filament, one of the most common requirements is achieving clean, human-readable URLs. While Eloquent's primary key (`id`) provides necessary database linkage, relying solely on numeric IDs for public-facing routes can result in less intuitive navigation. We often want to use a unique identifier, like a `slug`, directly in our URLs.

This guide will walk you through the process of modifying your Filament resource setup to incorporate a dynamic slug into your URL structure, moving from `/posts/1/edit` to the cleaner `/posts/{slug}/edit`.

## The Challenge: ID vs. Slug in Routing

You are working with a `PostResource` where your data includes an `id` (the database primary key) and a `slug` (a human-readable string). Currently, Filament's route definition for the edit page uses the record ID:

```php
// Current setup example
'edit' => Pages\EditPost::route('/{record}/edit'),
```

While this works perfectly for internal application routing, it doesn't provide the semantic clarity that a slug offers to end-users. We need to instruct Filament to use the `slug` instead of the auto-incrementing `id` when generating these links.

## The Solution: Customizing Route Parameters

To achieve dynamic routing based on a specific field like `slug`, we need to adjust how the route is defined within your Filament resource's page configuration. We will leverage Laravel's route binding capabilities to pull the slug into the URL path.

### Step 1: Ensure Slug Generation

Before routing, ensure that your Eloquent model correctly manages the creation and storage of the `slug`. This is typically handled by using model observers or mutators to automatically generate a clean slug when a post is saved.

### Step 2: Modifying the Filament Route Definition

The core change happens within the `getPages()` method of your resource class. Instead of relying on the generic `{record}` placeholder, we will explicitly define the route parameters using the desired field name (`slug`).

In your `PostResource` (or whichever resource handles the post data), modify the route definition as follows:

```php
use Filament\Resources\Pages;

class PostResource extends Resource
{
    // ... other methods

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPosts::route('/'),
            'create' => Pages\CreatePost::route('/create'),
            // Modified route to use the slug instead of the ID
            'edit' => Pages\EditPost::route('/posts/{post}/edit'), 
        ];
    }
}
```

**Explanation of the Change:**

By changing `Pages\EditPost::route('/{record}/edit')` to `Pages\EditPost::route('/posts/{post}/edit')`, we are instructing Filament to build a URL structure. The `{post}` placeholder is now explicitly telling Laravel to look for a parameter named `post`. Since this route is nested within the context of your resource, and assuming proper route setup (often requiring explicit model binding or custom route definitions depending on how you structured your API routes), Laravel will resolve this parameter using the related Eloquent model instance's attributes.

For complex scenarios involving relationships and specific route naming conventions, understanding how Laravel structures its routing is crucial. As with any robust Laravel application, leveraging framework conventions, like those found at [laravelcompany.com](https://laravelcompany.com), ensures that your code remains maintainable and scalable.

### Step 3: Handling Route Model Binding (Advanced Consideration)

For this to work seamlessly, you must ensure that the route parameter (`{post}`) is correctly bound to the `Post` model instance. In a typical Filament setup, if you are defining routes outside of the standard resource structure (e.g., in `routes/web.php`), you would define it explicitly:

```php
// Example route definition in routes/web.php
Route::get('/posts/{post}/edit', [PostController::class, 'edit'])->name('posts.edit');
```

When Filament generates its internal links, if properly configured (often by using dynamic route generation or clear model binding), it will substitute the `slug` from the requested record when generating the link for `/posts/{slug}/edit`.

## Conclusion

By moving away from relying solely on numeric IDs and explicitly incorporating fields like `slug` into your Filament route definitions, you enhance the user experience significantly. This practice aligns with modern RESTful principles where URLs should be descriptive rather than database-centric. Remember that structuring your application correctly, much like adhering to solid architectural patterns promoted by [laravelcompany.com](https://laravelcompany.com), ensures that these dynamic routing features are implemented robustly and maintainably across your entire application.
