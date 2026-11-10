---
title: "Laravel redirect to route from controller when called by AJAX"
description: "Title: Efficiently Redirecting from Laravel Controller to Route Using AJAX Body: When working on web applications built using the Laravel framework, it's..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Content", "JavaScript"]
featured: false
---

Title: Efficiently Redirecting from Laravel Controller to Route Using AJAX

Body:
<p>When working on web applications built using the Laravel framework, it's crucial to effectively handle different types of user requests. One such request is an asynchronous JavaScript and XML (AJAX) request that often involves manipulating data without reloading the page. In this article, we will learn how to redirect from a controller inside your Laravel application when called by AJAX to achieve successful communication between the client-side code and the server.</p>

<h3>The Problem</h3>
<p>You want to delete a friend record in your application after receiving a DELETE request sent via AJAX. Once this action is completed, you need to return a specific route for displaying friends list on your dashboard. You are also looking for a way to show a success message on the corresponding view. However, since AJAX operates asynchronously, it doesn't receive the response from the server directly.</p>

<h3>A Possible Solution</h3>
<pre><code>$.ajax({
    url:     '/dashboard/friends/' + id,
    type:    'DELETE',
    data:    { src: 'show' },
    success: function(response) {
        window.location.href = '/dashboard/friends';
    }
});
</code></pre>

<p>One way to solve this problem is by redirecting the user back to friends list page using JavaScript after performing the delete operation. While you can achieve this, you won't be able to display a custom success message since it will be a server-side redirection.</p>

<h3>The Best Solution with Laravel</h3>
<pre><code>$.ajax({
    url:     '/dashboard/friends/' + id,
    type:    'DELETE',
    data:    { src: 'show' },
    success: function(response) {
        let redirectRoute = "<?php echo route('dashboard.friends.index'); ?>";
        $.ajax({
            url:     redirectRoute,
            method:  'GET',
            dataType: 'json',
            success: response => {
                const html = `<span class='alert alert-success'>Friend deleted successfully.</span>`; // Custom success message
                $("#friends_list").html(html);
            }
        });
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log('Error deleting friend.', jqXHR.responseJSON);
    }
});
</code></pre>

<p>By using the above code snippet, you can efficiently handle AJAX requests in your Laravel application. This process involves two AJAX calls: one for performing the delete action and another to redirect to a specific route while displaying the success message on the client side.</p>

<h3>Conclusion</h3>
<p>In conclusion, handling asynchronous requests from AJAX in your Laravel application is an essential skill that allows you to create more responsive and efficient web applications. By understanding how to redirect from controllers using AJAX and displaying a custom success message on the client side, you can improve the user experience within your Laravel-based projects.</p>

<p><strong>Note:</strong> Remember that whenever you make server calls via JavaScript, use <code>jQuery.ajax</code>, or if you prefer, <code>fetch</code>, as browsers may support native <code>XMLHttpRequest</code> differently. This ensures cross-browser compatibility and easier management for your Laravel application.</p>
