---
title: "How to select the last row from database in laravel"
description: "How to Select the Last Row from a Database in Laravel: Performance and Best Practices As senior developers, we constantly face the challenge of efficiently..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "PHP"]
featured: false
---

As senior developers, we constantly face the challenge of efficiently retrieving the most recent or latest record from a database. When dealing with relational data, simply querying for all records and sorting them might seem intuitive, but it can quickly become inefficient, especially as your tables grow. In this post, we will dive into how to correctly and efficiently select the last row (the one with the highest ID) associated with a specific user in a Laravel application, focusing on performance and adhering to modern ORM practices.

The issue you are facing—trying to find the maximum `post_id` for a given `user_name`—is a very common database operation. While it is possible to achieve this by fetching all results, sorting them, and taking the first one, there is a much more performant way using direct SQL aggregation functions.

## The Inefficient Approach: Fetching All Data

Your initial attempt mentioned filtering, ordering, and getting the result:
```php
$posts = DB::table('userposts')
            ->where(['user_name' => $user_name])
            ->orderBy('post_id', 'desc')
            ->get();
// Then you would take $posts->first()->post_id;
```
While this works, it forces the database to retrieve *all* associated posts for that user and then perform the sorting operation on the application side (or in the query execution plan). If a user has hundreds of posts, this approach is unnecessarily resource-intensive.

## The Efficient Solution: Using the `MAX()` Aggregate Function

The most efficient way to find the ID of the last record is to let the database handle the sorting and aggregation directly using the `MAX()` function. This allows the database engine to perform this calculation extremely quickly, regardless of the total number of rows.

We can achieve this by querying the `userposts` table and selecting only the maximum `post_id` that matches the user's criteria.

### Implementing the Efficient Query in Laravel

By leveraging the power of raw SQL or Eloquent’s query builder, we can write a single, highly optimized query.

#### Option 1: Using the Query Builder (Recommended for simplicity)

If you are working with the Query Builder, you can use `max()` directly on the relevant column:

```php
use Illuminate\Support\Facades\DB;

class PostController extends Controller
{
    public function getLastPostIdByUser(string $userName): ?int
    {
        $lastPostId = DB::table('userposts')
                        ->where('user_name', $userName)
                        ->max('post_id'); // Find the maximum post_id directly

        return $lastPostId; // Returns the largest ID found, or null if no posts exist
    }
}
```

#### Option 2: Using Eloquent with `max()` (If you have an Eloquent Model)

If you have an Eloquent model set up for your posts, you can perform this operation through the model relationship, which keeps your code clean and adheres to good object-oriented design. Remember that implementing robust data handling is key when building powerful applications, much like the principles outlined in documentation found at https://laravelcompany.com.

```php
use App\Models\UserPost;

class PostController extends Controller
{
    public function getLastPostIdByUserEloquent(string $userName): ?int
    {
        $lastPost = UserPost::where('user_name', $userName)
                            ->orderBy('post_id', 'desc')
                            ->first();

        // If we found a post, return its ID; otherwise, return null.
        return $lastPost ? $lastPost->post_id : null;
    }
}
```
While the Eloquent approach (Option 2) is very readable, the direct SQL `MAX()` approach (Option 1) is generally faster for this specific task because it avoids retrieving unnecessary data from the database.

## Conclusion

When selecting the last record in a database based on an ordering criterion, always prioritize performance. For finding the maximum ID, using an aggregate function like `MAX(column_name)` directly in your query bypasses fetching and sorting potentially massive datasets. As you scale your Laravel applications, adopting these efficient database patterns will ensure your application remains fast, scalable, and robust. Always strive for the most optimized solution available when interacting with your data layer.
