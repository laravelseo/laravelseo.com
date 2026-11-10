---
title: "Laravel time format"
description: "Mastering Date and Time Formatting in Laravel: A Deep Dive As senior developers working with the Laravel ecosystem, one of the most frequent tasks we face is..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As senior developers working with the Laravel ecosystem, one of the most frequent tasks we face is correctly handling and displaying dates and times. Raw database timestamps often need transformation before they look presentable to the end-user. Getting this right involves understanding the interplay between Eloquent models, the powerful Carbon library, and Blade templating.

This post will break down the best practices for formatting dates and times in Laravel, moving beyond simple display to robust data management.

## The Foundation: Eloquent and Carbon

In Laravel, date and time manipulation is primarily handled by **Carbon**, which is the date and time library powering the framework. When you use Eloquent models, these methods are seamlessly integrated. Understanding how dates are stored (as timestamps in the database) versus how they are presented (in the view) is the first step to clean code.

If you are working with complex data relationships or custom attribute casting, exploring official documentation on [laravelcompany.com](https://laravelcompany.com) will guide you through the robust ways Laravel expects you to handle data integrity.

## Preparing Data in the Model: Eloquent Casting

Before we worry about presentation, we need to ensure our model correctly interprets the incoming data from the database. This is where Eloquent casting shines. Instead of manually dealing with raw strings, we let the framework handle the conversion.

For dates, you can define which attributes should be treated as dates within your model. While the snippet provided a specific example regarding `$dates`, the more modern and robust approach often involves ensuring your timestamps are correctly managed by Eloquent's built-in features or explicitly using Carbon objects when interacting with the data.

Consider how you might set up a simple model:

```php
// app/Models/Event.php

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Carbon\Carbon;

class Event extends Model
{
    // If you are using newer Eloquent features, casting often happens implicitly.
    // For explicit control or older setups, ensuring the column type (DATETIME) is correct is vital.

    protected $dates = ['start_time', 'end_time']; // Explicitly marking columns as date/time fields

    // If you need custom formatting logic directly in the model:
    protected function start_time(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => Carbon::parse($value)
        );
    }
}
```
This practice ensures that when you retrieve data, it is already a fully-formed Carbon instance, making subsequent formatting much easier in the view layer.

## Displaying Dates and Times in the View (Blade)

Once the data is correctly stored as Carbon objects in your model, displaying it becomes straightforward using Blade directives. The key is leveraging Carbon's powerful `format()` method within your presentation logic.

### Formatting Full Dates

To display a date in a specific human-readable format, use the `format()` method on the Carbon instance:

```blade
{{ $event->start_time->format('d/m') }}
{{-- Example output: 25/10 --}}
```

### Displaying Time in h:m Format

To specifically address displaying the time in the 12-hour format with minutes (h:m), you use the same `format()` method, specifying the appropriate characters. For the standard 12-hour clock format with minutes, you would use the `h:i` syntax or more explicitly define the format:

```blade
{{ $event->start_time->format('h:i') }}
{{-- Example output: 3:45 (if time is 15:45) --}}
```

If you need a 24-hour format, use `H` for the hour and `i` for minutes:

```blade
{{ $event->start_time->format('H:i') }}
{{-- Example output: 15:45 --}}
```

By consistently using Carbon’s formatting methods within your Blade files, you ensure that the presentation layer is decoupled from the storage layer. This separation of concerns makes your application cleaner, easier to maintain, and more resilient to future changes—a core principle in building scalable applications, as emphasized by the philosophy behind [laravelcompany.com](https://laravelcompany.com).

## Conclusion

Mastering date and time formatting in Laravel is less about complex SQL queries and more about mastering object manipulation within your application layer. By ensuring your Eloquent models utilize Carbon objects correctly and applying precise formatting directives in your Blade views, you can deliver perfectly formatted data to your users every time. Start by treating all retrieved timestamps as powerful Carbon objects, and the rest flows naturally from there.
