---
title: "How to find entry using name in eloquent Laravel?"
description: "Title: Easily Find Entries by Name Using Eloquent Laravel Introduction: In this comprehensive guide, we will learn how to find entries by name using the..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Easily Find Entries by Name Using Eloquent Laravel

Introduction: In this comprehensive guide, we will learn how to find entries by name using the Eloquent Laravel framework. By default, searching database entries is usually done with an id number. However, today we will discuss the methods and code required for finding entries based on their 'name' column. This technique will be demonstrated through a basic example of a blog app where a controller handles route processing, views are rendered using Blade templates, and models represent author information.

1. Using Eloquent ORM: Laravel provides the Eloquent Object Relational Mapper (ORM) to interact with database tables as objects. In this case, we have an 'Authors' model representing authors. We need to extend it from the Eloquent class and specify the table name in the class definition.

    <pre><code>&lt;?php 
class Authors extends Eloquent {
    public static $table = 'authors';
}
</code></pre>

2. Finding an Author by Name: To find authors by their names, we will modify the controller function to search for a matching name and render the author's details in the view file. In this example, we have created a 'get_view()' method that accepts an id number in the URL.

   <pre><code>class Authors_Controller extends Base_Controller {
    public $restful = true;

    public function get_view($id){
        $authorModel = Authors::where('name', 'LIKE', '%' . $id . '%')->first(); // search using LIKE operator and partial match
        return View::make('authors.view')
            -&gt;with('author', $authorModel)
            -&gt;with('title', $authorModel-&gt;name);
    }
}
</code></pre>

3. Modifying the URL Scheme: To display the name of the post and hide the id number in the URL, we will modify the route definition to accept a dynamic parameter '(:any)' and use it as the author's name in our view.

   <pre><code>Route::controller(Controller::detect());

Route::get('author/([^/]+)', array('as'=&gt;'author', 'uses'=&gt;'authors@view'));
</code></pre>

4. Displaying the Author Details: Finally, we will modify the view file to display the author's details using their name instead of an id number. In this example, the view uses a template layout and includes the relevant author information such as name, bio, created_at, and a link back to the authors list.

   <pre><code>@layout('main.index')
@section('content')
&lt;h1&gt;{{$author-&gt;name}}&lt;/h1&gt;

&lt;p&gt;
    {{$author-&gt;bio}}
&lt;/p&gt;

&lt;small&gt;
    {{$author-&gt;created_at}} |
    {{HTML::link(URL::$base.'/authors/', 'Go back')}}
&lt;/small&gt;
@endsection
</code></pre>

Conclusion: With these modifications, we have learned how to find entries by name in Laravel using the Eloquent ORM. By leveraging the power of Eloquent models and modifying our route definitions and views accordingly, we can provide a user-friendly URL scheme that displays the author's name instead of an id number. This technique improves the overall user experience and makes it easier for visitors to find specific authors within your blog or content site.
