---
title: "Laravel getting value from another table using eloquent"
description: "Title: Optimizing Queries and Retrieving Related Data with Laravel Eloquent Body: Laravel has an excellent ORM system called Eloquent that makes it easy to..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Keywords"]
featured: false
---

Title: Optimizing Queries and Retrieving Related Data with Laravel Eloquent

Body:

Laravel has an excellent ORM system called Eloquent that makes it easy to work with databases. By using Eloquent, you can perform various database tasks like retrieving data from multiple tables, filtering and sorting results, or even performing related queries. This blog post will delve into how you can use Eloquent to solve some common problems such as getting products for a specific user from different tables.

Let's start with our example tables: User table, Category table, and Product table. Here is a sample data from each of the tables.

<p>User table</p>
<pre><code>+----+---------+------------+
| id |  name   |    level   |
+----+---------+------------+
|  1 |  user 1 |     1      |
|  2 |  user 2 |     2      |
+----+---------+------------+
</code></pre>
<p>Category table</p>
<pre><code>+----+---------+------------+
| id | user_id |    name    |
+----+---------+------------+
|  1 |       1 | category 1 |
|  2 |       2 | category 2 |
|  3 |       2 | category 3 |
+----+---------+------------+
</code></pre>
<p>Product table</p>
<pre><code>+----+-------------+------------+
| id | category_id |    name    |
+----+-------------+------------+
|  1 |       1     | product 1  |
|  2 |       2     | product 2  |
|  3 |       3     | product 3  |
|  4 |       3     | product 4  |
+----+-------------+------------+
</code></pre>

Our problem is to get all the products for a specific user through Eloquent. We can solve this with the following code:

<pre><code>$id = 2;
$data = product::whereHas('category', function($q) use ($id){
    $q->where('user_id', $id);
})->get();
</code></pre>
This query fetches all the products that have a category linked to the user with an ID of 2. However, when you try to print the name of the category and the name of the user related to the product, it won't work because Eloquent doesn't load relationships by default. To do this, you need to use eager loading as follows:

<pre><code>$id = 2;
$data = product::with('category', 'user')->whereHas('category', function($q) use ($id){
    $q->where('user_id', $id);
})->get();
</code></pre>
This code loads the associated category and user for each product. You can then access their names using `$data->first()->category->name` and `$data->first()->user->name`.

Now, let's move onto the second part of your question: solving a query builder problem into Eloquent. Here is an example Eloquent code to achieve the same effect as a query builder with JOIN:

<pre><code>$id = false;
if(auth()->user()->level != 1){
    $id = auth()->user()->id;
}
$data = Product::with('category', 'user')->whereHas('user', function($q) use ($id){
    if(!$id){
        return;
    }
    $q->where('users.id', $id);
})->get();
</code></pre>
This code first checks the logged-in user's level and assigns a value to `$id` accordingly. It then loads all products along with their category and user using eager loading, and filters them based on the user ID. Note that this code assumes your Eloquent models are named as 'Product' for the Product table, 'Category' for the Category table, and 'User' for the User table.

In conclusion, you can use Laravel Eloquent to solve various problems related to database queries and retrieving related data. This includes getting products linked to specific users from multiple tables, as well as applying complex filters on the fly based on user privileges. To ensure optimal performance, always utilize eager loading wherever possible and optimize your models and relationships accordingly.
