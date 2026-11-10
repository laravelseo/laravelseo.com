---
title: "SQLSTATE[HY000] [1045] Access denied for user 'username'@'localhost' (using password: YES)"
description: "Title: SQLSTATE[HY000] [1045] Access Denied Error Resolution for MySQL Users in Ubuntu VM Body: In your Ubuntu Virtual Machine, you may encounter this error..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Errors"]
featured: false
---

Title: SQLSTATE[HY000] [1045] Access Denied Error Resolution for MySQL Users in Ubuntu VM

Body: In your Ubuntu Virtual Machine, you may encounter this error message: SQLSTATE[HY000] [1045] Access denied for user 'username'@'localhost' (using password: YES). To avoid this issue and maintain a smooth database connection, there are several steps you should take.

Firstly, let's assume that the configuration in your .env file is similar to the following:

<pre><code>DB_HOST=45.55.88.57
DB_DATABASE=b-prod
DB_USERNAME=root
DB_PASSWORD=*********
UNIX_SOCKET=/var/run/mysqld/mysqld.sock
</code></pre>

However, when you use a different database user:

<pre><code>DB_HOST=45.55.88.57
DB_DATABASE=b-prod
DB_USERNAME=b &lt;----------------------------------------------
DB_PASSWORD=*********
UNIX_SOCKET=/var/run/mysqld/mysqld.sock
</code></pre>

You might face the error due to incorrect credentials or user permissions. To prevent this, you should first verify your database users and their privileges. You can do this by running the following command:

<pre><code>mysql&gt; SELECT User,Host FROM mysql.user;
+------------------+-------------+
| User             | Host        |
+------------------+-------------+
| root             | %           |
| root             | 127.0.0.1   |
| root             | 45.55.88.57 |
| root             | ::1         |
| root             | localhost   |
| b            | localhost   |
| debian-sys-maint | localhost   |
| root             | localhost   |
+------------------+-------------+
8 rows in set (0.00 sec)
</code></pre>

From the above output, you have found multiple usernames and hostnames. While it's not clear which ones are linked to your application, the 'root' user with a wildcard '%' as the Host could be a good starting point for troubleshooting. You might also consider creating a new database user specifically for this connection.

To create a new database user:

1. Run mysql: `sudo mysql`
2. Execute the following query to grant privileges:
   <pre><code>GRANT ALL ON *.* TO 'b_new'@'localhost' IDENTIFIED BY 'password';
FLUSH PRIVILEGES;
</code></pre>

In the above example, replace 'b_new' with your desired username and 'password' with a secure password of your choice. This ensures that your database connection is configured correctly.

Finally, in your .env file, update the configuration to use this new user:

<pre><code>DB_HOST=45.55.88.57
DB_DATABASE=b-prod
DB_USERNAME=b_new
DB_PASSWORD=*********
UNIX_SOCKET=/var/run/mysqld/mysqld.sock
</code></pre>

To test your database password, you can use the following command within the MySQL client:

<pre><code>mysql&gt; ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';
+------------------+------+
| Message         | Code |
+------------------+------+
| Already has the | 0    |
+------------------+------+
1 row in set (0.00 sec)
</code></pre>

Although there is no error message, this command ensures that your MySQL user's password is up-to-date. This should prevent further issues related to incorrect or outdated passwords for the root user and database users in your Ubuntu VM. By following these guidelines, you can maintain a secure and stable database connection.
