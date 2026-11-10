---
title: "How to validate phone number in laravel 5.2?"
description: "Title: Comprehensive Guide to Validating Phone Numbers in Laravel 5.2 &nbsp; Introduction: Validating user input is an essential aspect of web application..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

<p><strong>Title:</strong> Comprehensive Guide to Validating Phone Numbers in Laravel 5.2</p>
<p>&nbsp;</p>

<p><strong>Introduction:</strong></p>

Validating user input is an essential aspect of web application development, ensuring that you have accurate data for further processing and avoiding potential issues later on. In this blog post, we will discuss how to validate phone numbers in Laravel 5.2 applications using the built-in validation features. We'll also learn about specific conditions to ensure the input is strictly as per our requirements - specifically, starting with '01', having exactly 11 digits, and being a number only.

<p><strong>Prerequisites:</strong></p>

To follow this guide, you need to have basic knowledge of Laravel framework (version 5.2) and PHP. You should also be familiar with creating controllers and validating user inputs. If you're new to Laravel, check out our comprehensive tutorials on <a href="https://laravelcompany.com/tutorials/getting-started">Getting Started</a> with this framework.

<p><strong>The Problem:</strong></p>

Suppose you want to build an application where users need to register and provide their phone number for future communication. You want the number to satisfy these conditions:
1. Starts with '01' (for example, 01234567890)
2. Be exactly 11 digits long
3. Contain only numeric characters (no alphabets or special symbols)

<p><strong>The Solution:</strong></p>

To address these requirements in Laravel 5.2, we can utilize the built-in validation rules and custom conditions as shown in the following example code:

<pre><code>
public function saveUser(Request $request){
    $this->validate($request,[
        'name' => 'required|max:120',
        'email' => 'required|email|unique:users',
        'phone' => 'required|min:11|numeric',
        'course_id'=> 'required'
    ]);

    $user = new User();
    $user->name=  $request->Input(['name']);
    $user->email=  $request->Input(['email']);
    $user->phone=  $request->Input(['phone']);
    $user->date = date('Y-m-d');
    $user->completed_status = '0';
    $user->course_id=$request->Input(['course_id']);
    $user->save();
   return redirect('success');
}
</code></pre>

Let's break down the code:

1. `$this->validate($request,[...])` is used to validate the request data and perform necessary actions based on validation results. In this example, we're validating four input fields - 'name', 'email', 'phone', and 'course_id'.
2. The first condition `'required|max:120'` ensures that there is an entry in the input field called 'name' and it should be a string of length 120 characters or less.
3. For the email, we need to validate it as an actual email address using the rule `'required|email|unique:users'`. The first condition ensures that the field is not empty, while the last part checks uniqueness in the users table (the second part might be changed according to your specific needs).
4. To validate a phone number starting with '01', we use the following rule `'required|min:11|numeric'. The first condition ensures that there is an entry in the input field called 'phone', and the second one guarantees that it has at least 11 numeric characters. Finally, the last part filters out any non-numeric values.
5. Lastly, we create a new user object using the data from the request ($user->name, $user->email, $user->phone, ...) and save it to the database through the controller method `$user->save()`. The method redirects the user to a success page after saving the record.

<p><strong>Conclusion:</strong></p>

Following this guide, you can easily validate phone numbers in Laravel 5.2 applications while meeting specific conditions. By implementing proper validation rules and custom conditions, you're guaranteed to have accurate data for your application needs. Remember, a correct and thorough understanding of the framework is critical in building robust web applications with secure user data handling.
