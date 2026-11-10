---
title: "save image in public folder instead storage laravel 5"
description: "Title: Save Images and Files in Laravel Public Folder Instead of Storage Body: In Laravel, to save your uploaded files or images in the public folder instead..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML", "PHP"]
featured: false
---

Title: Save Images and Files in Laravel Public Folder Instead of Storage

Body:
<p>In Laravel, to save your uploaded files or images in the public folder instead of storage, you need to make a few changes. The default Laravel configuration stores user-uploaded content in "storage/app" within the app directory. However, if that's not preferred, you can customize it for your project.</p>

<h3>Edit Your Config File</h3>
<p>The first step is to open the config/filesystem.php file, where you can modify how Laravel handles uploaded files and images. Make sure the 'disks' array includes a public disk configuration that points to your target directory.</p>

```php
'disks' => [
    //... existing disk configurations
    'public' => [
        'driver' => 'local',
        'root'   => storage_path('image'),
        'url'    => env('APP_URL') . '/public',
        'visibility' => 'public',
    ],
]
```
<p>Here, we've created the public disk configuration with a local driver and its root path set to storage/image. The URL is configured for accessing the public folder via your application's base URL.</p>

<h3>Modify Your Route and Controller</h3>
<p>Next, update your routes and controllers related to file uploading or image handling. Ensure that you use file-handling methods like $request->file('image') and image properties like $request->image->extension() and $request->image->store(). You can also save the records of uploaded files in a database table, such as pictbl.</p>

<h3>Create Your View</h3>
<p>In your view template, you can use Laravel's Form facade to handle file uploading along with image viewing. This allows you to display the uploaded images on the same page and save them in the desired location.</p>

```html
// In your view file:
{!! Form::open(['url' => 'saved','method' => 'post','files' => true]) !!}
    {!! Form::file('image') !!}
    {!! Form::submit('save') !!}
{!! Form::close() !!}
<img src="{{$patch}}" /> // View uploaded image using stored path from database table
```

<h3>Final Code Example</h3>
<p>Combining all the above steps, here's a complete example of saving images in the public folder:</p>

<h4>Route:</h4>
<pre><code>Route::get('pic',function (){
return view('pic.pic');
});
Route::post('saved','test2Controller@save');
</code></pre>

<h4>Controller:</h4>
<pre><code>public function save(Request $request)
{
    $file = $request->file('image');
    //Save format
    $format = $request->image()->extension();
    //Save full address of image
    $patch = $request->image()->store('images');

    $name = $file->getClientOriginalName();

    //Save on table
    DB::table('pictbl')->insert([
        'orginal_name' => $name,
        'format' => $base,
        'patch' => $patch
    ]);

    return response()
            ->view('pic.pic',compact("patch"));
}
</code></pre>

<h4>View:</h4>
<pre><code>{!! Form::open(['url' => 'saved','method' => 'post','files' => true]) !!}
    {!! Form::file('image') !!}
    {!! Form::submit('save') !!}
{!! Form::close() !!}
<img src="{{$patch}}" />
</code></pre>

<h3>Conclusion</h3>
<p>By modifying the config/filesystem.php file and adapting your routes, controllers, and views accordingly, you can manage to save uploaded images in Laravel's public folder instead of default storage locations. This approach allows for greater control over user-uploaded content and better visibility on your website.</p>
