---
title: "What are the Laravel naming conventions for controllers/models/views?"
description: "Mastering Laravel Naming Conventions: Controllers, Models, and Views I remember hearing that naming conventions for controllers, models, and views are..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

I remember hearing that naming conventions for controllers, models, and views are important—specifically whether to use singular or plural forms. It’s a common point of confusion because, while these patterns significantly impact code readability and maintainability, Laravel itself doesn't strictly enforce them at runtime. However, following established conventions is crucial for writing code that other developers (and your future self!) can easily understand.

Let’s dive into the recommended practices from a senior developer’s perspective.

## The Philosophy: Convention Over Configuration

In frameworks like Laravel, we operate on the principle of "convention over configuration." This means while you *can* technically name anything you want, sticking to community-accepted patterns makes your project instantly more familiar and easier to navigate. These conventions help enforce a predictable structure, especially when dealing with Eloquent relationships and RESTful API design.

The general consensus among Laravel developers leans towards using **pluralization** for collections (like controllers) and **singularization** for individual entities (like models).

## Naming Your Components

Here is a breakdown of the established conventions for each component in a typical Laravel application:

### 1. Models (The Data Layer) – Singular

Models represent a single, distinct entity within your database. Therefore, the convention strongly favors using **singular nouns**.

*   **Convention:** Use singular names for models (e.g., `User`, `Post`, `Product`).
*   **Why?** A Model is designed to represent *one thing*. When you use Eloquent to fetch a record, you are retrieving a single instance of that entity. This aligns perfectly with object-oriented principles and makes querying relationships clearer.

**Example:**
If you have a table named `products`, your model should be `Product.php`.

```php
// app/Models/Product.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    // ... model properties and relationships
}
```

### 2. Controllers (The Logic Layer) – Plural

Controllers handle the incoming HTTP requests and contain the logic to interact with the models. Since controllers often manage collections of resources, **plural nouns** are generally preferred here.

*   **Convention:** Use plural names for controllers (e.g., `PostController`, `UserController`).
*   **Why?** A controller typically handles routes related to a resource collection (e.g., listing all posts, creating a new post). Using the plural form signals that this class is responsible for managing the **collection** of that resource type.

**Example:**
If you need routes for managing posts, you would use `PostController`.

```php
// app/Http/Controllers/PostController.php
namespace App\Http\Controllers;

use App\Models\Post; // Note: The model is singular
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index()
    {
        // Logic to fetch all posts
        $posts = Post::all(); 
        return view('posts.index', compact('posts'));
    }
}
```

### 3. Views (The Presentation Layer) – Plural or Resource-Based

Views are the Blade files that render the data for the user. The naming here is more flexible, but consistency is key. Often, views follow a pattern based on the resource they display.

*   **Convention:** Use plural names that reflect the resource being displayed (e.g., `posts/index.blade.php`, `users/profile.blade.php`).
*   **Why?** When you are rendering a list of items, using a plural convention (`posts`) makes sense in the context of the view file structure.

## Summary Table

| Component | Recommended Convention | Example | Rationale |
| :--- | :--- | :--- | :--- |
| **Models** (Eloquent) | Singular | `Post` | Represents a single database entity. |
| **Controllers** | Plural | `PostController` | Manages the collection/actions related to that resource. |
| **Views** (Blade Files) | Resource-based | `posts/index.blade.php` | Reflects the collection being displayed. |

## Conclusion

While you are not strictly bound by these rules, adopting this pattern provides a cohesive architecture. By treating your Models as singular entities and your Controllers as plural handlers for those entities, you create a logical separation of concerns that enhances readability significantly. When building robust applications on Laravel, consistency trumps arbitrary choice every time. For more in-depth details on structuring your application effectively, always keep an eye on the official documentation provided by [laravelcompany.com](https://laravelcompany.com).
