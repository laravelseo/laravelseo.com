---
title: "Attempt to read property \"title\" on null"
description: "Mastering Resource Management in Laravel: A Deep Dive into CRUD Operations and File Handling When developing dynamic web applications with Laravel, managing..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "PHP"]
featured: false
---

When developing dynamic web applications with Laravel, managing the persistence of data—creating, reading, updating, and deleting (CRUD) resources—is fundamental. This process involves a crucial interplay between Eloquent Models, Controller logic, and Blade templating. The provided code snippets illustrate a practical implementation of these concepts, specifically focusing on managing category data and file uploads within an administrative context.

This post will dissect the provided controller logic and the associated view structure, offering a developer's perspective on best practices for handling relational data and file storage in Laravel.

---

## 1. The Controller: Orchestrating Data Persistence

The foundation of any application lies in the controller, which acts as the intermediary between the request and the data layer (the Eloquent Model). We see two core methods here: `update` and `destroy`.

### Handling Updates (`update` method)

The `update` method demonstrates how to handle incoming form data for modifying an existing record.

```php
public function update(Request $request, Category $category, $id)
{
    $data = Category::find($id);
    $data->parent_id = $request->parent_id; // Handling relational data
    $data->title = $request->title;
    // ... other fields

    if ($request->file('image')) {
        // Best practice for file storage in Laravel: using the Storage facade
        $data->image = $request->file('image')->store('public/images');
    }
    $data->save();
    return redirect('admin/category');
}
```

**Developer Insight:** The key here is leveraging Eloquent's relationship capabilities. By fetching the model (`Category::find($id)`) and directly modifying its attributes before calling `$data->save()`, we ensure atomicity. Crucially, notice the file handling: instead of storing the file on the server directly, using the `Storage` facade (which interacts with configured disk drivers, like local storage or S3) ensures scalable and organized file management. This approach aligns perfectly with Laravel’s emphasis on clean, object-oriented design.

### Handling Deletions (`destroy` method)

The `destroy` method handles resource removal, requiring careful attention to associated files before deletion:

```php
public function destroy(Category $category, $id)
{
    $data = Category::find($id);
    if ($data->image) {
        // Safely deleting the associated file from storage
        Storage::delete($data->image); 
    }
    $data->delete();
    return redirect('admin/category');
}
```

**Developer Insight:** Before executing `$data->delete()`, we must address any related external resources. In this case, if a category has an associated image stored on the filesystem, we use the `Storage` facade to safely remove it. This prevents orphaned files and maintains data integrity, which is critical for robust application design, as promoted by Laravel’s focus on elegant solutions.

## 2. The View: Building Dynamic Forms with Blade

The provided `create.blade.php` snippet shows how the front-end interacts with the back-end logic to facilitate data entry. The structure uses Bootstrap classes and form elements to create a user-friendly interface.

### Managing Nested Data (Parent Selection)

The most complex part of this view is handling the "Parent Product" selection:

```html
<select class="form-control select2" name="parent_id">
    @foreach ($data as $rs)
        <option value="{{ $rs->id }}"> {{ \App\Http\Controllers\Admin\CategoryController::getParentsTree($rs, $rs->title) }}</option>
    @endforeach
</select>
```

**Developer Insight:** This demonstrates the power of server-side logic feeding dynamic client-side options. Instead of listing every category ID statically, we call a custom controller method (`getParentsTree`) to fetch and display only the relevant parent options. This keeps the form clean and enforces valid relational constraints before the data hits the database, adhering to the principle that complex business logic should reside in the Controller, not the View.

### File Upload Forms

The image upload section correctly uses `enctype="multipart/form-data"` on the main form tag to allow file transmission. The use of `input-group` and custom classes is a common pattern for enhancing user experience while ensuring necessary form structure.

## Conclusion: Adopting Laravel’s Ecosystem

The successful implementation of this CRUD workflow relies not just on writing functional PHP, but on adhering to architectural best practices. By utilizing **Eloquent** for data modeling, the **Storage** facade for file operations, and structuring controller logic cleanly, developers can build highly maintainable applications. As we continue to explore the vast ecosystem provided by resources like [Laravel Company](https://laravelcompany.com), focusing on these core principles ensures that our solutions are not only functional but also scalable, secure, and enjoyable to develop.
