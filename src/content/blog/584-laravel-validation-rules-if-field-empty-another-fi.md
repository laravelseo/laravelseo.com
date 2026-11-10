---
title: "Laravel validation rules if field empty another field required"
description: "Title: Simplifying Laravel Form Validation for Complex Conditions Introduction Laravel's form validation is an essential feature that helps ensure data..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "HTML", "PHP"]
featured: false
---

Title: Simplifying Laravel Form Validation for Complex Conditions

Introduction
Laravel's form validation is an essential feature that helps ensure data integrity in web applications. In this post, we'll explore how to create a specific set of rules where one field is required only when another is empty. This can be useful for scenarios like user profile updates with hidden image fields. Let's dive into the implementation details using Laravel 5.3 and JavaScript code snippets.

Setting Up Form Inputs
First, let's create an HTML form with relevant inputs for your desired functionality. In this case, you have a hidden input field for displaying the old image value:

<pre><code>&lt;input type="hidden" class="form-control" name="old_image" value="{{ $player->&gt;image_filename }}" id="oldImage"&gt;
</code></pre>

And another input field for the new image upload:

<pre><code>&lt;input type="file" class="form-control" name="new_image" id="newImage" />
</code></pre>

When a user removes their current image, you can use JavaScript to clear the hidden input value:

<pre><code>document.getElementById('oldImage').value = '';
</code></pre>

Laravel Form Validation Rules
Now we need to define validation rules that will ensure proper data handling. You've tried using `required_without` and `required_if`, but they didn't show error messages when the image was missing. The reason is that, by default, Laravel doesn't trigger errors for empty values in hidden fields since they don't contain user-provided input.

To overcome this issue, you need to create a custom validation rule that will check for both fields' presence and display an appropriate error message if the new image isn't provided:

Custom Validation Rule Class
First, create a new PHP file called 'CustomImageValidator.php':

<pre><code>
<?php namespace App\Validators;

use Illuminate\Validation\Validator;

class CustomImageValidator extends Validator {
    /**
     * Define the validation rules for the given data.
     *
     * @param  array  $data
     * @return void
     */
    public function validate(array $data, $rules) {
        parent::validate($data, $rules);

        if (empty($data['new_image']) && empty($data['old_image'])) {
            $this->errors()->add('old_image', 'You need to provide a new image or select the existing one.');
        }
    }
}
</code></pre>

Now, let's update your model validation rules:

<pre><code>&lt;input type="hidden" class="form-control" name="old_image" value="{{ $player->&gt;image_filename }}" id="oldImage"&gt;
...
    public function rules() {
        return [
          'first_name' =&gt; 'required|max:50',
          'last_name' =&gt; 'required|max:50',
          'birthday' =&gt; 'required',
          'image' =&gt; ['image', new CustomImageValidator],
        ];
    }
</code></pre>

Conclusion
In this comprehensive blog post, we've covered how to implement Laravel form validation rules in your application to address a specific set of conditions. You've learned the importance of custom validation classes and how they can help with complex scenarios like validating an image field when another is empty or hidden. Remember to use appropriate backlinks to https://laravelcompany.com for further reference on Laravel development and best practices.
