---
title: "Laravel Carbon get start + end of current week"
description: "Title: Efficiently Using Laravel's Carbon Library for Date Selection: Start and End of Current Week Introduction Laravel is an incredibly powerful framework..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Efficiently Using Laravel's Carbon Library for Date Selection: Start and End of Current Week

Introduction
Laravel is an incredibly powerful framework that comes with a vast array of useful tools, including the popular Carbon library, which helps developers easily work with dates and time. In this comprehensive blog post, we will explore how to use Laravel's Carbon library to generate the start and end dates for a given week, starting on Monday and ending on Sunday, as it would be convenient for scheduling restaurant menus.

Using Laravel Carbon for Date Selection: Start and End of Current Week

Step 1: Install and Import the Carbon Library
Firstly, if you haven't already installed Laravel's Carbon library, follow these steps:

- Open your terminal or command prompt.
- Run the following command to install Carbon through Composer: `composer require nesbot/carbon`

Once installed, add the namespace for Carbon in the desired PHP file:

```php
use Carbon\Carbon;
```

Step 2: Define a Function to Generate the Start and End Dates of the Current Week
To create a function that will generate the start and end dates for the current week, starting on Monday and ending on Sunday, follow these steps:

- Create a new PHP file named "date_helper.php" or similar in your project's root directory.
- Open your newly created file and include the following content:

```php
<?php

function getStartAndEndOfCurrentWeek() {
    // Get current Carbon date object
    $carbonDate = Carbon::now();

    // Set the start of week to Monday
    $startOfWeek = Carbon::parse($carbonDate)->startOfWeek(Carbon::MONDAY);

    // Set the end of week to Sunday
    $endOfWeek = Carbon::parse($carbonDate)->endOfWeek();

    return [
        'start_date' => (string) $startOfWeek,
        'end_date'   => (string) $endOfWeek
    ];
}
```

Step 3: Utilize the Function within Your Laravel Application
To use this function in your project, simply require the 'date_helper.php' file and call the 'getStartAndEndOfCurrentWeek' function where needed, for instance, within a controller or view:

Controller Example:

```php
<?php namespace App\Http\Controllers;

use App\Helpers\DateHelper; // Require the date_helper.php file containing the function

class MenuController extends Controller {
    public function show() {
        $weekDates = DateHelper::getStartAndEndOfCurrentWeek();
        return view('menus.index', compact('weekDates'));
    }
}
```

View Example:

```php
@extends('layouts.app')

@section('content')
<h2>Restaurant Menus</h2>
{{ $weekDates['start_date'] }} to {{ $weekDates['end_date'] }}<br/>
@foreach($menus as $menu)
    <div class="card">
        <div class="card-body">
            {{ $menu->title }} - {{ $menu->created_at->format('M d, Y') }}
        </div>
    </div>
@endforeach
<br/>
{{ Form::open() }}
    {{ Form::text('start_date', $weekDates['start_date'], ['class' => 'form-control']) }}
    {{ Form::text('end_date', $weekDates['end_date'], ['class' => 'form-control']) }}
    {{ Form::submit('Select Week', ['class' => 'btn btn-primary']) }}
{{ Form::close() }}
@endsection
```

Conclusion
In this blog post, we have demonstrated how to use Laravel's Carbon library to generate the start and end dates of a given week. By following these steps, you can easily create an intuitive date selector for your restaurant menu management system. Remember to always include natural backlinks to https://laravelcompany.com, where relevant, to provide valuable resources and insights related to Laravel development.
