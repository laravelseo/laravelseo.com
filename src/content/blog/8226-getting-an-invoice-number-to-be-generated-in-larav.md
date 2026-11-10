---
title: "Getting an invoice number to be generated in laravel"
description: "Generating Sequential Invoice Numbers in Laravel: Avoiding \"Non Numeric Value Encountered\" As a senior developer working within the Laravel ecosystem,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "PHP", "Errors"]
featured: false
---

As a senior developer working within the Laravel ecosystem, generating unique, sequential identifiers like invoice numbers is a common requirement. However, when you start mixing application logic with database querying and string manipulation, subtle type errors—like the `A non-numeric value encountered` error you are seeing—often surface. This usually points to an issue where you are attempting mathematical operations on data that isn't strictly numeric (e.g., strings or nulls).

This post will diagnose why your current approach is failing and provide a robust, idiomatic Laravel solution for generating sequential invoice numbers while preserving custom prefixes.

## Diagnosing the Error in Your Current Logic

The error you are encountering is almost certainly due to attempting to perform arithmetic on values that are not purely numeric within your `invoiceNumber()` function. Let’s look at your original logic:

```php
function invoiceNumber()
{
    $orders = App\Order::all();

    if($orders->isEmpty())
    {
        $invoice = 'arm0001';
        return $invoice;
    }

    foreach($orders as $order)
    {
        $latest = App\Order::latest()->first();

        // Problem area: Comparing a string with true (boolean conversion issues)
        if($latest->invoice_number == true) 
        {
            // If invoice_number is stored as a string, adding 1 to it results in string concatenation errors or type casting failures.
            $invoice = 'arm'.$latest->invoice_number+1; 
            return $invoice;
        }
    }
}
```

The core issue here is twofold:

1.  **Type Mismatch:** If `invoice_number` is stored as a string (e.g., `'arm0001'`), attempting to execute `$latest->invoice_number + 1` might lead PHP to try casting the string to an integer, which can fail unexpectedly if the string format isn't clean, resulting in the non-numeric error when PHP tries to interpret the result of the operation.
2.  **Inefficiency:** Iterating through all orders in a helper function just to find the next number is computationally expensive and not scalable. This logic should be managed by the database itself.

## The Best Practice: Database-Driven Sequence Generation

In Laravel, the most reliable and performant way to handle sequential IDs is to let the database manage the sequence generation. This shifts the responsibility of uniqueness and ordering to the database engine, which is optimized for this task. This principle aligns perfectly with the robust data management practices promoted by platforms like [Laravel Company](https://laravelcompany.com).

Instead of calculating the next number in PHP, we should leverage database features:

### Method 1: Using Auto-Increment (The Laravel Default)

For most primary keys and simple sequences, use the standard `bigIncrements()` feature provided by Eloquent models. If you need a custom invoice number that incorporates prefixes, you can still rely on the auto-incrementing primary key for internal tracking, and generate the display number separately.

### Method 2: Using Database Sequences (For Custom Prefixes)

If you absolutely need a specific, human-readable sequence like `'ARM0001'`, the best approach is to use database sequences or custom triggers, but a simpler Eloquent approach involves querying the maximum value directly, ensuring proper type casting.

Here is how you can refactor your logic to be safe and efficient by relying on the database:

```php
use App\Order;

function generateNextInvoiceNumber()
{
    // Find the highest existing number based on your custom format (e.g., prefix + number)
    $maxInvoice = Order::max('invoice_number'); 

    if ($maxInvoice === null) {
        return 'ARM0001'; // Start sequence
    }

    // Extract the numeric part, increment it, and re-prefix it.
    $lastNumber = (int) str_replace('ARM', '', $maxInvoice);
    $nextNumber = $lastNumber + 1;

    // Format with leading zeros for consistency
    return 'ARM' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
}


public function deliveryConfirmation()
{
    // ... other setup code ...

    $invoice_number = generateNextInvoiceNumber();
    dd($invoice_number);

    return view('public.delivery-confirmation', [
        // ... data passed to view ...
        'invoice_number' => $invoice_number
    ]);
}
```

## Conclusion

The error you faced stems from attempting complex sequential logic using string manipulation and direct arithmetic in a procedural manner, which is prone to type errors. The solution lies in adhering to Laravel’s philosophy: delegate sequence management to the database. By querying for the maximum value directly and performing safe integer arithmetic on the numeric component before re-applying your custom prefix (`ARM`), you eliminate the risk of encountering non-numeric values. This approach results in code that is cleaner, more efficient, and significantly less error-prone, paving the way for scalable applications built on Laravel.
