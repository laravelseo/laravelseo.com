---
title: "How can I echo the version of the current Laravel version in php using the view?"
description: "Title: Easily Display Laravel Version in Your PHP Views Body: As a Laravel developer, you may wonder how to access the Laravel version number within your..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Title: Easily Display Laravel Version in Your PHP Views

Body: As a Laravel developer, you may wonder how to access the Laravel version number within your application's views without directly running commands on your terminal. This can be an important feature for many reasons, including debugging or maintaining records of your project history. In this post, we'll show you two different ways to echo Laravel's current version in your PHP code using the view.

First method: Using a helper function

1. Create a helper file (for example, `helpers.php`) and include it in your Laravel application. Here is an example of how this file might look:
   ```php
   <?php
     // helpers.php
     function getLaravelVersion() {
       return trim(shell_exec('php artisan --version | awk -F " " \'{print $2}\''));
     }
   ?>
   ```
   This helper function simply executes the Laravel version command (`php artisan --version`) and returns the output using shell_exec(). The awk command is used to extract just the second word, which represents the version number.

2. Include this helper file in your PHP view:
   ```php
    @include('helpers')
    {{ getLaravelVersion() }}
   ```
   Here, you are calling the `getLaravelVersion` function from the helper file and echoing its output using Blade syntax. This way, the Laravel version will be displayed within your application's views.

Second method: Directly executing the command in PHP code

1. Include the following code at the beginning of your view file to set a custom variable containing the Laravel version number:
   ```php
    <?php
      $laravel_version = trim(shell_exec('php artisan --version | awk -F " " \'{print $2}\''));
    ?>
    @include('helpers')
       // rest of your view code
   ```
   Here, we are using the shell_exec() function to execute the Laravel version command and assign its output (the second word) to a variable. This custom variable is then accessible within your view file, allowing you to echo the Laravel version as required in your application's views.

Regarding security concerns:

Using shell_exec(), which executes system commands, can introduce potential security risks if not handled properly. Therefore, it's recommended to ensure that only trusted users have access to these functions and implement appropriate security measures around sensitive operations.

Conclusion:

Displaying the Laravel version in your application views can add clarity and convenience for you as a developer, particularly when debugging or maintaining your project. While both methods presented are viable solutions, it's up to your personal preference as to which one suits your needs best. Always remember to exercise caution when working with shell_exec() and prioritize security in your Laravel applications. Happy coding!
