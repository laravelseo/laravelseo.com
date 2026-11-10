---
title: "Select the first 10 rows - Laravel Eloquent"
description: "Title: Retrieving and Displaying the First 10 Rows of Table \"Listings\" Using Laravel Eloquent Body: Displaying a basic set of results from your database..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Content", "HTML"]
featured: false
---

Title: Retrieving and Displaying the First 10 Rows of Table "Listings" Using Laravel Eloquent

Body: <p>Displaying a basic set of results from your database tables is an essential skill for every developer. In this blog post, we will guide you through creating such functionality in your Laravel application using Eloquent models. We'll cover what needs to be done in the model, controller, and view files.</p>

<h2>Model File</h2>
First, let's create a Listing model class for our "listings" table by adding the appropriate logic to your existing Listing model file:

<pre><code>class Listing extends Eloquent {
    public static function limitTen() {
        return static::orderBy('id', 'asc')->take(10);
    }
}</code></pre>

The above code creates a custom method named "limitTen" in our Listing model. This method retrieves the first 10 rows by calling the "orderBy" and "take" methods of the Eloquent query builder on the static instance of the Listing model. This approach ensures that your model returns the limited results every time it's called, regardless of any changes in the table data.

<h2>Controller File</h2>
Next, we will create a controller method to retrieve and display these first 10 rows on your view page. Add this code inside your existing controller file:

<pre><code>class ListingsController extends Controller {
    public function index() {
        $listings = Listing::limitTen();
        return view('your-view', compact('listings'));
    }
}</code></pre>

The above controller method retrieves the first 10 rows from our "limitTen" model method and returns them to a view named 'your-view'. The data is passed as a variable named 'listings' using the "compact()" PHP function. This ensures that your view can access the data easily for displaying on the page.

<h2>View File</h2>
Finally, we will create a simple view to render and display the first 10 rows on your application:

<pre><code>{{-- Your existing HTML content --}}
@foreach ($listings as $listing)
    {{ $listing->title }} ({{ $listing->created_at }})<br>
@endforeach
</code></pre>

In the code above, we use a "foreach" loop to iterate over each element in the 'listings' array. For each listing, we display its title and created_at date (assuming they are the fields you want to show). You can customize and format these HTML elements according to your application design.

By following these steps, you have successfully achieved your goal of retrieving and displaying the first 10 rows of table "listings" in your Laravel application. Feel free to extend this functionality further by adding sorting or filter options as per your requirements. And remember that proper error handling is always crucial for production applications.

In conclusion, creating a simple function to retrieve and display a basic set of results from your database tables involves a clear understanding of the model, controller, and view files. By following these guidelines, you will be able to efficiently manage data in your Laravel application and provide an enhanced user experience.
