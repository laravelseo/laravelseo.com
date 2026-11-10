---
title: "How to create a text file and a JSON with laravel 4 framework?"
description: "Title: Effortlessly Create and Upload Text and JSON Files Using Laravel 4 Framework Introduction: Laravel is an incredibly powerful PHP framework that..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "JavaScript", "PHP"]
featured: false
---

Title: Effortlessly Create and Upload Text and JSON Files Using Laravel 4 Framework

Introduction: Laravel is an incredibly powerful PHP framework that enables developers to build robust web applications with ease. In this blog post, we will explore the process of creating and uploading a text file (.txt) and a JavaScript Object Notation (JSON) file using Laravel 4. We'll also discuss how to handle these files from a developer's perspective and provide relevant code examples for better understanding.

1. Creating and Uploading a Text File:
To create and upload a text file, we will employ the built-in storage functionality in Laravel. Follow these steps:

a. Create a controller called `FileController` with the function to create and upload the file to handle both .txt and JSON files:
```php
// app/Http/Controllers/FileController.php
<?php namespace App\Http\Controllers;
class FileController extends BaseController {
    public function createFile(Request $request) {
      // Logic for creating and uploading files goes here.
    }
}
```

b. Create a form for the user to input file details:
```php
// resources/views/file-form.blade.php
@extends('layout')
@section('content')
  <h2>Upload File</h2>
  {{ Form::open(['action' => 'FileController@createFile', 'method' => 'post', 'enctype' => 'multipart/form-data']) }}
    @csrf
    {{-- Input fields for the file name and description --}}
    <div class="input-group">
      <span class="input-group-addon">File Name</span>
      {{ Form::text('file_name', null, ['class' => 'form-control']) }}
    </div>
    <br />
    {{-- Input file field to choose the file --}}
    {{ Form::file('file') }}
    {{-- Button to submit the form --}}
    {{ Form::submit('Upload', ['class' => 'btn btn-primary']) }}
  @include ('layouts.errors')
  {{ Form::close() }}
@endsection
```

c. In the `createFile` function in your controller, handle the request and create a text file:
```php
// app/Http/Controllers/FileController.php
<?php namespace App\Http\Controllers;
class FileController extends BaseController {
    public function createFile(Request $request) {
      // Handle file upload and other logic goes here.
      if ($request->hasFile('file')) {
        // Get the uploaded file
        $file = $request->file('file');
        // Save the filename and extension as 'name' and 'extension', respectively
        list($name, $extension) = explode('.', $file->getClientOriginalName());
        // Generate a new name for the saved file to avoid overwriting existing files
        $random_string = str_random(5);
        $fileNameToStore = md5($random_string . $file->getClientOriginalName()) . '.' . $extension;
        // Save the uploaded text file with the new name to disk
        $file->move(public_path('uploads'), $fileNameToStore);
        // If it's a JSON file, handle its creation and upload. Otherwise, return a successful response.
        if ($request->input('file_type') == 'json') {
          // Create a new JSON representation of the content (may require additional logic depending on your needs)
          $content = json_encode($data);
          // Save the JSON file with the same name but with '.json' extension
          Storage::disk('local')->put($fileNameToStore, $content);
        } else {
          return redirect()->back();
        }
      } else {
        return redirect()->back();
      }
    }
}
```

2. Creating and Uploading a JSON File:
The process of uploading a JSON file is similar to the one described above, with slight modifications in the HTML form, controller logic, and handling the specific JSON content. Here's an example for creating and uploading a JSON file using Laravel 4:

a. Create a controller named `JsonFileController` with the function to handle the creation and upload of JSON files:
```php
// app/Http/Controllers/JsonFileController.php
<?php namespace App\Http\Controllers;
class JsonFileController extends BaseController {
    public function createJsonFile(Request $request) {
      // Logic for creating and uploading files goes here.
    }
}
```

b. Create a form to input file details:
```php
// resources/views/json-file-form.blade.php
@extends('layout')
@section('content')
  <h2>Upload JSON File</h2>
  {{ Form::open(['action' => 'JsonFileController@createJsonFile', 'method' => 'post', 'enctype' => 'multipart/form-data']) }}
    @csrf
    {{-- Input fields for the file name and description --}}
    <div class="input-group">
      <span class="input-group-addon">File Name</span>
      {{ Form::text('file_name', null, ['class' => 'form-control']) }}
    </div>
    <br />
    {{-- Input file field to choose the JSON file --}}
    {{ Form::file('json_file') }}
    {{-- Button to submit the form --}}
    {{ Form::submit('Upload', ['class' => 'btn btn-primary']) }}
  @include ('layouts.errors')
  {{ Form::close() }}
@endsection
```

c. In your controller, handle the request and create a JSON file:
```php
// app/Http/Controllers/JsonFileController.php
<?php namespace App\Http\Controllers;
class JsonFileController extends BaseController {
    public function createJsonFile(Request $request) {
      // Handle file upload and other logic goes here.
      if ($request->hasFile('json_file')) {
        // Get the uploaded file
        $file = $request->file('json_file');
        // Generate a new name for the saved JSON file to avoid overwriting existing files
        $random_string = str_random(5);
        $fileNameToStore = md5($random_string . $file->getClientOriginalName()) . '.json';
        // Save the uploaded JSON file with the new name to disk
        $file->move(public_path('uploads/json'), $fileNameToStore);
      } else {
        return redirect()->back();
      }
    }
}
```

Conclusion: By following these steps, you can easily create and upload text (.txt) and JSON files in Laravel 4 framework. To demonstrate the process, we've created a file controller to handle both .txt and JSON file creation and uploading, as well as providing HTML forms for user input. Remember to incorporate appropriate error handling and validation, ensuring a seamless experience for your users.
