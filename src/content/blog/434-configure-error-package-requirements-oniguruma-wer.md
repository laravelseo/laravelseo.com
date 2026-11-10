---
title: "configure: error: Package requirements (oniguruma) were not met"
description: "Title: Resolving \"Package requirements (oniguruma) were not met\" Error During Laravel Docker Image Creation Introduction When creating a Docker image for..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Title: Resolving "Package requirements (oniguruma) were not met" Error During Laravel Docker Image Creation

Introduction
When creating a Docker image for your Laravel application, an error message pops up stating "configure: error: Package requirements (oniguruma) were not met." This issue is caused due to the missing dependency on the oniguruma package. In this blog post, we will examine how this problem arises and provide solutions to overcome it.

What is Oniguruma?
Oniguruma is a Perl library for Unicode regular expression matching, primarily used in Ruby programming languages. The error occurs as your Docker image requires oniguruma to function properly but cannot find the package, leading to an issue during configuration. This dependency requirement is standard and should be installed beforehand to avoid any potential conflicts.

Understanding the Issue
The error message points towards the absence of the oniguruma package in your environment. To determine where the problem lies, let's analyze the Dockerfile used to create the image:

<pre><code>FROM php:7
RUN apt-get update -y &amp;&amp; apt-get install -y openssl zip unzip git
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN docker-php-ext-install pdo mbstring
WORKDIR /app
COPY app /app # this copies all the app files to a folder called `app`
RUN composer install

CMD php artisan serve --host=0.0.0.0 --port=8000
EXPOSE 8000
</code></pre>

Here, we can see that oniguruma is not explicitly installed or configured in the Dockerfile. To resolve this issue, follow these steps:

Step-by-step Solution for Including Oniguruma Package
1. Inspect your local system and check if you have a suitable version of oniguruma installed. If not, install it using the appropriate package manager (e.g., yum or apt-get).
2. Ensure that the correct path to the oniguruma library is included in the PKG_CONFIG_PATH environment variable (if applicable) or specify the ONIG_CFLAGS and ONIG_LIBS variables as recommended by the error message.
3. Alternatively, manually include the oniguruma package in your Dockerfile before installing PHP extensions. This can be achieved by adding the following lines to the file:

<pre><code>RUN apt-get update -y && apt-get install -y oniguruma
</code></pre>

4. Rebuild and run the docker image using the updated Dockerfile. Make sure you add the necessary arguments (if any) to ensure a successful setup.
5. Test your Laravel application within the container to verify its proper functionality.

Conclusion
In this blog post, we have examined the configuration error related to oniguruma dependency during Laravel Docker image creation and provided a step-by-step guide to solving it. By following the instructions, you will ensure that your Laravel application functions smoothly within the docker container. In case of further issues or questions, feel free to consult the resources available at https://laravelcompany.com/blog for more in-depth knowledge on Laravel and Docker-related topics.
