---
title: "Laravel - Pass more than one variable to view"
description: "Title: Laravel Passing Multiple Variables to Your View with Ease Introduction In your Laravel application, you have a page that displays a list of people..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content"]
featured: false
---

Title: Laravel - Passing Multiple Variables to Your View with Ease

Introduction

In your Laravel application, you have a page that displays a list of people from the database, but you wish to display another specific person's details using the $ms variable. It's essential to learn how to pass multiple variables to your view for this purpose along with other data in an organized manner. In this comprehensive blog post, we will discuss how to achieve this efficiently and effectively while making use of Laravel's powerful capabilities.

Passing Multiple Variables

To send more than one variable to the view, you can modify your existing code as follows:

1. Add another variable to pass alongside $persons using the with() method.
2. Ensure that both variables are correctly defined in the controller.
3. Use compact() and array_merge() functions for better organization and efficiency.

Here's an extended example based on your initial code:

<pre><code>    function view($view)
    {
        $ms = Person::where('name', 'Foo Bar'); // Define the specific person to display as a variable
        $persons = Person::order_by('list_order', 'ASC')->get(); // Get a list of all people in the database

        // Use compact() function to pass all relevant variables with their names
        return view($view)
            ->with([
                'persons' => $persons,
                'ms' => $ms
            ]);
    }
</code></pre>

In the above code snippet, we have used compact() to pass all variables, including $persons and $ms. As a result, you can easily access both these variables in your view using the corresponding keys (i.e., 'persons' and 'ms'). The with() method accepts an array which makes it easier to handle multiple variables.

Using array_merge() for Further Efficiency

In case you want to have more variables, you can use array_merge() to merge arrays containing these additional variables. Here's how:

<pre><code>    function view($view)
    {
        $ms = Person::where('name', 'Foo Bar');
        $persons = Person::order_by('list_order', 'ASC')->get(); // Get a list of all people in the database

        $data_to_pass = compact(
            'persons',
            'ms'
        );

        $additional_vars = [
            'new_var1' => 1,
            'new_var2' => 'Test string'
        ];

        // Merge the arrays with both main variables and additional ones
        $combined_data = array_merge($data_to_pass, $additional_vars);

        return view($view)
            ->with('data', $combined_data);
    }
</code></pre>

This approach allows you to pass multiple variables and additional information without cluttering the code. You can add more variables easily by defining them in the array_merge() call.

Conclusion

Now, you know how to efficiently pass multiple variables to your Laravel view. By using compact() and array_merge(), you can simplify the process of passing additional data to your views while maintaining a clean and organized code base. Remember that proper organization and structure are essential for the successful development and maintenance of any Laravel application, and these techniques contribute significantly towards achieving that goal.
