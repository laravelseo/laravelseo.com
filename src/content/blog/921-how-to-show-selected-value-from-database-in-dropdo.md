---
title: "How to show selected value from database in dropdown using Laravel?"
description: "Title: Effortlessly Display Selected Value from Database in Laravel's Dropdowns Body: In Laravel, displaying a selected value from the database in a dropdown..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "HTML"]
featured: false
---

Title: Effortlessly Display Selected Value from Database in Laravel's Dropdowns

Body:

In Laravel, displaying a selected value from the database in a dropdown list on page load is a common task during form validation or data manipulation. The process involves three primary steps: retrieving data from the database, configuring the data for display, and rendering it with a Blade view. Let's dive into these steps in greater detail.

Step 1 - Retrieve Data from the Database
Within the controller, you need to fetch the data from the specific table in your database:

<pre><code>public function index()
{
 $country_data = DB::table('country')
    ->select('country_id', 'country_name')
    ->get();
 $profile_data = DB::table('profiles')
    ->select('*')
    ->where('id', $user_id)  // You need to pass the user ID here.
    ->first();
 return view('profile_update', compact('profile_data', 'country_data'));
}
</code></pre>

Here, we are retrieving all columns from the `profiles` table where `id` matches the given `$user_id`. We also retrieve data related to countries from the `country` table. The response includes a compact view with country_data and profile_data variables.

Step 2 - Configure Data for Display in the Dropdown
To display selected values in the dropdown list, we must first set up the correct HTML structure in our Blade view. In this case, we need to create a form that shows the options based on the database table:

<pre><code>&lt;select class="select4" name="country" id="country"&gt;
&lt;option value=""&gt;Please Select&lt;/option&gt;
 @foreach($country_data as $country)
 &lt;option value="{{$country->country_id}}" {{$profile_data->country == $country->country_id ? 'selected' : ''}}&gt;{{$country->country_name}}&lt;/option&gt;
 @endforeach&lt;/select&gt;
</code></pre>

Here, we use the Laravel Blade templating engine to iterate over the country data and display a list of countries in the dropdown. We have used the `country_id` column as the selected value and included a ternary operator condition to add a 'selected' attribute if the current profile's country matches the option's country name.

Step 3 - Render the Dropdown with a Blade View
The final step involves displaying the form in the HTML view: profile_update.blade.php.

<pre><code>&lt;form action="{{route('profile_store')}}" method="post"&gt;
    @csrf
    {{method_field('PUT')}}
    @include('partials._error')
    &lt;select class="select4" name="country" id="country"&gt;
        &lt;option value=""&gt;Please Select&lt;/option&gt;
        @foreach($country_data as $country)
            &lt;option value="{{$country->country_id}}" {{$profile_data->country == $country->country_id ? 'selected' : ''}}&gt;{{$country->country_name}}&lt;/option&gt;
        @endforeach&lt;/select&gt;
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    ... (other form fields)
    &lt;/form&gt;
</code></pre>

This example shows a comprehensive way to display selected values in the dropdown from Laravel's database. Note that there may be more efficient ways to accomplish this task, such as using Eloquent models. Moreover, you can also explore other features like select2 for advanced dropdown functionality or datatables for complex data visualization.

Conclusion: With these steps, you should now be able to show selected values from the database in a Laravel dropdown list on page load. Incorporate best practices and always keep your code clean and organized. For more resources, feel free to visit our website at https://laravelcompany.com for detailed tutorials and articles on Laravel development.
