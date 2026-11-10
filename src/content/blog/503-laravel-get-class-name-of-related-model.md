---
title: "Laravel get class name of related model"
description: "Title: Easily Access Model Class Names in Laravel Relationships without Querying Body: In Laravel, we often work with models that are connected to each other..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Keywords"]
featured: false
---

Title: Easily Access Model Class Names in Laravel Relationships without Querying

Body:
<p>In Laravel, we often work with models that are connected to each other through various relationships. One of the common relationships is a many-to-many relationship. In such cases, you may need to retrieve the class name for the model involved in these connections. Currently, you can achieve this by running a query using the get() method as shown in the example below:</p>

<pre><code>$className = get_class($faq->products()->get()->first());</code></pre>

However, there is a more straightforward way to obtain the class name of related models without actually executing any queries. In this blog post, we'll discuss how to achieve that with just a few lines of code.

1. Understanding Relationship Classes in Laravel
   To understand the concept better, let's break down some relationship terms:
   - Eloquent Model: A class representing a database table and providing methods for interacting with its data.
   - One-to-Many Relationship: An association between two models where one record can have multiple instances of another model related to it. These are represented using the belongsTo or hasOne relationships in Eloquent.
   - Many-to-Many Relationship: A relationship between two independent tables, each having many elements connected to the other table. In Laravel, these are denoted by the belongsToMany and hasManyThrough methods.

2. Obtaining Class Name Using Reflection
   Now that we know about Eloquent Models and relationships, let's explore a more direct method of getting the class names without executing queries:

  <pre><code>$className = $faq->getRelatedQuery()->getModel()->getTable();</code></pre>
  
   This code snippet uses Reflection to access the underlying model associated with an Eloquent relationship. The getRelatedQuery() method will return a query that contains only the related class data, and then we can call the getModel() method on this query object to get the table name. Finally, we use getTable() from the returned model instance to obtain the class name, all without performing any database queries!
   
   Note: This approach only works for models with a many-to-many relationship and may not be valid for other types of relationships. However, it does provide a simple solution for the given scenario.

3. Conclusion
   In this blog post, we've explored two methods to retrieve the class name associated with an Eloquent model's related models without executing any database queries. We discussed the concept of relationship classes in Laravel and learned about using reflection to access these classes directly. While the first method is more general-purpose and can be extended for other scenarios, the second option works specifically for many-to-many relationships. It's essential always to consider the context and choose the most suitable approach for your application needs.

Remember that these methods are just examples of practical solutions to a specific problem within Laravel. To learn more about Eloquent models and relationships, you can explore our detailed documentation at https://laravelcompany.com/blog/category/laravel-eloquent/ or attend one of our courses offered by the Laravel Company.
