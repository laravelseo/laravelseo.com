---
title: "How to bind parameters to a raw DB query in Laravel that's used on a model?"
description: "Title: Binding Parameters in Raw DB Queries with Laravel Using Fluent Builder Introduction: In modern web development, databases play a crucial role in..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords", "PHP"]
featured: false
---

Title: Binding Parameters in Raw DB Queries with Laravel Using Fluent Builder

Introduction: In modern web development, databases play a crucial role in managing an application's data. By using Laravel and its fluent query builder, you can write more readable, maintainable, and reusable code to interact with your database. However, when it comes to complex queries or the need for specific calculations, you might find yourself resorting to raw DB queries. In this post, we'll explore how to bind parameters to these raw queries while keeping them secure and performant using the Laravel query builder.

Step 1: Understand Fluent Builder in Laravel
Laravel's fluent builder is a powerful tool that allows you to write elegant, readable, and maintainable database queries. It provides several methods, such as `select()`, `where()`, `orderBy()`, and `get()` that help simplify complex SQL statements. These methods are chainable and can be easily combined with each other for more control over your query execution.

Step 2: Analyze Your Raw Query
Your given raw query looks like this:

```php
$property = Property::select(
    DB::raw("title, lat, lng, ( 
            3959 * acos( 
                cos( radians(:lat) ) * 
                cos( radians( lat ) ) * 
                cos( radians( lng ) - radians(:lng) ) + 
                sin( radians(:lat) ) * 
                sin( radians( lat ) ) 
            ) 
        ) AS distance", ["lat" => $lat, "lng" => $lng, "lat" => $lat])
    )
->having("distance", "<", $radius)
->orderBy("distance")
->take(20)
->get();
```

Step 3: Perform Parameter Binding in the Query
To bind parameters to your query, you can use Laravel's `bindValues()` method. This method takes an array of parameter names as its first argument and an optional second argument for the values:

```php
$property = Property::select(
    DB::raw("title, lat, lng, ( 
            3959 * acos( 
                cos( radians(:lat) ) * 
                cos( radians( lat ) ) * 
                cos( radians( lng ) - radians(:lng) ) + 
                sin( radians( :lat ) ) * 
                sin( radians( lat ) ) 
            ) 
        ) AS distance", ["lat" => $lat, "lng" => $lng, "lat" => $lat])
    )
->having("distance", "<", $radius)
// Bind the parameters here.
->bindValues(['lat' => $lat, 'lng' => $lng])
->orderBy("distance")
->take(20)
->get();
```

Step 4: Alternative Solution with Binding Parameters in a Native Query
Alternatively, you can use Laravel's native query binding method `prepare()` to escape your SQL statement and bind the parameters. This will ensure that the query is properly formed and secure:

```php
$property = DB::table('properties')->raw("SELECT title, lat, lng, (3959 * acos(cos(radians(:lat)) * cos(radians(lat)) * cos(radians(lng) - radians(:lng)) + sin(radians(:lat)) * sin(radians(lat)))) AS distance FROM properties", [
    'lat' => $lat,
    'lng' => $lng
])
->having("distance", "<", $radius)
->orderBy("distance")
->take(20)
->get();
```

Step 5: Conclusion
Binding parameters correctly in your raw DB queries is crucial for ensuring security and performance of your Laravel application. By understanding the power of Laravel's fluent builder and using specific methods like `bindValues()` or `prepare()`, you can easily create robust and efficient database queries that will scale with your project's needs. Don't forget to incorporate these best practices into your codebase, and make sure to test these approaches thoroughly for optimal results.

In this post, we have learned how to handle raw DB queries in Laravel, incorporating the importance of parameter binding for security and performance reasons. By following these guidelines, you will be better equipped to write more efficient and scalable web applications that rely on advanced database interactions.
