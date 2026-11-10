---
title: "Laravel : How to store json format data in database?"
description: "Title: Efficiently Storing JSON Data in Laravel Databases Introduction: In this blog post, we will discuss how to store and manage JSON format data in your..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "JavaScript"]
featured: false
---

Title: Efficiently Storing JSON Data in Laravel Databases

Introduction: In this blog post, we will discuss how to store and manage JSON format data in your Laravel database using controllers. We'll cover the best practices for handling complex data structures and provide examples, along with a brief explanation of why you might want to choose this method over other options.

1. Why Store JSON Data in Databases?

JSON (JavaScript Object Notation) format is widely used for storing and exchanging structured data. It offers several advantages like easy readability, flexibility, and extensibility. When dealing with complex data structures that involve multiple nested arrays or objects, storing the raw JSON can be more efficient than saving each element separately in different database tables.

2. Saving JSON Data Using Controllers

Let's consider our sample JSON data as mentioned earlier:

<pre><code>{&quot;id&quot;:&quot;bangladesh&quot;,&quot;divisions&quot;:[{&quot;name&quot;:&quot;Barisal&quot;},{&quot;name&quot;:&quot;Chittagong&quot;},{&quot;name&quot;:&quot;Dhaka&quot;},{&quot;name&quot;:&quot;Khulna&quot;},{&quot;name&quot;:&quot;Rajshahi&quot;},{&quot;name&quot;:&quot;Rangpur&quot;},{&quot;name&quot;:&quot;Sylhet&quot;}]}</code></pre>

We'll save this JSON data in the database using a controller. First, we create models for our entities, such as Divisions, Country, and State. In this case, we will have:

- A Divisions model that extends Eloquent Model and has relationships to other models (Country, State).
- A Country model that extends Eloquent Model and has a one-to-one relationship with the Divisions model for simplicity.
- A State model that extends Eloquent Model and also has a one-to-many relation with the Divisions model, as it can have multiple divisions.

3. Saving JSON Data in the Database Using Models

To store our JSON data efficiently, we can store the raw JSON as an attribute of our Country model:

<pre><code>class Country extends Model{
    ...
    public function divisions(){
        return $this->hasMany(Division::class);
    }
    ...
}
</code></pre>

In the Divisions model, we can save the division name and its parent country:

<pre><code>class Division extends Model{
    ...
    public function country(){
        return $this->belongsTo(Country::class);
    }
    ...
}
</code></pre>

4. Creating a Controller to Store and Retrieve Data

Now, we will create a controller that saves the JSON data, retrieves countries, divisions, and lists of all divisions with their parent country:

<pre><code>public function saveData(Request $request) {
    // Get the given JSON data as a string
    $jsonString = $request->input('json_data');
    $data = json_decode($jsonString, true);
    $countries = Country::all();

    foreach ($countries as $country) {
        // Save divisions for each country
        $divisionsForCountry = array_map(function ($divisionData) use (&$country) {
            $divisionInstance = new Division;
            $divisionInstance->fill($divisionData);
            $divisionInstance->country()->associate($country);
            return $divisionInstance;
        }, $data['divisions']);
        Division::insert($divisionsForCountry);
    }

    // Save the country with its divisions as JSON data in the Country model
    foreach ($countries as $country) {
        $country->json_data = $jsonString;
        $country->save();
    }
}
</code></pre>

We can then use this method to save and retrieve our data in a more structured manner, taking advantage of Laravel's built-in relationships.

Conclusion: Efficiently storing JSON data in databases using appropriate models and controllers not only saves time and resources but also allows for better organization and management of your application's data. Remember to utilize the appropriate database structure and follow best practices to ensure reliable and scalable solutions.
