---
title: "How to create a search filter using Vue js from API Data?"
description: "How to Create Dynamic Search Filters in Vue.js from API Data As developers, one of the most common tasks when dealing with external APIs is transforming raw..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["JavaScript", "Errors"]
featured: false
---

As developers, one of the most common tasks when dealing with external APIs is transforming raw data into a usable, interactive interface. A crucial part of this interaction is implementing dynamic search or filtering. When you combine asynchronous data fetching (like API calls) with reactive front-end state management (like Vue.js), subtle timing and scope issues can trip you up.

This post will walk you through a practical scenario: fetching data from an external source and creating a real-time search filter in Vue.js, addressing the common pitfalls encountered when using computed properties for filtering.

## The Challenge: Real-Time Filtering with Asynchronous Data

You have successfully fetched your data (e.g., people from the Star Wars API). Your goal is to allow the user to type into an input field and instantly display only the results matching that input.

The initial setup often involves fetching data in a `mounted` hook, storing it in a reactive property, and then creating a computed property to filter it based on another reactive property (the search term).

When developers encounter errors like `TypeError: this.people.filter is not a function`, it usually points to a timing issue or an incorrect reference to the data object within the computed function, especially when dealing with asynchronous operations that haven't fully resolved before the computed property attempts to access the state.

## The Vue Solution: Leveraging Computed Properties Correctly

The most idiomatic and efficient way to handle derived state in Vue is through **computed properties**. A computed property automatically recalculates its value whenever any of its reactive dependencies change (in this case, `this.people` or `this.search`).

The key is ensuring that the filtering logic operates correctly on the source data (`this.people`) and the filter term (`this.search`).

### Step-by-Step Implementation

Here is the corrected approach for implementing a dynamic search filter:

1.  **Data Initialization:** Ensure your API call populates the `people` array correctly.
2.  **Filter Logic:** Create a computed property that filters the original list based on the current search input. We will use the string method `.includes()` or a regular expression for more robust matching than `.match()`, which is often cleaner for simple substring searches.
3.  **Reactive Binding:** Bind the input field using `v-model` to `this.search`.

### Code Example: Refined Component Logic

Let's refine your component structure. Notice how we separate the data fetching from the filtering logic, ensuring both are reactive.

```vue
<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <!-- Input binds directly to the search term -->
                <input type='text' v-model="search" placeholder='Search people...'>
                <br>

                <!-- Displaying results from the computed property -->
                <ul>
                    <li v-for="person in filteredPeople" :key="person.name">
                        {{ person.name }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "StarWarsPeopleComponent",
    data() {
        return {
            people: [], // Stores the raw API data
            search: ''   // Stores the user input
        }
    },
    methods: {
        getAllStarWarsPeople() {
            fetch("https://swapi.co/api/people/")
                .then(response => response.json())
                .then(data => {
                    this.people = data.results; // Store only the relevant array from the API
                });
        }
    },
    computed: {
        filteredPeople() {
            // This computed property runs automatically whenever 'this.people' or 'this.search' changes.
            const searchTerm = this.search.toLowerCase();

            if (!searchTerm) {
                return this.people; // If search is empty, show all results
            }

            return this.people.filter(person => 
                person.name.toLowerCase().includes(searchTerm)
            );
        }
    },
    mounted() {
        this.getAllStarWarsPeople();
    }
}
</script>
```

### Why This Works Better

The error often arises when you try to access an array (`this.people`) before it has been fully populated by the asynchronous `fetch` call, or if the filtering logic itself is complex and breaks context.

By using a **computed property**, Vue manages the dependency chain automatically. When you type in the input field:
1.  `this.search` updates immediately.
2.  The `filteredPeople` computed property reruns.
3.  It accesses the fully loaded `this.people` array and filters it based on the new `this.search` value.

This reactive flow ensures that your UI updates instantly and reliably, providing a smooth user experience. This pattern of separating data fetching from derived state management is fundamental to building scalable applications, much like how well-structured patterns are essential in frameworks like Laravel where clean separation of concerns guides robust development practices.

## Conclusion

Creating dynamic search filters in Vue.js involves mastering the interaction between asynchronous data loading and reactive state management. By relying on **computed properties**—and ensuring your filtering logic handles case insensitivity correctly (by converting both the name and the search term to lowercase)—you can build highly interactive components efficiently. Focus on making your derived state reactive, and you will solve most complex UI synchronization problems with ease.
