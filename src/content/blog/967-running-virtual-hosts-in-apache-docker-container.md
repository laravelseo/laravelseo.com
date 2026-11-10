---
title: "Running virtual hosts in apache docker container"
description: "Title: Running Virtual Hosts in Apache Docker Container for Multiple PHP Applications Introduction: Developers and businesses increasingly use containers to..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Content", "HTML", "PHP"]
featured: false
---

Title: Running Virtual Hosts in Apache Docker Container for Multiple PHP Applications

Introduction:
Developers and businesses increasingly use containers to run their applications as they provide better isolation, scalability, and flexibility compared to traditional methods. In this article, we'll discuss how to configure your Docker environment with multiple virtual hosts running on Apache in order to host different PHP apps side by side. We will also touch upon the importance of networking configurations for these hosts to be accessible from outside the container.

Body:
1. Understanding Virtual Hosts and Docker Containerization
Virtual hosts allow you to run multiple websites or web applications using the same Apache server instance, which is useful when you have different PHP apps within a single project or when working on multiple projects simultaneously. Docker containers provide an isolated environment for each application, ensuring they don't interfere with each other and simplifying configuration management.

2. Creating Your Dockerfile
Start by creating a dedicated Dockerfile to run your Apache server along with PHP. Include the necessary dependencies such as required extensions and configuration files. Here is an example Dockerfile for a simple php-apache setup:

<pre><code>version: '3.2'
  services:
    php-apache:
      build:
        context: ./apache-php
      ports:
        - 80:80
        - 8060:8060

      expose:
        - '8060'
      volumes:
        - ./DocumentRoot:/var/www/html:z
</code></pre>

This Dockerfile creates two virtual hosts. The first one runs on port 80 and serves your main website, while the second one is configured to run on port 8060 for hosting a different application. It's essential to expose both ports in your Dockerfile if you want to access them from outside the container.

3. Configure Apache Virtual Hosts
To run your PHP applications through virtual hosts, create an appropriate configuration file similar to the following example:

<pre><code>&lt;VirtualHost *:60&gt;
    DocumentRoot /var/www/html/api
    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
&lt;/VirtualHost&gt;

&lt;VirtualHost *:80&gt;
    ServerAdmin webmaster@localhost
    DocumentRoot /var/www/html
    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
&lt;/VirtualHost&gt;
</code></pre>

In this example, we have two virtual hosts: one for port 60 running a specific PHP application and another on port 80 with the standard setup for your primary website. You can customize these configurations based on your needs.

4. Setting Up Networking Configuration
To properly expose your applications to outside connections, you need to ensure that the necessary ports are open in your Docker networking configuration. In this example, we're exposing port 80 and 8060 for your primary website and secondary PHP application respectively:

<pre><code>version: '3.2'
  services:
    php-apache:
      build:
        context: ./apache-php
      ports:
        - 80:80
        - 8060:8060
</code></pre>

5. Testing and Troubleshooting
After configuring the Dockerfile, Apache virtual hosts configuration file, and networking settings, you can build your containers with `docker-compose up` and test the applications to ensure they are running as expected. If your application doesn't load properly or faces network issues, verify your configurations and make necessary adjustments until everything works smoothly.

Conclusion:
Running virtual hosts in Apache Docker container allows you to efficiently manage multiple PHP applications within a single containerized environment. By understanding the importance of networking configuration and following best practices when setting up virtual hosts, you can effectively use these containers for different projects or client websites. Always remember to back up your configurations and test thoroughly before deploying your applications in production.
