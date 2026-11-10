---
title: "Place pagination number in url Vuejs"
description: "Mastering History: Placing Pagination Numbers in URLs with Vue.js As developers building dynamic applications, one of the most fundamental requirements for..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "Errors"]
featured: false
---

As developers building dynamic applications, one of the most fundamental requirements for navigation is ensuring that the application state is reflected accurately in the URL. When dealing with data-heavy interfaces like pagination, simply updating the displayed results isn't enough; users expect to be able to use the browser's back button to navigate between pages easily.

This post addresses a common challenge: integrating client-side pagination controls (like those provided by libraries such as Bootstrap-Vue) with Vue Router history management. We will walk through the pitfalls of implementing this, diagnose the issues you encountered with duplicate navigation, and provide a robust solution for creating navigable, bookmarkable URLs.

## The Challenge: State Management vs. History Navigation

You are leveraging Laravel (a fantastic foundation for API design) to fetch data using query parameters (`page` and `per_page`). This is the correct RESTful approach for data retrieval. However, when you update these parameters on the client side using `router.push()`, you run into history management conflicts.

The error message you received, `NavigationDuplicated`, is a clear signal that you are attempting to push a new historical entry that duplicates an existing state. This often happens when the router doesn't correctly identify the difference between pushing a full path (`/`) and updating only the query parameters (`?page=2`).

The core issue lies in how you manage the current route state before making the navigation call. If you simply push `{ path: "/", query: { page: this.currentPage } }`, you lose context, or worse, create redundant history entries if not handled carefully.

## The Solution: Clean Query Parameter Management

The key to successful URL-based pagination is ensuring that every time you navigate, you are *merging* the new state with the existing route parameters rather than overwriting them entirely. This ensures the browser's history stack remains clean and logically ordered.

Here is a refined approach focusing on reactivity and correct router interaction within your Vue component.

### 1. Setting up Reactive State and Watching Changes

We need to ensure that whenever `currentPage` changes, we update the route query without disrupting other existing parameters (like sorting or filtering, if they exist).

```javascript
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
    setup() {
        const route = useRoute();
        const router = useRouter();

        // Assume these are initialized from your API response
        const perPage = 10; // Example fixed value
        let currentPage = 1; // Start at page 1

        // Function to handle navigation updates
        const navigateToPage = (pageNumber) => {
            if (pageNumber > 0) {
                router.push({
                    // Merge existing query parameters with the new page number
                    query: {
                        ...route.query, // Keep existing params like filters or IDs
                        page: pageNumber,
                    },
                });
            }
        };

        // Watch for changes to currentPage and trigger navigation
        watch(
            () => currentPage,
            (newPage) => {
                navigateToPage(newPage);
            },
            { immediate: true } // Run immediately on load
        );

        return { 
            currentPage, 
            perPage, 
            navigateToPage 
        };
    }
}
```

### 2. Integrating with Data Fetching (The Backend Connection)

When your component loads, it should read the initial page number from the URL query parameters. This ensures that if a user bookmarks `/list?page=5`, they land directly on page 5 upon refresh.

**In your component's `mounted` hook or initialization:**

```javascript
// Inside your component setup...
const route = useRoute();

onMounted(() => {
    // Read the page number from the URL query parameters
    const initialPage = parseInt(route.query.page) || 1;
    currentPage = initialPage;
});
```

This pattern ensures that the state is synchronized: the URL dictates the view, and the component reacts to changes in both the data and the URL history. This mirrors the principles of clean API design often emphasized when building robust systems, similar to how well-structured services are important in frameworks like Laravel.

### 3. Managing Pagination Active States

The final piece is making sure your pagination controls reflect the current page number correctly. Since you are now reading `route.query.page` directly from the router state, updating the active class becomes straightforward:

```html
<template>
    <!-- ... other content -->
    <b-pagination
        v-model="currentPage"
        :per-page="perPage"
        :total-rows="totalRows"
        @change="handlePaginationChange"
    >
    </b-pagination>

    <!-- Example pagination links -->
    <nav>
        <router-link 
            v-for="page in totalPages" 
            :key="page" 
            :to="{ query: { page: page } }"
        >
            {{ page }}
        </router-link>
    </nav>
</template>
```

By using `router-link` with the `query` object, you are leveraging Vue Router's built-in mechanism for stateful navigation, which is far more reliable than manually manipulating `router.push()` when dealing with history synchronization.

## Conclusion

Implementing URL-based pagination in a Vue application requires moving beyond simple data fetching and embracing the power of client-side routing. By focusing on merging query parameters during navigation, watching reactive state changes to trigger history updates, and using the router's link components for navigation, you achieve a seamless user experience. This approach ensures that your application history is logical, bookmarkable, and robust, providing a professional level of interaction with your users.
