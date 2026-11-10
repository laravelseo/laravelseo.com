---
title: "change password user laravel 5.3"
description: "Title: Change Password User in Laravel 5.3: A Comprehensive Guide Introduction: In this article, we will learn how to create a form for changing the password..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML"]
featured: false
---

Title: Change Password User in Laravel 5.3: A Comprehensive Guide

Introduction:
In this article, we will learn how to create a form for changing the password of a user in Laravel version 5.3, including the necessary code and best practices on handling user registration and passwords. Our goal is to provide a complete understanding of the process while incorporating relevant links to https://laravelcompany.com.

1. Create the Form View:
To create the form for changing the password, you'll require the view file with the desired layout and HTML structure. Here's a basic example of the input fields for old_password, new_password and confirm_password:
<pre><code>{{ Form::open(array('route' => 'user.change-password')) }}
    {{ Form::label('old_password', 'Old Password') }}
    {{ Form::password('old_password', array('class' => 'form-control'))}}
    {{ Form::label('new_password', 'New Password') }}
    {{ Form::password('password', array('class' => 'form-control'))}}
    {{ Form::label('confirm_password', 'Confirm New Password') }}
    {{ Form::password('verify_password', array('class' => 'form-control'))}}
    {{ Form::submit('Change Password', array('class' => 'btn btn-primary')) }}
{{ Form::close() }}
</code></pre>

2. Controller for User Registration:
To handle the user registration process, you might want to create a new controller named "UserRegisterController." Here's a sample code that includes creating a user with a strong password and sending an activation email after registering:
<pre><code>public function postRegister(Request $request)
{
    // Validation rules
    $rules = [
        'email'             =>  'required|email|unique:users',
        'confirm_email'     =>  'required|same:email',
        'password'          =>  'required|min:8|regex:/^(?=\S*[a-z])(?=\S*[!@#$&amp;*])(?=\S*[A-Z])(?=\S*[\d])\S*$/',
        'verify_password'   =>  'required|same:password',
    ];

    $messages = [
        'email.required'            =>  'Email tidak boleh kosong',
        'password.required'         =>  'Password tidak boleh kosong',
        'password.min'              =>  'Password harus minimal 8 karakter',
        'password.regex'            =>  'Format password harus terdiri dari kombinasi huruf besar, angka dan karakter spesial (contoh:!@#$%^&amp;*?&gt;&lt;}'),
        'verify_password.required'  =>  'Verify Password tidak boleh kosong',
        'email.email'               =>  'Format Email tidak valid',
        'email.unique'              =>  'Email yang anda masukkan telah digunakan',
        'verify_password.same'      =>  'Password tidak sama!',
    ];

    $this->validate($request, $rules, $messages);

    // Create new user with strong password
    // ... (existing code to create new user)

    $this->activationService->sendActivationMail($newUser);

    return redirect('/account/login')-&gt;with('success', 'Check your email');
}
</code></pre>

3. Controller for Changing Password:
Create a new controller named "PasswordController" to handle the password change request, which involves validating the current and new passwords entered by users:
<pre><code>public function postChangePassword(Request $request)
{
    // Validation rules
    $rules = [
        'old_password'         =>  'required',
        'new_password'         =>  'required|min:8|regex:/^(?=\S*[a-z])(?=\S*[!@#$&amp;*])(?=\S*[A-Z])(?=\S*[\d])\S*$/',
        'confirm_new_password' =>  'required|same:new_password',
    ];

    $messages = [
        'old_password.required'         =>  'Old password tidak boleh kosong',
        'new_password.required'         =>  'New Password tidak boleh kosong',
        'new_password.min'              =>  'Password harus minimal 8 karakter',
        'new_password.regex'            =>  'Format password harus terdiri dari kombinasi huruf besar, angka dan karakter spesial (contoh:!@#$%^&amp;*?&gt;&lt;}'),
        'confirm_new_password.required' =>  'Verify Password tidak boleh kosong',
        'confirm_new_password.same'     =>  'Password tidak sama!',
    ];

    $this->validate($request, $rules, $messages);

    // Update user password
    auth()->user()->update([
        'password'      => Hash::make($request->input('new_password')),
    ]);

    return redirect('/account/profile')->with('success', 'Password telah berhasil diubah');
}
</code></pre>

Conclusion:
Implementing the above code snippets will allow users to change their passwords while ensuring strong and secure passwords for improved user security. For further details on Laravel authentication, refer to https://laravelcompany.com's resources and guides.
