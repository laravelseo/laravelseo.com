---
title: "Avoid public folder of laravel and open directly the root in web server"
description: "Title: Simplifying Your Laravel URL Structure: Accessing Root Directory without 'public' Introduction Laravel is an incredibly popular PHP framework that has..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Title: Simplifying Your Laravel URL Structure: Accessing Root Directory without 'public'

Introduction

Laravel is an incredibly popular PHP framework that has been gaining momentum for its easy-to-use functionality and clean syntax. One of the most common issues developers face, however, is configuring their web server to directly access the root directory instead of the public folder. This can be done using a simple configuration change in your .htaccess file.

What Is The 'public' Folder?

The Laravel framework includes an optional 'public' folder that contains all your application files and allows the server to serve static assets like images, stylesheets, scripts, etc. Typically, when accessing your Laravel website from a web browser, you use this public folder as the root directory. This causes an additional layer between your app and the webserver that processes the request.

Why Avoid The Public Folder?

While having a 'public' folder in your URL structure might not pose a significant threat to security, it's always advisable to simplify things for both you and site visitors. Removing this extra layer can help streamline your site structure, making it easier to navigate and understand. This may be particularly useful if you need to manage several sites with different frameworks and find the public folder redundant in your Laravel projects.

Using .htaccess For Simplification

The most straightforward way to remove this layer is by editing your existing .htaccess file or creating a new one, depending on your hosting server's default configuration. The .htaccess file is a hidden configuration file that lives in the root directory of your Laravel project, allowing you to override Apache's default behavior and provide customized instructions for handling requests at this level. Here's how to achieve it:

1. Open your .htaccess file or create one if none exists, with the following command (depending on your operating system):
   - Linux/MacOS: vi .htaccess (or nano .htaccess)
   - Windows: type "notepad .htaccess" in cmd and press enter

2. Inside the .htaccess file, add the following code snippet:

   ```
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteRule ^(.*)$ public/$1 [L]
   ```

3. Save and close the .htaccess file.

Now, whenever a request is made to your Laravel website without specifying a directory or file, your web server will automatically access the root directory. This effectively removes the 'public' folder from your URL structure, giving you the desired clean look. Please note that this may introduce potential issues if your Laravel project has conflicting namespaces due to the lack of an application base path. In such cases, it is recommended to consult a professional developer or follow Laravel documentation for guidance.

Conclusion

Removing the 'public' folder from your Laravel project's URL structure can help improve navigation and overall user experience. With proper .htaccess file configurations, you can seamlessly direct visitors to your application root directory without compromising security. Remember always to back up your files before making any changes to ensure a smooth process. Happy coding!
