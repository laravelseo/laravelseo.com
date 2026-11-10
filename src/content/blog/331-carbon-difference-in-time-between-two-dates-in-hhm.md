---
title: "Carbon Difference in Time between two Dates in hh:mm:ss format"
description: "Title: Carbon Difference in Time between Two Dates in hh:mm:ss Format Body: In this blog post, we will explore how to calculate the difference between two..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Carbon Difference in Time between Two Dates in hh:mm:ss Format

Body:

In this blog post, we will explore how to calculate the difference between two date time strings stored in a database and display it in the desired format of hours, minutes, and seconds (hh:mm:ss). We'll begin by looking at `diffForHumans`, a useful method that returns a formatted string with "after" or "ago", but doesn't quite fit our needs. Then we'll move on to creating a custom function to achieve the desired output.

Before getting into the code, it is essential to understand some basic concepts related to Carbon and Laravel. The Carbon library provides an easy-to-use interface for manipulating dates and times in PHP. It enables us to work with date time strings in a convenient way. In addition, Laravel includes Carbon as a dependency in its core, making it available for use in all your projects.

Let's start by analyzing the given code example:

```php
$startTime = Carbon::parse($this->start_time);
$finishTime = Carbon::parse($this->finish_time);
$totalDuration = $finishTime->diffForHumans($startTime);
dd($totalDuration);
```
The code snippet first parses the date time strings into Carbon objects, and then calls `diffForHumans()`, which returns a formatted string with "after" or "ago". This is useful for displaying the duration between two events, but it does not give us the hh:mm:ss format.

To achieve our desired output, we can create a custom function that will transform the `diffForHumans()` result into the hour:minute:second format. Here's an example of how this could be implemented:

```php
function humanDurationToTimeFormat($humanDuration) {
    $durationParts = explode(' ', $humanDuration);
    $hours = (int)$durationParts[0];
    $minutes = (int)$durationParts[1];
    $seconds = (int)$durationParts[2];
    return sprintf("%02d:%02d:%02d", $hours, $minutes, $seconds);
}
```
The new custom function `humanDurationToTimeFormat()` splits the supplied `diffForHumans()` result into the base units (hours, minutes, and seconds). It then converts these parts to their respective formatted values (e.g., 02 for hours less than 10) and returns them in the desired hh:mm:ss format using sprintf().

Now let's implement this custom function into our previous example code:

```php
$startTime = Carbon::parse($this->start_time);
$finishTime = Carbon::parse($this->finish_time);
$totalDuration = $finishTime->diffForHumans($startTime);
$formattedDuration = humanDurationToTimeFormat($totalDuration);
dd($formattedDuration);
```
Running this new code will result in a formatted string containing the time difference in hours, minutes, and seconds. If you need to store or use the converted duration as an integer value, convert the formatted string back to an integer using `Carbon::parse()`. Here's an example:

```php
$hhmmssDuration = Carbon::createFromTimeString($formattedDuration)->timestamp;
dd($hhmmssDuration);
```

In conclusion, by combining the power of Laravel and the Carbon library, we can easily access date time strings in our database and manipulate them to show a specific output. Our custom function `humanDurationToTimeFormat()` enables us to get the desired format of hours, minutes, and seconds for the duration between two dates. Feel free to incorporate this solution into your code and enjoy an efficient way of displaying date time differences.
