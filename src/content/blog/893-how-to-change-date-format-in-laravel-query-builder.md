---
title: "How to change date format in laravel Query Builder from \"2016-03-12\" to \"12-Mar-2016\""
description: "Title: Efficiently Modifying Date Formats in Laravel Query Builder Introduction: One of the core features of a database is handling dates and timestamps...."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Keywords"]
featured: false
---

Title: Efficiently Modifying Date Formats in Laravel Query Builder

Introduction: One of the core features of a database is handling dates and timestamps. However, each application may require different date formats for display or storage purposes. In this comprehensive guide, we will explore how to change date format from "2016-03-12" to "12-Mar-2016" in Laravel's Query Builder.

Body:

1. Understand the basics of date manipulation with Laravel: Laravel provides a rich set of tools for working with dates and time, including the Carbon library. It allows developers to create instances of DateTime objects, manipulate them using various methods, and format them as needed.

2. Retrieve data from the database with custom formats: To change the date format in your query results, use Laravel's Query Builder to perform the desired operation on the column containing the timestamp. This can be achieved by leveraging Carbon's powerful formatting capabilities. Consider the following example:

   <pre><code>$results = DB::table('customers as cust')
        -&gt;where('cust.id', $id)
        -&gt;select("cust.*","cust.cust_dob as dob")
        -&gt;first();
</code></pre>

3. Use the DATE_FORMAT function in your raw queries: You may want to use Laravel's raw queries to achieve more complex transformations on date fields, such as applying custom format strings. To change the date format from "2016-03-12" to "12-Mar-2016," you can execute a query like this:

   <pre><code>DB::table('customers as cust')
        -&gt;where('cust.id', $id)
        -&gt;select("cust.*","DATE_FORMAT(cust.cust_dob, '%d-%M-%Y') as formatted_dob")
        -&gt;first();
</code></pre>

4. Customize the format with Carbon's date functions: Laravel Query Builder uses Eloquent relationships to access and modify data, but sometimes you may need more flexibility. In such cases, using Laravel's Carbon library might be a better option. Here's an example of how you can manipulate dates in your models or controllers:

   <pre><code>$customer = Customer::find($id);
    $formattedDate = Carbon::parse($customer->cust_dob)->format('d-M-Y');</code></pre>

5. Combine Laravel's tools for efficient date manipulation: With a thorough understanding of the various techniques available in Laravel's Query Builder, Eloquent relationships, and Carbon library, you can efficiently change the format of dates between different systems. This will enable your application to handle data with ease while ensuring consistency across your codebase.

Conclusion: Effectively manipulating date formats in Laravel is crucial for maintaining consistent presentation and storage. By leveraging the powerful features provided by Laravel's Query Builder, Eloquent relationships, and Carbon library, you can easily adapt to specific requirements and provide users with the desired output while ensuring data integrity. Remember that well-written code, backed up with thorough knowledge of these tools, is essential for efficient date manipulation within your Laravel application.
