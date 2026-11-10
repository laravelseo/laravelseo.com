---
title: "How to change the date format in laravel view?"
description: "Mastering Date Formatting in Laravel Blade: From Database Timestamp to Human Readable Dates As a senior developer working with the Laravel ecosystem, you..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a senior developer working with the Laravel ecosystem, you frequently encounter situations where raw database timestamps need to be presented in a user-friendly format. Many developers run into this exact issue: retrieving a standard `YYYY-MM-DD HH:MM:SS` string from the database and needing to display it as something more aesthetically pleasing, like "14 July 2017."

This guide will walk you through the correct, idiomatic ways to handle date formatting in Laravel Blade, moving beyond simple string manipulation to leverage the power of Carbon.

## The Root of the Problem: Database vs. Presentation

The reason you are seeing `2017-07-14 06:04:08` is because your database (like MySQL or PostgreSQL) stores dates in a standardized, unambiguous format. When Laravel retrieves this data via Eloquent, it converts it into a PHP `DateTime` object, which is then displayed as the standard SQL date format by default.

The challenge isn't retrieving the data; the challenge is **formatting** that retrieved data for presentation in your Blade view. Simply echoing the raw attribute won't achieve the desired result.

## Solution 1: Formatting Dates within the Controller (Best Practice)

While you *can* format dates directly in the Blade file, the most robust and efficient practice is to perform data transformation in the Controller or Eloquent Query itself. This keeps your presentation logic separate from your view, adhering to the principles of separation of concerns.

If you are fetching a single record, you can use Carbon's powerful formatting methods directly on the model attribute before passing it to the view:

```php
// In your Controller method
$log = \App\Calllog::where('jobseeker_id', $jobseeker->id)->first();

if ($log) {
    $formattedDate = \Carbon\Carbon::parse($log->created_at)->isoFormat('d M Y');
} else {
    $formattedDate = 'N/A';
}

return view('logs', [
    'log' => $log,
    'display_date' => $formattedDate // Pass the formatted date to the view
]);
```

## Solution 2: Formatting Directly in the Blade View (The Direct Answer)

If you prefer to keep all presentation logic within the view, you must ensure that the data you are accessing is a valid Carbon instance. Since Eloquent handles casting dates into Carbon objects automatically, you can use Carbon's powerful `format()` method directly within your Blade syntax.

To achieve the specific format you requested (`14 July 2017`), you need to use the appropriate format tokens:

```blade
{{-- Assuming $log->created_at is a valid Carbon object --}}

<p>Created At: {{ $log->created_at->format('d M Y') }}</p>
```

### Understanding Carbon Date Format Tokens

The magic lies in the `format()` method, which accepts standard PHP date format characters. Here are some useful examples that can be adapted for various needs:

| Format | Example Output (for July 14, 2017) | Description |
| :--- | :--- | :--- |
| `d` | 14 | Day of the month, 2 digits. |
| `M` | Jul | Short textual representation of a month. |
| `Y` | 2017 | A four-digit representation of a year. |
| `F` | July | Full textual representation of a month. |
| `m` | 07 | Numeric representation of a month (with leading zero). |

Using the combination `'d M Y'` successfully yields the desired "14 July 2017" format. This flexible approach is exactly why leveraging libraries like Carbon, which Laravel relies upon heavily, makes date handling in applications significantly cleaner and more reliable. For advanced date manipulation and database interaction within Laravel, exploring the features of the [Laravel Company](https://laravelcompany.com) documentation will provide you with deeper insights into effective data management strategies.

## Conclusion: Choosing the Right Approach

When dealing with dates in Laravel:

1.  **For Data Integrity (Controller/Model):** Perform complex transformations or data preparation in your backend logic. This ensures that the raw data remains pristine, regardless of how it is displayed.
2.  **For Presentation (Blade):** Use Carbon's `format()` method directly within your Blade files to convert the stored date into a human-readable string for the end-user.

By mastering these techniques, you ensure that your application provides not only accurate data but also an excellent user experience.
