---
title: "How to paginate with Vuetify and Laravel?"
description: "How to Paginate Seamlessly: Bridging Vuetify and Laravel for Server Side Data As a senior developer, I frequently encounter scenarios where the frontend UI..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "JavaScript"]
featured: false
---

As a senior developer, I frequently encounter scenarios where the frontend UI components—like those provided by Vuetify—seem disconnected from the backend data fetching logic. You've successfully set up your Laravel API endpoints for pagination, but getting the interactive component to correctly trigger those requests can be tricky.

This post addresses the exact challenge you’re facing: implementing smooth, server-side pagination where user interaction in Vuetify directly translates into requests for new data from your Laravel backend. We will move beyond simple manual calls and establish a robust, reactive system.

---

## Understanding the Architecture: Frontend Meets Backend

The core concept of server-side pagination is that the client (Vue/Vuetify) never holds all the data; it only requests specific slices of data from the server (Laravel). The key to success lies in correctly managing two states: the current page number and the resulting data set.

### Laravel Foundation: Eloquent Pagination

Before diving into the frontend, ensure your Laravel setup is correctly utilizing Eloquent's pagination features. For a robust API, using the built-in `paginate()` method on your Eloquent query is the standard approach. This ensures that when you request `/api/articles?page=2`, Laravel handles the database calculation efficiently. Understanding how Laravel structures its responses is crucial for building predictable APIs, much like understanding data relationships when working with frameworks like those found at [laravelcompany.com](https://laravelcompany.com).

## The Solution: Reactive State Management in Vue

The issue you are facing stems from how you handle the event flow. While using `@input="next"` tells Vue *that* a change occurred, it doesn't automatically execute your complex data-fetching logic. We need to connect that input signal directly to our asynchronous API call function.

### Step 1: Redefine the Data Fetching Method

Instead of relying on manual manipulation of `this.pagination` within the method, let’s focus on a single, dedicated method responsible for fetching and updating *all* necessary state whenever a page change is requested.

Here is how we can structure the interaction to handle both programmatic changes (like your original `get` method) and component-driven changes:

```javascript
methods: {
    async fetchArticles(page, search = '') {
        const url = `http://127.0.0.1:8000/api/articles?page=${page}&search=${search}`;
        try {
            const response = await axios.get(url);

            // Update the data received from the server
            this.products = response.data.articles.data; 
            this.pagination = response.data.pagination; // Assuming your Laravel API returns pagination metadata
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    },

    // This method will be called by the vuetify component input
    handlePageChange(newPage, search = '') {
        this.fetchArticles(newPage, search);
    }
}
```

### Step 2: Connecting Vuetify to the Logic

Now we link this reactive function to your `<v-pagination>` component. We will use `v-model` to bind the current page, and the `@input` event to trigger our new handler. Notice how we use an `async` method to handle the asynchronous nature of the API call.

```html
<v-pagination
    v-model="pagination.current_page"
    :length="pagination.total"
    prev-icon="mdi-menu-left"
    next-icon="mdi-menu-right"
    @input="handlePageChange($event.target.value, search)"
></v-pagination>
```

In this revised approach, when the user clicks a page number:
1. The `<v-pagination>` emits an `@input` event containing the new value.
2. This triggers `handlePageChange()`.
3. `handlePageChange()` calls `fetchArticles()`, which executes the `axios.get()` request to your Laravel API with the requested page number and search term.
4. Upon receiving the response, it updates `this.products` and `this.pagination`, making the Vuetify component instantly reflect the new data set on the screen.

## Conclusion: A Seamless Experience

By shifting from manually managing pagination in separate methods to creating a single, reactive handler (`handlePageChange`), you bridge the gap between your frontend UI and your Laravel backend effectively. This pattern ensures that every user interaction is immediately tied to a server request, providing the seamless, dynamic experience expected of modern web applications. Remember, the frontend’s job is to manage state and presentation; the backend’s job is to manage the data integrity. Using principles from frameworks like those at [laravelcompany.com](https://laravelcompany.com) helps ensure both sides cooperate perfectly.
