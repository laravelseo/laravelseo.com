---
title: "Validate select form in laravel"
description: "Title: Validate Select Form Inputs in Laravel Easily Body: Validation plays an essential role in web applications as it helps ensure the data being submitted..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Errors"]
featured: false
---

Title: Validate Select Form Inputs in Laravel Easily

Body: Validation plays an essential role in web applications as it helps ensure the data being submitted is accurate and useful for further processing. In your scenario, you want to validate and pass the selected type of website from a select form input in your Laravel application. This can be achieved using various approaches, but let's discuss two popular methods.

Method 1: Using Laravel Validation Rules
Laravel provides a robust validation system that allows developers to define custom rules for their forms. To achieve the desired result, you can create a new rule named 'in_website_type' in your model or form request class. Here is an example of adding this rule and validating the form input:

1. Create the rule:
<pre><code>public function rules()
{
    return [
        // Other validation rules here
        'type' => ['required', new \App\Rules\InWebsiteType],
      ];
}
</code></pre>
2. Define the custom rule class (InWebsiteType):
<pre><code>class InWebsiteType extends Rule
{
    public $message;

    /**
     * Create a new rule instance.
     */
    public function __construct()
    {
        // Possible values for website types
        $websiteTypes = ['Business', 'Company', 'Personal', 'Online Shopping', 'Other'];
        $this->message = 'The selected website type is invalid. Please choose from: '.implode(', ', $websiteTypes);
    }

    /**
     * Determine if the validation rule passes.
     */
    public function passes($attribute, $value)
    {
        return in_array($value, array_keys($this->message));
    }

    /**
     * Get the validation error message.
     */
    public function message()
    {
        return $this->message;
    }
}
</code></pre>
3. Use this rule in your controller to validate the form input:
<pre><code>public function store(Request $request)
{
    // Other validation logic here
    if ($validator->fails())
    {
        return redirect('contact')
            ->withErrors($validator)
            ->withInput();
    }
    
    $data = array(
        'type' => $request-&gt;input('type'),
      );
    
    // Process data and send email
}
</code></pre>

Method 2: Using Request Validation
Laravel comes equipped with a feature that allows you to specify constraints for HTTP requests. This can be achieved by creating form request classes, which are an extension of the base Illuminate\Foundation\Validation\ValidatesRequests class. Here is how it could look in your case:

1. Define a new form request class (ContactFormRequest):
<pre><code>namespace App\Http\Requests;

use Illuminate\Foundation\Validation\ValidatesRequests;

class ContactFormRequest extends Request
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize()
    {
        // Add authorization logic here
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules()
    {
        return [
            'type' => ['required', 'in:Business,Company,Personal,Online Shopping,Other'],
          ];
    }
}
</code></pre>
2. Use this form request class in your controller to handle the request:
<pre><code>public function store(ContactFormRequest $request)
{
    // Other validation logic here
    
    $data = array(
        'type' => $request-&gt;input('type'),
      );
    
    // Process data and send email
}
</code></pre>

By using these methods, you can successfully validate the select form input for website type in your Laravel application. Just remember to include appropriate error messages or a user-friendly way to inform users about the invalid selection and provide them with a chance to correct it. As always, be sure to test your code thoroughly before deploying it to ensure everything functions as expected.
