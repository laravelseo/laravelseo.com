---
title: "The PUT method is not supported for this route. Supported methods: GET, HEAD, POST. in laravel"
description: "Title: Fixing PUT Method Issues for Resource Updates in Laravel Applications In your project, you're likely facing an issue where when you click the submit..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "PHP"]
featured: false
---

Title: Fixing PUT Method Issues for Resource Updates in Laravel Applications

In your project, you're likely facing an issue where when you click the submit button for updating a resource - be it editing or saving product details, you get the message "The PUT method is not supported for this route. Supported methods: GET, HEAD, POST." This can happen due to several reasons related to your code, routing configuration, and HTTP methods being used while creating and submitting forms.

To fix the issue, follow these steps:
1. Analyze your controller method signatures
In the given code block above, you're using `Request $request` for both `ProductController@edit()` and `ProductController@update()`. However, you should use different HTTP verbs when dealing with GET or PUT requests. In this case, change the methods' declarations to accept `GET`, `HEAD`, `POST`, respectively:
```php
public function edit($id)
{
    $product = Product::find($id);
    return view('product.edit', compact('product'));
}

/**
* Show the specified resource.
*
* @param  int  $id
* @return \Illuminate\Http\Response
*/
public function show($id)
{
    $product = Product::find($id);
    return view('product.show', compact('product'));
}

/**
* Update the specified resource in storage.
*
* @param  \Illuminate\Http\Request  $request
* @param  int  $id
* @return \Illuminate\Http\Response
*/
public function update(Request $request, $id)
{
    $product = Product::find($id);
[...]
```
2. Update your `web.php` routes
Modify the routes to reflect these changes:
```php
Route::get('/index', 'ProductController@index'); // seller view all product

Route::get('/create', 'ProductController@create'); // seller create new product
Route::post('','ProductController@store')-&gt;name('product.store'); //store in database

Route::get('/edit/{id}','ProductController@edit'); // seller edit post
Route::put('{id}', 'ProductController@update')-&gt;name('product.update'); //seller update (PUT method)
```
Now, instead of using `Request $request`, you have specified the HTTP verb in your routes. This ensures that the method being called matches the corresponding route and prevents any discrepancies between the submitted request's method and the code handling it. The `{id}` parameter in the `Route::put('{id}', ...)` allows for a direct mapping from URL to the controller method, improving readability and maintainability of your Laravel application.
3. Change the form action attribute
Finally, alter your edit.blade.php file's form code:
```html
<form action="{{route('product.update', $product->id)}}" method="post" enctype="multipart/form-data">
        {{csrf_field()}}
        {{method_field('put')}} 
[...]

<button type="submit" class="btn btn-success" name="update">Submit</button>
```
Replace the controller's action with the route for updating resources. This ensures that the submitted form data reaches the correct method and is handled accordingly. Additionally, using `{{method_field('put')}}` explicitly declares the HTTP verb being used in your form submission - essential to work seamlessly with your updated code.

These changes should fix your issue. The PUT method will now be appropriately supported for updating resources as defined by Laravel's routing and controller configuration, while maintaining a clear separation of responsibilities between them.
