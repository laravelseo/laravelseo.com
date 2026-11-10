---
title: "Fatal error: Array and string offset access syntax with curly braces is no longer supported in php 8.0 pkcs5_unpad"
description: "Title: Understanding and Resolving Fatal Errors Related to Deprecated Array Syntax in PHP 8.0's pkcs5 unpad Function Introduction Modernizing your codebase..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Content", "PHP", "Errors"]
featured: false
---

Title: Understanding and Resolving Fatal Errors Related to Deprecated Array Syntax in PHP 8.0's pkcs5_unpad Function

Introduction
Modernizing your codebase is crucial for ensuring that your applications are up-to-date and perform optimally. However, with each new version of the PHP language comes changes in syntax and practices that may require adjustments to existing code. In this blog post, we'll discuss a common error related to array access syntax and how you can resolve it when working with the pkcs5_unpad function in PHP 8.0.

The Fatal Error: Array and String Offset Access Syntax with Curly Braces is No Longer Supported
PHP 8.0 introduces several changes, one of which involves deprecating the use of curly braces for array offset access. Here's an example of the code that triggers this error:

<pre class="lang-php prettyprint-override"><code>if (!function_exists(&quot;pkcs5_unpad_e&quot;)) {
    function pkcs5_unpad_e($text) {
        $pad = ord($text{strlen($text) - 1});
        if ($pad &gt; strlen($text))
            return false;

        return substr($text, 0, -1 * $pad);
    }
}
</code></pre>

The issue lies in the usage of curly braces within array access syntax: `$text{strlen($text) - 1}` vs. `$text[strlen($text) - 1]`. The latter is the recommended and supported way to access an element in PHP arrays since PHP 8.0.

Resolving the Error
To resolve this error, you can replace the curly braces with square brackets:

<pre class="lang-php prettyprint-override"><code>if (!function_exists(&quot;pkcs5_unpad_e&quot;)) {
    function pkcs5_unpad_e($text) {
        $pad = ord($text[strlen($text) - 1]);
        if ($pad &gt; strlen($text))
            return false;

        return substr($text, 0, -1 * $pad);
    }
}
</code></pre>

With this change in mind, let's break down the code that causes the error and see what it does:

- Line 1: If pkcs5_unpad_e function is not defined yet, define it.
- Lines 2 and 3: Define a function named pkcs5_unpad_e with one argument, $text.
- Lines 4 and 5: Retrieve the padding value (represented by pad) from the last character of the text.
- Line 6: Check if the padding is greater than the length of the string. If so, return false, indicating an invalid padded input.
- Lines 7 and 8: Return a new string containing the unpadded data after stripping off the trailing bytes determined by the padding value (pad).

Conclusion
As PHP continues to evolve and introduce updates that impact syntax and functionality, keeping up with these changes is vital to prevent errors and maintain optimal performance. In this blog post, we've discussed a specific error related to array access syntax in a pkcs5_unpad function and provided an example of how it can be resolved. To learn more about PHP 8.0 updates and best practices, visit our website at https://laravelcompany.com.
