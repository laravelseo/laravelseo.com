---
title: "ErrorException : implode(): Passing glue string after array is deprecated. Swap the parameters"
description: "Title: Understanding and Solving the \"ErrorException : implode(): Passing glue string after array is deprecated. Swap the parameters\" Issue in Laravel..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Title: Understanding and Solving the "ErrorException : implode(): Passing glue string after array is deprecated. Swap the parameters" Issue in Laravel Applications

Body:
The ErrorException in question, where implode() is used but passing the glue (separator) string after an array is causing some confusion for your Laravel application's developers. This error occurs due to a minor change in the way how the implode function works. However, this can be easily addressed by following the best practices and understanding the changes that have occurred from PHP 7.3 to PHP 7.4.

Firstly, the code causing your Laravel app to generate this issue might appear as follows:

```php
$words = static::words($nbWords);
$words[0] = ucwords($words[0]);
return implode($words, ' ') . '.';
```

The first step in resolving the issue is to understand that since PHP 7.3, the order of the parameters passed has changed for the `implode()` function. If you're using PHP 7.3 or lower versions, nothing would change because the older version still accepts the glue string at the end.

However, if you're using PHP 7.4 as your local machine is, the code snippet above will generate this ErrorException. To resolve this issue, you need to adjust the `implode()` function call and pass parameters accordingly:

```php
$words = static::words($nbWords);
$glue = ' '; // add a new variable for the glue string
$words[0] = ucwords($words[0]);
return implode($glue, $words) . '.';
```

By doing so, you've ensured that the `implode()` function call is passing parameters consistent with PHP 7.4 requirements while maintaining functionality under lower PHP versions. This solution maintains compatibility across different PHP versions while eliminating potential errors caused by code changes in newer versions.

To further address this issue at a higher level, consider adopting Laravel's built-in utilities for working with strings and arrays:

```php
$words = static::words($nbWords);
$glue = ' ';
$wordStr = join($glue, $words); // Join the array of words using the glue string
$capWord = ucfirst($words[0]); // Use the built-in function to capitalize the first word in the array
return $capWord . $wordStr . '.';
```

In this case, you're leveraging Laravel's native utilities for manipulating strings and arrays directly. With these changes, your application should be free from this ErrorException. If you still encounter the issue or have further questions, feel free to reach out to us at https://laravelcompany.com where our highly skilled Laravel developers are always ready to assist you with any technical issues that arise in your projects.
