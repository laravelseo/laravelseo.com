---
title: "Laravel update/edit using foreach loop"
description: "Mastering Data Updates in Laravel: Avoiding the foreach Pitfall As a senior developer working with Laravel, you frequently deal with updating database..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer working with Laravel, you frequently deal with updating database records. When performing updates, especially when dealing with looping structures like `foreach`, it’s easy to run into unexpected errors. The error you encountered—`Invalid argument supplied for foreach()`—is a classic symptom of misunderstanding what data structure you are attempting to iterate over in PHP.

This post will diagnose why your update logic failed and provide robust, idiomatic Laravel solutions for handling database updates efficiently. We will look at your specific controller code and demonstrate the correct way to manage Eloquent models during updates, ensuring your application remains clean and functional.

## Understanding the Error: Why `foreach` Failed

The error `Invalid argument supplied for foreach()` occurs because the variable you are attempting to loop over is not an array or a Collection object, which are the only types PHP expects when using a `foreach` loop.

Let's examine your original logic within the `update_score` method:

```php
public function update_score(Request $request)
{
    $id = $request->input('id');

    // Problem Area: This fetches a single Eloquent model instance, not a collection.
    $scores = Score::find($id); 

    foreach ($scores as $datas) { // Error occurs here because $scores is an object, not an array.
        $datas->jan_ap = $request->input('jan_ap');
        $datas->jan_hm = $request->input('jan_hm');
        $datas->save();  
    }
}
```

When you use `Score::find($id)`, Eloquent returns a single `Score` model object (an instance of the class). You cannot iterate over a single object using `foreach`, which is why PHP throws an error. To fix this, we need to adjust our approach based on whether you intend to update one record or multiple records.

## Solution 1: Updating a Single Record Correctly

If your intention was simply to update the score associated with a single ID, you do not need a `foreach` loop at all. You can directly access and modify the model instance found by `find()`. This is much more efficient.

Here is the corrected approach for updating a single record:

```php
public function update_score(Request $request)
{
    $id = $request->input('id');

    // 1. Find the specific score record
    $score = Score::find($id);

    // 2. Check if the record exists before attempting to update
    if (!$score) {
        return back()->withErrors(['message' => 'Score not found.']);
    }

    // 3. Update the attributes directly on the model instance
    $score->jan_ap = $request->input('jan_ap');
    $score->jan_hm = $request->input('jan_hm');
    
    // 4. Save the changes to the database
    $score->save();

    return redirect()->route('markbook.show_score', $id)->with('success', 'Score updated successfully!');
}
```

## Solution 2: Handling Mass Updates with Collections

If you intended to update *multiple* scores (perhaps by sending an array of IDs or multiple score objects in the request), then you must fetch them as a collection. This is where `foreach` becomes useful, but it must operate on a Collection object.

For example, if your request contained an array of IDs:

```php
public function update_multiple_scores(Request $request)
{
    // Assume the request contains an array of IDs to update
    $ids = $request->input('ids', []); 

    // Fetch all necessary scores in one query for efficiency
    $scores = Score::whereIn('id', $ids)->get();

    foreach ($scores as $score) {
        // Now, $score is a valid Eloquent model instance within the loop
        $score->jan_ap = $request->input('jan_ap');
        $score->jan_hm = $request->input('jan_hm');
        $score->save();
    }

    return redirect()->route('dashboard')->with('success', 'Multiple scores updated.');
}
```

## Best Practice: Using Mass Assignment for Bulk Updates

For scenarios involving large-scale updates, looping through individual `save()` calls can become inefficient. A more performant and idiomatic Laravel approach is to use mass assignment or database query builders when possible.

If you are updating multiple records based on a single request payload, consider using `update()` on the collection:

```php
public function bulk_update(Request $request)
{
    $data = $request->only('jan_ap', 'jan_hm'); // Get only the fields being updated
    $ids = $request->input('score_ids', []);

    if (empty($ids)) {
        return redirect()->back()->withErrors('No scores provided for update.');
    }
    
    // Update all records in a single, efficient operation.
    // Note: This assumes you are updating *all* selected IDs with the *same* data.
    Score::whereIn('id', $ids)->update($data);

    return redirect()->route('dashboard')->with('success', count($ids) . ' scores updated successfully.');
}
```

## Conclusion

The key takeaway is that the success of a `foreach` loop hinges entirely on the data being iterated over. In the context of Eloquent models, you must ensure that `$scores` holds a collection (using methods like `get()` or `whereIn()->get()`) rather than a single model instance from `find()`. By understanding the difference between fetching a single record and fetching a collection, you can write clean, efficient, and error-free code, adhering to Laravel's principles of Eloquent data handling. For more insights into building robust applications with Laravel, check out resources on the official site: https://laravelcompany.com.
