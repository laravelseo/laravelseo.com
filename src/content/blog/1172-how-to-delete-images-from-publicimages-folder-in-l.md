---
title: "How to Delete Images from Public/Images Folder in laravel 5 (URL Data)"
description: "Title: Efficiently Deleting Images from Public/Images Folder in Laravel 5 using URL Data Introduction: In this blog post, we will discuss the process of..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content"]
featured: false
---

Title: Efficiently Deleting Images from Public/Images Folder in Laravel 5 using URL Data

Introduction: In this blog post, we will discuss the process of deleting images stored in Laravel's public/images folder using URL data. This approach is useful when you have your image URLs stored in a database and need to remove them from your application. We will cover different techniques and best practices for handling this situation.

Body:

1. Understanding the Issue
   When trying to delete images by referencing their URLs, it often seems like they are not getting deleted. This occurs because Laravel uses the file name stored in the database as a reference to access files rather than the full path. Let's see how we can fix this issue.

2. Creating an Efficient View Controller Method
   The first step is to create a new method in your view controller that will verify and delete the image referred by the provided URL. Here's an example:

   <pre><code>    public function deleteImage($url) {
        $image_path = parse_url($url, PHP_URL_PATH);  // extracts the path from a given url
        $image_path = str_replace('localhost', 'http://localhost', $image_path);  // converts localhost to http://localhost if necessary
        // check if the image exists and delete it
        if(File::exists($image_path)) {
            File::delete($image_path);
        }
        return response()->json([
            'success' => !File::exists($image_path)
        ]);
    }</code></pre>

   This method first parses the URL to extract the path. Then, it converts localhost to http://localhost if necessary (to ensure that relative paths work properly). Lastly, it checks if the image exists and deletes it before returning a JSON response indicating whether the operation was successful.

3. Integrating the Method into your Application
   To use this method in your application, you need to make an appropriate request within your controller or view code:

   <pre><code>    // From Controller
    public function deleteImageAction($id) {
        $record = Record::findOrFail($id);  // find the record with the given id
        if($record->deleteImage()) {
            return response()->json([
                'success' => true
            ]);
        } else {
            return response()->json([
                'error' => 'Could not delete image.'
            ], 500);
        }
    }

    // From View
    @if (isset($record))
        <a href="{{ route('delete-image', ['id' => $record->id]) }}" class="btn btn-danger">Delete Image</a>
    @endif

   Now, when you click the link to delete the image from your database record, it will first check if the URL is valid and then call the custom method to delete the image. If successful, the request returns a success message; otherwise, an error message is returned.

4. Conclusion:
   In this blog post, we discussed how to efficiently delete images stored in Laravel's public/images folder using their URL data. By creating and utilizing a custom view controller method and integrating it into your application, you can ensure the correct file deletion when referencing URLs instead of file names from your database. With this technique, you can manage your image storage more effectively and securely.
