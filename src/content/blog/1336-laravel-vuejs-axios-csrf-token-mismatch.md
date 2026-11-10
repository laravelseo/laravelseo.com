---
title: "Laravel + Vue.js (axios) - CSRF token mismatch"
description: "Title: Troubleshooting Laravel + Vue.js (axios) CSRF Token Mismatch Issue Body: When developing web applications with Laravel and Vue.js, you may encounter..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "HTML", "PHP"]
featured: false
---

Title: Troubleshooting Laravel + Vue.js (axios) CSRF Token Mismatch Issue
Body: <p>When developing web applications with Laravel and Vue.js, you may encounter the occasional "CSRF token mismatch" error when making a POST request via axios. This issue occurs specifically when using Axios with Laravel's default CSRF protection. Thankfully, it is relatively easy to tackle this problem through understanding the causes and applying some simple solutions.</p>

<h2>Understanding the Cause</h2>
The "CSRF token mismatch" issue usually arises due to either a missing or incorrectly set CSRF token in the request header. In Laravel, the CSRF (Cross-site Request Forgery) token is used to help prevent CSRF attacks by ensuring that only authenticated users have access to sensitive data and functionality through your application. Laravel provides an excellent protection layer for CSRF tokens via its built-in middleware in Kernel.php.

<h2>Best Practices</h2>
To avoid the "CSRF token mismatch" issue, make sure to follow these best practices:

1. Ensure that you have included `@csrf` on your form or used the Laravel Resource Controller for resourceful routes. This will automatically include the CSRF token in the HTML form.
2. Include a meta tag containing the CSRF token in App.blade.php and bootstrap.js file, as shown earlier in this post.
3. Always set up middleware protection in your Kernel.php to ensure that only authenticated users can access your application's critical routes. This will help maintain CSRF token consistency.

<h2>Solutions</h2>
If the issue persists despite following best practices, try these recommended solutions:
1. Clear Laravel config cache and rebuild it by running `php artisan config:clear` followed by `php artisan config:cache`.
2. Ensure proper use of tokens in your application. Include both 'X-CSRF-TOKEN' and 'csrf_token' meta tags to avoid confusion, as shown earlier in this post.
3. Consider using the Laravel Sanctum package for authentication and authorization when working with API routes. It integrates well with Vue.js and can help eliminate CSRF issues.
4. Inspect your application's cookies through a developer console to ensure that the CSRF token is present, correct, and not expired.
5. If all else fails, try disabling Laravel's CSRF protection by commenting out `VerifyCsrfToken::class` from your middleware group in Kernel.php. This ensures that no tokens are checked, but we recommend doing this only as a temporary solution to identify the cause of the issue.

<h2>Conclusion</h2>
In conclusion, Laravel's CSRF protection is an essential security feature for your web applications, and understanding how it works with Axios can help you avoid the "CSRF token mismatch" error that occasionally arises. By following best practices, setting up proper middleware, and troubleshooting as needed, you can maintain a secure Laravel + Vue.js (axios) application.
