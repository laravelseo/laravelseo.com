---
title: "Trying to get property 'id' of non-object laravel"
description: "Solving the Mystery: Getting Properties from Non Objects in Laravel Eloquent As a senior developer, I’ve seen countless developers run into frustrating..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "HTML", "PHP", "Errors"]
featured: false
---

As a senior developer, I’ve seen countless developers run into frustrating errors when dealing with data retrieval in Laravel, especially when mixing Eloquent models, relationships, and view logic. The error you're encountering—"Trying to get property 'id' of non-object"—is a classic symptom that points directly to an issue with how you are iterating over your data or accessing a relationship that hasn't been correctly loaded.

This post will dissect the specific problem in your setup and provide a robust, best-practice solution, ensuring your edit forms display correctly and efficiently.

## Understanding the Root Cause

The error arises because your view is attempting to treat a variable (in this case, `$k` inside the loop) as an Eloquent model, but that variable actually holds `null` or some other non-object value. This usually happens when:

1.  **Missing Relationship Loading:** You defined a relationship (`hasOne`), but you failed to load the actual related data from the database into the model instance before attempting to access it in the view.
2.  **Incorrect Iteration:** You are looping over an object that is not a collection, or you are accessing properties on a variable that was never populated.

Let's examine your provided code snippet:

In your `edit` method, you fetch a single product:
```php
$produk = produk::where('id',$id)->first();
return view('produk.edit',compact('produk'));
```
When you pass `$produk` to the view, it is a single `Produk` model object (or `null` if not found).

In your view, you attempt this loop:
```html
@foreach ($produk as $k)
    <option value="{{ $k->id }}" @if($produk->id_kategori == $k->id) selected @endif>{{$k->nama}}</option>
@endforeach
```
If `$produk` is a single model, iterating over it directly in this manner will fail or produce unexpected results because you are trying to iterate over an object instead of a collection. Furthermore, the logic inside the loop seems confused about whether it's looping through products or categories.

## The Solution: Correctly Loading Relationships

The key to solving this is ensuring that when you retrieve your main record (`$produk`), you also load any necessary relationships (like the category) so they are immediately available for use in the view. This adheres strongly to Laravel’s philosophy of leveraging Eloquent relationships.

Instead of fetching just the product, we need to fetch the product *along with* its related category information.

### Step 1: Modifying the Controller

We will use the `with()` method to eager load the relationship. Since your model defines a relationship named `kategoris`, we will load that data.

```php
use App\Models\Produk; // Assuming your model is in App\Models
use Illuminate\Http\Request;

public function edit($id)
{
    // Eager load the 'kategoris' relationship to fetch the category data along with the product.
    $produk = Produk::with('kategoris')->where('id', $id)->first();

    if (!$produk) {
        // Handle the case where the product doesn't exist
        abort(404);
    }

    return view('produk.edit', compact('produk'));
}

public function update(Request $request, $id)
{
    $produk = Produk::findOrFail($id); // Use findOrFail for cleaner error handling
    
    // Update logic remains the same...
    $produk->update([
        'nama' => $request->nama,
        'id_kategori' => $request->kategori,
        'qty' => $request->qty,
        'harga_beli' => $request->beli,
        'harga_jual' => $request->jual,
    ]);

    return redirect()->route('produk.index');
}
```

### Step 2: Adjusting the View Logic

With the relationship loaded via `with('kategoris')`, the data is now accessible directly on the `$produk` object. We no longer need an unnecessary loop; we just need to access the related category directly.

If you only expect one category per product (based on your `hasOne` setup), you can access it directly:

```html
{{-- Assuming $produk is the loaded model instance --}}

<select class="form-control" name="kategori">
    <option value="Pilih Kategori">Select Category</option>
    
    {{-- Access the relationship data directly from the loaded object --}}
    @if($produk->kategoris)
        @foreach ($produk->kategoris as $k)
            <option value="{{ $k->id }}" @if($produk->id_kategori == $k->id) selected @endif>{{$k->nama}}</option>
        @endforeach
    @else
        <option value="">No Category Assigned</option>
    @endif

</select>
```

**Note on the View Logic:** I have restructured your view logic to correctly iterate over the relationship loaded within `$produk->kategoris`. This eliminates the error because we are now iterating over a guaranteed collection (`$produk->kategoris`) rather than a non-object.

## Conclusion

The error "Trying to get property 'id' of non-object" is a common pitfall when working with Eloquent models in Laravel. The solution lies not just in fixing the view syntax, but in correctly utilizing Eloquent’s powerful relationship loading capabilities. By using methods like `with('relationshipName')` in your controller, you ensure that all necessary related data is retrieved efficiently, preventing these runtime errors and making your application more robust and maintainable. Always strive to load what you need upfront, as promoted by modern Laravel development practices found on resources like https://laravelcompany.com.
