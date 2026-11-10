---
title: "Laravel form html with PUT method for PUT routes"
description: "Title: Laravel Form HTML with PUT Method for PUT Routes Body: In a Laravel application, it is vital to understand the use of different HTTP methods. These..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML"]
featured: false
---

Title: Laravel Form HTML with PUT Method for PUT Routes

Body:
<p>In a Laravel application, it is vital to understand the use of different HTTP methods. These methods are used to indicate the type of request being sent by the client and how the server should process it. The form method attribute determines which HTTP method the submitted data will be sent with, either GET or POST for standard requests or PUT in this case. Let's elaborate further on how to handle PUT requests using forms.</p>
<p>Firstly, ensure your routes are properly configured to accept and process PUT requests. You can have separate named routes for different actions like creating, storing, updating, deleting, etc.:</p>
<pre><code>+--------+---------------------------+--------------+---------------------------                                                                                                                ---------+----------------+---------------+
| Domain | URI                       | Name         | Action                                                                                                                                             | Before Filters | After Filters |
+--------+---------------------------+--------------+---------------------------                                                                                                                         |                |               |
|        | GET|HEAD /                |              | postcontroller                                                                                                                                     | auth           |               |
|        | GET|HEAD login            |              | homecontroller@dologin                                                                                                                             |                |               |
|        | POST login                |              | homecontroller@dologin                                                                                                                             |                |               |
|        | GET|HEAD logout           |              | homecontroller@dologout                                                                                                                            |                |               |
|        | GET|HEAD post             | post.index   | postcontroller@index                                                                                                                               |                |               |
|        | GET|HEAD post/create      | post.create  | postcontroller@create                                                                                                                              |                |               |
|        | POST post                 | post.store   | postcontroller@store                                                                                                                               |                |               |
|        | GET|HEAD post/{post}      | post.show    | postcontroller@show                                                                                                                                |                |               |
|        | GET|HEAD post/{post}/edit | post.edit    | postcontroller@edit                                                                                                                                |                |               |
|        | PUT post/{post}           | post.update  | postcontroller@update                                                                                                                              |                |               |
|        | PATCH post/{post}         |              | postcontroller@update                                                                                                                              |                |               |
|        | DELETE post/{post}        | post.destroy | postcontroller@destroy 
</code></pre>
<p>Next, let's create a form with the PUT method. In your HTML code, you can use the following structure:</p>
<pre><code>&lt;form class=&quot;col-md-12&quot; action=&quot;&lt;?php echo URL::to('/');?&gt;/post/&lt;?=$post-&gt;postID?&gt;&quot; method=&quot;put&quot;&gt;
    &lt;div class=&quot;form-group&quot;&gt;
        &lt;textarea type=&quot;text&quot; class=&quot;form-control input-lg&quot; placeholder=&quot;Text Here&quot; name=&quot;post&quot;&gt;&lt;?=$post-&gt;post?&gt;&lt;/textarea&gt;
    &lt;/div&gt;
    &lt;div class=&quot;form-group&quot;&gt;
        &lt;button class=&quot;btn btn-primary btn-lg btn-block&quot; type=&quot;submit&quot; value=&quot;Edit&quot;&gt;Edit&lt;/button&gt;
    &lt;/div&gt;
&lt;/form&gt;     
</code></pre>
<p>However, as you mentioned, if your primary goal is to keep the form styled using CSS, it's recommended to use Laravel Form Builder. This will ensure that the form submission method will automatically be set to PUT while maintaining your desired styling.</p>
<p>In short, make sure your routes are configured correctly for PUT methods and choose the appropriate HTML structure or utilize Laravel's Form builder to handle the submission of forms with the PUT method. Remember that forms are meant to be submitted using HTTP requests, and the specific method used will dictate how the data is processed by the server.</p>
<p><strong>Conclusion:</strong> Ensuring proper route configuration, choosing between HTML code or Form Builder, and ensuring your form's method attribute matches your desired request type is fundamental for handling PUT requests in Laravel applications. This guarantees a smooth user experience while maintaining data security and effectiveness.</p>
