---
title: "How to use SQL Server connection in Laravel?"
description: "Title: Efficiently Utilizing SQL Server Connections in Laravel Applications Introduction: In today's tech landscape, the need for efficient database..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Title: Efficiently Utilizing SQL Server Connections in Laravel Applications

Introduction: In today's tech landscape, the need for efficient database management and seamless integration with different applications is crucial. With the ever-growing demand for efficient and scalable solutions, it becomes essential to understand how to utilize SQL connections effectively within Laravel projects. This comprehensive guide will walk you through the process of configuring your Laravel application to use Microsoft SQL Server (MsSQL) as its database management system.

1. Installing the required extensions: As mentioned in the initial query, Laravel requires PDO extensions for MS SQL Server connections. To install them on a Linux/UNIX-like platform, run the following command:
   <pre class="lang-php prettyprint-override"><code>sudo apt-get install php7.4-sqlsrv php7.4-odbc</code></pre>
   For macOS, you need to utilize Homebrew to install the required extensions. Run these commands in your terminal:
   <pre class="lang-php prettyprint-override"><code>brew install unix OdbcInst.r PM-unixODBC</code></pre>

2. Configuring ODBC connections: Laravel needs an ODBC connection to establish communication with Microsoft SQL Server. Follow these steps to set up your ODBC DSN (Data Source Name) for MS SQL Server using the ODBC Administrator tool:
   a. Open the ODBC Administrator by going to Start > Run > type "odbcad32" and press Enter.
   b. Click on System DSN, then click Add...
   c. Select Microsoft® ODBC Driver for SQL Server as your driver and click Finish.
   d. In the Connect to the database menu, provide your server IP, database name, username, password, and prefix. Click Next.
   e. Review the settings, customize if needed, then click Test Connection and Finish to complete the setup.

3. Configuring Laravel's 'sqlsrv' connection within database.php: Follow these steps to configure your Laravel application for use with Microsoft SQL Server through ODBC DSN:
   a. In your `config/database.php`, add the following entry under 'connections':
     <pre class="lang-php prettyprint-override"><code>'sqlsrv' => [
      'driver'   => 'sqlsrv',
      'host'     => 'myServerIP',
      'database' => 'myDatabase',
      'username' => 'myUsername',
      'password' => 'myPassword',
      'prefix'   => '',
      'charset'  => 'utf8',
      'port'     => '1433',
      'timeout'  => 30,
      'options'  => [PDO::ATTR_EMULATE_PREPARES => false],
 ],</code></pre>
   b. Note: You may need to adjust the host and port parameters according to your setup.

4. Perform a test query: Now that your Laravel application is configured, try performing a basic SQL query using Laravel's Query Builder or Eloquent ORM. If everything has been set up correctly, you should see the desired results.
   <pre class="lang-php prettyprint-override"><code>DB::connection('sqlsrv')->select("SELECT * FROM your_table");</code></pre>

Conclusion: In this comprehensive blog post, we have explored how to configure Laravel applications for use with Microsoft SQL Server while utilizing its ODBC connections. By following the steps outlined above and understanding the relationship between Laravel's configuration file ('sqlsrv') and your application's database management system, you can efficiently manage the data persistence layer of your projects. This guide offers a sound foundation for using MS SQL Server with Laravel while ensuring performance and scalability.
