---
title: "Laravel: connect to databases dynamically"
description: "Title: Dynamically Connecting Laravel to Different Databases Without Modifying database.php Introduction: Laravel provides several powerful tools for working..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Dynamically Connecting Laravel to Different Databases Without Modifying database.php

Introduction:
Laravel provides several powerful tools for working with databases. However, as you might have noticed, it's not designed for dynamic connections to different databases based on runtime data. In this article, we will explore a solution that allows Laravel to connect dynamically to the database using its existing DB class, while avoiding editing your configuration file.

Body:

1. Create a Database Class:
Before anything else, create a new file called "DatabaseHandler.php" in your app folder and define a custom database class that will manage all the connections. This class should implement the PDO connection and use the Laravel DB facade for interacting with the databases. Here's an example using our newly created DatabaseHandler class:

```php
namespace App;

class DatabaseHandler extends \Illuminate\Database\Capsule\Manager // or \PDO for other drivers
{
    private $connections = [];

    public function addConnection($databaseDetails) {
        $connectionName = generateUniqueConnectionId();
        $this->connections[$connectionName] = [
            'driver' => $databaseDetails['driver'],
            'host' => $databaseDetails['host'],
            'port' => $databaseDetails['port'],
            'database' => $databaseDetails['dbname'],
            'username' => $databaseDetails['user'],
            'password' => $databaseDetails['pass']
        ];
    }

    public function getConnection($connectionName) {
        if (!array_key_exists($connectionName, $this->connections)) {
            throw new \Exception("Invalid connection name: " . $connectionName);
        }

        return new \Illuminate\Database\Capsule\Manager(array_merge(['driver' => $this->connections[$connectionName]['driver']], $this->connections[$connectionName]));
    }
}
```

2. Define a Unique Connection Id Generator:
You will need to create a method that generates a unique ID for your connections to avoid conflicts. Here's an example using the unique id generator:

```php
function generateUniqueConnectionId() {
    static $counter = 0;
    return 'dynamic_connection' . ++$counter;
}
```

3. Use the DatabaseHandler Class in a Controller:
To utilize this class, you will need to create a new controller where you can add the connections and use them accordingly. Here's an example for a sampleController in Laravel 5.1:

```php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\DatabaseHandler;

class SampleController extends Controller {
    public function index() {
        $databaseDetails = [
            'driver' => 'mysql', // Example driver like mysql, sqlite, pgsql, or any other supported database driver
            'host' => 'localhost',
            'port' => 3306,
            'dbname' => 'test',
            'user' => 'root',
            'pass' => '' // Leave empty if not using password
        ];
        $databaseHandler = new DatabaseHandler();
        $databaseHandler->addConnection($databaseDetails);
        $connectionName = generateUniqueConnectionId();
        $db_handle = $databaseHandler->getConnection($connectionName);
        $data = $db_handle->select('*')->from('table_name')->where('id', 1)->get()->toArray();
        echo "<pre>"; var_dump($data); echo "</pre>";
    }
}
```

Conclusion:
In this article, we discussed how you can dynamically connect Laravel to different databases without modifying the database.php file. By implementing a custom database class and generating unique connection names, your application will be able to connect to various databases as needed. Remember, this method requires careful handling of sensitive data such as passwords and should not be used in production environments without proper precautions. For more information on Laravel database management, refer to the official documentation or check out our blog posts at https://laravelcompany.com/blog/.
