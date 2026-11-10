---
title: "Class 'App\\Models\\Student' not found when trying to acces model"
description: "Resolving the Dreaded Error: Why 'Class 'App\\Models\\Student' not found Happens in Laravel Welcome to the world of Laravel! As you dive into building dynamic..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Welcome to the world of Laravel! As you dive into building dynamic applications with Eloquent Models, it’s completely normal to encounter frustrating errors like "Class not found." This specific issue—where your application can't locate a model class despite seemingly correct file structure—is one of the most common hurdles for newcomers.

As a senior developer, I can tell you that this error is almost never about the code *inside* your class; it’s usually a problem with how PHP and the Laravel framework are set up to **autoload** those classes. Let's break down exactly why you are seeing "Class 'App\Models\Student' not found" and how to fix it permanently.

## The Root Cause: Namespaces, Autoloading, and Directory Structure

When you try to use `new Student;` or access a model via route binding, PHP needs to know where to find the definition for that class. This process is handled by an autoloader, which maps namespaces to file paths.

In a standard Laravel installation, models are expected to reside in a specific location and follow strict namespace conventions.

### 1. The Correct Directory Structure

Laravel follows a convention where all application-specific classes (Models, Controllers, Services) must be placed within the `app` directory. Specifically, Eloquent Models should live in the `app/Models` subdirectory.

**Incorrect Setup (Likely causing your error):**
If you place your model file directly under `app/Student.php`, PHP will look for it under the namespace structure, which defaults to `App\Student`. When you try to call `App\Models\Student`, the file simply doesn't exist in that location.

**Correct Setup:**
Your model file must be located at: `app/Models/Student.php`

### 2. Namespace Alignment is Key

The namespace declared at the top of your PHP file **must** match the directory structure you are using.

If your file is at `app/Models/Student.php`, the namespace declaration *must* be:

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    // ... model content
}
```

By correctly aligning the `namespace` declaration with the physical file path, you allow Laravel’s underlying PSR-4 autoloading mechanism to find and load the class when you reference it (e.g., `App\Models\Student`). This adherence to structure is fundamental to efficient development in Laravel, as emphasized by best practices found on sites like [laravelcompany.com](https://laravelcompany.com).

## Reviewing Your Code Snippets

Let's examine the code you provided to see where the disconnect lies:

**Your Controller:**
```php
use App\Student; // This import assumes Student is in the root App namespace, which is incorrect if models are in Models folder.
// ...
$student = new Student; // Fails because the class wasn't found via autoloading.
```

**Your Model (as provided):**
```php
namespace App; // Declares the model lives directly under 'App'.

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $table = 'students';
    protected $fillable = ['name', 'course'];
}
```

The conflict here is that your controller imports `App\Student`, but the model file structure expected by Laravel (and PSR-4) dictates that if you are using models, they should be in `app/Models`.

## The Solution: Correcting the Setup

To resolve the "Class not found" error, follow these steps:

**Step 1: Relocate the Model**
Move your `Student.php` file from wherever it currently resides to the standard location: `app/Models/Student.php`.

**Step 2: Update the Namespace**
Ensure the namespace inside that file reflects its new location:

```php
// app/Models/Student.php
namespace App\Models; // <-- Crucially, this must reflect the directory path!

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $table = 'students';

    protected $fillable = ['name', 'course'];
}
```

**Step 3: Update the Controller Import**
Update your controller to import the model using its correct, full namespace path:

```php
// In ApiController.php
use App\Models\Student; // Correctly references the model in the Models folder!

class ApiController extends Controller
{
    public function createStudent(Request $request) {
        $student = new Student; // Now this will work because autoloading is correct.
        $student->name = $request->name;
        $student->course = $request->course;
        $student->save();

        return response()->json([
            "message" => "student record created"
        ], 201);
    }
}
```

## Conclusion

The error you encountered is a classic case of misaligned namespace expectations, not a deep flaw in Eloquent itself. By strictly adhering to Laravel’s convention—placing models in the `app/Models` directory and ensuring their namespaces match that structure—you ensure that the framework's autoloader can successfully map class names to physical files. Always prioritize following established patterns; it saves countless hours of debugging later on. Keep building with confidence, and remember that good structure is the foundation for robust Laravel applications!
