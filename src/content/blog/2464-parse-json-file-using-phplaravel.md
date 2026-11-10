---
title: "Parse JSON file using PHP/Laravel"
description: "Mastering JSON Parsing in PHP/Laravel: Extracting Data from Complex Structures As developers working within the Laravel ecosystem, we frequently deal with..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Google"]
featured: false
---

As developers working within the Laravel ecosystem, we frequently deal with data exchange, often involving JSON payloads received from APIs or external services. A common and critical task is parsing this raw JSON string into usable PHP data structures so we can manipulate, store, or display the information effectively.

Today, we will walk through a practical scenario: parsing a nested JSON structure to extract specific details—room names, calendar IDs, and availability messages. We will explore the most efficient ways to achieve this using native PHP functions within a Laravel context.

## Understanding the Input Data

We are dealing with the following sample JSON data:

```json
{
    "Room 251": {
        "calID": "igm4pfi6cc78ncvm5i3gv521snp0si82@import.calendar.google.com",
        "availMsg": "Open Computer Lab"
    },
    "Room 318": {
        "calID": "9duielvutvv2b8d52ikgf8793pbn43sk@import.calendar.google.com",
        "availMsg": "Open Computer Lab"
    },
    "Room 319 (Friends Room)": {
        "calID": "q5tj99a61g71eqcaboae6md0qahle22hv@import.calendar.google.com",
        "availMsg": "Available For Study"
    },
    "Room 323": {
        "calID": "josiglibstb75c88o4s4f2r3h4i3lagc@import.calendar.google.com",
        "availMsg": "Open Computer Lab"
    },
    "Room 513 (Voinovich Room)": {
        "calID": "anjv4nfcr0b00sttbjp6cse5l7j0mvbe@import.calendar.google.com",
        "availMsg": "Available For Study"
    }
}
```

The goal is to iterate through this structure and extract the room name (the top-level key), the `calID`, and the `availMsg` from each inner object.

## The PHP Solution: Decoding and Iterating

The foundation of any JSON parsing in PHP is the `json_decode()` function. When dealing with complex, associative arrays like the example above, we must ensure we decode it into an array format.

### Step 1: Decoding the JSON String

First, we load the raw string into a PHP variable:

```php
$jsonString = '{ "Room 251": { ... }, "Room 318": { ... } }';

// Decode the JSON into a PHP associative array. 'true' as the second argument forces it into an array.
$data = json_decode($jsonString, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    die('JSON decode error: ' . json_last_error_msg());
}
```

Using `true` as the second argument is crucial; it tells `json_decode()` to return an associative array instead of a standard object, making the data much easier to navigate using keys.

### Step 2: Iterating and Extracting Data

Since our JSON structure is a dictionary of rooms, we can loop through the top-level array to access each room's details.

```php
// Assuming $data holds the decoded array from Step 1

echo "<h2>Room Details</h2>";

foreach ($data as $roomName => $details) {
    // Access the nested properties directly using the roomName key
