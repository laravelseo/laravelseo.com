---
title: "What is the best practice to show old value when editing a form in Laravel?"
description: "Title: Best Practices for Displaying Old Values While Editing Forms in Laravel Body: When developing forms in Laravel, it's essential to consider different..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Errors"]
featured: false
---

Title: Best Practices for Displaying Old Values While Editing Forms in Laravel

Body:
<p>When developing forms in Laravel, it's essential to consider different scenarios and provide users with a smooth experience. One such requirement is displaying the old value of fields when an edit form fails validation or input errors occur. In this article, we will discuss the best practices for accomplishing this using Laravel framework.</p>

<h3>Using the Form Request Validation Class</h3>
By utilizing the built-in Form Request Validation class in Laravel, you can easily access both validated and unvalidated data. This class extends the base ModelBinding class and provides methods for working with HTTP requests and performing validation. Here's an example of the FormRequest class:

<pre><code>class EditDogFormRequest extends FormRequest {
    // ... other validation rules, etc.

    public function attributes() {
        return [
            'title' => 'Dog Name',
            'age'   => 'Age',
            // ... more fields if required
        ];
    }
}
</code></pre>

<h3>Displaying Old Data in Form Fields</h3>
To display the old data when editing a form, you can use the <strong>"old"</strong> function in your Blade template. This will return either the submitted value from the previous request or the default value for that field if it has not been modified:

<pre><code>@if($errors->any())
    @foreach ($errors as $field => $error)
        <div class="alert alert-danger">{{$error}}</div>
    @endforeach
@endif

<!-- Form Fields -->
<div class="form-group">
    <label for="title">Title</label>
    <input type="text" name="title" id="title" class="form-control" value="{{old('title')}}" />
</div>

// ... other fields
</code></pre>

<h3>Handling Null Values</h3>
In the above example, if no data was entered for a particular field during validation or there were input errors, the "old" function will return an empty string instead of the old value. This can be handled by setting the model attribute to null when updating it based on the submitted request. For example:

<pre><code>$dog->update(request()->validate([
    // ... validation rules here
], ['title' => 'The :attribute field is required']));
</code></pre>

If no errors occur during validation, this code will update the dog model with the new input data. If an error occurs and validation fails, however, it will not update any values, leaving the old data intact.

<h3>Conclusion</h3>
By following these best practices, you can ensure your Laravel application provides a seamless editing experience for users while preserving their inputs in case of validation errors or user-specific conditions. The use of the Form Request Validation class and the "old" function allows developers to efficiently display and handle old data throughout the form submission process. Remember to keep your code clean, well organized, and maintainable, as it will significantly contribute to the overall quality of your Laravel application.
