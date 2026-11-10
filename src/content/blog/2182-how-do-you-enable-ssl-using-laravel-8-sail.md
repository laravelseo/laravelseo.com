---
title: "how do you enable ssl using laravel 8 sail"
description: "Enabling SSL with Laravel 8 Sail: A Comprehensive Guide Setting up an SSL certificate for your local development environment can be challenging, especially..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "Content", "PHP"]
featured: false
---

<h2>Enabling SSL with Laravel 8 Sail: A Comprehensive Guide</h2>
<p>Setting up an SSL certificate for your local development environment can be challenging, especially when using Docker and Laravel Sail. However, it is possible to achieve a secure connection between your localhost and remote server using various methods. In this blog post, we will explore the options available and provide step-by-step instructions on how to enable SSL for your Laravel 8 project powered by Laravel Sail.</p>
<h3>Option 1: Self‑Signed Certificate with Docker</h3>
<p>A self‑signed certificate is a valid but untrusted SSL certificate that you generate yourself. To create one, you can use tools like OpenSSL or Mkcert. First, add the following code to your <code>docker-compose.yml</code> file:</p>
<pre><code>services:
  webserver:
    image: nginx:stable-alpine
    ports:
      - "80:80"
      - "443:443" # Add this line to map port 443 on your localhost to the docker container's port 443
    volumes:
      - ./src:/var/www
      - ./ssl:/etc/ssl
      - ./nginx.conf:/etc/nginx/conf.d/default.conf # Add this line if you have a custom nginx.conf file
    links:
      - php:8.1-fpm
      - mysql:MySQLServer
</code></pre>
<p>Next, run the following commands to generate self‑signed certificates:</p>
<ul><li><code>openssl req -new -x509 -nodes -days 365 -keyout private.key -out certificate.crt -subj '/CN=local.dev.domain.com'</code></li><li><code>cp private.key ./ssl/private_local.dev.domain.com.key</code></li><li><code>cat ./ssl/certificate.crt ./ssl/private_local.dev.domain.com.key > ./ssl/combined.crt</code></li></ul>
<p>Update the following lines in your <code>nginx.conf</code> file:</p>
<pre><code>server {
    listen 80; # HTTP traffic on port 80
    listen [::]:80; # IPv6 HTTP traffic on port 80
    listen 443 ssl http2; # SSL (HTTPS) traffic on port 443
    listen [::]:443 ssl http2; # IPv6 SSL (HTTPS) traffic on port 443
    server_name local.dev.domain.com;
    root /var/www;
    index index.php;
    include snippets/ssl-selfsigned.conf;
}
</code></pre>
<p>Finally, update the following lines in your <code>.env</code> file:</p>
<pre><code>APP_URL=https://local.dev.domain.com
APP_ENV=local
APP_DEBUG=true # if you want to enable debugging mode
</code></pre>
<p>Run <code>sail up -d</code>, open your browser, and navigate to <code>https://localhost/</code>. If all goes well, you should see Laravel's welcome screen. Be aware that self‑signed certificates are not secure for production environments as they can cause potential security risks and warnings in the browser.</p>
<h3>Option 2: Let's Encrypt SSL Certificate with Docker</h3>
<p>Using Let's Encrypt, you can obtain a free and trusted SSL certificate. To generate one, add the following code to your <code>docker-compose.yml</code>:</p>
<pre><code>services:
  webserver:
    image: nginx:stable-alpine
    ports:
      - "80:80"
      - "443:443" # Map port 443 on your localhost to the docker container's port 443
    volumes:
      - ./src:/var/www
      - ./ssl:/etc/letsencrypt
      - ./nginx.conf:/etc/nginx/conf.d/default.conf # Add this line if you have a custom nginx.conf file
    links:
      - php:8.1-fpm
      - mysql:MySQLServer
</code></pre>
<p>Run the following commands to generate and setup Let's Encrypt certificates:</p>
<ul><li><code>docker-compose run --service-ports webserver bash</code></li><li><code>letsencrypt-auto --renew-by-default -a standalone -d local.dev.domain.com</code></li></ul>
<p>To renew the certificates every 90 days, run <code>docker-compose run --service-ports webserver bash && letsencrypt-auto renew</code>. Now, update the relevant lines in your <code>nginx.conf</code> and <code>.env</code> files as described earlier.</p>
<h3>Conclusion</h3>
<p>By following these steps, you can successfully set up SSL for your Laravel 8 project using Laravel Sail with either a self‑signed certificate or a trusted Let's Encrypt SSL certificate. Remember to keep your security in mind and use the appropriate option depending on your needs. Always monitor your setup and adjust accordingly if any issues arise.</p>
