---
title: "Laravel - convert array into eloquent collection"
description: "Laravel: Converting Raw API Arrays into Eloquent Collections—A Developer's Guide When building modern web applications with Laravel, we frequently interact..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Technical SEO", "HTML", "PHP"]
featured: false
---

When building modern web applications with Laravel, we frequently interact with external APIs to fetch data. This data usually arrives as a JSON response, which, when decoded in PHP, results in a simple associative array. While functional for basic tasks, working directly with these raw arrays can lead to frustrating errors when trying to leverage the full power of the Laravel ecosystem, especially when dealing with Eloquent relationships or Blade templating.

This post addresses a very common pain point: how to seamlessly transition that raw API data into an object-oriented structure that Laravel understands—specifically, an Eloquent Collection.

## The Problem Scenario: Arrays vs. Objects

Let's look at the scenario you described. You fetch data from an external API using Guzzle and decode the JSON response:

```php
public function getItems()
{
    $client = new \GuzzleHttp\Client();
    $res = $client->get('https://app.example.com/api/getItems');

    $vouchers = json_decode($res->getBody(), true); // $vouchers is now a standard PHP array

    dd($vouchers); 

    return view('api', compact('vouchers'));
}
```

When you attempt to loop this array in your Blade file:

```html
@foreach ($vouchers as $v)
    <p>{{$v->name}}</p>
@endforeach
```

You encounter the error: `"Trying to get property 'name' of non-object"`.

This error occurs because a standard PHP array (`$vouchers`) does not possess object properties like `name`. You can only access elements by index (e.g., `$v[0]`), not by property name. To use methods like `->name`, the data structure must be an object or, in the context of Laravel, an instance of a Collection.

## The Solution: Embracing Laravel Collections

The solution is to convert your raw PHP array into an instance of the `Illuminate\Support\Collection` class. Laravel's Collections are incredibly powerful tools designed specifically for manipulating arrays efficiently. By converting your data into a Collection, you unlock fluent methods, better iteration capabilities, and seamless integration with other Eloquent features.

You can perform this conversion immediately after decoding your JSON response:

```php
public function getItems()
{
    $client = new \GuzzleHttp\Client();
    $res = $client->get('https://app.example.com/api/getItems');

    $vouchersArray = json_decode($res->getBody(), true);

    // --- The Conversion Step ---
    $vouchersCollection = collect($vouchersArray); 
    // or using the helper: $vouchersCollection = collect($vouchersArray);

    dd($vouchersCollection);

    return view('api', compact('vouchersCollection'));
}
```

### Using Collections in Blade

Once you have the Collection, iterating over it becomes cleaner and more robust. You can use the powerful methods provided by the Collection class directly within your views.

If your API response is an array of objects (which is often the case when dealing with related models), you can ensure your data is structured correctly before passing it to the view. If your JSON provides simple arrays, you can still iterate easily:

```html
<body>
    <h2>Vouchers List</h2>
    @foreach ($vouchersCollection as $voucher)
        {{-- Access properties safely using arrow notation or object syntax --}}
        <p>Name: {{ $voucher->name }}</p> 
        {{-- Or if the data structure is simple, direct array access works too: --}}
        <p>ID: {{ $voucher['id'] }}</p>
    @endforeach
</body>
```

## Best Practices for API Data Handling

When dealing with external data in a Laravel context, always aim to convert it into Eloquent Models or Collections as early as possible. This principle aligns perfectly with the philosophy of Laravel—making complex tasks simple and expressive. Instead of passing raw arrays around, you pass structured objects that adhere to your application's conventions.

For advanced scenarios, if your API response contains nested data, consider using Laravel's powerful JSON parsing features or dedicated packages to handle the transformation from raw JSON directly into Eloquent models. As we continue to build robust applications based on frameworks like **Laravel**, mastering these data transformations is key to writing clean, scalable code. For deeper dives into Laravel architecture and design patterns, exploring resources from **https://laravelcompany.com** provides essential context for these best practices.

## Conclusion

Converting a raw API array into an Eloquent Collection is not just a syntax trick; it’s a fundamental step in adopting the Laravel paradigm. By utilizing the `collect()` helper, you transform simple, brittle arrays into powerful, expressive objects that integrate natively with your application logic and Blade views. Embrace Collections, and watch how dramatically simpler and more maintainable your data handling code becomes.
