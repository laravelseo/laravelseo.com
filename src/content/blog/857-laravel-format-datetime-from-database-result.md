---
title: "Laravel format DateTime from database result"
description: "Title: Laravel Format DateTime from Database Result: A Comprehensive Guide Body: Handling date and time data in your Laravel applications can be quite simple..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Content", "PHP"]
featured: false
---

Title: Laravel Format DateTime from Database Result: A Comprehensive Guide

Body:

Handling date and time data in your Laravel applications can be quite simple if you implement proper practices for data management. In this blog post, we'll explore how to convert database results of MySQL datetime format "YYYY-MM-DD HH:MM:SS" into other formats such as "DD.MM.YYYY HH:MM:SS" or "DD.MM.YYYY" and "HH1:MM1 - HH2:MM2". We'll also discuss the importance of keeping good MVC practices, providing code examples, and explaining relevant concepts like Carbon classes for handling date-time manipulations in Laravel.

Let's start by understanding how to convert a DateTime object from one format to another using Laravel's built-in functions. Firstly, you need to ensure that your database connection is properly configured. In your `config/database.php` file, update the "connection" information for your MySQL database:

```php
return [
    'default' => env('DB_CONNECTION', 'mysql'),
    'connections' => [
        'mysql' => [
            // ...
        ]
    ],
];
```

Now, let's create a new Laravel application and add some database entries:

```php
// In your controller class
use Illuminate\Support\Carbon;

public function index() {
    $date_begin = Carbon::now(); // Current date and time
    $date_end = Carbon::parse('2021-12-31 23:59:59'); // Future date and time

    $events[] = [
        'event' => 'First event',
        'date_begin' => $date_begin,
        'date_end' => $date_end
    ];

    // Store events in the database
    foreach ($events as $event) {
        Event::create($event);
    }
}
```

We have two date fields: `date_begin` and `date_end`. Now, we need to retrieve these dates from the database. Suppose you have a method called `getEvents()` that returns all the events data from your database. It will be something like this:

```php
public function getEvents() {
    $events = Event::all();

    return $events;
}
```

Now, let's modify our view to display these dates in the desired format and separate the date and time. For example, you want to show:

1. "DD.MM.YYYY" Format for Both `date_begin` and `date_end`:
   ```php
   @foreach ($events as $event)
     <tr>
       <td>{{ \Carbon\Carbon::parse($event->date_begin)->format('D.M.Y') }}</td>
       <td>{{ \Carbon\Carbon::parse($event->date_end)->format('D.M.Y') }}</td>
     </tr>
   @endforeach
   ```

2. "DD.MM.YYYY HH:MM:SS" Format for Both `date_begin` and `date_end`, Separating Date and Time with Custom String:
   ```php
   @foreach ($events as $event)
     <tr>
       <td>{{ \Carbon\Carbon::parse($event->date_begin)->format('D.M.Y') }} | {{ \Carbon\Carbon::parse($event->date_begin)->format('H:i') }}</td>
       <td>{{ \Carbon\Carbon::parse($event->date_end)->format('D.M.Y') }} | {{ \Carbon\Carbon::parse($event->date_end)->format('H:i') }}</td>
     </tr>
   @endforeach
   ```

Now, let's discuss MVC and why it is important for better application structure. The Model-View-Controller (MVC) pattern separates the business logic, data access, and user interface layers of your applications. This separation allows developers to easily maintain, test, and update different parts of the application without affecting other components. It also encourages code reuse and modularity.

To follow MVC principles in this scenario, you should perform date formatting operations in the Controller layer:

```php
// In your controller class
public function showEvents() {
    $events = Event::all();

    // Format dates here
    foreach ($events as $key => $event) {
        $date_begin = \Carbon\Carbon::parse($event->date_begin)->format('D.M.Y');
        $time_begin = \Carbon\Carbon::parse($event->date_begin)->format('H:i');
        $events[$key]->formatted_date_begin = "{$date_begin} | {$time_begin}";
    }

    return view('events.index', compact('events'));
}
```

Now, modify your view layout as follows:

```php
@foreach ($events as $event)
   <tr>
       <td>{{ $event->formatted_date_begin }}</td>
       <td>{{ $event->formatted_date_end }}</td>
   </tr>
@endforeach
```

By following MVC principles and using Carbon classes, you can achieve a well-structured Laravel application that provides better data management and format manipulation. For more information on the Carbon class and Laravel's built-in date/time tools, visit https://laravelcompany.com/blog/manipulating-dates-and-times-with-carbon-in-laravel for a comprehensive guide.
