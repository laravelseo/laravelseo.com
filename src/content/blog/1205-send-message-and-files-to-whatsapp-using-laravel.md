---
title: "Send message and files to whatsapp using laravel"
description: "Title: Easily Send WhatsApp Messages and Files Using Laravel: A Comprehensive Guide Introduction You may find yourself in a situation where your application..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Easily Send WhatsApp Messages and Files Using Laravel: A Comprehensive Guide

Introduction

You may find yourself in a situation where your application needs to send text messages and files over WhatsApp to your users or customers. In this comprehensive blog post, we'll guide you on how to achieve this using Laravel, a popular PHP framework. We will discuss setting up the environment, creating the necessary code, and working with webhooks for seamless communication between your application and WhatsApp.

Setting Up Your Environment

Before diving into writing the code, you'll need to ensure that you have the proper tools and dependencies installed on your computer. Here are some steps to get started:

1. Install the latest version of Laravel on your system by following the official documentation: https://laravel.com/docs/8.x/installation
2. Ensure you have Composer, a dependency manager for PHP packages, installed. If not, install it using `php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');
   require 'composer-setup.php'; Composer\Autoload\includeFile('composer/autoload_real.php');"
3. Run `composer create-project laravel/laravel appname` to create a new Laravel application named "appname".
4. Install the WhatsApp Business API PHP SDK using Composer: `composer require whatsapp/webapi` (or the specific version you need, like `composer require whatsapp/webapi:^1.0`)
5. Configure your Laravel application environment variables to include your WhatsApp login credentials and token: https://developers.facebook.com/docs/whatsapp/cloud-api/getting-started/installation

Creating the Code

Once you've set up your environment, let's start writing the code. You'll need to create a new controller named "WhatsAppController" with the following content:

<?php
namespace App\Http\Controllers;
use WhatsApp\WebAPI\Client;
class WhatsAppController extends Controller {
    private $client;
    public function __construct(Client $client) {
        $this->client = $client;
    }

    public function index() {
        $user = 'Work Data'; // Replace with your desired recipient name
        $messageText = 'Hello, this is a test message from your application. Please review.';
        $attachmentUrl = url('/images/sample_image.jpg'); // Replace with your actual file URL
        $this->client->send('work.data', ['user' => $user], [
            new \WhatsApp\WebAPI\Message\Text($messageText),
            new \WhatsApp\WebAPI\Attachment\File($attachmentUrl)
        ]);
    }
}

In the given code, you define a new controller named "WhatsAppController" that extends Controller. It uses the WhatsApp\WebAPI\Client class to send messages and files. First, you create an instance of a Client object in the constructor, which will be used throughout your application. Finally, you call the send() method on your client instance to send a message with text content and attachments.

Working with Webhooks

To ensure smooth communication between your application and WhatsApp, you'll need to handle webhook responses. In Laravel, you can easily create a route to catch these events:

<?php
use Illuminate\Routing\Controller;
class Route extends Controller {
    public function webhook() {
        // Process incoming webhooks according to your requirements
    }
}

In this code snippet, we define a new route named "webhook" that will handle any incoming webhook events. You can add further logic here to manage the webhooks as per your application's needs.

Conclusion

With these steps, you now have a clear understanding of how you can send WhatsApp messages and files using Laravel. By setting up your environment, creating the necessary code, and handling webhook responses, you'll be able to seamlessly integrate this functionality into your Laravel application. Remember that it is essential to follow security guidelines when working with sensitive data. For more information on integrating WhatsApp API or any other third-party services using Laravel, please visit our blog at https://laravelcompany.com/blog.
