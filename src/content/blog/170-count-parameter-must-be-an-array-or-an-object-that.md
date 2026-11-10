---
title: "count() parameter must be an array or an object that implements countable in laravel"
description: "Title: Understanding Countable Interface and Fixing \"count() Parameter Must be an Array or Object that Implements Countable\" Errors in Laravel Introduction:..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Title: Understanding Countable Interface and Fixing "count() Parameter Must be an Array or Object that Implements Countable" Errors in Laravel

Introduction:
Laravel is a powerful PHP framework that makes web development easier by providing various built-in features to help developers avoid common pitfalls. One critical aspect when working with arrays is ensuring they are properly handled and used for intended purposes, especially when counting them. In this comprehensive blog post, we will discuss the "count() parameter must be an array or an object that implements Countable" error in Laravel and provide you with all the necessary information to avoid it while creating efficient code.

The Code Sample:
Let's begin by analyzing the provided sample code. The given function credentials takes a $request as input, performs some database operations, and returns an array based on those operations. A specific part of this code is causing the error mentioned in the title. Let's examine it closely:

```php
$admin=admin::where('email',$request->email)->first();
if(count($admin))
{
   if($admin->status==0){
       return ['email'=>'inactive','password'=>'You are not an active person, Please contact to admin'];
   }
   else{
       return ['email'=>$request->email,'password'=>$request->password,'status'=>1];
   }
}
return $request->only($this->username(), 'password');
```

The error occurs in the `if(count($admin))` statement, indicating a problem with the `count()` function and the variable it is applied to. Let's dig deeper into this issue to understand its cause and solution.

Understanding Countable Interface:
In PHP, any class can implement the Countable interface if it allows counting its items, allowing us to use the count() function on objects that are not arrays. In Laravel, a common practice is to use Eloquent models which, by default, do not implement this interface. To fix the given error and avoid similar issues in the future, we need to understand how to properly deal with Countable interfaces in our applications.

Solution: Implementing Countable Interface on Custom Classes:
To make your custom classes compatible with count() function, you can add a "count" method that returns the number of items in the collection. Here's an example:

```php
class MyCustomCollection implements Countable
{
    protected $items;

    public function __construct($items)
    {
        $this->items = (array)$items;
    }

    public function count()
    {
        return count($this->items);
    }
}
```

In this example, we create a class named "MyCustomCollection" which extends Countable and contains the required methods. The constructor is used to initialize an array of data when creating new instances of this class. We also implement the "count()" function to return the number of items in the collection.

Implementing Countable Interface on Eloquent Models:
In some cases, when using Eloquent models, you might need to use the query builder to filter and retrieve related data. Unfortunately, the query builder doesn't natively implement the Countable interface. To work around this issue, we can create a custom method that mimics the count() function behavior:

```php
class EloquentModel extends Model implements Countable
{
    public function countResults($query = null)
    {
        if (is_null($this->connection)) return 0;

        $sql = 'SELECT COUNT(*) FROM (' . $this->buildQueryString($query) . ') AS q';
        $row = $this->getConnection()->prepare($sql)->execute();
        $count = (int)$row[0];

        return $count;
    }
}
```

In this example, we add a "countResults" method to the EloquentModel class that uses SQL queries to count the number of records in a collection. This method ensures proper counting even when working with query builder objects.

Conclusion:
By understanding the Countable interface and incorporating it into your custom classes or models, you can easily avoid the "count() parameter must be an array or object that implements Countable" error in Laravel. Always remember to check your code for any occurrences of count() and ensure its parameters are valid, whether they are arrays or objects with a suitable interface implementation. If you encounter issues while dealing with collections in your applications, the Laravel company resources can be a great guide to help you find the best solution.
