---
title: "How to upload multiple image in laravel"
description: "Title: Efficiently Uploading Multiple Images in Laravel Without Creating Separate Tables Body: In today's digital world, images play an increasingly vital..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Google"]
featured: false
---

Title: Efficiently Uploading Multiple Images in Laravel Without Creating Separate Tables

Body:
<p>In today's digital world, images play an increasingly vital role in enhancing the user experience on websites and applications. Laravel, a popular PHP framework, provides developers with powerful tools to handle multimedia content. However, uploading multiple photos at once can be challenging for both backend and frontend developers. In this post, we will explore how to efficiently upload multiple images in a single row within your database table without creating separate tables or relationships.</p>

<h2>Anatomy of the Solution</h2>

The solution involves using Laravel's built-in file handling abilities and the use of JSON serialized data. The uploaded files will be stored as a JSON object in a single database column, allowing for easy integration with other functionalities and future scaling needs.

<h3>Step 1: Configure Storage Drivers</h3>
To facilitate the storage and organization of these images, it's vital to have proper file storage configurations. Laravel offers various storage drivers such as LocalDisk, S3, or custom drivers like Dropbox or Google Cloud Storage. It's advisable to use a scalable driver that can handle multiple uploads with ease.

<h3>Step 2: Modify the Database Model</h3>
Modify your database model by adding a new JSON field to store the image details, as shown below:

```php
<?php
// File Name: User.php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
class User extends Authenticatable implements HasPhotos {
    use HasFactory;

    protected $photos = [];

    // ... Remaining code

    /**
     * Get the photos for this user.
     */
    public function getPhotosAttribute($value) {
        if (is_null($value)) {
            return [];
        }

        return collect((array) $value)->map(function ($asset) use ($user, $disk) {
            return $this->getPhotoPublicUrl($asset);
        });
    }

    /**
     * Set the photos for this user.
     */
    public function setPhotosAttribute($value) {
        if (is_null($value)) {
            $this->attributes['photos'] = null;
        } else {
            $diskName = config('filesystems.default');
            $assets = collect((array) $value)->map(function ($asset) use ($user, $disk) {
                return Storage::put($diskName . '/' . $user->id . '/' . $asset, file_get_contents($asset), 'public');
            });
            $this->attributes['photos'] = $assets;
        }
    }
}
```
<p>The User model has been modified to include a protected array for storing the photos. Additionally, we have defined two functions: getPhotosAttribute and setPhotosAttribute.</p>

<h3>Step 3: Create the Form Input Fields</h3>
To upload multiple images at once, we will create a form field that allows the user to select multiple files simultaneously. This can be achieved with HTML5 and Laravel's Blade template engine as shown below:

```html
<form method="post" action="/upload">
    @csrf
    <input type="file" name="photos[]" multiple />
    <!-- Other form fields -->
</form>
```

<h3>Step 4: Handle Multiple File Uploads</h3>
Once the user submits the form, our controller will handle the file upload process. We can create a method to store and manage the uploaded images in our database model. Below is how it might look:

```php
<?php
// File Name: UserController.php
namespace App\Http\Controllers;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller {
    public function uploadPhotos(Request $request) {
        // Validate and process the request as needed
        if ($files = $request->file('photos')) {
            foreach($files as $file) {
                $diskName = config('filesystems.default');
                $assetPath = Storage::put($diskName . '/' . $user->id . '/' . $file, file_get_contents($file), 'public');
                $this->setPhotosAttribute([$assetPath]);
            }
        }
    }
}
```
<p>We iterate through the uploaded files, store them on our desired storage driver, and set the photos attribute in our database model with updated JSON data.</p>

<h3>Step 5: Display Images in Your View</h3>
Finally, you can display the images on your views by simply looping through the photos attribute of the User model. Here's a sample code for that:

```html
@foreach($user->photos as $photo)
    <img src="{{ asset('storage/' . $user->id . '/' . $photo) }}" />
@endforeach
```
<p>The images can be displayed using the public URLs generated by Laravel for your storage driver.</p>

Conclusion:
With these steps, you now have a robust and efficient solution to upload multiple images in a single row within a database table without introducing separate tables or establishing relationships. By leveraging JSON serialized data and Laravel's built-in functionalities, you can manage large image libraries with ease while promoting scalability and flexibility.
