---
title: "Laravel - generate unique order number"
description: "Generating Unique Order Numbers in Laravel When developing a web application involving orders, one of the crucial factors that play a significant role is..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Content", "PHP"]
featured: false
---

Generating Unique Order Numbers in Laravel

When developing a web application involving orders, one of the crucial factors that play a significant role is maintaining the uniqueness of order numbers. In this article, we will discuss how to generate unique order numbers while keeping their formatting consistent with the given example #00000001. Firstly, let's break down the provided seed code and its implementation.

Seed Code for Order Numbers:

```php
foreach (range(1, 25) as $index) {
    DB::table('orders')->insert([
        'user_id' => rand(1, 25),
        'order_nr' => '#' . sprintf("%08d", $index),
        'price_sum' => $faker->randomNumber($nbDigits = 4, $strict = false) . '.' . $faker->randomNumber($nbDigits = 2, $strict = false),
        'status' => $faker->randomElement(['paid', 'pending', 'failed']),
        'created_at' => Carbon::now(),
        'updated_at' => Carbon::now(),
    ]);
}
```

This code snippet creates 25 orders, each with a unique order number in the format '#0000000n' where n represents the index. The function `sprintf("%08d", $index)` is responsible for padding the numbers to eight digits with leading zeros. If you want all your generated numbers to be sequential, you can adjust the range of the `foreach` loop accordingly.

Now let's move on to generating unique order numbers in the controller:

```php
public function create() {
    $order = new Order;

    $lastOrderNumber = DB::table('orders')->latest()->value('id'); // Retrieve the latest ID
    if (!$lastOrderNumber) {
        $lastOrderNumber = 1;
    } else {
        $lastOrderNumber++;
    }
    $order->user_id = Auth()->id();
    $order->order_nr = '#' . sprintf("%08d", $lastOrderNumber); // Prefix the number with #

    // Add more order details and save the object to the database
    $order->save();
    return view('steps.order');
}
```

In this controller method, we first retrieve the latest order ID from the database and use it as a starting point for the next generated order number (in case there is one). If no records are found, we assume that the last order was #00000001. After incrementing the last order ID by 1, we format the updated order number with leading zeros, and create a new order instance using it. Lastly, we save the order object to the database.

In conclusion, generating unique order numbers comes down to keeping track of the latest generated number (or ID) and incrementing it for the next request. By utilizing the Laravel Eloquent library, you can easily retrieve data from your database and use it in your code. Remember always to check if there are any existing records before creating new ones as this helps prevent duplicate order numbers. This approach guarantees consistency and uniqueness in your application's order numbering system.
