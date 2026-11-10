---
title: "Upload pdf file using Laravel 5"
description: "Title: Uploading PDF Files with Laravel 5: A Comprehensive Guide Body: The process of uploading a user generated file using Laravel 5 is relatively..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel"]
featured: false
---

Title: Uploading PDF Files with Laravel 5: A Comprehensive Guide

Body:
<p>The process of uploading a user-generated file using Laravel 5 is relatively straightforward. Here's how we can create a form that allows users to upload PDF files, store them in the specified folder, and display a success message upon successful submission.</p>

First, let us begin by defining the relevant routes and controller functions for managing the file upload process:

1. Routes: Create a route group with middleware named 'web' which will handle user requests:
   <pre><code>Route::group(['middleware' => ['web']], function() {
    // Routes specific to the web interface
});</code></pre>

To upload and store PDF files, create a route for the file upload form using 'post' method:
   <pre><code>Route::post('upload_pdf', 'FileController@store');</code></pre>

2. Controllers: To handle all operations related to file uploads, create a controller named FileController with the store() function:
   <pre><code>public function store(Request $request) {
    // Code to process and store uploaded PDF files goes here.
}
</code></pre>

Now that we have our routes and controllers set up, let's look at the view code for the form:

<p><div class="form-group">
     <label for="upload_file" class="control-label col-sm-3">Upload File</label>
     <div class="col-sm-9">
          <input class="form-control" type="file" name="upload_file" id="upload_file">
     </div>
</div></p>

To store the uploaded PDF files, we need to perform the following steps:

1. Receive the file data from the request in the controller's store() function using Request::instance()->file('upload_file'):
   <pre><code>$file = $request->file('upload_file');</code></pre>

2. Move the uploaded PDF to a specified upload path and folder, such as 'public/files':
   <pre><code>$filename = time().'_'.str_random(10).'.'.$file->getClientOriginalExtension();
    $path = storage_path('app/public/files').'/'.$filename;
    $file->move($path, $filename);</code></pre>

3. Redirect the user back to the form or to a specific page on successful file upload:
   <pre><code>return redirect()->route('dashboard')->with(['success' => 'PDF File Uploaded Successfully']);</code></pre>

4. Display relevant information about the uploaded PDF files in your view, such as filename and status:
   <p>Inside your blade file (or wherever you choose to display the file details), add the necessary HTML markup:</p>
   <pre><code>&lt;div class="form-group"&gt;
     &lt;label for="upload_file" class="control-label col-sm-3"&gt;&nbsp;&nbsp;&nbsp;Uploaded Files&lt;/label&gt;
     &lt;div class="col-sm-9"&gt;
          &lt;ul class="list-group"&gt;
              @foreach($files as $file)
                  &lt;li class="list-group-item"&gt;&nbsp;<a href="{{ route('download_pdf', ['filename' => $file->name]) }}" target="_blank">{{ $file->name }} ({{ $file->size }})</a>&nbsp;&gt;&nbsp;&#8657;</li>
              @endforeach
          &lt;/ul&gt;
     &lt;/div&gt;
&lt;/div&gt;
</code></pre>

Remember to handle and display errors in your view as well, such as file size limitations or incorrect upload formats. You can also add additional validation rules on the controller's store() function to ensure only PDF files are uploaded.

In conclusion, this tutorial demonstrates how to create a form to upload PDF files using Laravel 5 and store them in a specified folder on your server. By following these steps and best practices, you can now implement efficient and secure file upload functionalities into your application.
