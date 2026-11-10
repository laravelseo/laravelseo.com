---
title: "How to use scss files in Laravel"
description: "Title: Efficiently Integrating SCSS Files into Your Laravel Application Body: Incorporating third party themes or design elements into your Laravel..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "JavaScript", "HTML"]
featured: false
---

Title: Efficiently Integrating SCSS Files into Your Laravel Application

Body:

Incorporating third-party themes or design elements into your Laravel application can be a simple yet effective approach to enhance its visual appeal. However, the challenge arises when these themes utilize SCSS files instead of pure CSS. In this comprehensive guide, we'll explore how you can seamlessly incorporate SCSS files from an external theme into your Laravel project while following best practices for optimal performance and maintainability.

We have a free HTML theme with SCSS files that we want to integrate into our Laravel application. First and foremost, you need to create the necessary file structure in your Laravel project to house these new SCSS resources. To do this:

1. Create a `scss` folder under your `public/assets` directory or any other appropriate location based on your project's architecture.
2. If required assets such as images, fonts, or JavaScript files are part of the theme, create folders within `public/assets` to organize them accordingly.
3. Move all SCSS files from their original location in the HTML theme into the new `scss` folder you just created.
4. Rename the imported file paths in the HTML theme's CSS files (e.g., from `styles.css` to `custom.css`) so that there is no conflict with your Laravel project's default CSS stylesheet.

Now, let us examine how we can compile and utilize these SCSS files within our Laravel application:

1. Install the required library for compiling SCSS files using Composer by running the following command in your terminal: `composer require laravel/sail` (if you're using Sail) or `composer require laravel/sail-docker:extended`.
2. Configure your Laravel application to compile and minify SCSS files automatically by adding the following lines to the `config/app.php` file:
   ```php
    'providers' => [
        // ...
        \Laravel\Sail\ServiceProvider::class,
        \Laravel\Sail\DockerServiceProvider::class,
        // ...
        \Illuminate\View\FactoryServiceProvider::class,
        \Illuminate\Contracts\Debug\DelegateProviders::class,
    ],
   ```
3. Add the following code to your `webpack.mix.js` file:
   ```javascript
    mix
        .options({
            processCssUrls: false,
        })
        // ... (other configurations)
        .webpackConfig(config => {
            config.module.rules.push({
                test: /\.(scss|sass)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: ['tailwindcss'],
                            },
                        },
                    },
                    {
                        loader: 'resolve-url-loader',
                    },
                    'sass-loader',
                ],
            });
        });
   ```
4. Finally, load the custom CSS file (i.e., `custom.css`) in your HTML layout template using Laravel's built-in assets helper:
   ```html
   <link rel="stylesheet" href="{{ asset('public/assets/custom.css') }}">
   ```

You have successfully included SCSS files from an external theme into your Laravel application. Remember to always follow best practices for maintainability and efficiency, such as organizing your assets appropriately, compiling assets via Sail or other tools, and optimizing performance by minimizing CSS imports.

In conclusion, integrating SCSS files from a third-party HTML theme in your Laravel project is relatively straightforward with the right preparation and understanding of the tools at our disposal. By following this comprehensive guide, you can easily achieve your desired results while adhering to industry best practices for optimal performance and maintainability.
