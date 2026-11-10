---
title: "LogicException: Please make sure the PHP Redis extension is installed and enabled"
description: "Title: Solving LogicException: Please Make Sure the PHP Redis Extension Is Installed and Enabled Introduction Laravel's Redis component is an excellent..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Performance", "PHP", "Errors"]
featured: false
---

Title: Solving LogicException: Please Make Sure the PHP Redis Extension Is Installed and Enabled

Introduction

Laravel's Redis component is an excellent choice for handling data persistence, caching, and queues in your Laravel application. However, if you face the error "LogicException: Please make sure the PHP Redis extension is installed and enabled" even after installing the correct PHP Redis extension, don't panic! This post will guide you through possible solutions to fix this issue.

1. Verify PHP Redis Extension Installation and Enabled Status

Firstly, check whether the PHP Redis extension is already installed on your server. You can run the following command in your Laravel application root:

```php
php -m | grep redis
```

If you see output such as "redis", it means that the Redis module is loaded by the php-fpm. However, if there's no output, chances are high that you don't have PHP Redis installed or enabled. To resolve this, install and enable the extension using the following command:

```bash
sudo pecl install redis
sudo echo "extension=redis.so" > /etc/php/7.2/mods-available/redis.ini
sudo phpenmod redis
```

If you've recently installed PHP 8, replace '7.2' with the appropriate version number in the above commands. After this step, run the 'php -m | grep redis' command again to confirm that the Redis module is now loaded.

2. Ensure correct Redis driver configuration

Laravel provides multiple ways to connect to a Redis server: Predis or Phpredis drivers. Check if you are using the right one by inspecting your Laravel project's config/app.php file:

```php
'redis' => [
    'default' => [
        'connection_name' => env('REDIS_CONNECTION'),
        'host'            => env('REDIS_HOST', '127.0.0.1'),
        'port'            => env('REDIS_PORT', 6379),
        'database'        => env('REDIS_DATABASE', 0),
    ],
],
```

In the above code snippet, you can see a list of Redis configuration settings. Make sure your Laravel application is set to use PHPRedis (Phpredis) driver instead of Predis. If it's not specified, Laravel uses Predis by default. To make this change, modify the 'connection_name' key in the relevant section with "redis":

```php
'redis' => [
    'default' => [
        'connection_name' => env('REDIS_CONNECTION', 'redis'), // Change to 'redis'
        ...
        ],
    ]
],
```

3. Verify Redis configuration and connection

Ensure that your Redis server is configured properly and accessible from the Laravel project. If you are using Docker for local development, make sure your container is connected to your host machine. In case of AWS Elasticache or any other managed Redis service, ensure you can connect to it by using the provided credentials.

4. Flush and restart the Redis server

Sometimes, a simple flush of the Redis database might help resolve this issue. Run the following command from your Redis instance:

```bash
redis-cli FLUSHALL
```

After flushing the cache, you can restart the Redis server using:

```bash
sudo service php8.2-fpm restart || sudo systemctl restart php8.2-fpm
```

5. Conclusion

If after trying all these methods, the issue persists, feel free to contact your hosting provider or Laravel community for further assistance. Make sure to provide the error log and relevant configuration details as they might help in diagnosing the root cause of the problem. Ensure that you have connected your application to the correct Redis instance and that the PHP Redis extension is properly installed and enabled on your server. With these steps, you should be good to go in utilizing the Laravel Redis component for efficient data persistence and caching.
