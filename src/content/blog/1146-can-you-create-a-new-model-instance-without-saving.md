---
title: "Can you create a new Model instance without saving it to the database"
description: "Title: Creating New Model Instances Without Saving Them to the Database in Laravel Body: Creating new model instances without saving them directly to the..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP"]
featured: false
---

Title: Creating New Model Instances Without Saving Them to the Database in Laravel

Body:
<p>Creating new model instances without saving them directly to the database is possible, although it requires some additional steps and understanding of object-oriented programming principles. In this comprehensive guide, we'll explore different ways to achieve your desired result while using Laravel 5.0.</p>

<p><strong>Using Static Methods</strong></p>

Laravel provides a static method called <code>create()</code> on the model class that creates a new instance and simultaneously saves it to the database. If you want to create multiple instances without saving them immediately, you can use another static method: <code>withoutEvents()</code>. This method will prevent events associated with Model creation from being triggered. Here's an example code snippet:

<pre><code class="lang-php">$models = [];
for($i=0; $i<$numInstances; $i++) {
    $model = MyModel::withoutEvents()->get(['name', 'address']);
    $models[] = $model;
}
</code></pre>

In this code snippet, we are creating a new collection of model instances without saving them to the database. This approach ensures that the models' data is not persisted until you explicitly choose the best instance and save it.

<p><strong>Using Eloquent Collections</strong></p>

Another possibility is using Laravel's collections, which allow you to create multiple model instances without worrying about database persistence. Here's a simplified example:

<pre><code class="lang-php">$models = collect();
for($i=0; $i<$numInstances; $i++) {
    $model = MyModel::create(['name' => "Person {$i}", 'address' => "Address of Person {$i}"]);
    $models->push($model);
}
</code></pre>

In this example, we are using the <code>collect()</code> function to create an empty collection and then iterate through your desired instances. Each iteration creates a new model instance using the standard Laravel <code>create()</code> method, but without saving it to the database initially. The models are added to the collection without being saved, allowing you to choose the best one later on.

<p><strong>Using Model Factories</strong></p>

Model factories can help create multiple instances of your model with some custom data and then save them in a single database operation. You can define your own factory with desired attributes or even relationships:

<pre class="lang-php"><code>/**
 * Define model's personalized factory.
 */
$factory->define(App\MyModel::class, function ($faker) {
    return [
        'name' => $faker->unique()->randomElement(['Person 1', 'Person 2', 'Person 3']),
        'address' => $faker->address,
    ];
});
</code></pre>

This factory will generate a random name for each instance and assign a unique address. You can then create multiple instances by calling the factory method:

<pre class="lang-php"><code>$models = App\MyModel::factory()->count($numInstances)->create();</code></pre>

This approach makes it easier to generate multiple model instances without worrying about saving them individually. Once all instances have been generated, you can choose the one with the desired attributes and proceed with a normal <code>save()</code> operation for that model.

<p><strong>Conclusion</strong></p>

With Laravel's powerful tools such as static methods, collections, and factories, it is possible to create multiple model instances without saving them directly in the database. You can now take advantage of these techniques when working on complex projects with a focus on performance and scalability. To learn more about creating models, Laravel's Eloquent ORM, and other aspects of Laravel development, visit https://laravelcompany.com/.
