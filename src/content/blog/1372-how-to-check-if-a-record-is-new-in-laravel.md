---
title: "How to check if a record is new in Laravel?"
description: "Title: Understanding and Verifying New Records in Laravel Eloquent Objects One of the most important features of Laravel's object relational mapper (ORM) is..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Keywords", "PHP"]
featured: false
---

Title: Understanding and Verifying New Records in Laravel Eloquent Objects

<p>One of the most important features of Laravel's object-relational mapper (ORM) is Eloquent, which provides a convenient way to interact with your database tables as objects. This makes working with data much easier and more efficient compared to traditional SQL queries.</p>

<p>While Eloquent offers numerous advantages, it doesn't directly provide a built-in function to check if a record is new or existing in the database. However, that does not mean we cannot determine whether a model belongs to an already inserted record or a newly created one. In fact, there are multiple ways you can approach this task.</p>

1. Manual Check: The most straightforward method is to compare the primary key value of the model with its actual database identifier. For this, you can use the 'exists' method on the given query builder. Here is an example:
   <pre class="lang-php prettyprint-override"><code>$article = new Article;
if(!$article->exists()) {
    // New article instance with no primary key assigned
} else {
    // Existing article instance with a valid primary key
}</code></pre>

2. Scope Methods: Laravel allows you to create custom scopes that can be applied to model instances. With this approach, you could define a scope named "new" and use it in your queries. Here is how you would do so:
   <pre class="lang-php prettyprint-override"><code>$article = new Article;
if($article->scope('new')->get()->count() == 0) {
    // New article instance with no primary key assigned
} else {
    // Existing article instance with a valid primary key
}
</code></pre>

3. Model Events: You can leverage model events to check if the record is new or existing, especially when you want your logic to execute at different points during the lifecycle of an object. Here's how you'd use them:
   <pre class="lang-php prettyprint-override"><code>$article = new Article;
$article->saving(function($model) {
    if(!$model->contains('id')) {
        // New article instance with no primary key assigned
    } else {
        // Existing article instance with a valid primary key
    }
});
</code></pre>

4. Custom Attributes: Sometimes, you might need to keep track of the state of your objects. To achieve this, you can create custom attributes within your models that are set during specific events or method calls. This approach is very flexible and allows you to customize the logic based on your project's needs. Here's an example:
   <pre class="lang-php prettyprint-override"><code>$article = new Article;
$article->isNew = true;
$article->save();
if($article->isNew) {
    // New article instance with no primary key assigned
} else {
    // Existing article instance with a valid primary key
}</code></pre>

5. Combining Approaches: Depending on your project's requirements, you might find it best to use a combination of these methods or create your own custom approach. It all depends on the context and the complexity of your data management needs.

In conclusion, while Laravel Eloquent does not offer an explicit built-in method for determining new records, there are several viable alternatives you can explore based on your specific use case. By leveraging Laravel's powerful features and understanding the various ways to handle this scenario, you will be able to ensure the integrity of your data models in your projects.
