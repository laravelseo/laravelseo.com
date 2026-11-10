---
title: "Laravel eloquent get relation count"
description: "Title: Efficiently Retrieving Category Counts with Laravel Eloquent Relations Introduction: Laravel provides an extensive ecosystem of tools and libraries..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content"]
featured: false
---

Title: Efficiently Retrieving Category Counts with Laravel Eloquent Relations

Introduction:
Laravel provides an extensive ecosystem of tools and libraries for building web applications. When working with related data, such as articles and their categories, Eloquent relations can save time by allowing us to easily access associated records within a model instance. In this post, we'll discuss how to obtain the count of child articles per category in Laravel 5.3 using Eloquent relations.

Prerequisites:
Before proceeding with the steps below, ensure you have defined your models and their corresponding relationships following the code snippet provided earlier. Also, familiarize yourself with the Laravel query builder and its methods for working with related data.

Step 1: Define Nested Relations in the Category Model
To retrieve the count of articles per category, we first need to define nested relations within our category model. Since a category may have children categories as well, it's essential to consider this structure during modeling. The following code will achieve this:

<pre><code>// Category model
public function children() 
{
    return $this->hasMany(Category::class, 'parent_id', 'id');
}
</code></pre>

Step 2: Define the Parent-Child Relationship in the Article Model
In addition to the parent-child relationship within categories, we will define the relationship between articles and their category using Eloquent. This allows us to efficiently retrieve article counts based on their associated categories. Here's the code for the relationship definition:

<pre><code>// Article model
public function category()
{
    return $this->belongsTo(Category::class);
}
</code></pre>

Step 3: Add a Helper Function to Count Articles Per Category Level
With our models and relationships set up, we can create a helper function to retrieve the count of articles per category level. This will require working with the Laravel query builder and using its methods for accessing related data. We'll use the following code:

<pre><code>function getCategoryCounts($categories = null)
{
    $query = Category::query();

    if ($categories !== null) {
        $query->whereIn('id', $categories);
    }

    // Get counts for each parent category level
    return $query
        ->select(DB::raw('COUNT(`article`.`id`) as article_count, `category`.*, (CASE WHEN `category`.parent_id = 0 THEN COUNT(`category`.`id`) ELSE NULL END) AS child_category_count'))
        ->join('article', 'article.cat_id', '=', 'category.id')
        ->groupBy('category.parent_id')
        ->with(['children' => function($query) {
            $query->whereNull('parent_id')->orderBy('title');
        }])
        ->get();
}
</code></pre>

In this code, the `query` variable is used to create a new query instance based on our category table. Then, we join it with the article table, grouping by each parent ID and selecting the count of articles as well as the child category counts for each level. The `with()` and nested subquery are used to retrieve the children categories' details.

Step 4: Retrieve the Category Counts Based on Parent Categories
To get the required information, we can call our helper function and filter by our desired parent categories:

<pre><code>// Get counts for all top-level (parent) categories
$topLevelCategories = Category::where('parent_id', 0)->get();

foreach ($topLevelCategories as $category) {
    $counts = getCategoryCounts([$category->id]);
    echo 'Top Level Category: ' . $category->title . ', Article Count: ' . $counts['article_count'] . ', Child Categories (If any): ' . $counts['child_category_count'];
}
</code></pre>

In this example, we are looping through all the top-level categories and calling our helper function to obtain the counts for each. As a result, we'll get an output like:

Top Level Category: Parent 1, Article Count: 5, Child Categories (If any): 0
Top Level Category: Parent 2, Article Count: 8, Child Categories (If any): 4

Conclusion:
In this blog post, we have discussed how to efficiently get the count of associated articles per category using Laravel Eloquent. However, we need to consider the implications of nested relationships in our models and their performance impact on our application. For further optimization or more advanced techniques, refer to our extensive collection of resources on Laravel Company, including blog posts, tutorials, and documentation.
