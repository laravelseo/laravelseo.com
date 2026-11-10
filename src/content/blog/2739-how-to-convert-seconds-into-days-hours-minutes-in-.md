---
title: "How to convert seconds into days hours minutes in Laravel"
description: "Mastering Time Conversion in Laravel: Converting Seconds to Human Readable Durations with Carbon As developers working within the Laravel ecosystem, handling..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working within the Laravel ecosystem, handling time and date manipulations is a daily necessity. Whether you are processing timestamps from databases, calculating billing periods, or displaying durations to end-users, converting raw seconds into meaningful units like days, hours, and minutes is a frequent requirement.

Many developers attempt this conversion using raw mathematical operations or basic `CarbonInterval` methods, but often encounter unexpected results when trying to format the output correctly. This post will walk you through the most robust and idiomatic way to achieve your goal using the powerful **Carbon** library, ensuring your time calculations are accurate and readable.

## The Challenge: Why Simple Interval Methods Fall Short

You encountered an issue when trying to convert a raw second value into a human-readable string. Let's look at why your initial attempt didn't yield the desired result:

```php
$value = '90060';
CarbonInterval::seconds($value)->forHumans();
// Output: 90060 seconds
```

The `CarbonInterval` methods are excellent for representing time *differences*, but when used directly with `.forHumans()`, they often default to showing the raw interval or a simple relative time, rather than decomposing that total duration into its constituent parts (days, hours, minutes). To get the desired output like "1 day 1 hour 1 minute," we need to actively decompose the total seconds into these specific units.

## The Solution: Decomposing Seconds using Carbon

The most effective way to handle this is to take the total number of seconds and perform mathematical division to derive the days, hours, minutes, and remaining seconds. We can then use these calculated values to construct a human-readable string.

Since we are dealing purely with duration (not specific dates), we can leverage Carbon's ability to work with time objects, even if we start from scratch. A highly practical approach involves calculating the total number of days and then using the remainder for hours and minutes.

Here is a comprehensive example demonstrating the conversion:

```php
use Carbon\Carbon;

function convertSecondsToDaysHoursMinutes(int $totalSeconds): string
{
    // Define constants for conversion
    $secondsInDay = 86400;
    $secondsInHour = 3600;
    $secondsInMinute = 60;

    // 1. Calculate total days
    $days = floor($totalSeconds / $secondsInDay);
    $remainingSeconds = $totalSeconds % $secondsInDay;

    // 2. Calculate hours from the remainder
    $hours = floor($remainingSeconds / $secondsInHour);
    $remainingSeconds %= $secondsInHour;

    // 3. Calculate minutes from what remains
    $minutes = floor($remainingSeconds / $secondsInMinute);
    $seconds = $remainingSeconds % $secondsInMinute; // Optional: keep the leftover seconds

    // Format the output string
    return sprintf('%d day(s) %d hour(s) %d minute(s)', $days, $hours, $minutes);
}

$inputSeconds = 90060;
$result = convertSecondsToDaysHoursMinutes($inputSeconds);

echo "Input Seconds: " . $inputSeconds . "\n";
echo "Converted Duration: " . $result . "\n";
```

### Explanation of the Logic

1.  **Total Days:** We first determine how many full 24-hour periods fit into the total seconds using integer division (`floor($totalSeconds / $secondsInDay)`).
2.  **Remaining Seconds:** We use the modulo operator (`%`) to find the leftover time after accounting for the full days. This remainder is crucial for calculating the smaller units.
3.  **Hours and Minutes:** We repeat the process for the remaining seconds, dividing by the number of seconds in an hour (3600) to get the hours, and then using the modulo operator again to find the final minutes.

This manual decomposition ensures that you have precise control over the output format, which is superior to relying on generic relative time functions when a specific string structure is required. As we build robust backend logic in Laravel, mastering these fundamental mathematical operations within your chosen libraries is key to building predictable applications—much like how sophisticated features are built into the framework itself at **https://laravelcompany.com**.

## Conclusion

While Carbon provides an incredibly rich set of tools for date and time management, complex duration conversions often require a combination of mathematical logic and the library's structure. By understanding how to decompose raw seconds into days, hours, and minutes using simple arithmetic operations, you gain full control over your output formatting. This approach is precise, efficient, and gives you exactly the human-readable string you need for any application requirement.
