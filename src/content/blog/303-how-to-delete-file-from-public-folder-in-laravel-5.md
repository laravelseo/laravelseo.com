---
title: "How to delete file from public folder in laravel 5.1"
description: "Title: Deleting Files from Public Folder in Laravel 5.1 Introduction: Deleting files or images associated with a particular data record is an essential..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Content"]
featured: false
---

Title: Deleting Files from Public Folder in Laravel 5.1

Introduction:
Deleting files or images associated with a particular data record is an essential functionality in many web applications. Although Laravel handles database operations smoothly, files in public directories such as images/news aren't directly linked to the app models. Therefore, you need to handle them separately for seamless deletion and data consistency. In this blog post, we will discuss how to delete a file from the public folder while performing database-related actions using Laravel 5.1.

Step 1: Set Up Environment Variables
To connect your Laravel application with the image files on the server, you need to define environment variables for both storage and app paths in your .env file. For local development, you can use absolute paths like:

STORAGE_PATH=/path/to/storage
APP_PATH=/path/public

In production environments, these paths should be relative to the project root directory. Ensure that the files and images are accessible from your application by setting correct permissions and directories.

Step 2: Delete Image File
To delete the image file from the public folder, you can use either the built-in File class or the more efficient unlink() function. In this case, you would need to include the path of the file in your controller code. It's advisable to first check if the file exists before attempting to delete it:

<pre><code> public function destroy($id) {
    $news = News::findOrFail($id);
    $image_path = app_path("images/news/{$news->photo}");

    if (File::exists($image_path)) {
        //Use the built-in File class method to delete file
        File::delete($image_path);
    } else {
        throw new \InvalidArgumentException('Image file does not exist.');
    }

    $news->delete();
    return redirect('admin/dashboard')-&gt;with('message','خبر موفقانه حذف  شد');
}
</code></pre>

Step 3: Alternative Method - Using the unlink() Function
To delete a file using the unlink() function, follow these steps:

<pre><code> public function destroy($id) {
    $news = News::findOrFail($id);
    $image_path = app_path("images/news/{$news->photo}");

    if (file_exists($image_path)) {
        //Use the unlink() function to delete file
        unlink($image_path);
    } else {
        throw new \InvalidArgumentException('Image file does not exist.');
    }

    $news->delete();
    return redirect('admin/dashboard')-&gt;with('message','خبر موفقانه حذف  شد');
}
</code></pre>

Conclusion:
By following these steps, you can ensure that your Laravel application handles both database operations and file management effectively. As always, test your code thoroughly to prevent any unintended consequences like data loss or file deletion issues. Keep in mind the importance of proper naming conventions for files and directories throughout your project. Additionally, consider employing version control software such as Git to track changes and manage your repository easily. For more information on Laravel development best practices, visit https://laravelcompany.com/blog/.
