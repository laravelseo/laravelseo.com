---
title: "Paginate results with Vue.Js / Inertia.js and Laravel"
description: "Paginate Results Seamlessly: Mastering Pagination with Laravel, Vue, and Inertia.js As developers working with modern full stack frameworks, one of the most..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "PHP"]
featured: false
---

As developers working with modern full-stack frameworks, one of the most common tasks you face is handling data presentation, especially when dealing with large datasets. When combining the robust backend capabilities of Laravel with the dynamic frontend power of Vue.js via Inertia.js, implementing proper pagination can sometimes feel like navigating a maze.

You've hit a common snag: correctly exposing the necessary pagination links from your Laravel controller to your Vue component. This guide will walk you through exactly how Laravel structures this data and how you can leverage it effectively in your Vue application using Inertia.js.

## The Core Concept: Eloquent Pagination and Inertia Data Transfer

When you use Laravel's Eloquent `paginate()` method, it doesn't just return the data; it returns a comprehensive object that includes the items themselves *and* all the necessary metadata for building pagination controls (links, current page, total count).

In an Inertia setup, everything returned by your controller method is automatically serialized and passed to the corresponding Vue component as props. The key to successful front-end pagination is understanding which properties Laravel exposes in this object.

## Deconstructing the Controller Output

Let's look at the excellent data structure you are already receiving from your controller:

```php
$data['participants'] = User::with('groups')->select('id', 'name')->paginate(2);
return inertia('Dashboard/Participants', $data);
```

When Laravel handles this, the resulting object passed to Vue contains crucial pagination information. As you correctly observed in your inspection, properties like `links()`, `current_page`, `last_page`, and `next_page_url` are all present.

The missing piece is understanding how to access the actual navigation links. The magic lies within the `links()` method of the Paginator object.

When you execute:
```php
dd($data['participants']->links());
```
Laravel renders a Blade view (like `pagination::bootstrap-4`) which generates the necessary `<a>` tags for navigating between pages, complete with `next` and `prev` links. This rendered HTML is what Inertia transfers to Vue.

## Implementing Dynamic Pagination in Vue.js

Since you are receiving the entire paginator object as a prop, your goal in the Vue component is simply to destructure and utilize these properties to render your controls. You do not need to perform any complex API calls; the data is already present!

Here is how you can structure your Vue component to display the results and the pagination links:

```vue
<template>
  <div>
    <h2>Participants List</h2>

    <!-- Displaying the actual data -->
    <ul>
      <li v-for="participant in participants.data" :key="participant.id">
        {{ participant.name }}
      </li>
    </ul>

    <!-- Dynamically building the pagination links using the 'links' property -->
    <div v-if="participants.links">
      <nav>
        <ul class="pagination">
          <!-- Previous Page Link -->
          <li class="page-item" :class="{ disabled: participants.links.prev === null }">
            <a 
              :href="participants.links.prev ? participants.links.prev : null" 
              class="page-link"
              :aria-disabled="participants.links.prev === null"
            >
              Previous
          </li>

          <!-- Page Numbers -->
          <li v-for="page in participants.links.links" :key="page.url">
            <a 
              :href="page.url" 
              class="page-link"
              :class="{ active: page.active }"
            >
              {{ page.active }}
          </li>
          
          <!-- Next Page Link -->
          <li class="page-item" :class="{ disabled: participants.links.next === null }">
            <a 
              :href="participants.links.next ? participants.links.next : null" 
              class="page-link"
              :aria-disabled="participants.links.next === null"
            >
              Next
          </li>
        </ul>
      </nav>
    </div>

  </div>
</template>

<script setup>
import { defineProps } from 'vue';

// Define the expected props structure
const props = defineProps({
  participants: {
    type: Object,
    required: true
  }
});
</script>
```

## Best Practices and Laravel Ecosystem

This pattern—passing paginator objects via Inertia—is a cornerstone of building efficient, decoupled applications. It keeps your controllers focused purely on data retrieval and presentation logic, while allowing the frontend (Vue) to handle all the complex UI interactions for navigation. This separation of concerns is crucial, especially when managing large amounts of data, aligning perfectly with the principles of clean architecture often emphasized by organizations like Laravel.

When dealing with more complex relationships or nested pagination across multiple resources, exploring how Eloquent handles these nested `links()` can become essential. For deep dives into optimizing your database queries and Eloquent relationships, always refer to the official documentation on the [Laravel documentation](https://laravelcompany.com) for the most up-to-date best practices.

## Conclusion

You were on the right track! The pagination links are indeed available in the data passed from the Laravel controller; you just needed to know how to correctly access and iterate over them within your Vue component. By understanding that Inertia seamlessly bridges this gap, you can build highly interactive and efficient user interfaces without needing to manually manage API requests for every page change. Happy coding!
