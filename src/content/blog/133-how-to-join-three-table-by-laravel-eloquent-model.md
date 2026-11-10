---
title: "How to join three table by laravel eloquent model"
description: "Title: Efficiently Joining Tables in Laravel Using Eloquent Models Introduction In this article, we will explore how to join three tables together using the..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Keywords", "Performance"]
featured: false
---

Title: Efficiently Joining Tables in Laravel Using Eloquent Models

Introduction

In this article, we will explore how to join three tables together using the powerful Laravel Eloquent models while obtaining results with related columns instead of IDs. We will create a simple example that can be easily extended to fit more complex scenarios. The end goal is to provide you with a clear understanding and confidence when working with Eloquent-based models in your Laravel applications.

Getting Started

Before we dive into the code, let us take a look at our database structure:

1. Articles table - Contains articles-related data, including their titles, bodies, categories_id, and user_ids. 
2. Categories table - Stores different category names for the articles.
3. Users table - Holds information about users, such as their names and types (admin, user, etc.).

Now we will create Eloquent models for each of these tables:

- Article model: Representing the Articles table.
- Category model: Representing the Categories table.
- User model: Representing the Users table.

Creating the Join Query

The main challenge in this scenario is to fetch articles with their corresponding category names and user_names instead of IDs. To achieve this, we will use the Eloquent models' relationships functionality. Follow these steps:

1. Add relationships to our Article model with their respective related models (Category and User):

   - Category model: 'category' => 'category',
   - User model: 'user' => 'user',

2. Create the join query using the relationships we defined in step 1, ensuring that articles are fetched along with their relevant data:

   - Important note: We will use Laravel's eager loading to preload and load relations as objects instead of lazy-loading them on demand. This improves performance and reduces queries.

3. Select only the needed columns from the joined tables: ('articles.id', 'articles.title', 'articles.body', 'category.name', 'user.username')

4. Execute the query by calling the get() method on the result set: $articles = Article::with('category')->with('user')->get(...);

The final code should look similar to this example:

<pre><code>$articles = \App\Article::query()
            ->join('categories', 'categories.id', '=', 'articles.categories_id')
            -&gt;join('users', 'users.id', '=', 'articles.user_id')
            ->select('articles.id', 'articles.title', 'articles.body', 'category.name', 'user.username')
            -&gt;get();</code></pre>

Using Eloquent Models for the Query

Now that we have a basic understanding of how to combine these models and perform joins, let's look at a more efficient way using Laravel's Eloquent relationships:

1. Create an Article model with relationships:
   - Category model: 'category' => 'category',
   - User model: 'user' => 'user',

2. Define the relationship between the models inside each respective Eloquent model class (Article, Category, and User) to support bidirectional relations. This will allow us to access related data on both ends of our queries.

3. Execute the query using the eloquent eager loading functionality:
   - Important note: By default, Laravel uses lazy-loading for relationships in your models. To ensure efficient data retrieval and preload all needed columns, we will use Eloquent's with() method to load all related objects as part of the query. This will be more performant than separate queries being executed on demand.

4. Add a custom method within your Article model to allow users to select their preferred fields (optional):

<pre><code>public function getAllFieldsWithDetails($fields = [])
{
   $this->load('category', 'user');
   return $this->only($fields);
}
</code></pre>

Now, we can easily use our model to join tables and fetch specific fields:

<pre><code>$articles = \App\Article::query()
            -&gt;with('category', 'user')
            -&gt;get();

// Alternatively, you can pass the column names to only() method to specify which columns should be returned from each table:

$articles = \App\Article::query()
           ->with('category', 'user')
           -&gt;load('category', 'user') // Load relations in a separate query before the select query
           -&gt;get(['id', 'title', 'body']) // Fetch only specified columns from articles table
           -&gt;map(function ($article) {
                return $article->merge([
                    'category_name' => $article->category->name,
                    'user_name' => $article->user->username,
                ]);
            })
           -&gt;each(function ($data) {
                // Process data as needed
            });</code></pre>

Conclusion

In this article, we explored using Laravel Eloquent models to efficiently join three tables together. We created the necessary relationships within our models and performed the required joins using eloquent eager loading. By doing so, we were able to fetch articles along with their category names and user_names instead of IDs. Additionally, we introduced a custom method in our Article model that could be utilized when users only want specific fields from each table. This approach will streamline your development process and enhance the performance of your Laravel applications.
