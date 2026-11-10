---
title: "Create and save csv to storage in Laravel"
description: "Title: Efficiently Create, Save, and Update CSV Files in Laravel for Storage and Database Management Introduction: In this article, we'll provide a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Efficiently Create, Save, and Update CSV Files in Laravel for Storage and Database Management

Introduction: In this article, we'll provide a comprehensive guide on generating and saving CSV files to storage while updating related database records using Laravel. We'll cover some code examples and best practices, along with an explanation of common roadblocks and solutions.

Body:

1. Prepare the Data for Export: Before creating and saving the CSV file, ensure you have the appropriate data ready in a format that can be easily converted to CSV. If your data source is a Laravel Eloquent model (User, in this case), you can use the `all()` method to fetch all records for exporting.

   ```php
   $users = User::all();
   ```

2. Define File Headers and Columns: Set the file headers and columns that will appear in your CSV file. This can be achieved by creating an array containing the appropriate column names.

   ```php
   $headers = [
       'Content-type'        => 'text/csv',
       'Content-Disposition' => 'attachment; filename=test.csv',
       'Pragma'              => 'no-cache',
       'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
       'Expires'             => '0'
   ];

   $columns = [
       'First Name',
       'Email'
   ];
   ```

3. Create the CSV File: Using Laravel Streaming, create a PHP anonymous function to generate the CSV file and save it on the server. This function will handle opening the file output stream, adding headers, looping through the user records, and appending them as rows in the CSV file.

   ```php
   $callback = function() use($users, $columns) {
       $file = fopen('php://output', 'w');
       fputcsv($file, $columns); // Add headers

       foreach ($users as $user) {
           $row['First Name']  = $user->first_name;
           $row['Email']    = $user->email;

           fputcsv($file, array($row['First Name'], $row['Email'])); // Add rows
       }

       fclose($file); // Close the file stream
   };
   ```

4. Save and Update Database Records: To save the generated CSV file to storage and update the database records simultaneously, you can add a new instance of your model (UserDocument) with relevant information (name, file path, etc.). Then, save it to the database and return an appropriate response for user feedback.

   ```php
   $fileModel = new UserDocument;

   if ($callback) {
       $filePath = $callback->storeAs('uploads', 'test.csv', 'public'); // Store CSV file in storage

       $fileModel->name = 'test.csv';
       $fileModel->file_path = '/storage/' . $filePath;
       $fileModel->save(); // Save model to database

       return back()
           ->with('success', 'File has been uploaded.') // Show success message
           ->with('file', $fileName); // Pass filename for user reference
   }

   
   Note: You might encounter the error "Call to a member function storeAs() on resource" or something similar. This is because you need to ensure that the callback variable is passed as an argument of your controller action. Add $callback as the first parameter in the function definition, and it should work correctly.

5. Conclusion: By following these steps, you've successfully created a comprehensive solution for generating CSV files in Laravel, saving them to storage, and updating database records. This approach will help ensure your data remains consistent across various systems while also providing the convenience of downloading or exporting it for users.
