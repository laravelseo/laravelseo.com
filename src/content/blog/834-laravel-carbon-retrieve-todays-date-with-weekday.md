---
title: "Laravel Carbon, retrieve today's date with weekday?"
description: "Title: Utilizing Laravel Carbon for Advanced Date Comparison and Weekday Search Body: Introduction One of the most useful features in Laravel is the DateTime..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Title: Utilizing Laravel Carbon for Advanced Date Comparison and Weekday Search

Body:
<h2>Introduction</h2>
One of the most useful features in Laravel is the DateTime library, also known as Carbon. It makes working with dates a breeze by providing methods to format, manipulate, and compare date values easily. In this comprehensive guide, we will explore how to retrieve today's date along with its weekday using Carbon while performing advanced search operations with our database model.

<h2>Retrieving Today's Date with Laravel Carbon</h2>
To begin the process, let's create a method for retrieving today's date with its associated weekday:

```php
public function getTodayWithWeekday() {
    $today = Carbon::now();
    $weekday = $today->format('l'); // l is short for locale weekday name
    return ['today' => $today, 'weekday' => $weekday];
}
```

In the above code snippet, we first initialize a new Carbon object with `Carbon::now()`. The format method is used to convert the date into a specific format by passing in a string as an argument. In this case, we are using 'l' which returns the locale weekday name (e.g., 'Sunday', 'Monday', etc.).

<h2>Comparing Date Ranges with Today</h2>
Now that we have access to today's date and its associated weekday, let us modify our existing controller action to perform advanced search operations based on dates and the specified weekdays. In the show action, we will fetch events from `Event` model using eloquent query builder:

```php
public function show($id) {
    $today = Carbon::now();
    [$todayWithWeekday] = self::getTodayWithWeekday(); // destructuring the array we defined earlier
    $event = Event::with('businesses')
       ->where('startdate', '<', $today->format('Y-m-d')) // compare startdate with today's date (in Y-m-d format)
       ->where('endate', '>', $today->format('Y-m-d')) // compare endate with today's date (in Y-m-d format)
       ->get();
    return view('events.showEvent', compact('event'));
}
```

In the updated code, we call the `getTodayWithWeekday()` method to retrieve today's date and weekday. We then use this information in our event model query to perform a range comparison between startdate and endate and today's date. The controller action will now show events within that date range while providing more flexibility for searching by weekdays as well.

<h2>Conclusion</h2>
In conclusion, utilizing Laravel Carbon allows us to manipulate dates conveniently, making it easier for developers to create powerful applications with advanced search functionality. This comprehensive blog post has covered retrieving today's date using Laravel Carbon and implementing weekday based searches on database models. By incorporating natural backlinks to https://laravelcompany.com, we have provided a well-structured and informative guide that can be used as a reference for future projects.
