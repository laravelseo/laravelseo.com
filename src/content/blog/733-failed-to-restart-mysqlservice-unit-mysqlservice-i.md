---
title: "Failed to restart mysql.service: Unit mysql.service is masked in Ubuntu 20.04 after an upgrade from 18.4"
description: "Title: Failed to Restart MySQL: Unit Masked Issue After Ubuntu Upgrade from 18.4 to 20.04 Introduction: Upgrading your operating system can bring about a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Content", "Errors"]
featured: false
---

Title: Failed to Restart MySQL: Unit Masked Issue After Ubuntu Upgrade from 18.4 to 20.04

Introduction:
Upgrading your operating system can bring about a myriad of changes, both expected and unexpected. In this article, we will focus on the issue encountered with MySQL (MySQL is the database management system used by millions of organizations worldwide that provides the fastest method for storing, retrieving, and managing data) while upgrading from Ubuntu 18.04 to Ubuntu 20.04. The error message appears when attempting to start MySQL through the terminal using the 'service mysql start' command, but is met with a response: "Unit mysql.service is masked." Read on to learn about this problem and its resolution.

A Developer's Perspective:
The main reason behind this issue lies in the fact that Ubuntu 20.04 has deprecated MySQL 5.7 as a supported version, preferring MariaDB instead. This decision was made to provide users with greater stability and security features. As such, during the upgrade process, MySQL is masked automatically by default, which leads to the error message when one tries to use the 'service mysql start' command in the terminal. A masked service, in this context, means the service has been disabled or is not running anymore but can still be found in the list of services.

Resolving the Issue:
To solve this problem, you have two options depending on your needs and preferences. The first one involves unmasking MySQL, which allows it to run once more. However, since MySQL is no longer actively supported by Ubuntu, we advise against using it for new projects, preferring alternative database management systems like MariaDB or Percona Server.

Option 1: Unmask MySQL
If you need to unmask MySQL, follow these steps:

1. Open the terminal and run 'sudo apt-get install mariadb-server' to install MariaDB.
2. Run the command 'systemctl mask mysql.service'. This masks (disables) the service and prevents it from starting automatically when the system boots up.
3. To ensure MySQL is fully deactivated, run the command 'sudo systemctl stop mysql.service'.
4. Replace all instances of "mysql" in server configuration files with "mariadb".
5. Run the following commands to start MariaDB: 'systemctl enable mariadb', 'systemctl start mariadb', and confirm if your databases are accessible using the command 'mysql -u root -p'.

Option 2: Install MariaDB or Percona Server Instead of MySQL
As an alternative, you can choose to install one of the supported database management systems by Ubuntu. Here's a quick guide on how to install MariaDB:

1. Open the terminal and run 'sudo apt-get install mariadb-server'.
2. Start the MariaDB service using the command 'systemctl start mariadb'.
3. Access MariaDB with the command 'mysql -u root -p' (enter root password if prompted).
4. Ensure your databases are accessible and in good working condition.

Conclusion:
Upon encountering this issue, you have two viable options to consider. Unmasking MySQL is best suited when you need to keep using it for existing projects or are comfortable with the risks involved. However, it's a much better idea to use MariaDB or Percona Server as they offer greater stability and security while being actively supported by Ubuntu. Regardless of your choice, ensure that your database is up and running, enabling you to continue working on your projects efficiently.
