---
title: "How to return formatted(pretty) JSON instead of JSON? Or new line JSON instead of inline JSON?(Laravel)"
description: "How to Return Formatted (Pretty) JSON instead of Inline JSON in Laravel As developers working with APIs, one of the most common frustrations is dealing with..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As developers working with APIs, one of the most common frustrations is dealing with raw, inline JSON responses. While returning data as JSON is standard practice for RESTful APIs, when this JSON is dumped directly into the HTTP response body without proper formatting, it becomes extremely difficult for front-end developers or even debugging tools to read and parse.

This post dives into how you can move beyond simple inline JSON and return neatly formatted, multi-line JSON structures from your Laravel controllers, making your API significantly more consumable and user-friendly.

## The Problem with Inline JSON Responses

When you use methods like `return response()->json($data);` in a Laravel controller, the framework serializes the PHP array or object directly into a single, compact line of text. While this is efficient for data transfer, it sacrifices readability:

```json
[{"id":1,"name":"Winifred Glover", ...}]
```

This format is dense and requires manual effort to debug or display correctly in web applications. We want the output to look like this:

```json
[
  {
    "id": 1,
    "name": "Winifred Glover",
    // ... more data
  },
  // ... subsequent objects on new lines
]
```

The goal is not just to change the whitespace but to ensure the structure is clean and easily parsable.

## The Solution: Formatting JSON in Laravel

Since Laravel itself doesn't offer a built-in "pretty print" function for its JSON responses, we need to intervene in the process. The most effective way to achieve this is by manually manipulating the data before passing it to the `json_encode` function, utilizing PHP's capabilities.

The core strategy involves:
1. Fetching the required data (e.g., using Eloquent).
2. Ensuring the data is in a clean, structured format (usually an array of objects).
3. Using the `JSON_PRETTY_PRINT` flag within `json_encode()` to introduce the necessary indentation and newlines.

### Implementation Example

Let’s take your example route which fetches user data:

```php
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function getUsersAsPrettyJson()
    {
        // 1. Fetch the raw data from the database
        $users = DB::table('users')
                     ->limit(3)
                     ->get();

        // 2. Manually format the data for pretty printing
        // We use JSON_PRETTY_PRINT to instruct json_encode to format the output nicely.
        $prettyJson = json_encode($users, JSON_PRETTY_PRINT);

        // 3. Return the formatted string as a response
        return response($prettyJson, 200, [
            'Content-Type' => 'application/json'
        ]);
    }
}
```

### Explanation of the Code

In this approach, instead of having Laravel automatically handle the serialization (which results in inline JSON), we take control. We fetch the data and then explicitly use PHP’s built-in `json_encode()` function. The crucial part is passing the flag `JSON_PRETTY_PRINT`. This flag tells the encoder to insert whitespace and newline characters between elements, resulting in the readable, multi-line structure you desire.

While Laravel provides powerful tools for database interaction via Eloquent—a cornerstone of modern Laravel development—understanding how to manipulate the final output is a critical skill for building robust APIs that cater to various clients. This attention to detail ensures your API adheres to best practices, much like the principles championed by the [Laravel company](https://laravelcompany.com).

## Best Practices and Alternatives

While manually formatting JSON works perfectly for simple cases, it introduces complexity if you need to apply consistent formatting across many endpoints. For larger applications or complex APIs, consider these alternatives:

1. **API Resources:** For complex data transformations, Laravel's API Resources are the preferred solution. They allow you to define exactly what data structure should be returned, abstracting away the raw database results and ensuring consistency.
2. **Dedicated JSON Libraries:** If your requirements involve highly customized serialization or handling non-standard data types, exploring dedicated PHP libraries for JSON manipulation can offer more granular control than relying solely on `json_encode()`.

## Conclusion

Returning pretty, formatted JSON is an exercise in controlling the output stream of your API. By understanding that Laravel’s default behavior is efficient but not always user-friendly, we gain the power to customize the response. For simple formatting needs, manually applying `JSON_PRETTY_PRINT` within your controller logic is a straightforward and powerful technique. As you scale your projects, leverage Laravel's ecosystem—from Eloquent to API Resources—to manage data presentation cleanly and efficiently.
