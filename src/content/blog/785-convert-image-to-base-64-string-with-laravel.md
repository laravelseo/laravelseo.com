---
title: "Convert image to base 64 string with Laravel"
description: "Title: Effortlessly Convert Images to Base 64 Strings Using Laravel Introduction: In today's world of modern web development, handling images seamlessly is..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Content", "PHP"]
featured: false
---

Title: Effortlessly Convert Images to Base 64 Strings Using Laravel

Introduction: In today's world of modern web development, handling images seamlessly is an important aspect for any application. With Laravel, the popular PHP framework, you can easily manipulate and manage images. This blog post will walk you through converting an image to a base 64 string using Laravel in your application.

Body:

1. Understanding Base 64 Encoding: Before diving into the code, it is essential to understand what base 64 encoding is. It's essentially a method used for representing binary data in ASCII printable characters, making it more user-friendly and easier to include within text files or web applications.

2. Create Your Laravel Project: If you haven't already, create a new Laravel application using the Laravel installer or by following the instructions on their official website (https://laravel.com/docs/).

3. Implementing the Code: To convert an image to base 64 within your Laravel project, execute the following steps in your controller action:

   a. Create a new controller file (for example, ImageController.php) and add this method:

      ```php
      public function newEvent(Request $request){
          $parametre =$request->all();

          if ($request->hasFile('image')) {
              if($request->file('image')->isValid()) {
                  try {
                      $file = $request->file('image');
                      $imageContent = base64_encode(file_get_contents($file));
                      $this->storeImage($imageContent, 'file/images', $file);
                      return redirect()->route('home')->with(['success' => 'File uploaded successfully.']);
                  } catch (FileNotFoundException $e) {
                      echo "catch";
                  }
              }
          } else {
              return back()->withErrors('No file was selected.');
          }
      }

      public function storeImage($imageContent, $folder, $file) {
          Storage::disk(config('filesystems.disks.local.driver'))->putFileAs($folder.'/'.basename($file), $file);
          Storage::disk(config('filesystems.disks.local.driver'))->put($folder.'/image.png', base64_decode($imageContent));
      }
   ```

    b. In your view file, add an input field for the image upload:

      ```html
      <form action="{{ route('newEvent') }}" method="post" enctype="multipart/form-data">
          @csrf
          <input type="file" name="image" id="image">
          <!-- Other form fields and buttons go here -->
      </form>
      ```

4. Adding Form Handling: To handle the image upload, insert this within your view file (inside the form tag):

   ```html
   @if ($errors->any())
       <div class="alert alert-danger">
           <ul>
               @foreach ($errors->all() as $error)
                   <li>{{ $error }}</li>
               @endforeach
           </ul>
       </div>
   @endif

   @if (Session::has('success'))
       <div class="alert alert-success">
           {{ Session::get('success') }}
       </div>
   @endif
   ```

5. Test Your Code: You can now test your application by visiting the page where you added the form. Select an image and submit the form. Upon success, you should see the message "File uploaded successfully." Under the hood, Laravel will have taken care of converting your image to a base 64 string while also storing it in your local storage (assuming you used the default file system provided by Laravel).

Conclusion: By following this guide, you can seamlessly convert images to base 64 strings within Laravel. This approach allows for greater flexibility and ease of use when handling image files in your web applications. Incorporate these best practices for effortless image manipulation with Laravel.
