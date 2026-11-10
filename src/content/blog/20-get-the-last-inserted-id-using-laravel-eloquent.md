---
title: "Get the Last Inserted Id Using Laravel Eloquent"
description: "Title: Efficiently Retrieving the Last Inserted ID Using Laravel Eloquent A common requirement in many applications is to return the last inserted ID after..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Title: Efficiently Retrieving the Last Inserted ID Using Laravel Eloquent

A common requirement in many applications is to return the last inserted ID after performing an insertion operation on a database table. In this tutorial, we will demonstrate different methods of retrieving the last inserted ID using Laravel Eloquent.

1. Using the Model's getIncrementing() Property:

Firstly, let us assume you have a model defined for our Company entity and an associated migration file which has set up the table with appropriate columns. Here is how your model may look like:

<pre class="lang-php prettyprint-override"><code>&lt;?php

namespace App\Models;

class Company extends Model
{
    protected $fillable = [
        'nombre',
        'direccion',
        'telefono',
        'email',
        'giro',
        'fecha_registro',
        'fecha_modificacion'
    ];
}
</code></pre>

In your controller, you can use the model instance to insert a new record and get the last inserted ID by accessing its getIncrementing() property:

<pre class="lang-php prettyprint-override"><code>&lt;?php

public function saveDetailsCompany()
{
    $post = Input::All();

    $company = Company::create([
        'nombre' => $post['name'],
        'direccion' => $post['address'],
        'telefono' => $post['phone'],
        'email' => $post['email'],
        'giro' => $post['type'],
        'fecha_registro' => date("Y-m-d H:i:s"),
        'fecha_modificacion' => date("Y-m-d H:i:s")
    ]);

    return Response::json(array('success' => true, 'id' => $company->getIncrementing()), 200);
}
</code></pre>

Here, we first create a new instance of the Company model and pass the required data. After saving the record using the create() method, you can retrieve the last inserted ID by calling getIncrementing(). Please keep in mind that this approach only works if your primary key is incremented (auto_increment).

2. Using the Database's Insert Method:

An alternative way to obtain the last inserted ID is by using the database insert method directly, which gives more control over the primary key's value. You can do so as follows:

<pre class="lang-php prettyprint-override"><code>&lt;?php

public function saveDetailsCompany()
{
    $post = Input::All();

    $data = [
        'nombre' => $post['name'],
        'direccion' => $post['address'],
        'telefono' => $post['phone'],
        'email' => $post['email'],
        'giro' => $post['type'],
        'fecha_registro' => date("Y-m-d H:i:s"),
        'fecha_modificacion' => date("Y-m-d H:i:s")
    ];

    $id = DB::table('companies')->insertGetId($data);

    return Response::json(array('success' => true, 'id' => $id), 200);
}
</code></pre>

In this example, we first prepare an array with the data to be inserted and then call the database insert method using a static DB facade. This approach allows us to specify the primary key value if desired or use the next available ID (incremented).

3. Using the Model's getLastInsertId() and Raw SQL:

If you need more control over the inserted ID, such as setting it manually or retrieving the last inserted ID using a custom condition, you can perform a raw SQL query via Laravel's DB facade:

<pre class="lang-php prettyprint-override"><code>&lt;?php

public function saveDetailsCompany()
{
    $post = Input::All();

    DB::beginTransaction();

    try {
        // Save the Company record using a raw SQL query
        DB::statement("INSERT INTO companies (nombre, direccion, telefono, email, giro, fecha_registro, fecha_modificacion) VALUES ('{$post['name']}', '{$post['address']}', '{$post['phone']}', '{$post['email']}', '{$post['type']}', NOW(), NOW())");
        $id = DB::getPdo()->lastInsertId();
    } catch (\Exception $e) {
        // Rollback the transaction if an error occurs during saving the Company record.
        DB::rollback();
        return Response::json(array('success' => false, 'message' => $e->getMessage()), 500);
    }

    DB::commit();
    return Response::json(array('success' => true, 'id' => $id), 200);
}
</code></pre>

In this example, we first create a raw SQL query to insert the company record. After performing the insert operation and ensuring that no error occurs, we get the last inserted ID using the PDO lastInsertId() method. Finally, we commit the transaction but return an appropriate response based on success or failure. This approach is useful if you need more control over the primary key generation or have complex requirements for retrieving the last inserted ID.

Conclusion:

Laravel Eloquent provides different methods to retrieve the last inserted ID after performing database operations. You can use getIncrementing() on your model instance, call the Insert method with insertGetId(), or perform a raw SQL query using DB facade. Each approach has its own advantages and should be chosen based on your specific needs. For more information on Laravel Eloquent features, head over to the official documentation at https://laravelcompany.com/docs/laravel/.
