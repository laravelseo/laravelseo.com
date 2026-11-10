---
title: "Laravel delete button with HTML form"
description: "Title: Adding Delete Button with HTML Form Confirmation for Users in Laravel Introduction: In this blog post, you will learn how to add a delete button using..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "JavaScript", "HTML"]
featured: false
---

Title: Adding Delete Button with HTML Form Confirmation for Users in Laravel

Introduction: In this blog post, you will learn how to add a delete button using an HTML form to your existing Laravel CRUD (Create, Read, Update, and Delete) application for users. We will also implement confirmation popups when the user clicks on the delete button, ensuring that they are certain before proceeding with deleting a specific user account.

Creating a Confirmation Popup: When a user clicks on the delete button, we want to display a confirmation prompt to prevent accidental deletions of users. This can be achieved by creating an HTML form as shown below:

<pre><code>// Within your existing code for editing or deleting a user
&lt;form id="delete-form" method="POST" action="/admin/users/{{$user->id}}"&gt;
    {{ csrf_field() }}
    {{ method_field('DELETE') }}

    &lt;input type="hidden" name="_token" value="{{ Session::token() }}"&gt;

    &lt;div class="form-group"&gt;
        &lt;label&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Are you sure you want to delete this user?&lt;/label&gt;
        &lt;input type="submit" class="btn btn-danger" value="Delete user"&gt;
    &lt;/div&gt;
&lt;/form&gt;
</code></pre>

Note that the action of this form is the same as your existing delete route. We've also included a hidden token field to ensure that only requests using the delete button can send this specific request to your controller.

Adding a Confirmation Popup with JavaScript: To display the confirmation popup when the user clicks on the delete button, add the following code snippet in your view file:

<pre><code>@section('delete-button')
  &lt;form id="delete-btn-form" method="POST" action="/admin/users/{{$user->id}}" style="display: none;"&gt;
    {{ csrf_field() }}
    {{ method_field('DELETE') }}

    &lt;input type="hidden" name="_token" value="{{ Session::token() }}"&gt;

    &lt;div class="modal fade" id="confirm-delete-user" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">&lt;!-- Modal body and footer omitted for brevity --&gt;&lt;/div&gt;

    &lt;script type="text/javascript"&gt;
        $(document).ready(function(){
            $('.delete-button').on('click', function(){
                $('#confirm-delete-user').modal({show: true});
                $('#delete-btn-form').submit();
            });
        })
    &lt;/script&gt;
  &lt;/form&gt;

  @include('inc.errors')
@endsection

// Include jQuery and Bootstrap CSS in your layout if not already done
<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css">

@section('delete-button')
  &lt;a href="#" class="btn btn-danger delete-button" data-toggle="modal" data-target="#confirm-delete-user">&lt;/a&gt;
</code></pre>

The above code adds a new modal dialog and related JavaScript code to display the confirmation popup. The submit button in the hidden form is triggered when the user clicks the 'Yes, delete this user' button within the popup, which then sends the appropriate DELETE request to your controller as usual. Additionally, the link for the delete button was converted into a clickable anchor with a custom class 'delete-button'. This triggers the modal dialog when clicked and ensures that only this specific action can prompt the confirmation popup.

Finally, make sure that your controller catches the DELETE requests to delete users as usual, perhaps redirecting back to the list of users after deletion.

Conclusion: By adding a delete button with a confirmation popup in Laravel using HTML form and JavaScript, you can provide an extra level of security for your application's users. The blog post covered all necessary details, including code snippets, to help you implement this feature successfully in your own Laravel CRUD projects. Remember to test thoroughly before deploying the changes to ensure that your application remains secure and user-friendly.
