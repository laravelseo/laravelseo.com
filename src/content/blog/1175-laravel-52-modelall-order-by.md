---
title: "laravel 5.2 - Model::all() order by"
description: "Title: Efficiently Retrieving Laravel Models in Reverse Chronological Order Body: In Laravel 5.2, when you use Model::all() to retrieve all records for a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP"]
featured: false
---

Title: Efficiently Retrieving Laravel Models in Reverse Chronological Order

Body:

<p>In Laravel 5.2, when you use Model::all() to retrieve all records for a particular table, you get the full collection of data. However, if you want this collection sorted in reverse chronological order (most recent record first), it may not be as straightforward as one might think.</p>

<h3>The Traditional Approach</h3>

One way to achieve this is by applying the sort() method to the Model::all() output. Here's how you could do that:

1. Fetch all records from the table using Model::all().
2. Obtain a copy of the collection using collect() function.
3. Apply reverse() on the copied collection, which reverses its order.
4. Finally, call sortByDesc() on the reversed collection to sort it in reverse chronological order based on a specific column or attribute (such as created_at).

<p><code>$posts = Post::all();</code></p>
<p><code>$reversedCollection = collect($posts)->reverse()->sortByDesc('created_at');</code></p>

This method of sorting the collection is not very efficient, especially if you deal with large datasets. It involves creating a new collection, applying several methods for reversing and sorting, and then looping through it to obtain the result. This approach consumes more processing time and memory usage than necessary.

<h3>A More Efficient Approach</h3>

Fortunately, Laravel provides an alternative method that is both efficient and easy to use: Query Builder, which allows you to customize your queries and retrieve records accordingly. With this approach, you can query the table directly with the desired sorting criteria in your database connection configuration file (e.g., config/database.php).

For instance, to retrieve all posts sorted by 'created_at' in reverse chronological order:

1. Open your database configuration file and navigate to the default connection settings under each database section.
2. Add a new query to the 'default' array, which will be executed on every request (see the example below).
3. Run the DB::connection()->getPdo() to get the PDO connection instance for that specific database.
4. Use the PDO object's prepare() method to create a prepared statement, and then execute it using the executedQuery() method. Add the query as a string with the order clause at the end (e.g., 'order by created_at desc').
5. Get the results from the executed query and store them in a new collection.
6. Return the newly created collection in your view or controller method.

<p><code>// config/database.php</code></p>
<p><code>'default' => [
  'query' => 'select * from posts order by created_at desc',
  // other configuration options ...
],</code></p>
<p><code>$posts = DB::connection()->getPdo()->prepare('select * from posts order by created_at desc')->executeQuery();</code></p>
<p><code>$reversedCollection = collect($posts);</code></p>

This method provides a more efficient approach to retrieving your Laravel model collection in reverse chronological order. It involves working directly with the database, optimizing the query for better performance and memory usage compared to the traditional approach.

<h3>Conclusion</h3>

In summary, when you need to obtain all records from a table in reverse chronological order using Laravel 5.2, there are two methods to consider: the traditional sorting approach or the more efficient database query approach. The latter provides better performance and memory usage while achieving your desired result. Always choose the most suitable method based on your project requirements and ensure you follow best practices for working with database connections and collections in Laravel.
