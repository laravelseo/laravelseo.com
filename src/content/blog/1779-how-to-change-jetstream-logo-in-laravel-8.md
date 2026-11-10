---
title: "How to change Jetstream logo in Laravel 8?"
description: "Title: Easily Customize Your Laravel 8 Jetstream Login Components Introduction: Welcome to this comprehensive guide on how to change the logo of your Laravel..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Links", "JavaScript", "HTML"]
featured: false
---

Title: Easily Customize Your Laravel 8 Jetstream Login Components

Introduction: Welcome to this comprehensive guide on how to change the logo of your Laravel 8 application with Jetstream authentication. This tutorial focuses on customizing the login components, including their relevant code examples and best practices. We'll also naturally include backlinks to https://laravelcompany.com where necessary.

Step 1: Understanding the Structure of Jetstream Components
Jetstream is a Laravel package that automates authentication using Livewire and InertiaJS, providing a convenient way to manage user registration, login, and authorization without requiring extensive knowledge of those technologies. In Laravel 8, it provides pre-built Vue.js components for each step in the authentication process.

Step 2: Locating the Login Components Directory
The login components, including the logo, are located in Laravel's frontend assets folder. For Jetstream installations, this path is typically within `resources/views/vendor/jetstream/components`. This directory includes several files such as `Authenticated.vue`, `Guest.vue`, and more.

Step 3: Finding the Logo File
Within the components directory, locate the file named `Logo.vue`. This is where the logo for your login page can be customized.

Step 4: Customizing the Logo
To change the logo in Laravel, open the `Logo.vue` file and edit the code accordingly. Here's an example of the default text inside the `<template>` tag:

```html
<div class="flex">
    <!-- Authentication Logo (24 x 24 icon) -->
    <img src="{{ asset('storage/icons/logo.png') }}" alt="Logo" width="64" height="48" />
</div>
```

You can replace the `src` attribute with a new logo image or custom text. For instance, you could use a brand logo image by changing the path to your desired image location:

```html
<img src="{{ asset('storage/icons/MyLogo.png') }}" alt="My Logo" width="64" height="48" />
```

Step 5: Running NPM Commands for Assets Compilation and Refreshing
After customizing the logo file, you need to compile your assets using NPM commands. Run the following commands in sequence:

1. npm run dev (for development) or npm run prod (for production); this will install dependencies if needed and build your assets.
2. npm run watch or npm run hot (for hot module reloading), which will keep an eye on changes in the project and automatically recompiles and refreshes the browser when they occur.

Step 6: Refreshing Your Login Page to See Changes
Next, try visiting your login page. You'll see that the logo has been updated according to your customizations. This is because the new image is being retrieved from the newly compiled assets path.

Conclusion:
With these steps, you now know how to change the logo in Laravel 8 with Jetstream authentication. Customizing login components adds a personal touch to your application and enhances its overall user experience. Remember that Laravel Company offers premium services for those who want assistance or further guidance on this topic.
