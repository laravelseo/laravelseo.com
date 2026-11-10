---
title: "Laravel do not validate if field is not required"
description: "Title: Laravel Request Validation: Understanding Required Fields and Conditional Logic Body: Request validation in Laravel is a powerful tool used to ensure..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Title: Laravel Request Validation: Understanding Required Fields and Conditional Logic
Body: <p>Request validation in Laravel is a powerful tool used to ensure that incoming data (from forms or APIs) adheres to certain rules and guidelines set by the developer. In some cases, you may want to specify conditional logic for form fields based on other field values or choices made in your application.</p>

<h2>The Problem</h2>
In our initial scenario, we have a request validation that checks whether a 'digits:10' rule is required even if the 'type' is not 'individual'. This leads to an error when the given context does not apply. To tackle this issue, we need to understand how Laravel handles conditional field validations with the provided `required_if` and other validation rules.

<h2>Understanding Conditional Validation Rules</h2>
Laravel provides various types of conditional validation rules that allow you to validate fields based on their relations to others or specific conditions. The `required_if`, for example, ensures the field is required only if a given condition is met. In our case, we have two groups of rules: one set for individual 'type' and another for legal-entity 'type'.

<h2>Solving the Problem</h2>
To resolve this issue, we can modify our validation to check whether the pin field should be required or not based on the provided type. We will use the `required_with` rule along with custom logic in our controller or request class. Here is an updated example:

<pre><code>&lt;?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OwnerEstate extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        if ($this->type == 'individual') {
            $rules = [
                'firstname' => 'required',
                'secondname' => 'required',
                'lastname' => 'required',
                'pin' => 'required|digits:10',
            ];
        } else if ($this->type == 'legal-entity') {
            $rules = [
                'name' => 'required',
                'eik' => 'required|digits:9',
            ];
        }

        return $rules;
    }
}
</code></pre>

Now, when a user submits the form with any type other than individual ('type', 'legal-entity'), the validation rules will not require the pin field to be filled out. If the type is set to 'individual', then the necessary fields and their respective rules are applied as before.

<h2>Conclusion</h2>
Laravel provides excellent tools for handling conditional validations in your form submissions. By understanding the different validation rules and using them effectively, we can ensure that our users are provided with accurate feedback and guidance based on their choices. This approach also helps us avoid unnecessary errors and confusion when working with complex forms. To learn more about Laravel's request validation options, check out our comprehensive article on the topic at https://laravelcompany.com/blog/post/laravel-request-validation-tutorial.
