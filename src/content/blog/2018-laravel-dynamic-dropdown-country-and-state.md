---
title: "Laravel dynamic dropdown country and state"
description: "Title: Dynamically Display Countries and States with Laravel Dropdowns Introduction: In your web application, you have created two dropdown menus to select..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "HTML", "PHP"]
featured: false
---

Title: Dynamically Display Countries and States with Laravel Dropdowns

Introduction: In your web application, you have created two dropdown menus to select countries and states from your database. You are currently facing an issue where when you choose a country, its associated states don't appear in the second dropdown menu. This blog post will provide an in-depth solution to this problem.

Step 1: Retrieve Country and State Data from the Database
Firstly, you need to retrieve all the country names and state names from your database. In your AdminController.php file, add the following code snippet to get the data:

<pre><code>public function user_register()
{
    $countryname = DB::table('countries')
        ->get();
    $statename = DB::table('states')
        ->get();

    ...
}
</code></pre>

Step 2: Use Ajax to Dynamically Update the State Dropdown
To make the state selection dependent on the chosen country, we can use AJAX. You can replace the HTML code for both dropdowns with the following snippet in your user_register.blade.php file:

<pre><code>&lt;select class="form-control" id="countries" name="countries"&gt;
    &lt;option value=""&gt;Please select&lt;/option&gt;
        &lt;?php foreach ($countryname as $key=&gt;$countryname): ?&gt;
        &lt;option value="&lt;?php echo $countryname-&gt;sortname; ?&gt;"&lt;?php
         if (isset($countries) &amp;&amp; Input::old('countries') == $countryname-&gt;sortname)
         {
             echo 'selected="selected"';
         }
         ?&gt;&gt;
        &lt;?php  echo $countryname-&gt;sortname ." - ". $countryname-&gt;name  ; ?&gt;
    &lt;/option&gt;
    &lt;?php endforeach; ?&gt;
&lt;/select&gt;


&lt;select class="form-control" id="states" name="states"&gt;
    &lt;option value=""&gt;Please select&lt;/option&gt;
        &lt;?php foreach ($statename as $key=&gt;$statename): ?&gt;
        &lt;option value="&lt;?php echo $countryname-&gt;name; ?&gt;" &lt;?php
        if (isset($states) &amp;&amp; Input::old('states') == $statename-&gt;name)
        {
            echo 'selected="selected"';
        }
        ?&gt;&gt;
        &lt;?php  echo $statename-&gt;name; ?&gt;&lt;/option&gt;
        &lt;?php endforeach; ?&gt;
&lt;/select&gt;
</code></pre>

In the above code, we have used the HTML <select> element with AJAX to dynamically load the state options based on the selected country. We will update the states when a new country is chosen by using JavaScript and Laravel's Eloquent ORM. Each dropdown will keep its previous selection as well.

Step 3: Write JavaScript Code for Dynamic Dropdown Updates
Add the following JavaScript code to your user_register.blade.php file inside the relevant HTML tags:

<pre><code>&lt;script type="text/javascript"&gt;
    $(document).ready(function() {
        // Get country dropdown's selected value
        $('.countries').change(function() {
            var country_id = $(this).val();
            if (country_id) {
                $.get('{{ url('/filterStates/') }}/'+country_id, function(data) {
                    // Update the states dropdown with new options
                    $('.states').empty().append(data);
                });
            } else {
                window.location.href = '{{ URL::to("/") }}';
            }
        });
    });
&lt;/script&gt;
</code></pre>

This JavaScript code will listen to any change in the selected country and make an AJAX request to get states based on that country. Once it receives the updated list of states, it will empty the existing options in the state dropdown and replace them with the new ones.

Step 4: Add a Route for Filtering States by Country ID
Now we need a route that filters states based on their country_id value. Add the following route to your web.php file:

<pre><code>Route::get('filterStates/{countryId}', 'Controller@filterStates');</code></pre>

Finally, create a controller function named filterStates() and pass the required parameters to display the filtered states based on the country_id value:

<pre><code>&lt;?php namespace App\Http\Controllers;

class Controller extends BaseController {
    public function filterStates($countryId) {
        $states = \App\State::where('country_id', '=', $countryId)->get();

        return view('partials.dropdown', compact('states'));
    }
}
&lt;/code&gt;</pre>

This route will call the filterStates() function in your Controller, pass the country ID to it, and render a partial view with only the states dropdown options for this specific country. You can use a different file or blade template to create the partial view, but make sure you're passing the right data to it.

Conclusion: With these steps followed, your Laravel application now has dynamic dropdown menus that adapt based on the selected countries and states from your database. To ensure optimal performance, consider caching your state options for each country and updating them only when necessary.
