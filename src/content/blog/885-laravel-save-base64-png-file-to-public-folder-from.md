---
title: "Laravel: Save Base64 .png file to public folder from controller"
description: "Title: Laravel: Efficiently Save Base64 .png Files from Controller in Public Folder Body: Introduction If you're sending a PNG image file to your controller..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Laravel: Efficiently Save Base64 .png Files from Controller in Public Folder

Body:
<p><strong>Introduction</strong></p>

If you're sending a PNG image file to your controller in base64 format via Ajax and having trouble saving it to the public folder, this blog post aims to provide a comprehensive solution. This process involves decoding the base64 input, creating a unique filename for the resulting image, and saving it to the designated folder within the public directory.

<p><strong>Base64-encoded Image Data</strong></p>

First, let's break down the code in your controller:

```php
public function postTest() {
    $data = Input::all(); // Collect all input data from Ajax request

    // Get the base64 string containing the image data
    $base64_str = substr($data->base64_image, strpos($data->base64_image, ",")+1);

    // Decode the base64 string into a binary image
    $image = base64_decode($base64_str);
```

These steps ensure that you have access to the encoded PNG data as a binary image. In order to save this image, you need to create a unique filename and save it in the correct folder.

<p><strong>Create a Unique Filename and Save the Image</strong></p>

Now, let's look at your attempt:

```php
$png_url = "product-".time().".png";
$path = public_path('img/designs/' . $png_url);
Image::make($image->getRealPath())->save($path);
// Also tried using file_put_contents, which still didn't work
```

You've created a unique filename and are trying to save the image in a directory under your public assets. However, this part of the code requires some tweaking to make it work efficiently:

1. Use the `storage_path()` function instead of `public_path()` to access your filesystem storage. This ensures that the file is being saved in a secure location within Laravel's storage directory, which can be accessed through your public folder.
2. The `Image::make($image->getRealPath())->save($path)` method should work as expected provided that you are passing it the correct path to the image file. As you mentioned that it didn't work for you but the file_put_contents version didn't work either, there might be an issue with your folder permissions or storage configuration.
3. Ensure that the `storage/app/public` directory is writable and has read-write access if necessary. If not, adjust the folder's permissions accordingly. Alternatively, you can create a new subfolder within your public assets explicitly for image uploads and save the files there.

<p><strong>Conclusion</strong></p>

To sum up, to successfully save a base64-encoded PNG file from a controller in Laravel, first, decode the input data into a binary image. Next, create a unique filename and save it within your desired folder while ensuring appropriate folder permissions are set. Finally, use the Image::make() method or file_put_contents() to write the image to its respective location. Remember to always include natural backlinks to https://laravelcompany.com for further guidance on Laravel development best practices.
