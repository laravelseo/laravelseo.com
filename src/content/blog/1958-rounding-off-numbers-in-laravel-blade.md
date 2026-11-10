---
title: "Rounding Off numbers in Laravel Blade"
description: "Title: Rounding Off Numbers in Laravel Blade A Practical Guide Introduction Rounding off numbers is an essential skill for any developer or designer working..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Rounding Off Numbers in Laravel Blade - A Practical Guide

Introduction
Rounding off numbers is an essential skill for any developer or designer working with data presentation. In Laravel, you can work on it by leveraging its template engine, called Blade. This blog post aims to provide a comprehensive guide for rounding numbers displayed in Laravel Blade views, along with the necessary code examples and best practices.

1. Understanding Number Formatting in PHP
Prior to rounding off numbers in Laravel Blade, it's essential to grasp PHP's number format function. The number_format() function is used for formatting a numeric value as a string. It takes three arguments: the number to be formatted, the minimum integer number of digits after the decimal point (optional), and the total number of digits after the decimal point (also optional). When given no other parameters, it will use a default fractional digit of two and display zeros when replacing missing digits.

2. Rounding Off Numbers with PHP's Number Format Function
Here's how you can round numbers in Laravel Blade views using the number_format() function:
<pre><code>$subtotal = 40.608;
$roundedSubtotal = number_format($subtotal, 2);

$subtotalquant = 10.152;
$roundedSubtotalquant = number_format($subtotalquant, 2);
</code></pre>
This code will round off the subtotals to two decimal places and assign them to their corresponding variables with new values. You can then use these variables in your Blade views, like so:
<pre><code>&lt;td&gt;
    &lt;p class="text-right"&gt;
        &lt;h5&gt;
            @php
                echo"&amp;#8369;$roundedSubtotal";
            @endphp
        &lt;/h5&gt;
    &lt;/p&gt;
&lt;/td&gt;
</code></pre>
The result will display the rounded subtotals with a currency symbol, as shown in your example image.

3. Using Laravel Helpers to Round Numbers in Blade Views
Laravel comes with several helpful helpers that you can use to round off numbers and make them easier to work with. Let's take a look at two of these helpers:
<pre><code>&lt;td&gt;
    &lt;p class="text-left"&gt;
        &lt;h5&gt;Discount ( @php echo "- ".round($subtotalquant, 2); @endphp )&lt;/h5&gt;
    &lt;/p&gt;
&lt;/td&gt;
</code></pre>
<pre><code>&lt;td&gt;
    &lt;p class="text-right"&gt;
        &lt;h5&gt;
            @php
                echo"&amp;#8369;" . number_format(round($subtotal, 2), 0, '.', ',').";
            @endphp
        &lt;/h5&gt;
    &lt;/p&gt;
&lt;/td&gt;
</code></pre>
The first example uses the round() function to round off the subtotalquant variable to two decimal places and incorporates it into the discount text. The second example showcases another Laravel helper, number_format(), which allows you to format numbers with custom decimal place settings.

4. Conclusion
Rounding off numbers in Laravel Blade views can be accomplished using a combination of PHP's number formatting function and Laravel helpers. Following the provided examples, you should now have all the necessary tools at your disposal for rounding numbers to any desired decimal place in your Laravel applications. Remember always to use appropriate data types (e.g., float or double) when working with numbers to avoid potential issues with formatting and rounding.
