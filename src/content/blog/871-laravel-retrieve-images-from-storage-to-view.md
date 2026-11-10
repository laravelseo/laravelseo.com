---
title: "Laravel Retrieve Images from storage to view"
description: "Title: Efficiently Retrieve Images Stored in Laravel Storage for Viewing Body: Laravel provides a robust file storage system that offers several ways to..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content"]
featured: false
---

Title: Efficiently Retrieve Images Stored in Laravel Storage for Viewing

Body: <p>Laravel provides a robust file storage system that offers several ways to manipulate and display uploaded images. In this article, we'll discuss how you can efficiently retrieve images stored in Laravel for viewing by users.</p>

<p><strong>Storing Uploaded Files</strong></p>

<pre><code> $file = $request->file($file_attachment);
        $rules = [];
        $rules[$file_attachment] = 'required|mimes:jpeg|max:500';
        //...
        $uploaded = Storage::put(
            $destinationPath . $file_attachment . '.' . $file->getClientOriginalExtension(),
            file_get_contents($file->getRealPath())
        );
</code></pre>

<p>As seen in the code above, you use Laravel's storage system to store uploaded files. The file is first validated before being stored in a specified destination path. Laravel then saves the image with its original extension under that given path.</p>

<p><strong>Retrieving and Displaying Images</strong></p>

<p>When you want to show your users the images they've uploaded, you can use the following code:</p>

<pre><code> &lt;img src="{{ URL::asset('storage/photo.jpg') }}" /&gt;
</code></pre>

<p>Here, the image is displayed as an <code>img</code> tag, and its source URL is set to a Laravel-provided helper function, <code>URL::asset()</code>, which returns a fully qualified URL to your uploaded image's storage location. This ensures that the images are served correctly and securely.</p>

<p><strong>Avoiding Unreadable Texts</strong></p>

<p>You mentioned experiencing unreadable texts when trying to retrieve a file from storage. This is often caused by an incorrect content type header being sent along with the image data. To avoid this issue, you can use the following code in your controller:</p>

<pre><code> $storage = Storage::get('/2/filename.jpg');
    return response($storage)
        ->header('Content-Type', 'image/' . explode('.', $file_attachment)[1]) // Set the correct content type header based on file extension
        ->setCallback(function ($response, $file) {
            return $response->withAddedHeader('Access-Control-Allow-Origin', '*');
        });
</code></pre>

<p>In this code, you retrieve the image from Laravel storage and set its content type header to the appropriate file extension. Additionally, a callable is attached to your response object, which allows you to add custom headers for better compatibility with browsers.</p>

<p><strong>Displaying Images on a Public Route</strong></p>

<p>If you want users to access your images directly from their browser URLs, you can set up a dedicated route. Here's an example:</p>

<pre><code> Route::get('storage/{filename}', function ($filename) {
        $userid = session()->get('user')-&gt;id;
        return Storage::get($userid . '/' . $filename);
    });
});
</code></pre>

<p>This route allows you to access images based on their file name. It ensures that the correct user's uploaded images are displayed, preventing unauthorized access and enhancing security.</p>

<p><strong>Conclusion</strong></p>

<p>Retrieving and displaying uploaded images from Laravel storage is a crucial aspect of your application. By following these guidelines, you can easily show your users their uploaded pictures while maintaining the necessary security measures. Additionally, ensure that your image content-type headers are set correctly to provide a smooth user experience.</p>

<p><strong>Note: Remember to keep your code well-structured and easy to read for better maintainability and collaboration. Always follow Laravel's best practices when working with files and images to ensure the best performance.</strong></p>
