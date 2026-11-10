---
title: "Laravel - How to use onesignal notification"
description: "Laravel & OneSignal: Sending Real Time Product Notifications via Backend Data As a senior developer working with Laravel, you are looking to leverage your..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

As a senior developer working with Laravel, you are looking to leverage your robust backend system to provide real-time updates to your mobile users. Implementing push notifications through services like OneSignal is an excellent way to enhance user engagement—for example, notifying users immediately when a new product is added to the inventory.

You have already taken the crucial first step by installing the `laravel-notification-channels/onesignal` package and setting up the basic controller methods (`via` and `toOneSignal`). The challenge now shifts from *how* to format the notification to *when* and *how* to trigger this process automatically when a database change occurs.

This guide will walk you through the architectural pattern required to bridge your Laravel backend events with your OneSignal notifications, ensuring scalability and reliability.

## Understanding the Notification Flow in Laravel

The core difficulty isn't setting up the endpoint; it’s managing the asynchronous nature of sending push notifications. A user action (like inserting a product) should not wait for an external service call (like notifying thousands of app users) to complete. This is where Laravel’s Event and Queue system becomes indispensable.

### Step 1: Define the Event

First, define an event that signifies a new product has been created. This typically happens within your Eloquent model or a dedicated service layer after a successful database transaction.

```php
// Example: In your Product model or a dedicated Service class
use App\Events\ProductCreated;

class ProductService
{
    public function createProduct(array $data)
    {
        // 1. Perform the database insertion
        $product = Product::create($data);

        // 2. Fire the event when the product is successfully created
        event(new ProductCreated($product));

        return $product;
    }
}
```

### Step 2: Create the Listener

Next, create a Listener that will execute the notification logic when the `ProductCreated` event is fired. This listener will be responsible for calling the OneSignal integration you set up.

```php
// app/Listeners/SendOneSignalNotification.php
use App\Events\ProductCreated;
use NotificationChannels\OneSignal\OneSignalMessage;

class SendOneSignalNotification
{
    public function handle(ProductCreated $event)
    {
        $product = $event->product; // Access the newly created product data

        // Construct the notification details
        $subject = "New Product Added: {$product->name}";
        $body = "A new product, {$product->name}, has been added to the catalog.";
        $url = route('products.show', $product->id); // Assuming you have a route set up

        // Use the package implementation to prepare the message
        $message = OneSignalMessage::create()
            ->subject($subject)
            ->body($body)
            ->url($url)
            ->webButton(
                OneSignalWebButton::create('details')
                    ->text('View Product')
                    ->icon('https://upload.wikimedia.org/wikipedia/commons/4/4f/Laravel_logo.png')
                    ->url(route('products.show', $product->id))
            );

        // Dispatch the job to be handled asynchronously
        // This is crucial for performance!
        NotificationJob::dispatch($message); 
    }
}
```

### Step 3: Implement Asynchronous Processing with Queues

Instead of executing the notification logic directly inside the listener, you should dispatch a Job to a queue. This ensures that if the OneSignal API call experiences latency or failure, your main application thread remains responsive. This pattern aligns perfectly with modern Laravel best practices for handling heavy operations, as promoted by principles found in frameworks like those underpinning **Laravel** itself.

You would then define a Queueable Job:

```php
// app/Jobs/SendOneSignalNotificationJob.php
class SendOneSignalNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $message;

    public function __construct($message)
    {
        $this->message = $message;
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
        // This is where you would use the NotificationChannels package 
        // to actually send the request to OneSignal.
        \NotificationChannels\OneSignal\OneSignalService::send($this->message);
    }
}
```

## Conclusion: The Power of Decoupling

By decoupling your database insertion from the notification delivery using Laravel Events and Queues, you achieve a highly scalable and resilient system. You no longer rely on synchronous web requests to manage external communication. This approach ensures that even under heavy load, new product creations are handled swiftly, and notifications are reliably sent to your users via OneSignal. Remember, when building complex applications in Laravel, always favor the architecture that separates concerns—events for triggering, queues for processing, and services for executing logic.
