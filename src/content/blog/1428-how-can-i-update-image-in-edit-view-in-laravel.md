---
title: "How can I update image in edit view in laravel?"
description: "Updating Profile Picture in Laravel Edit View In Laravel, updating profile pictures while editing can be achieved using the correct approach. You need to..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML"]
featured: false
---

In Laravel, updating profile pictures while editing can be achieved using the correct approach. You need to incorporate some logic in your code and Blade files that handles both uploading new images and keeping existing ones when not necessary. Here is a comprehensive breakdown of how it can work.

<h2>Blade File</h2>

The view for editing an employee profile should include inputs for the personal details as well as the image input with the appropriate code to display the current profile picture. Your Blade file might look like this:

```HTML
@extends('layouts.app')

@section('content')
    <div class="container">
        <h2 class="text-center mb-4 font-weight-normal">Edit Employee Profile</h2>

        @if(Session::get('Success'))
            <div class="alert alert-success">
                {{ Session::get('Success') }}
            </div>
        @endif

        <!-- Display the current profile picture -->
        @foreach ($empProfilePic as $empProfilePicture)
            @if($employee->id == $empProfilePicture->id)
                <img src="uploads/images/{{ $empProfilePicture->file }}" id="profile-img-tag" height="100" width="100">
            @endif
        @endforeach

        <!-- Form for editing personal details and uploading image -->
        <form action="{{ route('employees.update', $employee->id) }}" method="post" enctype="multipart/form-data">
            @csrf
            @method('PUT')
            <div class="row">
                <!-- Personal details inputs and labels -->
                <div class="col-md-6">
                    @include('includes.personal_details_inputs', ['emp' => $employee])
                </div>
                <div class="col-md-3">
                    <label for="photo" style="margin-top: 2rem; font-size: 16px;">Profile Picture :<span class="danger">*</span></label>
                </div>
                <!-- Image input and div to display current image -->
                <div class="col-md-9">
                    <input type="file" name="file" id="file" class="form-control">
                </div>
                <div class="col-md-3">
                    @foreach ($empProfilePic as $empProfilePicture)
                        @if($employee->id == $empProfilePicture->id)
                            <img src="uploads/images/{{ $empProfilePicture->file }}" id="profile-img-tag" height="100" width="100">
                        @endif
                    @endforeach
                </div>
                <!-- Submit button -->
                <button type="submit" class="btn btn-primary float-right">Update Employee</button>
            </div>
        </form>
    </div>
@endsection
```

<h2>Controller File</h2>

In your controller file, you can handle the updating process. For each employee update, verify if a new image is uploaded or not. If there's no image file attached, use the current profile picture, otherwise store and set the new image path. Here's an example:

```PHP
public function updateEmployee(Request $request, $id)
{
    // Rest of your code

    // Store Image In Folder
    $file = $request->file('file');
    if ($file != null) {
        $name = $file->getClientOriginalName();
        $file->move('uploads/images', $name);

        // Update Image in Database
        $employee->file = $name;
    } else {
        foreach ($empProfilePic as $empProfilePicture) {
            if ($employee->id == $empProfilePicture->id) {
                $name = $empProfilePicture->file;
                break;
            }
        }
        $employee->file = $name;
    }

    // Continue the rest of your code to update and save the employee details.
}
```

By combining these two files, you can successfully allow users to edit an employee's personal information while maintaining their profile picture either by uploading a new one or keeping the existing one. For more comprehensive examples, please refer to Laravel documentation for working with file uploads and images.
