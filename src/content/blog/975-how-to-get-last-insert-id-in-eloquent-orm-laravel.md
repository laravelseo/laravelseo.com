---
title: "How to get last insert id in Eloquent ORM laravel"
description: "Title: Efficiently Retrieving Last Insert IDs in Laravel's Eloquent ORM Body: Laravel is an incredible PHP framework built with MVC architecture that has..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Efficiently Retrieving Last Insert IDs in Laravel's Eloquent ORM

Body:
Laravel is an incredible PHP framework built with MVC architecture that has gained immense popularity over the years due to its ease of use and feature-rich functionality. Amongst all its features, the Eloquent Object Relational Mapper (ORM) stands out as a powerful tool for database interaction. In this blog post, we will explore how to get the last insert ID in Laravel's Eloquent ORM when using its "create" method.

To begin, let us understand the concept of inserting new records into your database tables. You can use either the "Model::create($data)" or the "Model::firstOrCreate($attributes)" method for this purpose. In our case, we will be using the "create" function as shown below:

<pre><code>GeneralSettingModel::create($GeneralData);
User::create($loginuserdata);
</code></pre>
Here, each call to Model::create() inserts new rows into their respective tables. The question now arises when we try to get the last inserted ID: how do we retrieve this value?

Unfortunately, using either of these methods does not return the inserted model or its ID directly. You need to perform an additional step for retrieving the last insert ID in Laravel's Eloquent ORM. To achieve that, you can take the following approach:

<pre><code>$general_setting = GeneralSettingModel::create($GeneralData);
$lastInsertId = $general_setting->getOriginal('id');

// For multiple models
$user = User::create($loginuserdata);
$lastInsertId = DB::getPdo()->lastInsertId();
</code></pre>

In the first example, we save the general setting model and directly access its ID property using the "getOriginal" method. In the second case, since there is no direct access to the last inserted ID for a created user model, you can use Laravel's DB facade to retrieve it by calling the "lastInsertId()" method after executing the database insertion query.

In some cases, the DB facade might not be sufficient to get the required information. For example, if you are using an external transaction with a different database connection, then you should follow these steps:

<pre><code>$transaction = \DB::connection()->beginTransaction();
try {
    // Perform your application logic
    $general_setting = GeneralSettingModel::create($GeneralData);
    $user = User::create($loginuserdata);

    $lastInsertId = DB::getPdo()->lastInsertId();

    $transaction->commit();
} catch (\Exception $e) {
    $transaction->rollBack();
}
</code></pre>

Once you have retrieved the last insert ID, it's essential to use it in your application logic. By following these techniques, you can easily and efficiently get the last inserted ID for any model created using Laravel's Eloquent ORM.

To summarize: Retrieving the last insert ID in Laravel with Eloquent ORM is straightforward yet has a few specific approaches based on your database interaction method. Remember always to check the documentation and use relevant methods depending on your requirements. Happy coding!
