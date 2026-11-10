---
title: "How to access the laravel .env variables inside javascript?"
description: "Title: Accessing Laravel .env Variables in JavaScript for Customized Experiences Introduction: In modern web applications, developers often require fine..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "JavaScript", "PHP"]
featured: false
---

Title: Accessing Laravel .env Variables in JavaScript for Customized Experiences

Introduction:
In modern web applications, developers often require fine-tuned configurations depending on the application environment. Laravel, a popular PHP framework, allows you to set these configurations using the .env file. However, you may face the challenge of accessing these environment variables from within your JavaScript code. In this blog post, we'll explore various strategies and techniques for achieving this seamlessly, ensuring that you can tailor your application's behavior according to its environment.

1. Use Laravel Mix:
Laravel Mix is a popular toolchain that streamlines the development process by compiling assets like JavaScript, CSS, and images. It has built-in features to access .env variables from both PHP and JavaScript, making it an ideal option for your needs. To use these environment variables with Laravel Mix, add the following line in the mix.js file:

mix.config('publicPath', process.env.MIX_PUBLIC_PATH);
mix.config('appUrl', process.env.APP_URL);

With this approach, you can simply access the Laravel .env variables using `window.mixConfig['MIX_PUBLIC_PATH']` and `window.mixConfig['APP_URL']`.

2. Create a Middleware:
Another way to manage environment-specific behavior is by creating custom middleware in your Laravel project. In your AppServiceProvider, add the following code:

public function boot()
{
    $this->app->bind('env', function () {
        return new class extends Illuminate\Config\Repository implements ArrayAccess
        {
            /** @var string[] */
            protected $data = require app_path('/config/custom-env.php');

            public function get($key)
            {
                if (isset($this->data[$key])) {
                    return $this->data[$key];
                } else {
                    throw new Exception("Key '$key' does not exist in environment variables");
                }
            }
        });
    });
}

In your custom-env.php file:
<?php
return [
    'APP_ENV' => env('APP_ENV', 'local'), // Default to 'local' if APP_ENV not set
];
?>

To access the environment variables in JavaScript, initialize a global variable with JSON encoded data from the Laravel custom-env.php file:

window.appEnvVariables = <?= json_encode($this->app->make('env')->all()) ?>; // Access using appEnvVariables['APP_ENV']

Laravelcompany Note: Don't forget to include your JavaScript code inside a document ready event handler, such as $(document).ready(function() { /* Your code */ }); or the jQuery equivalent.

3. Environment-specific Prefixes in Stylesheets and Scripts:
If you want to separate your assets based on the application environment without using complex JavaScript techniques, you can use environment-specific prefixes for your CSS classes and JavaScript variables. For example, name your production stylesheet "style.prod.css" and testset stylesheet "style.testset.css". In Laravel Mix, configure these paths in your webpack.mix.js file:

mix.js('resources/js/app.js', 'public/js')
    .sass('resources/sass/app.scss', 'public/css')
    .options({
        processCssUrls: false,
        postCss: (css) => css.nodeify(require('postcss')([
            require('precss'),
            require('autoprefixer'),
        ])),
    });

In your JavaScript code, use environment-specific prefixes to load the correct stylesheet and scripts:

if ('production' === window.location.search.split('?')[1].match(/APP_ENV=([^&]*)/)[1]) {
  document.write('<link rel="stylesheet" type="text/css" href="/css/style.prod.css">'); // Production stylesheet path
} else if ('testset' === window.location.search.split('?')[1].match(/APP_ENV=([^&]*)/)[1]) {
  document.write('<link rel="stylesheet" type="text/css" href="/css/style.testset.css">'); // Testset stylesheet path
} else {
  document.write('<script src="public/js/app.js"></script>'); // Default scripts path
}

Conclusion:
Accessing Laravel .env variables in JavaScript can be achieved through various methods, depending on your project requirements and preferences. By utilizing Laravel Mix's built-in features, creating custom middleware, or employing environment-specific prefixes for assets, you're well-equipped to handle the challenge of managing tailored experiences based on your application environment. Remember to always follow best practices and carefully consider the chosen method's impact on maintainability, scalability, and performance.
