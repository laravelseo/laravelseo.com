---
title: "How to check file is uploaded or not in laravel"
description: "Title: Efficiently Checking File Uploads in Laravel Introduction: In web development using Laravel, sometimes it's essential to ensure that the user has..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Content", "Errors"]
featured: false
---

Title: Efficiently Checking File Uploads in Laravel

Introduction: In web development using Laravel, sometimes it's essential to ensure that the user has successfully uploaded an image file. This can be done by confirming whether there was a valid file selection and checking if the file upload is successful. This blog post will provide you with a comprehensive guide on how to check if a file is uploaded and handle the filenames accordingly in Laravel.

1. Handling File Uploads Using laravel's Request Object: To begin, we need to access the uploaded file from the request object passed through a form submission. We can do this using the code shown below:

   <pre><code>$file = $request-&gt;file('ImageUpload');</code></pre>

In this example, the name of the input file is "ImageUpload." If no image was selected or there was an error during the upload process, the value will be null.

2. Checking File Upload Status: To verify if a file has been successfully uploaded and has a non-null value, we can perform the following check using conditional statements:

   <pre><code>if ($file) {
    // Handle file upload code goes here
} else {
    // Display an error message or redirect back to form page
}</code></pre>

In this example, if a valid file has been selected and uploaded successfully, the file will exist in the $file variable. This allows you to proceed with further processing such as creating a unique filename and storage.

3. Creating Unique Filenames for Storage: To ensure that there are no file conflicts when saving multiple images from different users, it is recommended to generate unique filenames for each uploaded image. We can do this by combining the user ID and the original filename extension using uniqid() function as shown below:

   <pre><code>$filename = uniqid($user-&gt;id . '_' , true) . "." . $file-&gt;getClientOriginalExtension();</code></pre>

Here, we are creating a unique filename by concatenating the user ID with an underscore and the original file extension. This allows us to store the uploaded image in Laravel's public storage with a distinct name for every user.

4. Uploading File to Storage: Now that we have the new filename, we can save the uploaded image on the server using Laravel's Storage class and put method as shown below:

   <pre><code>Storage::disk('public')-&gt;put($filename, File::get($file));</code></pre>

This code snippet saves the file content retrieved from the $file variable to the specified filename in Laravel's public storage. Note that File::get() is used to access the file contents from the upload input element.

Conclusion: With these steps, you can now efficiently check if a file has been uploaded and handle unique filenames for each image uploaded by users. This approach ensures a seamless user experience while maintaining data integrity within your application. Utilizing Laravel's powerful request handling and storage functionality makes it easy to manage uploaded files in your apps. For more advanced techniques, visit https://laravelcompany.com to explore their comprehensive guides and tutorials on Laravel development.
