---
title: "How to show Save success message in Laravel 5.1?"
description: "Title: Displaying Save Success Messages in Laravel 5.1 Applications Body: In your Laravel 5.1 application, you have successfully saved data to the database..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

Title: Displaying Save Success Messages in Laravel 5.1 Applications

Body:
<p>In your Laravel 5.1 application, you have successfully saved data to the database using the Controller's store method as shown above. Now let's discuss how to display a success message when saving data is successful. There are multiple ways of accomplishing this and we will cover them briefly.</p>

<h3>Using Session Messages</h3>
<p>Laravel offers an extremely convenient way to handle messages, either for success or errors, using the session messages feature. To display a success message when saving data in Laravel 5.1, you can simply add this code immediately after calling the save() method:</p>

<pre><code>Session::flash('success', 'Seeder successfully saved!');
</code></pre>

<p>This will store the specified success message ("Seeder successfully saved!") in the session and show it next time a view is rendered. You can display this flash message from the views using the following code:</p>

<pre><code>{{ Session::get('success') }}
</code></pre>

<h3>Using Messages in Blade Templates</h3>
<p>Alternatively, you can define messages directly within your view templates as shown below:</p>

<pre><code>@if (Session::has('success'))
    <div class="alert alert-success">
        {{ Session::get('success') }}
    </div>
@endif
</code></pre>

<h3>Using Validation Messages</h3>
<p>Another approach is to include validation messages in your Laravel 5.1 application. These messages can be used both for error and success notifications. To display a custom save success message, you can follow these steps:</p>

1. In your controller, define an array of validation rules and a custom message for each field.

<pre><code>$messages = [
    'name' => 'The name field should be unique and not blank.',
    'address' => 'The address cannot be empty.',
    'age' => 'Please enter your age.',
];
</code></pre>

2. Define a custom validation rule for the save() method in the controller.

<pre><code>$this-&gt;validate($request,[
    'name'=&gt;'required|unique:seeders|max:255',
    'address'=&gt;'required',
    'age'=&gt;'required',
], $messages);
</code></pre>

3. Add the following code after calling save() in your controller to display validation messages:

<pre><code>if ($validator-&gt;fails()) {
    return redirect()->back()-&gt;withErrors($validator)-&gt;withInput();
}
</code></pre>

This approach will show error messages for invalid fields and a success message upon successful validation. Remember to include error messages in your views using the following code:

<pre><code>@if ($errors->any())
    <div class="alert alert-danger">
        @foreach ($errors-&gt;all() as $error)
            {{ $error }}<br>
        @endforeach
    </div>
@endif
</code></pre>

In conclusion, there are multiple ways to display success messages upon saving data in Laravel 5.1 applications. The choice depends on your preferences and project requirements. Be sure to consider the pros and cons of each approach and select the one that best fits your needs. For more guidance and practical examples related to Laravel development, visit https://laravelcompany.com.
