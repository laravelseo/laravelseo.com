---
title: "Laravel - Load common header and footer to view"
description: "Title: Loading Common Header, Footer, and Views in Laravel for Efficiency In modern web development, efficiency is a must have trait for application..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML", "PHP"]
featured: false
---

Title: Loading Common Header, Footer, and Views in Laravel for Efficiency

In modern web development, efficiency is a must-have trait for application development. One way of achieving this is by reusing common parts (like headers and footers) across multiple pages to prevent code duplication, improve readability, and facilitate future updates. In this comprehensive blog post, we will explore how Laravel, the popular PHP framework, facilitates loading a common template with header, footer, and views using controllers and views.

To begin, let's first establish the project structure:

1. Create a dedicated folder named 'includes' to hold our shared components (header, footer, etc.).
2. Include your application-specific layouts under the "resources/views" folder.
3. Ensure proper hierarchy for your views, such as 'admin' for administrative pages and 'dashboard' for displaying a dashboard view.

Next, let's write our controller code to handle common views:

```php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class Common extends Controller
{
    public function login()
    {
        $data['title'] = 'Dashboard';
        $data['template'] = 'admin/dashboard';
        return view('common_template', compact('data'));
    }
}
```

Here, we have a simple controller named "Common" with a 'login' action. This controller returns a view called 'common_template'. The template file will load the data from the 'login' action and then render the common layout.

Now let's create our shared header and footer templates:

Header (includes/header.blade.php):
```html
<!DOCTYPE html>
<!-- Your HTML or PHP code for your site header goes here -->

@section('header_content')
    @include('includes/navigation')
@show
```
Footer (includes/footer.blade.php):
```html
<!-- Your HTML or PHP code for your site footer goes here -->

@section('footer_content')
    @include('includes/footer')
@show
```

To load the common template, use the following view:
```html
<!-- includes/common_template.blade.php -->
<?php echo View::make('includes/header'); ?>

<?php $template = '"' . $data['template'] . '"'; ?>
<?php echo View::make($template); ?>

<?php echo View::make('includes/footer'); ?>
```

In the common_template.blade file, we call the header and footer templates by using the 'include' method from Laravel's View class, which essentially loads these shared components. Then, we use the $data['template'] variable to determine the specific view that contains our actual content to be displayed in the page. 

Finally, combine all of these elements:

1. Navigate to app/Http/Controllers/CommonController.php and add your controller code as described earlier.
2. Create the views for header, footer, and dashboard layouts under 'resources/views'.
3. Load your routes as follows:
    ```php
    Route::get('/', [CommonController::class, 'login']);
    ```
4. Open a browser tab and navigate to your application root URL (e.g., http://localhost:8000/) to see the dashboard view along with shared header and footer.

Once this setup is complete, you can easily add or remove content from any page by simply updating the 'login' action in the controller and changing the relative path for the template variable accordingly. This method promotes code reuse and saves development time.

In conclusion, Laravel's MVC structure facilitates separating business logic (controller) from presentation details (view). By implementing the correct view hierarchy and loading common templates from controllers, you can create efficient applications with minimal code duplication and improved readability.
