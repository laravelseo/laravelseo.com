---
title: "Argument 1 passed to Illuminate\\\\Database\\\\Query\\\\Builder::cleanBindings() must be of the type array, string given"
description: "Title: Argument 1 passed to Illuminate\\Database\\Query\\Builder::cleanBindings() must be of the type array, string given Understanding and Resolving Common..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Keywords", "Errors"]
featured: false
---

Title: Argument 1 passed to Illuminate\Database\Query\Builder::cleanBindings() must be of the type array, string given - Understanding and Resolving Common Laravel Database Errors

Introduction: One of the most challenging aspects of working with Laravel is managing complex database queries. Sometimes, you might encounter errors that seem rather confusing or misleading at first glance. This blog post aims to provide a comprehensive explanation of the issue "Argument 1 passed to Illuminate\Database\Query\Builder::cleanBindings() must be of the type array, string given" and guide you through possible solutions.

Body:

1. Understanding the Error Message

The error message refers to the method "cleanBindings()" in Laravel's Query Builder class. This method is responsible for cleaning up any previously executed queries. However, as per the error message, the first argument passed to this function must be an array or a string instead of whatever it currently is. Understanding what causes this error involves identifying how you are using the Query Builder and how you may have mistakenly passed an incorrect data type.

2. Incorrect Usage of Array or String Values in Data Updates

Let's look at your controller code, which seems to contain two different types of data updates: one for a normal table with vendor details (where Vendor::find() returns the model) and another for an EAV (Entity-Attribute-Value) table using VendorDetail.

In the first case, you are updating the "is_active" field of the vendor record but also trying to perform a mass update on its attributes via the EAV table. This raises two concerns:

a. The first error is caused by using the same $request variable for both cases without considering the data types expected by each update. Since you are updating both the normal and EAV tables, it's crucial to ensure that the passed values match their respective contexts. For instance, if you assign "0" as "is_active," it should be a Boolean value (true or false), while passing the detail and join_at attributes from $request in an array for the second query.

b. The second issue is related to how your controller handles vendor data updates. It's recommended to use separate models for each type of data rather than mixing them together in a single model. In this case, it may be better to have two distinct classes: one for vendors (VendorModel) and another for vendor details (VendorDetail).

3. How to Prevent Errors When Updating Database Records

To resolve the issue and avoid similar errors in the future, you can follow these guidelines:

a. Ensure that the data types passed to your models match their respective fields' requirements. For instance, use a Boolean value for "is_active" and an array for EAV table updates.

b. Consider refactoring your model structure by separating vendor-related attributes from vendor details. This will facilitate data management and prevent mixing different types of data in a single model.

c. Verify that you are using the correct data types in both your controller code and your database queries. Always double-check whether you're sending arrays or strings as required by your model methods.

Conclusion: The "Argument 1 passed to Illuminate\Database\Query\Builder::cleanBindings() must be of the type array, string given" error is often caused by mismatches between data types and expected parameters in Laravel database queries. To prevent such issues, follow best practices for model structure organization and ensure that you're passing the correct data types to your models during database updates. For further understanding on Laravel best practices, visit https://laravelcompany.com.
