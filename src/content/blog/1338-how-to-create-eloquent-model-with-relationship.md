---
title: "How to create Eloquent model with relationship?"
description: "Title: Simplifying Eloquent Model Creation with Relationships Body: Developing efficient applications often requires you to manage several entities, their..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML"]
featured: false
---

Title: Simplifying Eloquent Model Creation with Relationships

Body:

<p>Developing efficient applications often requires you to manage several entities, their relationships, and the data they contain. Laravel's Eloquent model is a powerful tool that provides an object-oriented interface for working with database tables. In this post, we will focus on creating Eloquent models with their corresponding relationship in a more beautiful and streamlined manner using Laravel.</p>

<h3>Setting Up the Database Tables</h3>
Firstly, let's set up our two database tables: "Person" for storing person-related data (firstname and lastname) and "Employee" to store employee details (position). The database schema could look like this:

<pre><code>CREATE TABLE persons (
   id SERIAL PRIMARY KEY,
   firstname VARCHAR(255),
   lastname VARCHAR(255)
);

CREATE TABLE employees (
   id INT NOT NULL AUTO_INCREMENT,
   person_id INT,
   position VARCHAR(100),
   FOREIGN KEY (person_id) REFERENCES persons(id)
);
</code></pre>

<h3>Creating the Models</h3>
Now let's create an "Employee" Eloquent model that inherits from Laravel's Model class and includes the necessary columns. The Person model can be created in a similar way:

<pre><code>class Employee extends Model {
   protected $fillable = ['firstname', 'lastname', 'position'];

   // Define relationships with the Person model here, if needed
}
</code></pre>

In this example, we've defined a few columns that can be filled when creating an employee: firstname, lastname, and position. The $fillable property ensures these fields are mass assignable. Note that we haven't included any relationship definition yet for the Employee model.

<h3>Creating Eloquent Model with Relationship</h3>
To create an instance of the Employee model (including its related person) in a more beautiful way, we can utilize Eloquent relationships' 'create' method:

<pre><code>use App\Person; // Import Person model here
use App\Employee; // Import Employee model here

// Create new employee and associate it with the created person instance:
$person = new Person();
$person->firstname = 'Jack';
$person->lastname = 'London';
$person->save(); // Save first person record

$employee = new Employee();
$employee->position = 'writer';
$employee->person_id = $person->id;
$employee->save(); // Save employee instance, linking with the person
</code></pre>

Here, we first create a Person object and save it to our database. Then, we create an Employee object while specifying the relationship (via 'person_id'). The 'person_id' is set to the ID of the previously saved Person instance.

In conclusion, this approach allows you to create Eloquent models with relationships in a more aesthetically pleasing and efficient manner that keeps your code clean and maintainable. For more information on working with Laravel's Eloquent ORM, check out our detailed tutorial at <a href="https://laravelcompany.com/blog/eloquent-orm-tutorial">Laravel Company</a>.
