---
title: "How to do update query on laravel fluent using db::raw"
description: "Title: A Comprehensive Guide to Updating Table Values with Laravel Fluent and DB::raw Body: In this blog post, we are going to answer the question of how to..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Keywords", "PHP"]
featured: false
---

Title: A Comprehensive Guide to Updating Table Values with Laravel Fluent and DB::raw

Body: In this blog post, we are going to answer the question of how to properly perform an update operation using Laravel's fluent query builder and DB::raw. Specifically, we want to update a value in one table based on another table's data. We will also review some common pitfalls encountered while attempting these updates.

Let us first clarify the given code examples:

1. The provided code does not seem to be working due to a lack of proper syntax and missing connections between tables. However, the concept is correct, as we want to update "favorite_contents" based on data from "contents."

2. Our main goal is to set the type for each favorite content record to match its corresponding record in contents. To achieve this, we need to leverage Laravel's fluent query builder and DB::raw features:
   - Fluent Query Builder: This PHP object provides a convenient interface for working with database queries. It allows us to chain multiple operations like joins, updates, and conditions.
   - DB::raw(): This utility function lets us execute raw SQL statements safely within Laravel.

Starting from the given code samples, we will provide an improved approach:

1. Declare all necessary table names and variables:
   <pre><code>$table = 'favorite_contents';
$contentsTable = 'contents';
$ids = ['5', '6'];</code></pre>
2. Define the join query to connect both tables by content IDs:
   <pre><code>$joinQuery = DB::table($table)
        -&gt;join('contents', function($join) use($table, $contentsTable){
            $join-&gt;on("$table.content_id", '=', "$contentsTable.id");
        });</code></pre>
3. Get the result based on the given content IDs:
   <pre><code>$favoriteContents = $joinQuery->whereIn($table . '.content_id', $ids)
        -&gt;get();</code></pre>
4. Update the favorite contents based on the corresponding contents type:
   <pre><code>foreach ($favoriteContents as $favoriteContent) {
    DB::raw("UPDATE $table SET $table.type = (SELECT contents.type FROM $contentsTable WHERE $contentsTable.id = $favoriteContent->content_id)
            WHERE $table.id = {$favoriteContent->id};");
}</code></pre>

Now, let us examine a few aspects:

- The first code sample was not working because it lacked proper syntax and did not create any connection between the two tables. By using the correct query builder function calls provided above, we can generate an effective update operation for our favorite contents.
- Fluent query builders provide a convenient way to work with databases while ensuring cleaner, more readable code than raw SQL statements. They also facilitate easier maintenance and future adjustments to your database models.
- DB::raw is a useful tool that lets you safely run arbitrary SQL statements without exposing your database credentials. This can be helpful when working with complex or dynamic updates requiring multiple tables.

Finally, let us summarize our approach: 

1. Define the necessary variables and table names.
2. Use Fluent Query Builder to connect all relevant tables and perform joins based on content IDs.
3. Execute an update query for each favorite content using DB::raw to set its type value according to the contents type.

With these guidelines in mind, you are now equipped with a thorough understanding of how to properly perform updates with Laravel's Fluent Query Builder and DB::raw.
