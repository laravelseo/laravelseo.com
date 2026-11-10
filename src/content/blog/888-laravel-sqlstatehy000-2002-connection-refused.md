---
title: "Laravel SQLSTATE[HY000] [2002] Connection refused"
description: "Title: Troubleshooting Laravel SQLSTATE[HY000] [2002] Connection refused Errors on DigitalOcean VPS Introduction: Laravel is an excellent and powerful PHP..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP", "Errors"]
featured: false
---

Title: Troubleshooting Laravel SQLSTATE[HY000] [2002] Connection refused Errors on DigitalOcean VPS

Introduction: Laravel is an excellent and powerful PHP framework that allows developers to develop advanced web applications rapidly. But sometimes, despite deploying the project successfully as you have done with your Digital Ocean VPS following a tutorial, you may encounter issues with database connectivity. This blog post aims to address one such issue - the SQLSTATE[HY000] [2002] Connection refused error and provide practical solutions to resolve this problem during Laravel deployment.

1. Checking the Database Configuration: Double-check your configuration in the .env file, especially focusing on DB_HOST (which should be your VPS IP), DB_PORT (usually 3306), DB_DATABASE (the name of your database), DB_USERNAME (root is common), and DB_PASSWORD. Ensure that all these parameters are correctly configured to match your local machine, the DigitalOcean VPS, and your web hosting server.

2. Enabling Remote MySQL Connections: In some hosting providers like Cloudways or Digital Ocean, you might need to allow remote connections to your database from external IP addresses. Follow the instructions provided by your service provider on how to enable remote MySQL connections.

3. Setting Up Local Tunnel for Database Access: To simplify the process of connecting to your VPS's database, you can use Laravel Forge or a similar tool that provides local tunneling services. This solution is especially useful if you encounter problems with your firewall configuration or remote connection settings. If enabled, this service creates a secure tunnel between your VPS database and a URL on your local network.

4. Adjusting Laravel .env File for Local Tunnel: To allow Laravel to connect to the local tunnel, update the APP_URL value in your .env file accordingly. For example, if your local tunnel is accessible at http://localhost:12345, you would change APP_URL to http://localhost:12345/project-root.

5. Ensuring Firewall Rules are Permissive: To enable remote access, you might need to allow specific traffic to and from your VPS server. This includes setting up firewalls and adhering to network security best practices. For example, some digital ocean droplets may have SSH access limitations that might prevent Laravel migrate commands from running successfully.

6. Verifying Database Credentials: Check if the credentials you provided in your .env file are accurate. If they're not correct, update them with the proper information for your VPS database. Use a MySQL client tool like Sequel Pro or HeidiSQL to connect directly to the database on your VPS and test these credentials.

7. Testing Database Connection: After making changes to your .env file and ensuring that firewalls, tunnels, and other restrictions are configured properly, try running 'php artisan migrate' once again. If issues persist, check the Laravel logs for more information about the error. You may also need to reinstall MySQL or run 'composer update' if you recently updated your project dependencies.

8. Enabling SSL/TLS: If you encounter an SSL issue during database connection, consider enabling SSL on your VPS and updating your .env file accordingly. Adding "DB_PORT=3306" to the DB_CONNECTION section can help address SSL issues that might affect MySQL connections.

Conclusion: Troubleshooting Laravel connection issues is a routine part of deployment processes, but with a methodical approach and attention to detail, you will be able to overcome these issues in no time. Referring to the given steps should assist you in identifying and solving the SQLSTATE[HY000] [2002] Connection refused error, resulting in a stable Laravel application on your Digital Ocean VPS. Happy coding!
