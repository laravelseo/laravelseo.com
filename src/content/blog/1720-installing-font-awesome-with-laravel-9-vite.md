---
title: "Installing font-awesome with Laravel 9 (Vite)"
description: "Title: Installing Font Awesome with Laravel 9 (Vite) A Comprehensive Guide for Developers Introduction As a senior developer and technical blogger, we..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "JavaScript"]
featured: false
---

Title: Installing Font Awesome with Laravel 9 (Vite) - A Comprehensive Guide for Developers

Introduction

As a senior developer and technical blogger, we understand the importance of keeping up with newer frameworks and technologies. In this case, you're working with Laravel 9 which uses Vite instead of Mix for bundling resources. You're also not using any preprocessors like Sass or Less.

In this article, we will walk you through the process of installing Font Awesome without using Sass and working within the framework of Laravel 9 along with Vite.

1. Create a New Application
Begin by creating a new application in your local environment with Laravel 9. Use the following command to initiate the project:

```bash
composer create-project laravel/laravel mylara9project --prefer-dist
```

2. Install Font Awesome Assets
To install Font Awesome assets, run the following composer command within your project directory:

```bash
composer require fontawesome/fontawesome-free
```

This command will add two components to your application:
- A CSS file (fontawesome.css) for use in a traditional web development workflow.
- A JS file (fontawesome.js) for use with Vite, allowing you to import font icons directly into your project.

3. Configure Laravel Mix and Vite for Font Awesome
Vite relies on separate files for different components like CSS and JS, thus you'll need to set up imports for your desired icons using the following steps:
- Locate the main.js file in your application directory.
- Import font awesome for Vite from node_modules by adding this line:
```js
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas, faGithub } from '@fortawesome/pro-solid-svg-icons';

library.add(fas);

Vue.component('fa', FontAwesomeIcon);
```
This code imports the required packages and sets up Font Awesome for Vite. Feel free to adjust the icons according to your preferences or needs.

4. Use Font Awesome Icons in Your Application
To use these imported font icons within your application, first import Vue as shown below:
```html
<script src="https://unpkg.com/vue@3"></script>
```

Next, register FontAwesomeComponent with the imported component as follows:
```html
Vue.component('fa', FontAwesomeIcon);
```

Finally, use your icons in templates by specifying the desired icon name within the `<i>` tag and applying the font awesome class:
```html
<i class="fas fa-github"></i>
```
Replace 'fa-github' with the icon name of your choice.

5. Alternative Method for Sass Users
If you prefer using Sass, it will be easier to add Font Awesome to your project. Just follow these steps:
- Install Font Awesome as a dependency by running `composer require fontawesome/fontawesome`.
- Import the necessary stylesheet in your _app.scss file (or equivalent) by adding this line:
```css
@import '~@fortawesome/fontawesome-free/css/all.min.css'
```

Conclusion
Whether you choose to implement Font Awesome with Vite or Sass, the process remains straightforward. For Laravel 9 projects without any preprocessors and using Vite, simply follow our guide to install the font assets and properly configure imports for your desired font icons. Feel free to explore other functionalities of the Font Awesome package or contact us at https://laravelcompany.com/contact for further assistance!
