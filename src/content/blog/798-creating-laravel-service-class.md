---
title: "Creating laravel service class"
description: "Title: Utilizing Laravel Service Classes with Uptime Monitoring APIs Creating a service class in Laravel is an excellent way to organize your code and make..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Title: Utilizing Laravel Service Classes with Uptime Monitoring APIs

Creating a service class in Laravel is an excellent way to organize your code and make it easily reusable throughout your application. In this blog post, we'll discuss how you can convert the provided code into a proper service class and use service providers or service containers for maximum efficiency.

First, let's analyze the given code snippets:

1. Uptime.php: This script fetches data from an external API using curl to check uptime monitoring status. To convert it into a service class, you'll need to create a new class named UptimeService and move the code inside this class. The code can be refactored as follows:

   <code>public function fetchUptimeData($api_key) {
       $curl = curl_init();

       curl_setopt_array($curl, array(
           CURLOPT_URL => "https://api.uptimerobot.com/v2/getMonitors",
           CURLOPT_RETURNTRANSFER => true,
           CURLOPT_ENCODING => "",
           CURLOPT_MAXREDIRS => 10,
           CURLOPT_TIMEOUT => 30,
           CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
           CURLOPT_CUSTOMREQUEST => "POST",
           CURLOPT_POSTFIELDS => $api_key,
           CURLOPT_HTTPHEADER => array(
               "cache-control: no-cache",
               "content-type: application/x-www-form-urlencoded"
           ),
       ));

       $response = curl_exec($curl);
       $err = curl_error($curl);

       curl_close($curl);

       if ($err) {
            throw new Exception("cURL Error #:" . $err);
       } else {
           return json_decode($response);
       }
   }</code>

2. ApiCommand.php: This class contains two methods - handle() and showMonitors(). In order to turn it into a service class, we'll create a new class named UptimeApiService with these methods. To use this service class throughout your application, you'll need to add the appropriate code at your desired locations.

Once you have created the respective service classes and included them in your app, let's look into how you can utilize service providers or service containers for better organization:

- Service Providers: Laravel offers a powerful feature called "Service Providers" that allow you to group related services together. In our case, we could create a 'UptimeMonitoringProvider', which can register the UptimeService and UptimeApiService with Laravel. This way, they'll be available through dependency injection wherever needed.

- Service Containers: If your application requires a more sophisticated approach, you might consider using service containers. A container is an extension of Laravel's Container class that allows for more fine-grained control over the life cycle and dependencies within each of your services. This could be helpful in situations where you need to have specific environments or custom configurations for each service.

By incorporating these practices, you can create a well-organized and efficient Laravel application with robust uptime monitoring capabilities. If you're unsure about the best approach or require further clarification, feel free to consult the Laravel documentation and community resources available online.
