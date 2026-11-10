---
title: "laravel 5.2 custom log file for different tasks"
description: "Title: Managing Custom Log Files for Different Tasks in Laravel 5.2 Introduction Laravel is an incredibly powerful PHP framework that offers a robust logging..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Managing Custom Log Files for Different Tasks in Laravel 5.2

Introduction
Laravel is an incredibly powerful PHP framework that offers a robust logging system to help developers keep track of their applications' activities. While the default log file, laravel.log, serves as a central place for most logs, there may be situations where you might want to create and maintain separate log files for different purposes. In this blog post, we will explore how to implement custom log files for order-related and payment-related tasks in Laravel 5.2, while following best practices and using helpful code examples.

Creating Custom Log Files
To start creating a custom log file, first let's create two directories under the "storage" directory - one for payments logs (payments) and another for order logs (orders). Inside each of these directories, you will create an empty file to serve as your new log file. For example:

```bash
mkdir storage/logs/payments
touch storage/logs/payments/payment_log.log

mkdir storage/logs/orders
touch storage/logs/orders/order_log.log
```

Modifying Logging Configuration File
Next, open the laravel.log file (at app/config/logging.php) and set the location of your custom log files:

```php
'daily' => array(
	'driver'   => 'daily',
	'path'     => storage_path() . '/logs/laravel.log', // Change this to your desired path
	'file'     => null,
	'level'    => 'debug',
	'daily'    => true,
	'location' => 'public',
	'rotation_interval' => 12,
),

'payments' => array(
	'driver'   => 'single',
	'path'     => storage_path() . '/logs/payments/payment_log.log', // Modify this path to your payment log file location
	'file'     => null,
	'level'    => 'debug',
),

'orders' => array(
	'driver'   => 'single',
	'path'     => storage_path() . '/logs/orders/order_log.log', // Modify this path to your order log file location
	'file'     => null,
	'level'    => 'debug',
)
```

For more advanced logging configuration options like changing the rotation interval or configuring multiple log files for a single channel, you can refer to Laravel's official documentation.

Using Logging Facade
Now we need to use the correct channels in our code for writing logs to their respective custom log files. To do this, we will update the existing code for order and payment related tasks as follows:

For Order Task (OrderController):
```php
use Illuminate\Support\Facades\Log;

public function store(Request $request) {
	// ...
	Log::channel('orders')->info('An order has been placed.'); // Logging to orders log file.
	// ...
}

For Payment Task (PaymentController):
use Illuminate\Support\Facades\Log;

public function store(Request $request) {
	// ...
	Log::channel('payments')->info('A payment has been processed.'); // Logging to payments log file.
	// ...
}
```

Conclusion
In this blog post, we have covered how to create and use custom log files for order-related tasks in Laravel 5.2 using the logging configuration file and the logging facade. This approach allows developers to keep track of their applications' activities with more granularity and better organization. As always, make sure you test your code thoroughly before deploying it to your production environment. For further information on custom log files or any other Laravel-related topics, feel free to visit our website at https://laravelcompany.com.
