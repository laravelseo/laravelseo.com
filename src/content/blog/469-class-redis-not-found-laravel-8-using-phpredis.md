---
title: "Class \"Redis\" Not Found laravel 8, using phpredis"
description: "Title: Troubleshooting \"Class 'Redis' not Found\" Error When Using Phpredis with Laravel 8 Body: Many developers using Laravel 8 have encountered the..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Performance", "PHP"]
featured: false
---

Title: Troubleshooting "Class 'Redis' not Found" Error When Using Phpredis with Laravel 8

Body:

Many developers using Laravel 8 have encountered the frustrating error 'Class "Redis" Not Found' when they try to run <code>php artisan config:clear</code>. A common case is when attempting to configure Redis clients in their application, such as for caching purposes. This issue can be confusing, since Redis functionality appears to work during testing, but errors occur when executing the command that clears configuration files. In this article, we will explain why this happens and how to fix it by providing a step-by-step guide.

Before diving into the solution, let's understand what might be happening behind the scenes with Laravel 8 and Redis. When you configure Redis in your application, it typically involves setting up a connection using PHP extensions. However, when you run <code>php artisan config:clear</code>, the configuration files get cleared, wiping out the connection details, which causes the previously working but undefined class 'Redis' to throw an error.

Now that we understand what could be causing the problem, let's fix it by making a few changes in your Laravel 8 application. Here are the steps:

1. Go to your <code>config/app.php</code> file and find the 'aliases' section. This is where you can configure the class name for different components of your project, including Redis and other packages. Note that this step is essential in preventing conflicts with global packages that may have their own alias for Redis.

2. Locate the following line (possibly commented): <code>// 'Redis' =&gt; Illuminate\Support\Facades\Redis::class,</code>. Uncomment this line and make sure it is included in your <code>config/app.php</code> file.

3. If you are using a global Redis package or some other extension with an alias for Redis, add that to the 'aliases' section. This will ensure the correct class name is being used for the Redis implementation of your choice.

4. Next, go to your <code>App\Models\Setting</code> file and check the usage of Redis in any methods or functions. Ensure that you are using the correct alias for Redis, such as 'Redis::set' or 'RedisFacade::set'.

5. Finally, if you have other extensions like PhpRedisConnector depending on Redis, ensure they are set up correctly and that all alias usages in your application point to the appropriate class name.

By following these steps, you should be able to resolve the 'Class "Redis" Not Found' issue when using phpredis with Laravel 8. Always keep in mind that proper configuration of aliases and dependencies is crucial for avoiding conflicts and ensuring smooth integration between different packages and extensions in your application. Happy coding!
