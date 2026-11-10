---
title: "php - How to make file uploaded only image - Laravel"
description: "PHP How to Make File Upload Only Image Laravel Hello there! As a fellow developer, I completely understand the frustration you are facing. When dealing..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP"]
featured: false
---

Hello there! As a fellow developer, I completely understand the frustration you are facing. When dealing with file uploads in web applications, seemingly simple tasks often hide complex security and validation challenges. You are trying to achieve a crucial goal: ensuring that users can only upload images, blocking potentially malicious files like ZIP archives or executable scripts.

As a senior developer, I can tell you that relying solely on the HTML `accept` attribute is insufficient for security. The real magic—and the security—happens on the server side. We need robust validation to guarantee data integrity.

This guide will walk you through the correct, secure, and Laravel-idiomatic way to restrict file uploads to only images.

## Why Client-Side Checks Are Not Enough

You correctly started by using the `accept` attribute in your HTML input:

```html
<input type='file' name='photo' class='form-control' accept = 'image/jpeg , image/jpg, image/gif, image/png'>
```

While this improves the user experience by hiding irrelevant file types in the browser's file selection dialog, it is purely a client-side hint. A determined user can easily bypass this restriction by manipulating the request directly (e.g., using tools like Postman or cURL) and sending the file type they want, completely bypassing your frontend checks.

Therefore, the definitive solution lies in **server-side validation**. This ensures that no matter how the request is initiated, Laravel rigorously checks the contents of the uploaded file before processing it.

## The Secure Laravel Approach: Server-Side Validation

In a Laravel application, the best practice for handling incoming user data, including files, is to leverage Form Requests and built-in validation rules. This keeps your controller logic clean and adheres to the principles taught by teams like those at [laravelcompany.com](https://laravelcompany.com).

### Step 1: Define Validation Rules in Your Request

Instead of trying to filter the file type manually in the controller, we define strict rules for what is acceptable within a dedicated Form Request class. We will use the `mimes` rule, which checks the MIME type of the uploaded file.

Create or update your `CreateBannerRequest` class to include validation rules:

```php
// app/Http/Requests/CreateBannerRequest.php

public function rules()
{
    return [
        'photo' => [
            'required',
            'file',
            // This is the crucial part: only allow specific image MIME types
            'mimes:jpeg,jpg,png,gif', 
            'max:2048', // Optional: Add size restriction for security and performance
        ],
    ];
}
```

By using `mimes:jpeg,jpg,png,gif`, Laravel automatically rejects any file that does not match these extensions (like a `.zip` file), stopping the unwanted upload immediately.

### Step 2: Refine the Controller Logic

With the validation rules properly set up in the Request class, your controller logic becomes much simpler and safer. You no longer need complex manual checks for file type before moving it.

Here is how you would refine your controller method to benefit from this structure:

```php
use Illuminate\Http\Request;
use App\Http\Requests\CreateBannerRequest; // Ensure this is imported

public function store(CreateBannerRequest $request)
{
    // If the request passes validation (including file type checks), 
    // we know 'photo' exists and is a valid image.
    $input = $request->validated(); // Use validated() for cleaner access to input
    
    // Get original file name
    $filename = $request->file('photo')->getClientOriginalName();
    $input['photo'] = $filename;

    // Upload and move the file securely
    $path = $request->file('photo')->store('banners'); // Use store() for better organization in Laravel storage
    
    $banner = $this->BannerRepository->create($input);

    // Flash messages remain the same
    \Illuminate\Support\Facades\Session::flash('success', 'Banner saved successfully.');

    if (empty($banner)) {
        \Illuminate\Support\Facades\Session::flash('error', 'No image available.');
        return redirect(route('banner.index'));
    }

    return redirect(route('banner.index'));
}
```

### Step 3: Secure File Storage Best Practices

When dealing with file uploads, remember that security extends beyond validation to storage as well. Instead of using the default `store()` method, which saves files into a directory that might be less organized or secure for large applications, consider using Laravel's built-in **Filesystem** facade. This gives you more control over where and how files are stored.

## Conclusion

To summarize, the key to making file uploads restricted to images in Laravel is to prioritize server-side validation. Forget client-side hints for security; rely on the robust validation provided by Laravel's Request system. By implementing strict `mimes` rules within your Form Request, you ensure that only intended image files are allowed into your system, providing a secure and reliable foundation for your application. Happy coding!
