---
title: "Unable to set the APP_PORT on .env for Laravel Sail"
description: "Title: Troubleshooting APP PORT in Laravel Sail for Windows Environments Body: When working on Laravel 8 with Sail, you might face issues when attempting to..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

Title: Troubleshooting APP_PORT in Laravel Sail for Windows Environments
Body: <p>When working on Laravel 8 with Sail, you might face issues when attempting to set the APP_PORT variable in your .env file while running it under Windows. This problem can be particularly frustrating because Ubuntu machines seem to work just fine. Let's explore why this happens and provide a solution for setting the APP_PORT on your local Windows machine.</p>

<h3>Understanding the Issue</h3>
<p>The error message "services.laravel.test.ports contains an invalid type, it should be a number, or an object" indicates that something is off with the ports section of your docker-compose.yml file. This occurs because Laravel Sail expects APP_PORT to be either a single port number (a string of a valid port) or a mapping of ports. If you provide a literal value like "3000" for APP_PORT, the engine assumes it's a fixed port, and in Windows, it doesn't know how to handle this as an argument for docker-compose.yml.</p>

<h3>Solution for Setting APP_PORT with Laravel Sail</h3>
<p>To resolve this issue, follow these steps: </p>
1. Comment out the ports section in your docker-compose.yml file. This will temporarily disable any specific port mapping.
   <pre><code>#    - '${APP_PORT:-80}:80'
</code></pre>
2. Run sail up to ensure that Laravel Sail starts without problems, and then test your application with the current APP_PORT value. If it works fine (regardless of what the port is), proceed to the next step.
3. Ensure that you have enabled port forwarding in your docker-compose.yml file for localhost URLs, as shown below:
   <pre><code>  ...
    ports:
        - '${APP_PORT:-80}:80:host'
...
</code></pre>
4. Run sail up again to start Laravel Sail with the new docker-compose.yml configuration. Test your application, and see if it works as expected. If not, try adjusting the port forwarding or changing the APP_PORT value in your .env file until you find a working setup for your local environment.
5. If you're satisfied with the current APP_PORT and its behavior, update your docker-compose.yml file to include the specific port number ('3000', for example) as it suits your needs.
6. Run sail up again to ensure that the project starts correctly with the new configuration, and test your application on localhost with the updated APP_PORT setting.
7. In case you decide to revert back the original ports section in the docker-compose.yml file or make any other modifications, remember to run sail down and then sail up again to ensure that all container services are terminated and restarted correctly before testing your application.
<p>If you prefer not to modify your docker-compose.yml file, you can always use a custom .env file for each of your environments or local machines. This allows you to keep the port settings separate for different setups.</p>

By following these steps, you should be able to set and test the APP_PORT variable in Laravel Sail on Windows while maintaining proper communication between your application and docker-compose.yml file. Your laravel company can provide a comprehensive guide with best practices and further details on this issue for more specific use cases.
