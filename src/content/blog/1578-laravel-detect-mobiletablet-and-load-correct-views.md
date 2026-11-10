---
title: "Laravel detect mobile/tablet and load correct views"
description: "Title: Efficiently Detection of Mobile Versus Desktop Devices and Loading Correct Views in Laravel Body: Determining the user's device type (mobile or..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Efficiently Detection of Mobile Versus Desktop Devices and Loading Correct Views in Laravel

Body:

Determining the user's device type (mobile or desktop) and loading correct views based on that is a common requirement for modern web applications. Achieving this with minimal code adjustments to your view controllers becomes crucial to maintain a clean architecture. In this comprehensive blog post, we will discuss how you can achieve this by leveraging Laravel's powerful routing capabilities and configuration settings.

1. Detect Mobile or Tablet Devices:
To get started, let's define a function that detects the device type. We can utilize the User-Agent string, which provides information about the user's device. The code snippet below shows how to extract this data and categorize devices into "mobile" or "desktop" based on well-known patterns:

```php
function getDeviceType() {
    $user_agent = $_SERVER['HTTP_USER_AGENT'];

    // Mobile Devices
    if (strpos($user_agent, 'iPhone') || strpos($user_agent, 'iPad') || strpos($user_agent, 'Android')) {
        return "mobile";
    } elseif (strpos($user_agent, 'BlackBerry') || strpos($user_agent, 'Windows Phone')) {
        return "mobile";
    }

    // Tablet Devices
    if (strpos($user_agent, 'iPad') && strpos($user_agent, 'Safari')) {
        return "ipad";
    } elseif (strpos($user_agent, 'Nexus 7') || strpos($user_agent, 'Nexus 9')) {
        return "android-tablet";
    } elseif (strpos($user_agent, 'Android') && strpos($user_agent, 'Silk')) {
        return "kindle-fire";
    }

   // Desktop or Unknown
   return "desktop";
}
```

2. Configuring View Paths based on Device Type:
Once the device type is detected, we can define two different view paths in Laravel's configuration file (config/app.php) by leveraging the Config::set() method. This way, you don't need to modify your view controllers. Here's an example:

```php
Config::set('view.paths', [storage_path('app/mobile-views'), storage_path('app/desktop-views')]);
```

This code sets the view paths to be 'storage/app/mobile-views' and 'storage/app/desktop-views'. You can also add more folders based on your needs. Now, Laravel will automatically load views from these directories according to the detected device type.

3. Using Device Detection in Routes:
Now that we have configured view paths, we need to use them when defining routes and controllers. Our updated route file (routes/web.php) might look like this:

```php
use App\Http\Controllers\MobileController;
use App\Http\Controllers\DesktopController;

Route::get('', function () {
    $deviceType = getDeviceType();

    if ($deviceType === "mobile") {
        return redirect(route('mobile.home'));
    } elseif ($deviceType === "desktop" || $deviceType === "ipad" || $deviceType === "android-tablet" || $deviceType === "kindle-fire") {
        return redirect(route('web.home'));
    }
});
```

Here, we check the device type and redirect to specific routes based on that. The 'mobile.home' route will use views from the mobile-views folder, while the 'web.home' route will use views from the desktop-views folder.

4. Conclusion:
By following these steps, you can efficiently detect mobile or tablet devices and load correct views for each device type without modifying your view controllers. This approach ensures a cleaner codebase and makes it easier to maintain your application as your requirements evolve. Remember to keep your configuration files consistent, update the routes when necessary, and enjoy well-optimized web applications for all types of devices!
