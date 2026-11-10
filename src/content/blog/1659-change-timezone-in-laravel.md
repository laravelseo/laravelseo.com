---
title: "Change timezone in laravel"
description: "Title: Efficiently Change Timezone in Laravel Applications Introduction: Laravel makes it easy for developers to work with time zones through its built in..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Efficiently Change Timezone in Laravel Applications

Introduction:
Laravel makes it easy for developers to work with time zones through its built-in configuration options. It automatically sets the default time zone to UTC, which is universally recognized and widely used. However, if you prefer working with another time zone or if your application serves users from different regions, you can adjust this setting according to your needs. In this comprehensive blog post, we will explore how to change the Laravel timezone and provide code examples for both configuring the environment file (`.env`) as well as the `app.php` configuration file.

I. Timezone Configuration in Laravel using .env File:
1. Start by modifying your project's root directory `.env` file. This is typically the `.env` file inside your Laravel installation folder.
2. Locate the time zone configuration line, which should look something like this:
   `APP_TIMEZONE=UTC`
3. Change the current time zone to 'Asia/Tehran' by replacing the existing value with the new one:
   `APP_TIMEZONE=Asia/Tehran`
4. Save your changes and restart the development server (if running) to see the effects of this change instantly.
5. Alternatively, you can use Laravel's built-in CLI command to set up a new time zone: `php artisan timezone:change Asia/Tehran`
   This command will update your `app/Config/App.php` configuration file, as well as the `.env` file, with the specified time zone.

II. Timezone Configuration in Laravel using app.php File:
1. Open the Laravel project's `config/app.php` file for editing.
2. Locate the 'timezone' key within the 'config' array:
   `'timezone' => env('APP_TIMEZONE', 'UTC'),`
3. Change the default time zone from UTC to Asia/Tehran by updating the value of the 'env' parameter inside the array:
   `'timezone' => env('APP_TIMEZONE', 'Asia/Tehran'),`
4. Ensure that you have set your desired time zone within the environment variables file (`.env`) as well, so Laravel can retrieve it successfully. If not, simply add this line to the existing `.env`:
   `APP_TIMEZONE=Asia/Tehran`
5. Save your changes and restart the development server if required. Alternatively, you can run the timezone command again (if necessary) to update both files simultaneously.

III. Conclusion:
Now that you've successfully changed the Laravel application's default time zone from UTC to Asia/Tehran, your application will display dates and times according to the chosen time zone. It is essential to keep in mind that each change has its impact on how the application functions. If you encounter any issues or need further clarification about time zones, consider reaching out to our team of experts at https://laravelcompany.com for support.

Remember, working with time zones requires utmost attention and proper management of configuration files as they can affect not only your application's presentation but also other services like database transactions and logs. Be sure to test your app thoroughly after changing the time zone to ensure its functionality remains unaffected.
