---
title: "Laravel 5.4: how to delete a file stored in storage/app"
description: "Title: Laravel 5.4: Deleting Files Stored in storage/app Introduction In this blog post, we will address the issue of deleting a file stored in storage/app..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content"]
featured: false
---

Title: Laravel 5.4: Deleting Files Stored in storage/app

Introduction

In this blog post, we will address the issue of deleting a file stored in storage/app using Laravel 5.4. We'll cover different approaches and their pros and cons along with code examples to ensure you can accurately perform this task.

Laravel's File System for Storage

Before diving into the solutions, it is essential to understand how Laravel manages files and folders in its file system. Laravel has three primary paths for storing data: public/storage, app/storage (local storage), and storage/framework/cache. It recommends using storage/app for local files that are not intended for public access.

Approach 1: Using URLs with unlink()

When working with a file's path in Laravel, you can use the url() helper function to create an absolute URL. This is useful if you need to delete a file stored in storage/app using unlink(). However, it does not change the issue that the file is not deleted from the local storage.

Code Example 1:

<pre><code>use File    
$file_path = url().'/storage/app/jobseekers_cvs/'.$filename;
unlink($file_path);
</code></pre>

Approach 2: Using Paths with unlink()

Another option is to use your app's public path to access the local storage and then delete the file using the standard unlink() function. This ensures that both the web application and your server can see the changes, as Laravel's public folder is where the webserver reads files for public access.

Code Example 2:

<pre><code>use File    
$file_path = public_path().'/storage/app/myfolder/'.$filename;
unlink($file_path);
</code></pre>

Approach 3: Using Laravel's File Class to Delete a File

The best practice for handling file operations in Laravel is using the built-in File class. It provides dedicated methods for working with files and directories, ensuring your code is efficient, well-structured, and maintains compatibility across multiple versions of Laravel.

Code Example 3:

<pre><code>use File    
File::delete('/storage/app/myfolder/'.$filename);
</code></pre>

Conclusion

Deleting a file stored in storage/app using Laravel can be achieved through multiple methods, each with its unique set of pros and cons. Using the built-in File class is recommended for efficiency and accuracy. However, for ensuring your web application recognizes the change without affecting the local file system, use public_path().

Remember to always choose the most appropriate method depending on your use case, but remember, deleting a file from Laravel's storage/app folder does not mean it will also be deleted from the server. It is essential to ensure that you are aware of the file's location in your local system and act accordingly.

Thank you for visiting our blog at https://laravelcompany.com. Stay tuned for more informative content on Laravel development, best practices, and tutorials!
