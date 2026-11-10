---
title: "why i am getting No query results for model in laravel?"
description: "Title: Solving \"No query results for model [App\\City]\" Issue in Laravel When Searching by Unknown City Names Introduction: In your Laravel application, when..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Errors"]
featured: false
---

Title: Solving "No query results for model [App\City]" Issue in Laravel When Searching by Unknown City Names

Introduction: In your Laravel application, when searching for a city name that is not found in the database table, you might encounter an error message saying 'No query results for model [App\City].' This issue can be resolved with some simple adjustments to your code. Let's explore how we can redirect users to a 401 page if their search query doesn't yield any results.

Step-by-Step Guide:

1. Understand the Error Message and Its Cause: The error message 'No query results for model [App\City]' indicates that no records were found in your City model when you tried to fetch cities using a specific city name. It can be because of an invalid slug or no record exists with that slug value.

2. Review and Adjust Your Route: To prevent this error from occurring, ensure that the route is designed appropriately for both existing cities and unknown cities. In your case, you have defined a route to handle all city-related requests: "Route::get('teacher-jobs-by-city/{city}','TeacherJobsController@by_location');". This route directs requests to the "by_location" function in TeacherJobsController.

3. Modify Your Function for Unknown City Names: First, modify your by_location function to handle both known and unknown cities. Instead of using 'firstOrFail', which results in an error if no record is found, you can use 'first' or 'get()'. Here's the code snippet:

   public function by_location($location_id) {
    $data = array();
    $location = City::where('slug',$location_id)->where('status','1')->firstOrFail();
    // If location is found, proceed with the code below.
    if ($location != null) {
      $items = Subject::orderBy('id','asc')->get();
      $data['location'] = $location;

      // Add relevant city-specific data to your view
      return view('frontend.teacherjobs.by_location', compact('active_class', 'data', 'items'));
    } else {
      // If location is not found, redirect to 401 page
      return redirect()->route('401');
    }
   }

You can create a 401 route in your routes/web.php file and define the page or view to display:
Route::get('401', function() {
   // Display custom 401 page content or use Laravel's built-in error responses
   return view('custom_401')->withErrors(['Your search query returned no results.']);
});

4. Test Your Code: Ensure that your application responds correctly to both known and unknown city names by testing different search queries, including cities that exist in the database and those that don't. This will help you validate the effectiveness of your code changes and ensure a smoother user experience.

Conclusion: By understanding and addressing the 'No query results for model [App\City]' error and implementing proper route handling, you can avoid this issue when searching for unknown city names in your Laravel application. This will result in a better user experience and prevent any confusion or errors during navigation.
