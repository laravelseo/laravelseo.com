---
title: "Laravel Eloquent: How to order results of related models?"
description: "Title: Laravel Eloquent: Ordering Results of Related Models with a Few Simple Steps Body: Working with related models in Laravel is efficient using its..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content"]
featured: false
---

Title: Laravel Eloquent: Ordering Results of Related Models with a Few Simple Steps
Body:

Working with related models in Laravel is efficient using its powerful ORM (Object Relational Mapper), Eloquent. With just a few lines of code, you can establish relationships between your database tables and easily interact with them. However, sometimes your data might not be naturally sorted or ordered the way you want. In this blog post, we will learn how to order results from related models using Laravel Eloquent.

Let's first understand the relationship and the code you have so far for working with students and schools:

1. You have a model called "School" that has many "Students".
2. In your School model, you create a function named "students()":
   <pre><code>public function students()
{
    return $this->hasMany('Student');
}
</code></pre>
3. You fetch the school using its ID in your controller:
   <pre><code>$school = School::find($schoolId);
</code></pre>
4. In your view, you iterate through all students related to a specific school:
   <pre><code>@foreach ($school-&gt;students as $student)
</code></pre>

To order the students by any field in the "students" table, follow these steps:

1. Set up the sorting criteria: In this case, let's say you want to order students according to their age. You will need a field named 'age' in your students table and a query parameter to sort them. For example, $sortBy = 'asc' (ascending) or 'desc' (descending) for the direction of ordering:
   <pre><code>$sortBy = 'asc'; // descending can also be used for descending order
</code></pre>
2. Create a closure within your students() relation to specify the sorting criteria: In this case, you would need to use the "orderBy('column', $direction)" method where 'column' is the name of the field you want to sort by (in our example, 'age') and $direction represents the sort order (ascending or descending).
   <pre><code>public function students() { return $this-&gt;hasMany('Student')->orderBy('age', $sortBy); }
</code></pre>
3. Retrieve your school with all the students ordered as per your criteria in the controller:
   <pre><code>$school = School::find($schoolId)
    -&gt;students()
    -&gt;orderBy('age', $sortBy)
    -&gt;get();
</code></pre>
4. In your view, iterate through the ordered students:
   <pre><code>@foreach ($school-&gt;students as $student)
</code></pre>

With this approach, you have successfully ordered the results of related models using Laravel Eloquent and query parameter sorting. Keep in mind that you can also filter data by adding additional criteria within your closure, such as:
   <pre><code>public function students() { return $this-&gt;hasMany('Student')->orderBy('age', $sortBy)->where('school_id', $schoolId); }
</code></pre>

In conclusion, with a few simple steps and the power of Eloquent's query builder, you can easily order results from related models in Laravel. The key is to understand how relationships work within your database schema and use closures effectively to define specific criteria for each relationship. At https://laravelcompany.com, we have a wealth of resources on working with Eloquent and ORM development that can further improve your Laravel skills, so feel free to explore our site!
