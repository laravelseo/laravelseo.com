---
title: "Block-scoped declarations not yet supported outside strict mode"
description: "Title: Block scoped declarations not yet supported outside strict mode Troubleshooting Laravel 5.4 Webpack Issues Body: Laravel is a popular PHP framework,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Keywords", "JavaScript"]
featured: false
---

Title: Block-scoped declarations not yet supported outside strict mode - Troubleshooting Laravel 5.4 Webpack Issues

Body:
Laravel is a popular PHP framework, and one of its core features is the Laravel Mix. This utility combines modern tools and provides an efficient development environment for web developers. In this blog post, we'll discuss the issue of block-scoped declarations not being supported outside strict mode when working with Laravel 5.4's Webpack on Homestead Vagrant box, and how to solve it.

In your setup, you have loaded all your dependencies as well as your webpack configuration, which is a step towards creating assets for your application. However, the problem arises when running `npm run production`. As shown in the error message, Laravel Mix's setup Webpack configuration has let and const block-scoped declarations that are not yet supported outside strict mode.

Let us investigate further into this issue. First, we need to understand what block-scoped declarations are. Block scoping is a new feature introduced in ES6 (ECMAScript 2015), which allows you to declare variables with the let or const keywords within curly brackets { }. These variables are only accessible inside that block and cannot be accessed after leaving it.

As for strict mode, it's a special execution context introduced in JavaScript which modifies the language behavior to make it more consistent between implementations. It disables certain features that were considered harmful and increases consistency across the board. Strict Mode helps prevent common errors and makes JavaScript code safer.

The issue is caused by a conflict between block-scoped declarations in strict mode. Since your Laravel Mix setup is running strictly within strict mode, it's unable to handle let or const block-scoped variables correctly. As a result, you get the error "Block-scoped declarations (let, const, function, class) not yet supported outside strict mode."

To solve this problem, there are a few approaches:
1. Use global variables instead of let/const block-scoped variables in your webpack configuration if these variables need to be accessed from multiple places.
2. If you can't modify the Webpack config file or use globals, you could try temporarily disabling strict mode by putting 'use strict'; at the top of each file that requires let/const declarations within the same scope. However, this approach is not recommended for production environments as it goes against best practices and increases the risk of bugs in your code.
3. Upgrade to a newer version of Laravel (if possible) or switch to another framework with better support for modern JavaScript features.

In conclusion, the issue is caused by a conflict between block-scoped declarations and strict mode in your Webpack configuration file. To solve this problem, you can either use global variables or disable strict mode temporarily if necessary. Ultimately, upgrading to a newer Laravel version or switching frameworks may be the best long-term solution for better JavaScript support and code consistency.
