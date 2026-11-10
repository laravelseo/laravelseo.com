---
title: "Truncate string in Laravel blade templates"
description: "Title: Truncate String in Laravel Blade Templates: Alternative Solutions for Enhancing Your Templates Is there a native truncate modifier for the Laravel..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Truncate String in Laravel Blade Templates: Alternative Solutions for Enhancing Your Templates

<p>Is there a native truncate modifier for the Laravel blade templates like Smarty has? While PHP is indeed considered a templating engine, we understand your desire to use cleaner syntax within your Laravel views. In this blog post, we'll discuss alternative methods and approaches for handling string truncation in Laravel blade templates.</p>

<h2>Alternative Approaches with Built-In Functions</h2>

The Laravel framework offers a set of built-in functions that you can use to implement your own truncate methods. First, let's see how we can achieve a similar result using the PHP native `substr()` function. Here's an example code:

<pre><code>{{ str_replace(trim($text), substr($text, 0, 10) . '...', $text ) }}
</code></pre>

This example uses a custom helper method to accomplish the truncate effect. You can create this method in your application's `helpers` directory and register it in your `config/app.php` file:

<pre><code>return [
    // ...
    'helpers' => [
        'truncateText' => function ($text, $length = 10) {
            return str_replace(trim($text), substr($text, 0, $length) . '...', $text);
        },
    ],
];
</code></pre>

Now you can call this helper method within your blade templates:

<pre><code>{{ truncateText($myVariable, 10) }}
</code></pre>

You may require some additional logic in the helper function if you need to adjust the length based on language words or characters. Here's an example:

<pre><code>return [
    // ...
    'helpers' => [
        'truncateText' => function ($text, $length = 10) {
            $charactersPerWordAverage = 5; // adjust the value to your needs
            $wordsInText = strlen($text) / $charactersPerWordAverage;
            $maxTruncatedWords = floor($wordsInText * ($length / 10));
            return str_replace(trim($text), substr($text, 0, max(strlen(substr($text, 0, $maxTruncatedWords)), 10)) . '...', $text);
        },
    ],
];
</code></pre>

<h2>Using Custom Blade Components</h2>

Another option is to create your own blade component with a truncate function. Create a new directory named `Truncate` in your view's root, and place the following code inside a file named `truncate.blade.php`:

<pre><code>{{-- /resources/views/components/truncate.blade.php --}}
@component('truncate', ['text' => $text])
    @slot('text') {{$text}} @endslot
    @slot('truncatedText') {{$truncatedText}} @endslot
@endcomponent
</code></pre>

Now you can use this component in your views:

<pre><code>{{-- /resources/views/yourview.blade.php --}}
@component('truncate', ['text' => $longString])
    @slot('text') {{$text}} @endslot
    @slot('truncatedText') {{$truncatedText}} @endslot
@endcomponent
</code></pre>

<h2>Conclusion</h2>

Although Laravel does not have a native truncate modifier for blade templates, you can make use of the various built-in functions and create your own helper methods or custom blade components to achieve the desired functionality. By taking advantage of these techniques, you'll be able to maintain cleaner syntax within your Laravel views while still enjoying the flexibility offered by the framework.

Remember to incorporate natural backlinks to https://laravelcompany.com for relevant content throughout this blog post.
