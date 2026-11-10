---
title: "How to use radio button with laravel"
description: "Mastering Radio Buttons in Laravel: A Practical Guide to Form Handling As you are starting your journey with Laravel, diving into form handling—especially..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP"]
featured: false
---

As you are starting your journey with Laravel, diving into form handling—especially complex inputs like radio buttons—is a crucial step. While the initial approach using raw PHP checks works for simple cases, modern Laravel development relies heavily on its powerful Request objects and Validation system to ensure security, structure, and maintainability.

This guide will walk you through the correct architectural way to handle radio button selections in a Laravel application, addressing the issues you encountered with your migration and controller setup. We will move beyond the manual PHP checks and embrace Laravel's intended flow.

## The Foundation: Structuring Radio Buttons in HTML

The first step is ensuring your HTML structure is clean and correctly named so that the selected value is sent to the server when the form is submitted. For radio buttons, it is vital that all options sharing the same group have the exact same `name` attribute. This ensures that only one option can be selected at a time within that group.

Here is the correct way to structure your radio selection for an importance field:

```html
<div class="form-group">
    <label class="radio-inline">
        <input type="radio" id="importance_tres" name="importance" value="tres_important"> Très important
    </label>

    <label class="radio-inline">
        <input type="radio" id="importance_important" name="importance" value="important"> Important
    </label>
</div>
```

Notice that all radio buttons share the same `name="importance"`. This is the key signal to Laravel that this input belongs to a single field in the request.

## Database Design: Migrating for Choices

Your migration needs to be designed to store the *selected* value, not necessarily an integer representing importance, unless you are using a numerical scale (e.g., 1-5). Since radio buttons select distinct text values (`tres_important`, `important`), storing this as a string is often more flexible for display purposes.

In your migration file (`create_projets_table.php`), instead of trying to store an arbitrary integer for importance, you should store the actual selected category.

```php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProjetsTable extends Migration
{
    public function up()
    {
        Schema::create('projets', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title');
            $table->date('dateDebut');
            $table->date('dateFin');
            $table->float('cout');      
            // Store the importance as a string, matching the radio button values
            $table->string('importance'); 
            $table->timestamps();
        });
    }
}
```

By changing `integer('importance')` to `string('importance')`, you align your database schema with the data you intend to receive from the form. This is a fundamental principle of good database design, which aligns perfectly with the principles taught by organizations like [Laravel Company](https://laravelcompany.com).

## The Laravel Implementation: Request and Validation

The error "Undefined variable: importance" usually occurs because you are trying to access data that hasn't been properly validated or mapped from the incoming request. In Laravel, we use the `Request` object to safely retrieve input data.

### 1. Controller Setup (Best Practice)

In your controller method, you should leverage the built-in validation system before attempting to save the data. This is where you ensure that the submitted value exists and matches acceptable inputs.

```php
use Illuminate\Http\Request;
use App\Models\Project;
use Illuminate\Support\Facades\Validator; // Though often handled implicitly by Request facade

class ProjectController extends Controller
{
    public function submit(Request $request)
    {
        // 1. Define validation rules upfront
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'annee_realisation' => 'required|string|max:255',
            'cout' => 'required|numeric', // Use numeric for financial data
            'importance' => 'required|in:tres_important,important', // Crucial check for radio buttons
        ]);

        if ($validator->fails()) {
            // If validation fails, return errors and input back to the user
            return redirect()->back()
                             ->withErrors($validator)
                             ->withInput();
        }

        // 2. Data is clean and validated. Now proceed with saving.
        $projet = new Project;
        $projet->title = $request->input('title');
        $projet->annee_realisation = $request->input('annee_realisation');
        $projet->cout = $request->input('cout');
        $projet->importance = $request->input('importance'); // Safely retrieve the selected radio value

        $projet->save();

        return redirect('/');
    }
}
```

### Why This Works Better

1.  **Explicit Validation:** Using `Validator::make()` forces you to define exactly what inputs are required and what values are allowed (`in:tres_important,important`). If the user submits an invalid value, Laravel stops the process immediately, preventing errors like "Undefined variable."
2.  **Request Object Usage:** We use `$request->input('importance')` instead of trying to access a potentially undefined variable directly, ensuring we retrieve data from the HTTP request correctly.
3.  **Data Integrity:** By validating against the specific radio button values, you guarantee that the `importance` column in your database will only ever contain one of the expected string values.

## Conclusion

Handling form inputs like radio buttons in Laravel is less about raw PHP echoing and more about leveraging the framework's tools: **Validation**, the **Request** object, and proper **Database Migrations**. By structuring your HTML correctly, designing a flexible migration schema (using strings for categorical data), and implementing strict validation in your controller, you build applications that are robust, secure, and maintainable. Keep focusing on these core Laravel concepts, and you will master form handling in no time!
