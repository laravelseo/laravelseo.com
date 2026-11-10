---
title: "How to delete record in laravel 5.3 using ajax request?"
description: "Title: Troubleshooting Laravel 5.3 Ajax Delete Function Issues Body: Deleting records using AJAX in Laravel 5.3 can be a bit tricky if you're not used to it...."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Errors"]
featured: false
---

Title: Troubleshooting Laravel 5.3 Ajax Delete Function Issues

Body:
<p>Deleting records using AJAX in Laravel 5.3 can be a bit tricky if you're not used to it. Many developers face issues while attempting this task, including the common error <code>NetworkError: 405 Method Not Allowed</code>. In this blog post, we will help you understand why this issue happens and provide solutions for fixing your AJAX delete function in Laravel 5.3.</p>

<p><strong>Misunderstanding the HTTP Request Type</strong></p>

The most common reason for the error <code>405 Method Not Allowed</code> is that you are using an incorrect HTTP request method. In your given code example, you are using <code>PUT</code> instead of <code>DELETE</code>. Make sure to use the appropriate HTTP verb (_method in this case) for the specific action, which should be <code>DELETE</code> in this scenario to properly delete a record.
<pre><code>url: "user/delete/"+id,
dataType: "JSON",
data: {
    "id": id,
    "_method": 'DELETE',
    "_token": token,
},
success: function ()
{
    console.log("it Work");
}
</code></pre>

<p><strong>Check for Routing Issues</strong></p>

The routing configuration might also cause this problem. Ensure that the route is set correctly to handle the delete action. In your provided code, the route should be:
<pre><code>Route::delete('/user/delete/{id}', 'UserController@destroy');
</code></pre>

<p><strong>Ensure CSRF Token Matching</strong></p>

Cross-Site Request Forgery (CSRF) tokens are used to verify that a web request is coming from the expected location. In your code, you're using <code>csrf_token()</code>, but the one in the AJAX request should match this token. Make sure the CSRF token is generated and sent correctly:
<pre><code>$(".deleteProduct").click(function(){
    var id = $(this).data("id");
    var token = $(this).data("token");
    $.ajax({
        url: "user/delete/"+id,
        type: 'DELETE',
        dataType: "JSON",
        data: {
            "_method": 'DELETE',
            "_token": token,
        },
        success: function () {
            console.log("it Work");
        }
    });
});
</code></pre>

<p><strong>Testing the Functionality Properly</strong></p>

Before calling your delete function through AJAX, test it directly in a browser by visiting the route's URL or using the Laravel tinker console. This will help you make sure that the backend code is functioning properly:
<pre><code>?user/delete/12 (Replace 12 with the actual ID of the record to delete)</code></pre>

If your backend deletion functions correctly, then try again using AJAX. If the error still persists, check the Laravel console for any other relevant warnings or errors.

<p><strong>Conclusion</strong></p>

Deleting records in Laravel 5.3 with AJAX can be difficult if you're not careful about the correct HTTP request method and routing configuration. By ensuring that these aspects are set up correctly, you should be able to use AJAX without any issues. Remember to test your backend functions before attempting to call them through ajax, and refer back to this blog post for guidance. Happy coding!
