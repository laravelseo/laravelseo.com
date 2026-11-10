---
title: "Add [title] to fillable property to allow mass assignment on [App\\Post]"
description: "Title: Mass Assignment in Laravel: Understanding Fillable Properties and Safe Insertion of Data Introduction Mass assignment is a common practice in web..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Errors"]
featured: false
---

Title: Mass Assignment in Laravel: Understanding Fillable Properties and Safe Insertion of Data

Introduction
Mass assignment is a common practice in web application frameworks like Laravel to make data insertion convenient for developers by allowing multiple values to be assigned to model properties simultaneously. However, sometimes, it could cause vulnerabilities due to the lack of proper configuration and validation. In this blog post, we discuss the importance of fillable properties in preventing unwanted mass assignment and how to implement secure data insertion using Laravel 5's Eloquent ORM.

Mass Assignment: The Concept Behind Fillable Properties
Mass assignment is an essential feature in Laravel that eases inserting multiple values for a model at once. It saves time and effort by letting developers assign multiple properties to their models within the same request, such as through forms or API endpoints.

However, this convenience comes with potential security risks if not properly handled – attackers could exploit vulnerabilities in your application's models to update sensitive data. To mitigate these risks, Laravel provides a mechanism called "fillable properties." Fillable properties are attributes that can be mass-assigned when creating or updating an object, which helps maintain the security of your application and ensures only authorized data fields can be modified.

Implementing Mass Assignment with Fillable Properties
In Laravel 5, you could enable mass assignment by defining fillable properties in your Eloquent model's $fillable array:

<pre><code>class Post extends Model {
    protected $fillable = [
        'title',
        'body',
        // other fillable fields
    ];
}
</code></pre>

This ensures that only the specified fields are allowed to be mass-assigned. If you try to assign values outside these properties, Laravel will throw an error indicating that the field is not a known fillable property:

<p><em>&quot;Add [title] to the fillable property to allow mass assignment on [App\Post].&quot;</em></p>

The above error message suggests you need to add the missing field, 'title', to your model's $fillable array to allow mass assignment for that specific field. To fix this issue, modify your code as follows:

<pre><code>class Post extends Model {
    protected $fillable = [
        'title',
        'body',
        // other fillable fields
    ];
}
</code></pre>

Alternative to Mass Assignment Using Eloquent ORM
Laravel's ORM allows developers to manipulate data from the database without worrying about manual SQL queries. It provides several methods for inserting or updating data, which can be used as a more secure alternative to mass assignment:

1. Create your model object and assign values one by one:
   <pre><code>//Create Post
$post = new Post;
$post-&gt;title = $request-&gt;input('title');
$post-&gt;body = $request-&gt;input('body');
$post-&gt;save();
</code></pre>

2. Use the "create" method with a separate array of values for each property:
   <pre><code>$post = Post::create([
    'title' => $request-&gt;input('title'),
    'body' => $request-&gt;input('body')
]);
</code></pre>

By following these techniques, you can ensure the security of your application while making data insertion more convenient and efficient.

Conclusion
Mass assignment in Laravel is a useful tool for developers to speed up data insertion but requires careful handling to avoid vulnerabilities. By implementing fillable properties, you can keep your application secure and prevent unauthorized updates to sensitive fields. Remember always to use safe practices when working with user inputs and data manipulation, and consult official documentation and tutorials for more guidance on how to effectively utilize Laravel's features.
