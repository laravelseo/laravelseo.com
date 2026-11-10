---
title: "Laravel : To rename an uploaded file automatically"
description: "Title: Automatically Renaming Uploaded Files and Displaying Recent Uploads in Laravel Apps Body: Renaming Uploaded Files Renaming uploaded files can be done..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Title: Automatically Renaming Uploaded Files and Displaying Recent Uploads in Laravel Apps

Body:

<h2>Renaming Uploaded Files</h2>
Renaming uploaded files can be done for a variety of reasons, such as avoiding clashes in file names or maintaining privacy. Fortunately, this process is relatively simple using Laravel's built-in features and the provided code block gives us a glimpse of how it could have been implemented. However, the generated name ("php" followed by random string) might not be desirable if you want to maintain the original file name but with a new extension or modified name. To achieve this, follow this approach:

1. First, create an array for possible extensions and desired file formats (excluding the default ones). For example, in this case, we'll have ['pdf', 'docx']. Laravel's `str_random()` function can help generate random strings of a specified length for file names if needed.
2. Use Laravel's `Storage::disk('public')->put($fileName, file_get_contents($file));` to save the uploaded file with its modified name and original format. 
3. Replace your current code with the following one:

<code>if (Input::hasFile('file')){
    echo "Uploaded<br>";
    $file = Input::file('file');

    // Generate a new file name from the array of desired formats and extensions, replacing '.' with '_' in case of file format change.
    $fileName = str_random().'_'.uniqid().strtolower(array_rand($desiredFormats));

    // Specify the file extension based on the generated filename. Replace the original one if needed.
    $fileExtension = ($extension == 'original' ? '' : array_search(pathinfo($fileName, PATHINFO_EXTENSION), $desiredExtensions) !== false ? array_search(pathinfo($fileName, PATHINFO_EXTENSION), $desiredExtensions) : null);
    if ($fileExtension != null){
        $fileExtension = '_'.$fileExtension;
    }

    // Save the uploaded file with the modified name and original format.
    Storage::disk('public')->put($fileName.$fileExtension, file_get_contents($file));
}</code>

This approach will generate a new file name with an extension specified in your desired extensions array while maintaining its original format. The process is also applied to the file names in the database and when other users download the files.

<h2>Showing Recently Uploaded Files</h2>
You can display recently uploaded files using Laravel's `Storage::disk('public')->allFiles('uploads')` method, which returns an array containing all the file names within a specified directory. To show the most recent ones on your page, you can perform simple sorting operations like:

<code>$recentUploads = Storage::disk('public')->allFiles('uploads');
sort($recentUploads);
array_reverse($recentUploads);</code>

This will place the most recent file at the top of the list. Now you can loop through this array to show a list of recently uploaded files on your page. To make them downloadable, you can add links with the actual filenames as anchors pointing to the public storage path:

<code>foreach ($recentUploads as $file) {
    echo "<p><a href='/storage/".$file."'>Download ".$file."</a></p>";
}</code>

Remember that if you're using this code in a user-facing page, you should validate the file extension and format to prevent potential security issues.

Conclusion:
In summary, renaming uploaded files allows you to maintain privacy, avoid name clashes, and have a more organized storage system for your application. By combining Laravel's features and proper coding practices, you can successfully achieve this goal and also display recently uploaded files on your page for your users' download.
