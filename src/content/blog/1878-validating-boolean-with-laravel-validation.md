---
title: "Validating boolean with Laravel Validation"
description: "Title: Efficiently Validating Boolean Inputs with Laravel Form Requests Body: When building web applications, one of the essential aspects is making sure..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "PHP"]
featured: false
---

Title: Efficiently Validating Boolean Inputs with Laravel Form Requests

Body: <p>When building web applications, one of the essential aspects is making sure that submitted data is clean and valid. Users often have a tendency to input incorrect or irrelevant information, which can negatively impact your application's performance and user experience.</p>

<h2>Creating Form Requests</h2>

<p>To validate forms in Laravel, you must first create a form request class. A form request is essentially a validation class that helps you define rules for handling incoming data from your user-submitted web forms.</p>

<pre><code class="language-php"><?php namespace App\Http\Requests;
use Illuminate\Validation\Request;
class LoginFormRequest extends FormRequest {
/**
* Determine if the user is authorized to make this request.
*/
public function authorize() {
return true;
}

/**
* Get the validation rules that apply to the request.
*/
public function rules() {
return [
'username' => 'required|max:255',
'password' => 'required|min:8',
'remember_me' => 'in:true,false'
];
}
}
?>
</code></pre>

<h2>Validating Boolean Inputs</h2>

<p>In the above code snippet, we have created a form request class for a login form. We have defined validation rules for the username and password fields. The <strong>"remember_me"</strong> field is checked to be validated as boolean input. As Laravel's in rule only accepts arrays of non-boolean strings, you need to specify true and false as string values.</p>

<h2>Improving Validation with Custom Functions</h2>

<p>To make the validation more concise and practical, you can use custom functions. For instance:</p>

<pre><code class="language-php"><?php namespace App\Http\Requests;
use Illuminate\Validation\Request;
class LoginFormRequest extends FormRequest {
/**
* Determine if the user is authorized to make this request.
*/
public function authorize() {
return true;
}

/**
* Get the validation rules that apply to the request.
*/
public function rules() {
return [
'username' => 'required|max:255',
'password' => 'required|min:8',
'remember_me' => 'boolean'
];
}

/**
* Custom function for boolean validation.
* @param $attribute
* @param $value
* @return bool
*/
public function validateBoolean($attribute, $value) {
return in_array($value, ['true', 'false']);
}
}
?>
</code></pre>

<h2>Conclusion</h2>

<p><strong>Summary:</strong> Laravel offers several ways to validate your forms and ensures clean data is handled. The best practice for validating boolean inputs in a Laravel application involves creating form requests, defining validation rules, and potentially using custom functions for more concise code.</p>

<p>Referencing our example login form with the "remember me" checkbox, you now have a well-structured and efficient way to validate the boolean input. For further information on Laravel's validation system, please refer to the official documentation provided by the Laravel Company at <a href="http://laravel.com/docs/validation#basic-usage" rel="noreferrer">http://laravel.com/docs/validation#basic-usage</a></p>
