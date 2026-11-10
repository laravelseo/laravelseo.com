---
title: "Laravel 5.4 on PHP 7.0: PDO Exception - Could not find driver (MySQL)"
description: "Title: Laravel 5.4 on PHP 7.0: PDO Exception Could not find driver (MySQL) Body: I have a Laravel 5.4 project on my Ubuntu 14.04 VPS with Plesk 12.5.30...."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

Title: Laravel 5.4 on PHP 7.0: PDO Exception - Could not find driver (MySQL)
Body:

I have a Laravel 5.4 project on my Ubuntu 14.04 VPS with Plesk 12.5.30. After creating the database and setting up the .env file with required information, I ran php artisan migrate, and exceptions were thrown:

<blockquote>
  
  <p><strong>[Illuminate\Database\QueryException]</strong><br>
    could not find driver (SQL: select * from information_schema.tables where table_schema = pmaramaldb and table_name = migrations)</p>
  
  <p><strong>[PDOException]</strong><br>
    could not find driver</p>
</blockquote>

My .env file has:

<blockquote>
  <p>DB_CONNECTION=mysql</p>

  <p>DB_HOST=127.0.0.1</p>

  <p>DB_PORT=3306</p>

  <p>DB_DATABASE=pmaramaldb</p>

  <p>DB_USERNAME=user</p>

  <p>DB_PASSWORD=password</p>
</blockquote>

I've followed most of the guides to solve this error and there wasn't any positive results. Here are a few solutions I tried:

1. Enabling Extension Solution: The php.ini file is being generated automatically, which says not to modify it because it will be lost when regenerated. So I enabled PDO by adding extension=pdo_mysql in the .env file. This didn't work.

2. Installing php7.0-mysql Solution: After installing MySQL, I ran php artisan migrate again. The output showed that php5-sqlite was already installed and up to date. Hence, this solution did not fix the issue.

3. SQL Lite Install Solution: As instructed by a question link, I tried running sudo apt-get install php5-sqlite. It showed that php5-sqlite was already the newest version. This didn't resolve the problem either.

4. Composer Dump-autoload Solution: After running composer dump-autoload, this did not fix the issue.

After running the command php -i, the output showed:

<blockquote>
  <p>PDO                                                                                                                                                                                                                                       </p>
  
  <p>PDO support => enabled</p>
  
  <p>PDO drivers =>           </p>
  
  <p>...</p>
  
  <p>PHP Version => 5.6.30-1+deb.sury.org~trusty+1</p>
</blockquote>

Well, I am not sure if this has anything to do with the error, but the version shown when running php -v is:

<blockquote>
  <p>user@server: ~/path$ php -v    </p>
  
  <p>PHP 5.6.30-1+deb.sury.org~trusty+1 (cli)    </p>
  
  <p>Copyright (c) 1997-2016 The PHP Group</p>
  
  <p>Zend Engine v2.6.0, Copyright (c) 1998-2016 Zend Technologies<br>
      with Zend OPcache v7.0.6-dev, Copyright (c) 1999-2016, by Zend Technologies</p>
</blockquote>

To resolve the issue, several other fixes could be considered:

1. Updating Plesk and PHP versions to their latest available stable releases. Ensure your system meets all compatibility requirements for Laravel 5.4, as it requires PHP 7.0 or higher.

2. Ensuring that your .env and php.ini files are properly configured with required settings. In particular, check the extensions listed under load_extension_dirs in your php.ini file and see if PDO is included.

3. Double-check your database configuration to ensure it's correct for the Laravel project, particularly regarding the database host, user, password, and port information.

4. In case of a problem with the PHP version, try installing an alternative PHP version manager like PHPMailer or Composer. This allows you to work on multiple PHP versions simultaneously and quickly switch between them as needed.

5. Ensure that your Laravel project is set up properly with the correct dependencies for Laravel 5.4, which may require a fresh install. If not, try updating or reinstalling the dependencies using composer update/install.

By following these steps, you should be able to resolve the PDO exception issue and successfully connect your Laravel 5.4 project with the MySQL database.
