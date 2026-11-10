---
title: "PHP7.1 and Laravel 5.3: Function mcrypt_get_iv_size() is deprecated"
description: "Title: Resolving \"mcrypt get iv size() is deprecated\" Error when Upgrading from PHP7.0 to 7.1 with Laravel 5.3 Body: When updating your PHP version, it's not..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Title: Resolving "mcrypt_get_iv_size() is deprecated" Error when Upgrading from PHP7.0 to 7.1 with Laravel 5.3

Body:

When updating your PHP version, it's not uncommon to encounter deprecation warnings or runtime errors such as the one mentioned in your scenario. The "mcrypt_get_iv_size() is deprecated" error might cause issues, and you may wonder if upgrading Laravel to 5.3 can solve this problem. Before jumping into that solution, let's first understand the issue at hand and then discuss possible alternatives.

The mcrypt extension, which provides encryption and decryption functions, is deprecated in PHP 7.1. This change means you should start looking for better alternatives or use other extensions like OpenSSL to replace it. However, Laravel 5.3 does not use the mcrypt extension directly but does rely on some libraries that use mcrypt internally, such as Monolog.

To solve this issue without upgrading Laravel:
1. Replace the "mcrypt_get_iv_size()" function calls in your code with alternative methods. For instance, you can consider using the OpenSSL extension or other encryption libraries that are not based on mcrypt.
2. If possible, use a custom cryptographic library like PyCrypto (for Python) or another PHP-based library instead of directly relying on the deprecated functions in your project.
3. Keep your PHP version at 7.0 and address the security vulnerabilities by reviewing your code and ensuring it is up-to-date with current best practices. You can refer to the official Laravel documentation or our tutorials at https://laravelcompany.com for guidance on these best practices.
4. If you decide to update PHP to 7.1, consider using a more modern framework like Laravel 5.3 that supports PHP7.1 and has already addressed this deprecation issue within their codebase. This will also ensure your project benefits from other improvements and features brought by the newer versions of both PHP and Laravel.
5. In cases where updating PHP to 7.1 is not an option, you can look into downgrading the offending library to a version that does not use mcrypt internally or use alternative libraries like OpenSSL for encryption needs instead.

In conclusion, while updating your PHP and Laravel versions might solve the problem, it's not always necessary if your project is already stable and functional. It's crucial to prioritize security by addressing any vulnerabilities that could arise from using deprecated functions or extensions. If you do decide to upgrade, consider adopting a more modern framework like Laravel 5.3 for seamless integration with the latest PHP versions. As always, when in doubt, consult a professional service such as the Laravel Company for expert advice tailored to your project's specific needs and requirements.
