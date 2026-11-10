---
title: "Change date format Laravel"
description: "Mastering Date Formatting in Laravel: Achieving Indonesian Locale Display As a senior developer, I frequently encounter situations where data fetched from a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer, I frequently encounter situations where data fetched from a database needs to be presented in a culturally appropriate manner. One of the most common pain points is handling date and time formatting across different locales—for instance, displaying months in English when the user expects Indonesian (Bahasa Indonesia).

You’ve run into a classic localization challenge: converting a standard date format into a specific regional format. While PHP's native `date()` function is powerful, achieving true locale-aware formatting requires more than just changing the format string; it requires setting the correct locale context.

This post will guide you through the proper, robust methods for achieving Indonesian date formatting in your Laravel application, moving beyond simple, potentially unreliable, string manipulation. We will explore why your current approach doesn't work and introduce the best practices using modern PHP tools integrated within the Laravel ecosystem.

## The Pitfall of Simple `date()` Formatting

Your example code uses:
```php
<?php echo date("d F Y", strtotime($row->tanggal_pelaksanaan)); ?>
```
When you use `"F"` in the format string, PHP defaults to the locale settings of the server or the environment it is running in. If the system is set to English (or lacks explicit Indonesian locale configuration), it will output the English month name ("March"), regardless of what language your users expect. This approach is brittle because it depends entirely on the server configuration rather than explicitly telling PHP *which* language rules to use for formatting.

## Solution 1: The Traditional Approach using `setlocale()` (The PHP Way)

For a direct manipulation of the date string in pure PHP, you can attempt to set the locale before calling the date function. This is the most direct way to influence how date/time functions interpret month names.

```php
<?php
// Set the locale to Indonesian
setlocale(LC_TIME, 'id_ID.UTF-8', 'Indonesian'); 

$date_timestamp = strtotime($row->tanggal_pelaksanaan);

// Now the output should reflect the configured locale (e.g., "23 Maret 2017")
echo date("d F Y", $date_timestamp); 
?>
```

**Caveat:** While `setlocale()` works, relying on it can introduce environment-specific issues. In large, complex applications, this method is often less reliable than using dedicated localization libraries.

## Solution 2: The Laravel and Carbon Best Practice (The Recommended Way)

In the modern Laravel landscape, the gold standard for date and time manipulation is **Carbon**, which extends PHP's `DateTime` class. Carbon integrates seamlessly with Laravel’s localization features, making it incredibly easy to handle internationalization without manual locale setting headaches.

By using Carbon's methods, you instruct the object itself on how to format the output based on the desired locale, regardless of the underlying server settings.

Here is how you implement this best practice:

```php
use Carbon\Carbon;

// Assuming $row->tanggal_pelaksanaan holds a valid date string
$dateObject = Carbon::parse($row->tanggal_pelaksanaan);

// Use the localization method to format the date for Indonesian locale
$formattedDate = $dateObject->isoFormat('dd MMMM YYYY'); 

echo $formattedDate; // Output: 23 Maret 2017
```

### Using Carbon in Blade Templates

When working within a Laravel view (Blade), you can leverage the `->format()` method on a Carbon instance. If you have set your application's locale correctly in your `config/app.php` file, or if you pass the locale explicitly, the formatting becomes standardized:

```blade
{{-- Assuming $tindakan->target_verifikasi is already a Carbon object or can be cast to one --}}
Tgl: {{ $tindakan->target_verifikasi->isoFormat('dd MMMM YYYY') }}
```

This approach ensures that your application remains consistent and maintainable, which aligns perfectly with the principles of building scalable applications, much like those promoted by **Laravel Company** regarding robust framework development.

## Conclusion

To successfully display dates in an Indonesian format within a Laravel application, avoid relying solely on PHP's raw `date()` function and manual locale settings. Instead, embrace the power of modern libraries like Carbon. By using methods provided by Carbon, you delegate the complex task of localization to a dedicated tool, ensuring your date formatting is accurate, readable, and scalable across different environments. Stick with Carbon for all your date operations!
