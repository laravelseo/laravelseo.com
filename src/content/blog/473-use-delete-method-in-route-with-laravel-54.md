---
title: "use DELETE method in route with Laravel 5.4"
description: "Title: Using DELETE Method in Routes with Laravel 5.4: A Comprehensive Guide Body: Laravel provides an elegant way of handling different HTTP requests..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML", "PHP"]
featured: false
---

Title: Using DELETE Method in Routes with Laravel 5.4: A Comprehensive Guide

Body: <p>Laravel provides an elegant way of handling different HTTP requests through its routing system and various methods such as GET, POST, PUT, and DELETE. In this blog post, we will focus on using the DELETE method in a Laravel 5.4 project to handle deletions for categories in your application. We'll cover the necessary steps, possible issues, and best practices while handling such requests.</p>

<h2>Setting Up the View</h2>
First, let's create the view using Blade template engine to display a list of categories and their respective delete buttons:

<pre class="lang-html prettyprint-override"><code>&lt;table class="table"&gt;
  &lt;thead&gt;
    &lt;th&gt;Name&lt;/th&gt;
    &lt;th&gt;Action&lt;/th&gt;
  &lt;/thead&gt;
  &lt;tbody&gt;
    @foreach ($categories as $category)
      &lt;tr&gt;
        &lt;td&gt;$category-&gt;name&lt;/td&gt;
        &lt;td&gt;
          &lt;a href="{{ url('/categories', ['id' =&gt; $category-&gt;id]) }}"&gt;
            &lt;button class="btn btn-default"&gt;
            Delete
            &lt;/button&gt;
          &lt;/a&gt;
        &lt;/td&gt;
      &lt;/tr&gt;
    @endforeach
  &lt;/tbody&gt;
&lt;/table&gt;
</code></pre>

This code will generate a table with the category names and a delete button for each row. Clicking on the "Delete" button will send an HTTP DELETE request to the specified route.

<h2>Routing and the Route Method</h2>
Next, we'll create the appropriate route in our web.php file:

<pre class="lang-php prettyprint-override"><code>Route::delete('/categories/{id}', CategoryController@destroy);
</code></pre>

This line of code will map all DELETE requests directed towards "/categories/[id]" to the "destroy()" method in our CategoryController class. We can create this controller with a simple function that handles this request:

<pre class="lang-php prettyprint-override"><code>namespace App\Http\Controllers;

use Illuminate\Routing\Route;
use DB;

class CategoryController extends Controller {
    public function destroy($id) {
        // Perform logic to delete the category with the specified id.
        $category = DB::table('categories')->where('id', $id)->first();
        if (isset($category)) {
            $category->delete();
        }

        return redirect()->route('list-categories');
    }
}
</code></pre>

This controller will first retrieve the category with the specified ID and then delete it. Finally, it will redirect back to the list of categories.

<h2>Addressing Potential Issues</h2>
If you've followed these steps but still encounter an error such as "Method [DELETE] is not supported by URL", it means your browser might be sending an incorrect request type. In this case, we can try forcing the request to use the DELETE method:

<pre class="lang-html prettyprint-override"><code>&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
  &lt;head&gt;
    ...
  &lt;/head&gt;
  &lt;body&gt;
    <script>
      document.querySelector('form').method = 'DELETE';
    </script>
    ...
  &lt;/body&gt;
&lt;/html&gt;
</code></pre>

In this example, we select the form element and set its "method" attribute to "DELETE". This should force the browser to send a DELETE request when submitting the form. Alternatively, you could try using JavaScript to create a custom AJAX call which explicitly sets the HTTP method as DELETE.

In conclusion, this comprehensive guide highlights the necessary steps and best practices for handling DELETE requests through Laravel 5.4 routes and controllers. By following these guidelines, your application can effectively manage deletion operations while maintaining efficient routing performance. Remember to always keep your code clean and well-structured for future maintenance and updates.
