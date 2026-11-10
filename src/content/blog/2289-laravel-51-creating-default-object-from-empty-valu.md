---
title: "Laravel 5.1 Creating default object from empty value"
description: "Title: Resolving \"ErrorException in AdminController.php line 108: Creating default object from empty value\" Error in Laravel 5.1 Body: When developing web..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Title: Resolving "ErrorException in AdminController.php line 108: Creating default object from empty value" Error in Laravel 5.1

Body:
<p>When developing web applications with the Laravel 5.1 PHP framework, it's common to encounter errors while handling requests and updating records. One such issue that developers may face is the "ErrorException in AdminController.php line 108: Creating default object from empty value." In this blog post, we will explore the possible reasons for this error and provide solutions to resolve it.</p>

<p><strong>Common Causes of the Error</strong></p>
- Accessing an undefined property in a Model or Controller. For example, if you are trying to access a non-existing attribute on a Product model, such as $product->unavailable_items, this will cause the error.
- Trying to update a record without providing the specific field values. Laravel assumes that all fields should be updated when no specific fields are mentioned in the request data. Therefore, it creates an empty object for any missing fields, which can lead to this error.

<p><strong>Steps to Resolve the Error</strong></p>
1. Analyze your code and identify where the error is occurring. Inspect your routes, controllers, and models to find the area that handles updating records as it is likely the source of the issue.
2. Check if you have any undefined properties in your Model or Controller code. Ensure each attribute has been declared with proper data type specifications.
3. Review your request data. Make sure all fields are provided correctly and match the relevant model attributes. If necessary, double-check that you're using proper field names to access Model attributes.
4. Update your routes and controllers to include explicit field updating when necessary. For instance, if only a few specific fields need to be updated in your Product record, make sure those are explicitly mentioned in the request data instead of letting Laravel assume all fields are being modified. This can be done by including the attribute names as keys in the request parameters or by using the PATCH method with JSON-encoded data.
5. If the error is caused by a different issue, ensure your server is running the latest and stable version of PHP to minimize chances of encountering such errors. Regularly run 'php artisan optimize' to ensure your application code is compiled correctly.
6. Test and retest your application to ensure the error has been resolved. Make sure valid and invalid updates have proper handling in place, with appropriate responses for both success and failure scenarios.

<p><strong>Conclusion</strong></p>
The "ErrorException in AdminController.php line 108: Creating default object from empty value" error can be resolved by following these steps to identify the root cause and implementing necessary changes. By ensuring your application code is well-structured, with proper data handling and field updating, you can minimize this error and provide a better user experience for your web app users. For more information on Laravel development, visit https://laravelcompany.com.

<p><strong>Code Examples</strong></p>
For example, to resolve the issue in your AdminController as shown earlier, you may adjust the update method to only modify the specified fields:

<pre><code>public function update(Request $request, $id) {
    $product = Product::find($id);
    
    // Only update the provided fields
    $product->name = Request::input('name');
    $product->description = Request::input('description');
    $product->price = Request::input('price');
    if (Request::hasFile('imageurl')) {
        $uploadedImageUrl = $request->file('imageurl')->store(config('settings.images_path'));
        $product->imageurl = $uploadedImageUrl;
    }
    
    $product-&gt;save();
    return redirect('/admin/no');
}
</code></pre>

In this revised code, only the specified fields are updated in the Product record to avoid creating an empty object. This ensures better data handling and reduces the chances of encountering the error.
