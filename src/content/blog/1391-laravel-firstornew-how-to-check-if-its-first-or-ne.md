---
title: "Laravel firstOrNew how to check if it's first or new?"
description: "Title: Laravel firstOrNew Understanding How To Check If An Object Is New or Existing Body: Laravel's built in function firstOrNew is a powerful tool that..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

Title: Laravel firstOrNew - Understanding How To Check If An Object Is New or Existing
Body: <p>Laravel's built-in function firstOrNew is a powerful tool that helps developers manage both new objects as well as existing ones with ease. As you already know, it returns either the first element of the collection (if one exists) or creates a new object and adds it to the database, depending on your needs. However, in some cases, you might want to determine whether the returned object was created or retrieved from an existing user in the database.</p>

<p>To achieve this goal, Laravel provides a convenient way for developers through its API design philosophy and code structure. It involves using the has attribute on the model instance, which checks if a particular attribute value already exists in the database or not. This allows you to determine whether the returned object is new or an existing one.</p>

<pre><code>$user = \App\User::firstOrNew([
    'email' =&gt; $userData-&gt;getEmail(),
    'name' =&gt; $userData-&gt;getName(),
]);

if ($user->isDirty()) { // this is new
    // user was created now
} else if ($user->wasRecentlyCreated) { // a boolean attribute set when the model is newly created
    // user was created now
} else {
    // user already existed
}
</code></pre>

<p>The firstOrNew() method's return value will indeed be either an existing user or a new one, depending on your initial query and input. However, to accurately determine whether the object is new in both cases (newly created during this run or pre-existing), we can use two attributes within Laravel models: isDirty() and wasRecentlyCreated.</p>

<p>The isDirty() method checks if any of the model's attributes has been changed since it was last retrieved from the database, indicating that it's a new object. On the other hand, the wasRecentlyCreated attribute is set automatically to true whenever a new instance is created for the model and saved to the database.</p>

<p>The combination of these attributes helps you achieve the desired outcome in your code: if both are false, the user you retrieved is already present in the database. On the contrary, if either one is true (isDirty() or wasRecentlyCreated), it implies that the object is new.</p>

<p>Remember that using these attributes might not be necessary in some cases, depending on your project needs and implementation strategy. However, they offer a convenient solution for developers who want to know if an existing user has been modified or created as part of their code flow.</p>

In conclusion, Laravel's firstOrNew() function provides versatility in handling both new objects and existing ones with ease. To determine whether the returned object is already present in the database or newly created, you can use the combination of the isDirty() and wasRecentlyCreated attributes within your model instance code. Always ensure that these attributes align with your project's needs and provide a clear understanding of the data being managed by your application.
