---
title: "Get category name from category id laravel"
description: "Get Category Name from Category ID in Laravel: Mastering Eloquent Relationships Welcome to the world of Laravel! It’s a fantastic framework for building..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Welcome to the world of Laravel! It’s a fantastic framework for building robust web applications, and one of the most powerful features you'll master is Eloquent Relationships. Many beginners start with simple table structures, like your `posts` and `categories` tables, and then wonder how to efficiently join that data to display meaningful information.

You have the setup:
*   **posts table:** `id`, `name`, `category_id`, `status`
*   **categories table:** `id`, `name`

Your goal is simple: Display the post name alongside its corresponding category name. As a senior developer, I can tell you that the most elegant and maintainable way to achieve this in Laravel is by defining an Eloquent relationship. This approach abstracts away complex SQL joins, making your code cleaner, more readable, and easier to manage as your application grows.

Let’s dive into how we set up this relationship and fetch the data efficiently.

---

## Step 1: Defining the Eloquent Relationship

The key to linking these two tables is defining a relationship in your Eloquent Models. Since one category can belong to many posts, and one post belongs to one category (as per your setup), we will define a One-to-Many relationship from the `Category` model to the `Post` model.

### The Category Model (`app/Models/Category.php`)

In the `Category` model, you tell Laravel that a category *has many* posts:

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    // Define the relationship: A Category has many Posts
    public function posts()
    {
        return $this->hasMany(Post::class);
    }
}
```

### The Post Model (`app/Models/Post.php`)

Next, in the `Post` model, you define the inverse relationship—how a post relates back to its category:

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    // Define the relationship: A Post belongs to one Category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
```

By defining these methods, you have created a bidirectional bridge between your models. This is the core principle of Object-Relational Mapping (ORM) in action, which Laravel excels at. For more details on leveraging Eloquent effectively, always refer to the official documentation at [https://laravelcompany.com](https://laravelcompany.com).

## Step 2: Retrieving Data with Eager Loading

Now that the relationship is defined, retrieving the data becomes straightforward. If you simply fetch posts, you'd need a second query inside your loop to find the category name for each post (the N+1 problem). The solution is **Eager Loading** using the `with()` method.

In your Controller or Service layer, you can load the necessary category data in a single, optimized query:

```php
use App\Models\Post;

class PostController extends Controller
{
    public function index()
    {
        // Fetch all posts and eagerly load the related 'category' for each post.
        $posts = Post::with('category')->get();

        // Now, you can iterate and access the category name directly!
        foreach ($posts as $post) {
            echo "Post Name: " . $post->name . "\n";
            echo "Category Name: " . $post->category->name . "\n\n";
        }

        // Or return the collection if you are sending data to a view
        return view('posts.index', compact('posts'));
    }
}
```

### Explanation of the Code

1.  **`Post::with('category')`**: This tells Eloquent, "When fetching these posts, please also load the related `category` data using a single JOIN operation under the hood."
2.  **`->get()`**: Executes the query and hydrates the results into a collection of `Post` models, each automatically containing its associated `Category` model instance.
3.  **`$post->category->name`**: Because we used eager loading, accessing the relationship is simple property access. Laravel handles the necessary foreign key lookup instantly, avoiding multiple database hits.

---

## Conclusion

Mastering Eloquent relationships is what separates basic CRUD operations from building sophisticated, scalable applications. By establishing `hasMany` and `belongsTo` relationships between your models, you delegate the complex task of data joining to Laravel's powerful ORM. Always favor eager loading (`with()`) when dealing with related data to ensure optimal performance. Keep practicing these concepts; they are the backbone of efficient development on any Laravel project!
