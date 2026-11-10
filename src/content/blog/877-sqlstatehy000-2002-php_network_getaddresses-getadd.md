---
title: "SQLSTATE[HY000] [2002] php_network_getaddresses: getaddrinfo failed: nodename nor servname provided, or not known"
description: "Title: Troubleshooting SQLSTATE[HY000] [2002]: php network getaddresses: getaddrinfo failed A Comprehensive Guide for Laravel Developers Introduction The..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Errors"]
featured: false
---

Title: Troubleshooting SQLSTATE[HY000] [2002]: php_network_getaddresses: getaddrinfo failed - A Comprehensive Guide for Laravel Developers

Introduction

The error "SQLSTATE[HY000] [2002] php_network_getaddresses: getaddrinfo failed: nodename nor servname provided, or not known" is a common issue faced by Laravel developers. This blog post aims to provide a comprehensive guide on understanding the reasons for such errors and offer solutions to fix them effectively.

Understanding the Basics

Laravel's Database Migration tool uses database migrations to synchronize the structure of your database with the codes in your application. The error occurs due to improper configuration or connectivity issues between your Laravel application and the database server. Here are the common causes:

1. Misconfiguration in the .env file: Your .env file should contain the correct details about your database host, username, password, and port. Incorrect or missing entries can trigger this error.

2. MySQL socket path issue: If you're using a MySQL socket as the connection method instead of specifying the IP address, ensure that the UNIX_SOCKET variable in .env is pointing to the correct location. If this isn't set up correctly, Laravel might fail to connect with the database.

3. Incorrect server domain name or IP: The DB_HOST variable should be set to "127.0.0.1" for local development when using MySQL on your local machine. If you're using a different host such as a remote database, ensure that the correct domain name or IP is specified in this variable.

4. Firewall or proxy issues: Network firewalls and proxies can sometimes block port 3306 used by MySQL. Make sure your local machine has access to the database server on this port.

5. Issues related to DNS resolution: If a hostname or IP address is missing from the /etc/hosts file, Laravel might struggle to resolve them and establish a connection with the database server. Ensure that all relevant entries are present in your hosts file.

Solutions for Fixing the Error

1. Check and correct the .env file: Update the values of DB_HOST, DB_DATABASE, DB_USERNAME, and DB_PASSWORD variables to ensure that they match your database configuration. If you're using a MySQL socket path, verify the value of UNIX_SOCKET as well.

2. Configure the firewall or proxy settings: Allow access to port 3306 on your network's firewalls and proxies, or use alternative ports if needed. Ensure that your local machine can reach the database server without any restrictions.

3. Update the /etc/hosts file entries: Add the relevant hostnames and IP addresses to the /etc/hosts file on both your local machine and the remote server, if applicable. This is especially crucial when connecting to a database running on a different machine.

4. Use Docker or virtual machines: If you're working with a complex setup involving multiple machines or containers, consider using containerization solutions like Docker or virtual machines to ensure proper network connectivity and configuration of your PHP application and MySQL server.

Conclusion

By understanding the various reasons for this error and following the provided solutions, you can overcome the "SQLSTATE[HY000] [2002]: php_network_getaddresses: getaddrinfo failed" issue in Laravel projects. This comprehensive guide should enable you to maintain a stable database connection during migration tasks or development processes.

Remember to regularly check and update your .env file, configuration files, and other network settings for the best performance of your Laravel application. In case of any further issues, feel free to reach out to the Laravel community for assistance on their official support forum (https://laracasts.com/forums) or via a detailed blog post on this topic with sufficient details about your setup and error.
