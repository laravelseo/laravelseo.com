---
title: "message: \"SQLSTATE[HY000] [2002] php_network_getaddresses: getaddrinfo failed: Temporary failure in name resolution (SQL: select * from `users`...)\""
description: "Title: Message \"SQLSTATE[HY000] [2002] php network getaddresses: getaddrinfo failed\" Error in Laravel Web App Deployment on Ubuntu Server Introduction When..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Title: Message "SQLSTATE[HY000] [2002] php_network_getaddresses: getaddrinfo failed" Error in Laravel Web App Deployment on Ubuntu Server

Introduction

When web applications are deployed to different environments, issues can arise due to differences between development and production setups. This blog will focus on a common error message you might face when deploying your Laravel 5.8 app to an Ubuntu server: "SQLSTATE[HY000] [2002] php_network_getaddresses: getaddrinfo failed". We'll discuss the reasons behind this, explain how it can be resolved, and offer some best practices to avoid these scenarios in the future.

Why am I Getting This Error?

This error is primarily due to incorrect configuration of the database connection details. It suggests that your PHP application cannot establish a connection with the database server. This is because the getaddrinfo function has failed temporarily, possibly due to issues related to network connectivity or name resolution.

Resolving the Issue

To tackle this issue, first ensure you have the correct IP address and port number of your database server in place. In your .env file, make sure you've set the following details:

```text
DB_CONNECTION=mysql
DB_HOST=http://localhost/ (or change it to your actual database server IP)
DB_PORT=3306
DB_DATABASE=client
DB_USERNAME=jdggsss
DB_PASSWORD=kjhgfdddd
```

Note: The DB_HOST value should point to the database server's IP address, not your application's URL. This is a common mistake that causes this particular error.

In addition, check whether your connection details are secure and up-to-date. If you used any password for your database user or the database itself, ensure there are no typos in their values as incorrect credentials could trigger this issue.

If the above steps don't resolve the problem, it might indicate a network connectivity issue between your Laravel application and the database server. In such cases, verify that both servers are connected to the same subnet or VLAN and confirm they can communicate with each other successfully, for example by pinging their IP addresses.

Best Practices

- Always use correct database information in your .env file and double-check them before deployment.
- If you're using a dynamic application IP address (like 20.10.10.122), be wary of potential network issues or DNS changes that could affect the connection. In such cases, it might be better to use localhost and configure your application and database server on the same machine.
- Consider using environment variables for sensitive information like passwords and IP addresses to prevent them from being exposed in files like .env. This is especially important if you're working on a shared or public repository.
- Ensure you have proper user permissions set up for both your application and database servers, as this could also cause connectivity issues.

Conclusion

In conclusion, the SQLSTATE[HY000] [2002] php_network_getaddresses: getaddrinfo failed error in Laravel Web app deployment on Ubuntu servers can be attributed to incorrect database connection settings, network issues, or other factors. By following best practices and double-checking your configuration details before deploying your application, you can avoid such errors in the future and ensure a smooth transition from development to production.
