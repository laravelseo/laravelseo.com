---
title: "Laravel api pagination specify page"
description: "Mastering Dynamic Pagination in Laravel: Specifying Page and Per Page As developers working with modern web applications, handling pagination correctly is a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Keywords", "PHP"]
featured: false
---

As developers working with modern web applications, handling pagination correctly is a fundamental skill. When building APIs or web interfaces that fetch large datasets, specifying both *how many items* to show (`perPage`) and *which page* to display (`page`) dynamically from the URL query parameters is crucial for a good user experience.

The challenge often arises when trying to combine Eloquent's built-in pagination methods with external request data. Let’s dive into how you can seamlessly integrate the current page number into your Eloquent queries, moving beyond static pagination calls.

## The Anatomy of Dynamic Pagination

You are correctly observing that Laravel provides excellent tools for handling pagination through Eloquent models. As noted in the official [Laravel Documentation](https://laravel.com/docs/5.8/pagination), methods like `paginate()` are designed to handle the heavy lifting of generating links, but they require specific parameters to function dynamically.

When you start with a simple call:

```php
User::paginate(); // Default perPage is usually 15 or 25 depending on configuration
```

You achieve static pagination. To make it dynamic based on URL inputs like `?page=0&perPage=10`, you need to read those inputs from the incoming HTTP request and inject them into your query builder.

## Implementing Dynamic Pagination via Request Input

The solution lies in utilizing the `$request` object available within your controller method to dynamically construct the pagination parameters before calling the Eloquent method. This is a standard practice for building RESTful APIs and dynamic web views, ensuring that whatever the user requests from the URL is reflected in the resulting data set.

Here is the practical implementation:

```php
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function index(Request $request)
    {
        // 1. Get the desired items per page from the request
        $perPage = $request->input('perPage', 10); // Default to 10 if not provided

        // 2. Get the desired page number from the request (ensure it's an integer)
        $page = $request->input('page', 1); // Default to page 1 if not provided

        // 3. Apply both parameters to the paginate method
        $users = User::paginate($perPage, ['*'], 'page', $page);

        return response()->json($users);
    }
}
```

### Explanation of the Code

In the example above, we achieve dynamic pagination by performing three key steps:

1.  **Reading Parameters:** We use `$request->input('perPage')` and `$request->input('page')` to safely retrieve the values sent via the URL query string. It is crucial to always provide a default value (e.g., `10` or `1`) in case the user omits these parameters, preventing errors.
2.  **Calling `paginate()`:** The core of the solution is passing the retrieved variables directly into the `paginate()` method: `User::paginate($perPage, ['*'], 'page', $page)`. Notice that we are using the overloaded version of `paginate()` which accepts the items per page, the columns, and crucially, the name of the page parameter (`'page'`) alongside its value.
3.  **Result:** This setup ensures that when a user navigates to `/users?page=2&perPage=20`, your backend correctly fetches records 21 through 40, using 20 items per page.

## Best Practices for API Pagination

When dealing with APIs, structuring the pagination response is just as important as fetching the data itself. When you return a paginated result (which includes `current_page`, `last_page`, `next_page_url`, etc., as documented on [Laravel](https://laravelcompany.com)), ensure your API response format adheres to standards like JSON:API or standard Laravel pagination structure.

Always validate the input parameters strictly. If `$request->input('perPage')` returns an invalid value, your application might behave unexpectedly. Always sanitize and validate user input before using it in database queries.

## Conclusion

Implementing dynamic pagination that respects both `perPage` and `page` from the URL requires shifting focus from static model calls to dynamic request handling. By leveraging the `$request` object within your controller to extract these parameters and pass them directly to Eloquent’s powerful `paginate()` method, you create flexible, robust, and user-friendly data retrieval systems. Mastering this technique is a significant step in building scalable applications with Laravel.
