---
title: "Inertia: Reload page with updated data without modifying scroll position"
description: "Title: Effortlessly Reload Pages with Updated Data Using Inertia while Preserving Scroll Position Introduction In today's dynamic web applications, user..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "JavaScript"]
featured: false
---

Title: Effortlessly Reload Pages with Updated Data Using Inertia while Preserving Scroll Position

Introduction

In today's dynamic web applications, user interaction is crucial for a seamless and engaging experience. One of the common challenges developers face when implementing this interactivity is ensuring an efficient way to reload pages with updated data without losing the current scroll positions. Inertia, Laravel's progressive JavaScript framework, facilitates such interactions by allowing you to keep users in place while they browse through your application.

Preserving Scroll Position and Working Solution

To solve the issue of preserving the scroll position when reloading pages with updated data, we can make some adjustments to our existing code:

1. Include Inertia's `preserveScroll` option in the form request:

<pre><code>    completed(id) {
                this.completedForm.put(`/endpoint/completed/${id}`, {
                    preserveScroll: true,
                    onSuccess: () =&gt; {
                        Inertia.get('posts');
                    },
                });
            },
</code></pre>
   Here, we add the `preserveScroll` option to the form request when clicking the 'completed' button. This ensures that the scroll position will not be reset when reloading the page with updated data.

2. Use Inertia's API to get a new version of the page:
   <pre><code>    public function markAsCompleted(Request $request)
    {
        $post = Post::find($request-&gt;id);

        $post-&gt;completed = true;

        $post-&gt;save();

        return Redirect::route('posts');
    }
</code></pre>
   In this case, when a post is marked as completed and the data is saved in the database, we redirect to the 'posts' route. This can be handled by Inertia using a get request for the updated page.

3. Ensure that the new version of the page contains the necessary CSS class for the completed posts:
   <pre><code>    if ($post-&gt;completed) {
        $post->renderCompletedStyle();
     }
</code></pre>
   This code snippet is an example of a helper method that can be called to add the CSS class for completed tasks.

4. Adjust the JavaScript code to handle the Inertia redirect:
   <pre><code>    completed(id) {
                this.completedForm.put(`/endpoint/completed/${id}`, {
                    preserveScroll: true,
                    onSuccess: () =&gt; {
                        Inertia.get('posts');
                    },
                });
            },
</code></pre>
   Finally, we add the `onSuccess` callback to handle the successful response from the form request. When the data has been saved and redirected, we can call Inertia's `get` method for the 'posts' route, ensuring that the updated page with the correct scroll position is loaded.

Conclusion

Using Inertia, Laravel, and VueJs, you can create a seamless user experience by preserving the scroll positions when reloading pages with updated data. By implementing these simple adjustments to your code, your users will be able to interact effortlessly with your application without any disruptions. For more information on Inertia and Laravel, check out https://laravelcompany.com/blog/category/inertiajs for in-depth guides and tutorials.
