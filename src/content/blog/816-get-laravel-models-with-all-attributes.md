---
title: "Get Laravel Models with All Attributes"
description: "Title: Comprehensive Guide to Retrieving Laravel Models with All Attributes Including Null Values Body: Introduction In the world of Laravel, models are a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Comprehensive Guide to Retrieving Laravel Models with All Attributes - Including Null Values

Body:

<h2>Introduction</h2>
In the world of Laravel, models are a way to interact with your database objects. However, sometimes there may be a need to load all attributes from a model even if they are null. This is particularly important when building functions that update models using arrays containing attribute values, needing to account for both existing and new properties. In this article, we will discuss how you can retrieve Laravel models with all their attributes, including null ones, and provide best practices for handling them effectively in your codebase.

<h2>Retrieving Models with All Attributes</h2>
To begin with, let's see how you would typically fetch a model's attributes using the Laravel way. The `find()` method on the Eloquent model class gets an object for a given ID. When calling this method, it will only return the attributes that are not null. In our case, we want to retrieve models with all their attributes - even if they have null values.

Laravel provides a helper function called `with()` that can be used for this purpose. Using `with()`, you can specify a set of relationship methods explicitly on an Eloquent model. Let's see how it works:

```php
$user = User::with(['phones', 'emails'])->firstOrFail($userId);
```

This code snippet loads the user with `id=$userId` and eager-loads associated phone numbers (through relation "phones") and email addresses (relation "emails"). In our case, we want to load all attributes for a particular model regardless of their value. Thankfully, there is another helper function called `withTrashed()`.

<h2>Using withTrashed()</h2>
The `withTrashed()` method can be used in conjunction with the `findOrFail()` or `firstOrFail()` methods to load your model along with all its attributes, including those that are set to null:

```php
$user = User::withTrashed()->findOrFail($userId);
```

Here, the controller will fetch a specific user with all their attributes in the state they currently exist. However, due to Laravel's default behaviour, if a field is set to null but not explicitly specified for retrieval with `findOrFail()`, that attribute won't be loaded from the database. To force loading all fields, you can use the `pluck()` method:

```php
$user = User::withTrashed()->findOrFail($userId);
$rawUserData = $user->getAttributes();
$userWithNullValues = array_merge(collect($rawUserData), collect($user)->only([
  'id',
  'name',
  'email'
]));
```

This code block stores the loaded model as `$user`, grabs all its attributes and then merges them with those from a freshly created collection of the same model. The second array is created using Laravel's `only()` method, which specifies which attributes to include in the output. Finally, we merge both collections to form a new one with all model attributes, including null values.

<h2>Conclusion</h2>
To load all of a Laravel model's attributes, even those that are set to null, you can use the combination of `withTrashed()` and `findOrFail()`. Remember that this approach might result in more data being loaded than needed. You should always ensure efficiency by using appropriate techniques that work best for your project.

<h2>LaravelCompany.com Resources</h2>
For more information on Laravel and its capabilities, visit https://laravelcompany.com/blog/. Our blog features many helpful tutorials, articles, and guides that will help you become a better Laravel developer.
