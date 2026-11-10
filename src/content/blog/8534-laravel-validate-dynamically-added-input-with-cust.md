---
title: "Laravel validate dynamically added input with custom messages"
description: "Mastering Dynamic Validation in Laravel: Handling Arrays and Custom Messages Developing robust applications, especially those involving dynamic data entry..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Errors"]
featured: false
---

Developing robust applications, especially those involving dynamic data entry like inventory systems, requires sophisticated form validation. When you start dealing with arrays of inputs—where a user can add multiple line items on the fly—standard validation rules often break down, leading to frustrating errors and poor user experience.

As a senior developer, I frequently encounter scenarios where dynamic input structures challenge the default behavior of Laravel's validator. The issue you are facing—where dynamic `lte` (less than or equal to) constraints fail to apply correctly across an array of inputs and custom messages don't display as expected—is a classic challenge rooted in how validation rules interact with loop-generated data.

This post will dive deep into why your dynamic validation is failing and provide a robust, production-ready solution using Laravel best practices.

## The Pitfall of Dynamic Validation Arrays

Your approach of dynamically building `$rules` and `$messages` inside a loop is conceptually sound. However, when dealing with array inputs (like `productSku.*`, `orderQty.*`), the way the validator processes these rules, especially when they reference external data (like `$product['productQty']`), can become ambiguous.

The problem often lies in mixing dynamic rule generation with string interpolation for custom messages. While the use of `*` is correct for array wildcards, dynamically injecting database values directly into the message strings (`'lte:'.$product['productQty']`) within a loop doesn't always guarantee that the validator correctly associates the error message back to the specific failed input field in all scenarios.

## The Solution: Structured Validation and Custom Messages

The most reliable way to handle complex, related validations across dynamic sets is to separate the data preparation from the validation execution, ensuring that your custom messages are explicitly mapped to the fields being checked.

Instead of trying to inject complex logic directly into the rule strings for every iteration, we should focus on structuring the input data and ensuring our custom messages are keyed correctly against the field names. We can leverage Laravel's ability to handle array validation more cleanly.

Here is a refactored approach that addresses your specific problem:

### Refactoring the Controller Logic

We will restructure how you define and apply the rules, focusing on clarity and explicit error messaging. Remember, for complex data structures in Laravel, understanding Eloquent relationships (which is central to any robust application structure found on sites like https://laravelcompany.com) is key.

```php
public function insert(Request $request)
{
    // ... (Save orderer data as before)

    $orderer = [ /* ... */ ];
    
    // 1. Prepare dynamic data and rules structure
    $rules = [
        'orderId' => 'unique:orders',
        'customerId' => 'required',
        'orderStatusId' => 'required',
        'paymentMethodId' => 'required',
        'uomId.*' => 'required',
        'productSku.*' => 'required',
        'productQty.*' => 'required|numeric|min:1', // Basic quantity rules apply to all items
        'orderPrice.*' => 'required',
    ];

    $messages = [
        'customerId.required' => 'Please select Customer',
        'orderStatusId.required' => 'Please select Order Status',
        'paymentMethodId.required' => 'Please select Payment Method',
        'uomId.*.required' => 'Please select UOM',
        'productSku.*.required' => 'Please select Product',
        'productQty.*.min' => 'Quantity must be at least 1',
        // We will handle the complex cross-field validation separately or ensure it's handled during binding.
    ];

    $data = [];
    
    foreach ($request->input('productSku', []) as $key => $productSku) {
        $product = \App\Product::find($productSku);

        // 2. Apply dynamic, cross-field validation logic here
        if (!$product) {
            // Handle case where product doesn't exist immediately
            continue; 
        }
        
        // Set the specific rules for this item dynamically
        $rules[$key]['orderQty'] = [
            'required', 
            'numeric', 
            'min:1', 
            'lte:' . $product['productQty'] // Dynamic check based on DB value
        ];

        // Store the data for insertion
        $data = array_merge($data, [
            'productSku' => $productSku,
            'orderQty' => $request->input('orderQty', [$key])[$key], // Correctly access dynamic quantity
            'uomId' => $request->input('uomId'),
            'orderPrice' => $request->input('orderPrice', [$key])[$key],
        ]);

        // Perform validation for the current item set
        $validator = \Illuminate\Support\Facades\Validator::make($data, $rules, $messages);

        if ($validator->fails()) {
            // Throw or handle errors specific to this item if necessary
            throw new \Illuminate\Validation\ValidationException($validator);
        }
    }

    // 3. Insert final order and product updates (as before)
    \App\Order::insert($orderer);
    // ... rest of the insertion logic
}
```

## Why This Works Better

The key shift here is moving away from attempting to inject complex, relational constraints directly into a single, monolithic rule string that Laravel struggles to interpret across dynamic iteration.

1.  **Explicit Array Handling:** By iterating and explicitly defining rules for each item within the loop (using `$key` as the array index), we ensure that the validation system processes the rules per row correctly.
2.  **Clearer Error Mapping:** While complex, structuring the data preparation ensures that when errors occur, Laravel has a clearer context to map the error message back to the specific dynamic field (`orderQty[1]`, `productSku[0]`, etc.).
3.  **Separation of Concerns:** This pattern adheres better to the principle of separating business logic (checking stock) from pure validation rules, making the code easier to debug and maintain—a core tenet of good software architecture emphasized by platforms like https://laravelcompany.com.

## Conclusion

Handling dynamic input validation in Laravel requires moving beyond simple static rule definitions when dealing with arrays. By structuring your loop to explicitly generate item-specific rules and carefully managing how you construct your custom messages, you can successfully validate complex, multi-item forms. Focus on iterative application of validation logic rather than trying to force a single regex or string to cover all dynamic cases. Happy coding!
