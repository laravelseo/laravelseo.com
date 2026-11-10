---
title: "Laravel. Use scope() in models with relation"
description: "Title: Laravel: Effectively Using Scopes with Eloquent Relationships In the world of Laravel development, you often work with multiple related models. One..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

Title: Laravel: Effectively Using Scopes with Eloquent Relationships

In the world of Laravel development, you often work with multiple related models. One such instance is having two connected models: `Category` and `Post`. The `Post` model comes equipped with a `published()` scope method (`scopePublished()`) that represents posts which are live on your website.

However, when you attempt to retrieve categories along with their associated published posts using the following code:

<pre><code>$categories = Category::with('posts')-&gt;published()-&gt;get();
</code></pre>

You may run into an error stating that the `published` scope is undefined for categories. This occurs because you're trying to apply a `scopePublished()` method on the `Category` model, which doesn't have this functionality by default. In order to resolve this issue, let us examine how to properly use scopes with relationship models in Laravel:

1. Analyze your relations: Review the relationships between `Category` and `Post`. The `Category` model has many `posts`, while each `Post` belongs to a single category. We can leverage these relationships for efficient retrieval of data.

2. Set up the Eloquent relationships: In our example, we have established these relationships as follows:

   <pre><code>class Category extends \Eloquent
{
    public function posts()
    {
        return $this-&gt;HasMany('Post');
    }
}

class Post extends \Eloquent
{
   public function category()
   {
       return $this-&gt;belongsTo('Category');
   }

   public function scopePublished($query)
   {
       return $query-&gt;where('published', 1);
   }

}
</code></pre>

3. Apply the published scope: Since we want to fetch only published posts, we should apply the `scopePublished` method before retrieving the post data. This can be done by invoking the scope on the query object for Posts using a closure inside the relationship definition of Category:

   <pre><code>class Category extends \Eloquent
{
    public function posts()
    {
        return $this-&gt;HasMany('Post')
                     -&gt;with(['category' => function($query) { $query->published(); }]);
    }
}
</code></pre>

In this implementation, we added a `published` scope to the `post` relationship in the Category model. When retrieving posts related to a specific category, the query will include the published scope in order to only return the published posts.

4. Retrieve all categories with their associated published posts: Now that we've defined and applied the `scopePublished`, we can use it to retrieve all categories along with their respective published posts:

   <pre><code>$categories = Category::with('posts')-&gt;get();
</code></pre>

This will result in an array of category objects each containing the details related to its published posts.

In conclusion, when working with relationship models and scopes in Laravel, it is important to understand how to apply these methods efficiently. By correctly setting up our relationships and applying the `scopePublished` method as needed, we can effectively use scopes with Eloquent relations, ensuring cleaner code and better performance.
