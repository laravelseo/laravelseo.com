---
title: "How to convert a UTC datetime string into users' current timezone?"
description: "How to Convert UTC Datetime Strings into Users' Current Timezone in Laravel & Vue As developers working across distributed systems, dealing with timezones is..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript"]
featured: false
---

As developers working across distributed systems, dealing with timezones is one of the most common and frustrating hurdles. When you rely on Coordinated Universal Time (UTC) for storage and transmission, it’s easy to get tangled up when trying to display that time accurately to an end-user who lives in a different timezone.

This post addresses a very specific scenario: how to take a UTC timestamp from a Laravel API response and correctly display it in the user's local timezone on the frontend using Vue and a library like Day.js, ensuring accurate "time ago" calculations. We will explore why simple string manipulation fails and provide a robust, developer-friendly solution.

## The Problem: Ambiguity of UTC

Your observation is spot on. When your Laravel API returns a timestamp like `"2019-04-17 05:20:37"`, this value is inherently in UTC. When the Vue frontend receives this string, if it simply parses it without explicitly handling timezone context, it treats that time as a fixed point in time (UTC).

When you use `dayjs(dateString).fromNow()`, Day.js calculates the difference between the parsed date and the current moment *in the client's local timezone*. If the server sends UTC but the client doesn't correctly interpret this offset, the resulting difference calculation can be skewed by 5 or 6 hours, as you experienced with the Asia/Kolkata example.

The core issue is not the string itself, but the lack of explicit timezone awareness when bridging the gap between the server (UTC) and the client (Local Time).

## Solution 1: Mastering Timezone Handling in Laravel (The Backend Fix)

While the frontend must ultimately render the time correctly for the user, the best practice dictates that the backend should prepare the data in a timezone-aware manner. We use Laravel’s powerful Carbon library to manage this conversion seamlessly.

Instead of just returning a plain `toDateTimeString()`, we ensure the timestamp is handled as a proper Carbon instance. In modern Laravel applications utilizing concepts like those found on **[laravelcompany.com](https://laravelcompany.com)**, manipulating these objects provides superior control over time logic.

If you need to present a specific user's last seen time relative to *their* local timezone, you must be aware of that timezone when formatting the output. However, for simple display purposes where the client handles the final presentation, sending the standardized ISO 8601 format is usually sufficient, as the client can interpret it based on their own settings.

**Refined Laravel API Code:**

Ensure your Eloquent models use the correct timezone definitions, and when retrieving data, rely on Carbon's formatting capabilities:

```php
// Example within a Controller method
use Illuminate\Support\Carbon;

// Assuming $lastSeen is already a Carbon instance or a string that can be parsed by Carbon
$lastSeenFormatted = $lastSeen->toIso8601String(); 

$user_details = array(
    // ... other fields
    'last_seen' => $lastSeenFormatted, // Send the standardized ISO format
    // ...
);

$user_profile['user_details'] = $user_details;
return response()->json($user_profile);
```

By sending a consistent, unambiguous string (like ISO 8601), you delegate the timezone interpretation responsibility to the client-side library, which is designed to handle this context.

## Solution 2: Frontend Implementation with Day.js (The Client Fix)

Since you are using Day.js, you need to ensure that when it receives a string like `"2019-04-17 05:20:37"` (which is UTC), it correctly interprets this as a point in time and then calculates the difference relative to the user's local machine settings.

The key is ensuring Day.js parses the input as an absolute moment, which it does well when given a standardized format. The environment where you call `fromNow()` is critical; it must operate on a date object that has been correctly interpreted by the browser's native timezone awareness.

**Corrected Vue/Day.js Implementation:**

The logic remains very similar, but we rely on the robustness of Date objects and Day.js to handle the conversion internally:

```javascript
import dayjs from "dayjs";

// Function to convert UTC string to relative time using Day.js
convertFromNow(utcString) {
    // 1. Parse the standardized ISO string into a Day.js object.
    // Day.js intelligently handles standard date strings, interpreting them based on local settings
    // or treating them as UTC if no timezone is specified (depending on context).
    const date = dayjs(utcString);

    // 2. Calculate the difference from the current moment in the user's local time.
    return date.fromNow();
}

// Example Usage in your Vue component:
const lastSeenUtc = userInfo.user_details.last_seen; // e.g., "2019-04-17T05:20:37+00:00" (or similar ISO string)

const relativeTime = convertFromNow(lastSeenUtc);

// Display the result
console.log(relativeTime); 
// This will now correctly show the difference based on the user's local timezone settings.
```

By ensuring your API provides a clean, standardized timestamp (like ISO 8601), and by letting Day.js handle the final presentation layer, you eliminate the need for complex manual timezone offset calculations within your frontend code. The library is designed to bridge exactly this gap, making time display accurate regardless of where the user is located.

## Conclusion

Dealing with UTC in web applications requires discipline on both the backend and frontend. By leveraging Laravel's Carbon package to manage data integrity and ensuring your frontend libraries like Day.js are utilized correctly with standardized ISO strings, you can successfully convert remote UTC timestamps into meaningful, localized time differences for your users. Always prioritize sending unambiguous, timezone-aware data from your API, and let the specialized JavaScript libraries handle the final presentation!
