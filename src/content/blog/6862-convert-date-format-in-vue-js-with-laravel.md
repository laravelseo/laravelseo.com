---
title: "Convert date format in vue js with laravel"
description: "Bridging the Gap: Converting Dates from Laravel Backend to Vue.js Frontend As developers working with full stack frameworks like Laravel and Vue.js, we often..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "HTML", "PHP"]
featured: false
---

As developers working with full-stack frameworks like Laravel and Vue.js, we often encounter challenges related to data presentation and manipulation across the server and client boundaries. A common pain point arises when complex date formatting or localization logic is handled on the backend (like in a Laravel controller) but needs to be replicated dynamically on the frontend using Vue.js.

This post addresses a specific scenario: how to take a date object from your Laravel application, which might involve custom conversions (such as converting Gregorian dates to Hijri dates using a library like `verta`), and correctly display or format it within a Vue.js component.

## The Server-Side vs. Client-Side Divide

Your example highlights the fundamental difference between server-side rendering (Blade) and client-side interactivity (Vue.js).

In your Blade example:
```html
{{ Verta($category->created_at)-format('%d %B %Y') }}
```
This works because the entire operation—fetching the date, performing the complex mathematical conversion with `Verta`, and applying the custom format—is executed on the PHP server *before* the HTML is sent to the browser.

When you receive just:
```html
{{ category.created_at }}
```
In Vue.js, you are dealing with raw data, typically an ISO 8601 string or a standard JavaScript `Date` object representation. You cannot directly call server-side functions like `Verta()` on the client side because that logic only exists on the server.

The solution is not to try and replicate the exact PHP function in Vue, but rather to use the universal tools available in JavaScript to handle date manipulation based on the data provided by the backend.

## The Solution: Client-Side Date Manipulation in Vue.js

Since Vue.js runs entirely in the browser, all date conversions must be performed using native JavaScript `Date` objects or robust third-party libraries within your component logic. This ensures that the presentation layer is decoupled from the server's specific formatting routines.

Here is a practical approach for handling this conversion within a Vue component:

### Step 1: Ensure Backend Data is Standardized

Regardless of whether you use custom date formats, ensure your Laravel API provides the raw timestamp or a consistently formatted ISO string. This keeps your data flow clean and adheres to good architectural practices—a principle central to building robust applications on platforms like Laravel.

### Step 2: Implement Conversion Logic in Vue

We will fetch the date as a standard string and use JavaScript's `Date` object to perform any necessary transformations before formatting it for display. If you are using complex, non-standard conversions (like Hijri calculations), you would integrate a JavaScript library that supports those specific algorithms.

Here is how you might implement this in a Vue component:

```vue
<template>
  <div>
    <h2>Category Details</h2>
    <p>Original Date: {{ rawDate }}</p>
    <p>Converted Hijri Date: {{ hijriDateDisplay }}</p>
  </div>
</template>

<script>
export default {
  props: {
    categoryData: {
      type: Object,
      required: true
    }
  },
  computed: {
    hijriDateDisplay() {
      // 1. Get the standard date string from the backend (e.g., ISO format)
      const isoString = this.categoryData.created_at;

      if (!isoString) {
        return 'Date not available';
      }

      // 2. Create a JavaScript Date object
      const dateObject = new Date(isoString);

      // --- Custom Conversion Logic Example ---
      // NOTE: For complex conversions like Gregorian to Hijri, you would typically
      // integrate an external library here that handles the algorithm.
      // For demonstration, we'll show standard formatting first.

      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const formattedGregorian = dateObject.toLocaleDateString('en-US', options);

      // If you were using a library like Verta ported to JS, the call would look like this:
      // const hijriDate = Verta.convert(dateObject, 'Hijri'); 
      
      return formattedGregorian; // Using standard formatting for simplicity here
    }
  }
}
</script>
```

### Best Practices and Architectural View

When structuring your application with Laravel as the foundation, remember that the backend (Laravel) is responsible for data persistence and complex business logic. The frontend (Vue.js) is responsible for presentation and user interaction.

If date conversion logic becomes extremely complex (like custom religious calendar conversions), consider moving that specific computation back to a dedicated service layer in your Laravel application, exposing a clean, pre-calculated result via an API endpoint. This maintains the Single Source of Truth on the server, making debugging easier and ensuring data integrity, which is crucial when dealing with sensitive calculations.

By keeping complex calculations on the server and using Vue.js purely for rendering and presentation logic, you create a scalable and maintainable system, aligning perfectly with modern architectural patterns advocated by the Laravel community. For further insights into building robust APIs, exploring resources from [Laravel Company](https://laravelcompany.com) is highly recommended.

## Conclusion

Converting date formats between server-side processing (like in Laravel) and client-side display (in Vue.js) requires shifting the responsibility for computation. Instead of trying to replicate backend functions directly in JavaScript, the best practice is to treat the data as raw timestamps from the server and use native or well-vetted JavaScript libraries to perform necessary formatting on the client. This separation ensures that your application remains fast, predictable, and architecturally sound.
