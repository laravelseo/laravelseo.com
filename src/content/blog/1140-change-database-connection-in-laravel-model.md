---
title: "change database connection in laravel model"
description: "Title: Easily Change Database Connection in Laravel Model for External Database Access Body: Laravel is known for its extensive database management..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "PHP"]
featured: false
---

Title: Easily Change Database Connection in Laravel Model for External Database Access

Body:

Laravel is known for its extensive database management capabilities, but sometimes you may need to work with an external database for specific models or situations. In this comprehensive blog post, we'll guide you through the process of changing the database connection in your Laravel 4.2 model to access an external database, complete with relevant code examples and best practices.

First, let's take a look at the general structure of your existing model:

```php
<?php
class McibModel extends Eloquent {
    /**
      * The database table used by the model.
      *
      * @var string
      */
    //here i should call the external database table
    protected $table = 'agencies';
}
```

Step 1: Define Your Database Connection Settings

Before you can connect to your external database, you'll need to create a new database connection configuration in Laravel. You can easily define your database connection settings within your .env file:

```dotenv
DB_CONNECTION=mysql2
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=external_db
DB_USERNAME=user
DB_PASSWORD=pass
```

Step 2: Update Your Model's Database Connection Configuration

Next, you need to update your model's database configuration to reference the new connection settings. Since your current model is extending Eloquent and using the agencies table from an external database, change the $table attribute and $connection attribute like so:

```php
<?php
class McibModel extends Eloquent {
    /**
      * The database table used by the model.
      *
      * @var string
      */
    protected $table = 'agencies';
    protected $connection = 'mysql2';
}
```

Note that you're now explicitly setting your connection to be 'mysql2', which is a name we chose for this tutorial. You may use any other suitable database connection name based on your project setup.

Step 3: Test Your Model's Database Connection

Now, let's test your model's external database connection. Open up your terminal and run the following command to create a new migration file:

```bash
php artisan make:migration create_agencies_table --create=agencies
```

Open the newly created '2016_09_18_173432_create_agencies_table.php' migration file and add your table definition, including primary key and any other fields required by your application:

```php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateAgenciesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('agencies', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            // add other fields as needed
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('agencies');
    }
}
```

Run the migration:

```bash
php artisan migrate
```

Finally, create a new test file (e.g., test_external_db_access.php) to check your model's interaction with the external database:

```php
<?php

use App\McibModel;

class TestExternalDbAccess extends TestCase
{
    public function testConnectionToExternalDatabase()
    {
        $model = new McibModel();
        $result = $model->get();

        // Ensure you're getting results from the external database
        $this->assertTrue($result->count() > 0);
    }
}
```

Run your test suite and make sure everything is working as expected.

Conclusion:

With these steps, you have successfully changed your Laravel 4.2 model to use an external database for its table. By defining the database connection settings in .env and updating the model's configuration accordingly, you can easily interact with multiple databases from within your Laravel application. Remember to always follow best practices and keep your database connections secure. Enjoy working with your external database!
