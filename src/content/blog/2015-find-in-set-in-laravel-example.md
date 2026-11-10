---
title: "find in set in laravel ? example"
description: "Title: Finding Values from Comma Separated Fields in Laravel: A Comprehensive Guide Hello fellow developers! Understanding how to work with comma separated..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML", "PHP"]
featured: false
---

Title: Finding Values from Comma-Separated Fields in Laravel: A Comprehensive Guide

Hello fellow developers! Understanding how to work with comma-separated values (CSV) is a crucial skill when dealing with databases, and Laravel provides us with useful tools for handling these types of data. Today, we'll be focusing on finding values from CSV fields within our Laravel applications.

When working with database tables containing comma-separated tags or other fields, it can be challenging to find specific values. In this blog post, we will discuss how you can achieve this using the powerful tools provided by the Laravel framework. Let's get started!

Working with CSV data in Laravel begins with defining your query and understanding the structure of your database table. We have a table named 'tags_value', which contains tags in comma-separated values, as shown below:

<p><strong>tags_value</strong></p>
<div class="s-table-container">
<table class="s-table">
<thead>
<tr>
<th>id</th>
<th>tags</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td>
<td>css,html,php</td>
</tr>
<tr>
<td>2</td>
<td>php,java,css</td>
</tr>
<tr>
<td>3</td>
<td>java,c++,ios</td>
</tr>
</tbody>
</table>
</div>

Our goal is to find all the values containing 'css' within the column named 'tags'. For this purpose, Laravel provides us with a built-in function called FIND_IN_SET() which can help us solve our problem. Let's take a look at how we can use it effectively:

```php
$query = DB::table('tags_value')
    ->whereRaw(FIND_IN_SET('css', Tags))
    ->get();
```
In this code, we are using Laravel's query builder to select all rows from the 'tags_value' table where 'css' is found within the list of tags. The 'whereRaw()' method allows us to pass a custom SQL statement for filtering purposes. In our case, it will ensure that 'FIND_IN_SET('css', Tags)' is applied to the table. Finally, we call the 'get()' method to execute the query and return all matching rows.

However, using this approach might not provide you with the expected results if your comma-separated values have duplication or inconsistent formatting, making it challenging to find specific values properly. Let's consider a more robust solution:

```php
$tags = ['css', 'html', 'php']; // A list of tags we want to check
$query = DB::table('tags_value')
    ->selectRaw('id, (CASE WHEN `tags` REGEXP :tag
        THEN 1 ELSE 0 END) AS matches')
    ->whereIn('id', function($query) use ($tags) {
        $query->selectDistinct('id')
            ->table('tags_value')
            ->join('tags', 'tags.id', '=', 'tags_value.id')
            ->where(function ($q) use ($tags) {
                foreach ($tags as $tag) {
                    $q->orWhereRaw("FIND_IN_SET($tag, Tags)");
                }
            })
            ->get();
    })
    ->groupBy('id') // Group the results by id
    ->havingRaw("SUM(matches) = COUNT(*)") // Check if all tags are present for each row
    ->get(['id', 'matches']);
```
In this code, we first define a list of tags to search for. We then perform a join between the tables 'tags_value' and 'tags' using 'FIND_IN_SET()'. The INSIDE keyword ensures that each row from 'tags_value' matches all the specified tags. Finally, we group results by 'id', sum and count the number of matching entries, and filter rows where all specified tags are present. This way, our query will return only those that contain values for all the given tags.

In both approaches, you can see how Laravel's powerful tools assist in finding values from comma-separated fields effectively and efficiently. By implementing these techniques within your Laravel applications, you can master working with CSV data and enhance your database manipulation skills.

For more details on this topic and other laravel related tutorials, feel free to check out https://laravelcompany.com/blog/. Don't forget to bookmark our website for future reference!

With these tips in mind, we hope you are now better equipped to solve your database queries involving comma-separated fields. Happy coding!
