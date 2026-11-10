---
title: "vuetify v-data-table not showing nested object data"
description: "Mastering Nested Data in Vuetify Data Tables: Solving the [object Object] Mystery As developers building dynamic interfaces with Vue and Vuetify, one of..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "Errors"]
featured: false
---

As developers building dynamic interfaces with Vue and Vuetify, one of the most common hurdles we face when rendering complex data is handling nested objects. You have meticulously structured your backend data—perhaps pulled from a Laravel API—with related entities like addresses or emergency contacts, but when you try to display this data in a `v-data-table`, you often encounter the frustrating result: `[object Object]`.

This post will dive deep into why this happens and provide practical, robust solutions for correctly displaying nested data within your Vuetify tables.

## The Root Cause: Why You See `[object Object]`

The behavior you are observing is not an error in your data structure itself; it’s a fundamental limitation in how JavaScript (and consequently Vue templates) handles object rendering. When you use simple interpolation like `{{ props.item.address }}` inside a table cell, Vue attempts to convert that entire object into a string. By default, JavaScript converts objects to the string representation of their prototype, which results in the generic output: `[object Object]`.

This happens because the template expects a primitive value (string, number) for display, not a complex object structure. To fix this, we need to explicitly tell Vue *which* piece of information from that nested object we actually want to display.

## Solution 1: Explicitly Accessing Nested Properties

The most straightforward solution is to use dot notation or bracket notation to drill down into the specific properties you need from your nested objects. Instead of trying to display the entire `address` object, you should target its internal fields (`region`, `houseNumber`, etc.).

Let's look at your provided data structure:

```javascript
// Example Data Snippet
"address": {
    "region": "Addis Ababa",
    "woreda": "bole",
    "kebele": "10",
    "houseNumber": "35698",
    // ... other fields
},
```

To display just the region, you access it directly: `props.item.address.region`.

### Implementing the Fix in the Template

You need to adjust your template slot to extract only the necessary strings:

```html
<template slot="items" slot-scope="props">
  <tr>
    <!-- ... other cells ... -->
    <td class="text-xs-right">{{ props.item.firstName + props.item.middleName + props.item.lastName }}</td>
    <td class="text-xs-right">{{ props.item.gender }}</td>
    <td class="text-xs-right">{{ props.item.dateOfBirth }}</td>

    <!-- FIX: Accessing nested properties directly -->
    <td class="text-xs-right">{{ props.item.address.region }}</td> 
    <td class="text-xs-right">{{ props.item.emergencyContact.firstName }}</td>
    
    <!-- ... other cells ... -->
  </tr>
</template>
```

By explicitly calling `.region` on the `address` object, you instruct Vue to render the string value stored at that location, resolving the `[object Object]` issue.

## Solution 2: Concatenating for Richer Display

For fields where you want a more human-readable consolidated view—like combining the address parts or contact details—you can use string concatenation within your template. This gives you complete control over how the data is presented.

If you wanted to display the full address in one cell, you could combine multiple nested fields:

```html
<!-- Example of combining address fields -->
<td class="text-xs-right">{{ props.item.address.region }}, {{ props.item.address.woreda }}, {{ props.item.address.houseNumber }}</td>
```

This approach moves the complexity from the data layer (where it should stay structured) to the presentation layer, ensuring your table remains clean while still providing rich context. This principle of separating data structure from presentation is vital, especially when working with complex systems, whether you are using Laravel for backend logic or Vue for frontend rendering, as emphasized in modern frameworks like those supported by services such as https://laravelcompany.com.

## Conclusion

Dealing with nested data in table components requires attention to detail. The `[object Object]` error is a classic symptom of attempting to render an entire object instead of its specific properties. By mastering explicit property access and careful string concatenation, you gain full control over how your complex data is visualized. Always remember: structure your data efficiently on the backend, and then carefully map that structure to your frontend presentation layer to achieve seamless and beautiful user experiences.
