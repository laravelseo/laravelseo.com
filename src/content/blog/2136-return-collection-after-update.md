---
title: "Return Collection after update()?"
description: "Title: Return Collection after update()? A Comprehensive Guide for Developers Introduction As a developer working with Laravel, you might have encountered..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Keywords"]
featured: false
---

Title: Return Collection after update()? A Comprehensive Guide for Developers

<h2>Introduction</h2>

As a developer working with Laravel, you might have encountered situations where you need to return the updated collection or row data after performing an update query. This blog post aims to guide you through managing collections and their content after running an update() method.

<h2>The Problems</h2>

Sometimes you may encounter issues while dealing with update operations in Laravel, especially when working with raw queries. One common problem is that the $updated variable might not return a collection of updated rows as expected. Instead, it returns the affected row count (in this case, 1). This behavior raises questions about how to get access to the newly updated data within that context.

<h2>Solution 1: Using Laravel's update() Method</h2>

Laravel provides an elegant and convenient way to manage update operations through the Eloquent model. If you have a related model with a defined table, using the update() method is the best approach as it returns the updated instance of your model. Here's how it would look:

<pre><code>$user = User::find(1);
$user->votes = 123;
$user->save();</code></pre>

In this case, $user will contain your updated object with the new value for 'votes'. You can access it using:

<pre><code>{{$user-&gt;votes}} //returns 123</code></pre>

The benefit of this approach is that the instance you've been working on gets automatically updated, and all relationships remain intact. Also, by using the defined model and relationships, your code becomes more robust and maintainable.

<h2>Solution 2: Using Raw Queries with update()</h2>

In some cases where database tables don't exactly map to Eloquent models or you need to run custom raw queries, the original method may still apply. In this situation, running an update() query will only return the affected row count (i.e., 1) through the $updated variable:

<pre><code>$updated = DB::table('users')-&gt;where('id', 1)-&gt;update(['votes' =&gt; 123]);</code></pre>

To access your updated row, you can use the raw query and explicitly return the updated data. You can do that by selecting all columns from 'users' table where 'id' is 1:

<pre><code>$user = DB::table('users')-&gt;where('id', 1)-&gt;first();</code></pre>

In this case, $user will contain your updated data for the user with an id of 1.

<h2>Conclusion</h2>

While dealing with update operations in Laravel, it is vital to understand how to manage collections and access updated data. Using the built-in Eloquent model and its update() method ensures a cleaner codebase and a maintained relationship structure. If you need to work with raw queries, consider using explicit selection methods like first(). In either case, be sure to validate your assumptions about the returned data and handle potential issues accordingly.
