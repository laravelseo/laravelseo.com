---
title: "Why I'm getting 'Non-static method should not be called statically' when invoking a method in a Eloquent model?"
description: "Title: Resolving 'Non static Method Should Not Be Called Statically' Errors in Eloquent Models Body: In Laravel, one of the most common errors developers..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Errors"]
featured: false
---

Title: Resolving 'Non-static Method Should Not Be Called Statically' Errors in Eloquent Models
Body: <p>In Laravel, one of the most common errors developers face when working with models is the "Non-static method should not be called statically" error. This issue occurs mostly when trying to invoke a non-static method as if it were static. In this blog post, we will dive into the root cause of this problem and provide a proper solution for invoking Eloquent model methods in controllers.</p>

<h2>Understanding Non-Static Methods and Static Calls</h2>
Before delving into the solution, let's first understand why static calls are not possible with non-static methods. A class provides a blueprint for creating objects and offers reusable functions or methods for manipulating data. In Laravel, models are classes that handle database interactions and store business logic related to entities.

Non-static methods are those that require an instance of the class to be called upon. These methods rely on the context provided by the object instance; otherwise, they cannot operate correctly. For example, consider a "getAll" method within a Post model that needs access to the $posts property. To work properly without errors, this method must use the current object's $this variable to fetch and set the required data.

In contrast, static methods are functions contained within the class itself and do not require an instance of the class to be called upon. They operate independently and don't depend on any specific context. For example, a "getTotalPosts" method could be made static if it needs only access to the database without requiring any object-specific information.

<h2>The Issue: Invoking Non-Static Methods Statically in Eloquent Models</h2>
When trying to invoke a non-static method as a static function, an error like "Non-static method should not be called statically" is raised. This happens because Laravel's Eloquent models are designed to work with static functions to maintain the integrity and flexibility of the application. Static functions in models can be used without instantiating an object or dealing with object context.

<h2>The Solution: Properly Invoking Model Methods in Controllers</h2>
To avoid this error, you should follow these steps when invoking non-static methods from your controller:

1. Instantiate the Eloquent model class with the "new" keyword:
   <pre><code>$postModel = new Post();</code></pre>

2. Call the desired method on the object instance using the $this reference within the model itself:
   <pre class="lang-php prettyprint-override"><code>public function getAll() {
    return $posts = $this->all()->take(2)->get();
}
</code></pre>

3. Invoke the method on the instantiated model object in your controller:
   <pre><code>return $postModel-&gt;getAll();</code></pre>

This approach ensures that you are handling your Eloquent model methods correctly and avoids any potential errors related to static calls. In case you require the model instance later in your code, simply assign it to a variable as done above with $postModel.

<h2>Conclusion</h2>
When working with models in Laravel, always respect their nature by sticking to non-static methods when dealing with object contexts and calling static functions for more flexible operations. By following the steps outlined here, you can ensure that your code remains error-free, well-structured, and adheres to the principles of good software design.
