---
title: "Array Push in Laravel"
description: "Title: Displaying Static Select Options with Laravel: Adding 'Others' Item without Database Interference Introduction: In today's world of web applications,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Displaying Static Select Options with Laravel: Adding 'Others' Item without Database Interference

Introduction: In today's world of web applications, developers often work on displaying different choices to users in a user-friendly manner, like providing select dropdowns. However, sometimes you need to add an additional "Others" option manually within the controller without inserting it into your database, just for view purposes. This blog post aims at providing a comprehensive answer to this issue with clear examples and best practices.

The Scenario: Your application already retrieves all items from the database related to competitions, and you want to display these choices in a select dropdown with the "Others" item at the end. You are trying to achieve this statically without actually inserting the new item into your database but only for the view.

Solution 1: Using Array_Push() Function

The array_push() function allows you to add one or more elements to an existing array. In your case, it will help you append the 'Others' option at the end of the $competition_all array after fetching all items from the database. Your updated controller code would look like this:

```php
// Controller Code
$competition_all = Competition::all();
$newCompete = array('name' => 'Others');
array_push($competition_all, $newCompete);

$this->competition_games = array('Competition');

foreach ($competition_all as $competition_games) {
    $this->competition_games[$competition_games->name] = $competition_games->name;
}
```

This approach successfully adds the "Others" item at the end of the array, but it requires retrieving the data from the database again. If you want to minimize loading time and optimize your code, consider using a different solution:

Solution 2: Defining Static Options within View

In this approach, instead of adding the "Others" item through PHP code, you can define it directly in view files. By doing so, you won't need to retrieve all competition data from your database and can maintain a cleaner controller code.

Here is an example of defining static options within view files:

```php
// Controller Code
$competition_all = Competition::all();
foreach ($competition_all as $competition_games) {
    $this->competition_games[$competition_games->name] = $competition_games->name;
}
```

View File:

```php
<select name="competitions">
  <option value="1" selected>Value 1</option>
  <option value="2" selected>Value 2</option>
  <option value="3" selected>Value 3</option>
  <option value="4" selected>Value 4</option>
  <option value="5">Others</option>
</select>
```

Conclusion: Laravel provides multiple ways to add static options to your select dropdown, and you can choose the most appropriate one depending on your project requirements. Remember that the primary goal is to ensure a smooth user experience while maintaining the integrity of your database. By following these best practices, you can effectively showcase the "Others" item without inserting it into the database.
