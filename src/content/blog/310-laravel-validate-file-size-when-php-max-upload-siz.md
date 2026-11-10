---
title: "Laravel - validate file size when PHP max upload size limit is exceeded"
description: "Title: Laravel Validate File Size When PHP Max Upload Size Limit is Exceeded Introduction: In the world of web development, it's crucial to have control over..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Laravel - Validate File Size When PHP Max Upload Size Limit is Exceeded

Introduction: In the world of web development, it's crucial to have control over your server and its settings. However, shared hosting often imposes certain limits on upload sizes for security purposes. Laravel, being a popular PHP framework, offers efficient tools to handle file validations. This blog post will guide you through how to validate or force the file size to be within the server's limits even if it exceeds the maximum upload size.

1. Checking File Size Limit in the Configuration File:
Firstly, we need to access your 'config/filesystems.php' configuration file. Here, you can find details about the storage drivers and their settings for uploading files. You will see the 'disk' section with a key named 'maximum_file_size', which determines the maximum size of files allowed on your server. 

You can either change or remove this limit by setting its value to '0' (as in unlimited) or deleting it from the file. Don't forget to save and close this file. However, if you are using a shared hosting provider, you might not have access to edit these settings since they manage server configurations for you.

2. Validating File Size with Custom Requests:
In this approach, we will create a custom request that checks the files uploaded by users exceeding the server's limits. For this, navigate to your 'app/Http/Requests' directory and create a new file named 'CheckMaxFileSize.php' containing the following code:

```php
<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Support\Facades\Storage;

class CheckMaxFileSize extends Request {
  use ValidatesRequests;

  /**
   * Determine if the user is authorized to make this request.
   *
   * @return bool
   */
  public function authorize() {
    $file = Storage::disk('public')->get($this->file('file')); // Get the uploaded file from storage

    if ($file) {
      $size = fstat(fopen($file, 'r+'))['size']; // Retrieve the file size
      if ($size > config('filesystems.disks.public.maximum_file_size') * 1024) { // Check if the file exceeds the server's maximum upload limit in bytes
        return false; // Return false to prevent the request from proceeding further
      } else {
        fclose($file);
      }
    }

    return true;
  }
}
```

Here, we use Storage facade and file('file') method getter to retrieve the uploaded file. Then, we calculate the file size by getting its 'size' attribute from a stat() result. We validate it against your server-specific maximum file size limit. If the file is within limits, we continue with the request; if not, we stop the request and return false.

3. Implementing File Size Validation in Controllers:
Now that we have our custom request 'CheckMaxFileSize', we can use it throughout your application to validate file sizes when exceeding server-specific limits. To demonstrate this, let's modify an existing controller. Open the file with your desired controller name and add this code:

```php
<?php
namespace App\Http\Controllers;

use App\Http\Requests\CheckMaxFileSize;
use Illuminate\Http\Request;

class MyController extends Controller {
  public function myAction(CheckMaxFileSize $request, Request $input) {
    // Your controller logic goes here...
  }
}
```

Here, we've imported our custom request in the use statements and applied it on the route. This ensures that whenever a user uploads files exceeding the server-specific maximum file size limit, they will not be allowed to proceed with the action.

Conclusion: This blog post has covered various approaches on how you can validate or force the file size under a specific server's upload limit using Laravel techniques. While changing the PHP ini settings directly might offer more control, it could affect other users on shared servers. With these methods, you can strike a balance between user experience and maintaining your website's security while ensuring users don't face unexpected errors or limitations when uploading files to your platform.
