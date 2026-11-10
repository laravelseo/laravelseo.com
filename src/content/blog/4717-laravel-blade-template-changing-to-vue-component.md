---
title: "Laravel blade template changing to vue component"
description: "Migrating from Laravel Blade: Transforming Views into Dynamic Vue Components As a senior developer, I often see projects built with Laravel that serve as a..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript", "HTML"]
featured: false
---

As a senior developer, I often see projects built with Laravel that serve as a solid foundation. The transition from server-rendered Blade templates to modern Single Page Applications (SPAs) using frameworks like Vue.js is a common and powerful evolution. You are running into a very common hurdle: how to manage the stateful interactions of CRUD operations when you start moving away from full page reloads.

This guide will walk you through the architectural shift, showing you exactly how to convert your existing Laravel Blade structure into dynamic, interactive Vue components, effectively solving your issue with data refreshing and state management.

## The Architectural Shift: From Server Rendering to API-Driven Design

The core difference between traditional Laravel development and a modern SPA is the flow of control. In the traditional setup (like your current Blade files), the server handles *everything*: fetching data, processing form submissions, and rendering the entire HTML page.

With Vue.js, we adopt an **API-first approach**. Laravel's role shifts from being a full-stack renderer to becoming a robust backend API provider. The frontend (Vue) then becomes solely responsible for requesting data from this API and dynamically updating the DOM based on that response.

This decoupling is essential for creating responsive applications. Instead of refreshing the entire layout upon adding a record, we only request the necessary data, update the component state locally in Vue, and refresh only the relevant part of the screen. This aligns perfectly with modern architectural principles championed by companies like [Laravel Company](https://laravelcompany.com).

## Step 1: Decoupling Your Backend (The Laravel API)

Before touching Vue, we must ensure your Laravel backend can serve data efficiently. Your existing `RoadmapController` is perfect for this. Instead of returning full Blade views, it should return JSON data. This allows Vue to consume the data via AJAX requests.

**Example: Modifying the Controller for API Use**

You need to adjust your controller methods to return JSON responses instead of redirecting to new views.

```php
// In RoadmapController.php (Conceptual change)

public function index()
{
    $roadmap = DB::table('roadmaps')->get();
    return response()->json($roadmap); // Return data as JSON
}

public function store(Request $request)
{
    // ... validation and saving logic ...
    Roadmap::create($request->only(['year', 'body']));
    return response()->json(['message' => 'Created successfully'], 201); // Return success status
}
```

By adopting this pattern, you are leveraging Laravel’s strength in building robust APIs. This separation ensures that your frontend and backend can evolve independently.

## Step 2: Converting Blade Views into Vue Components

Your Blade files (`index.blade.php`, `show.blade.php`, etc.) should now be treated as **templates**—the visual structure you want to replicate in Vue components, not executable PHP logic.

For your roadmap table, the content of `roadmap/index.blade.php` would become the template for a new Vue component, perhaps named `RoadmapIndex.vue`.

### Example: Mapping Data Display

In the Blade file, instead of looping over `$roadmap`, you just define the structure:

```html
<!-- roadmap/index.blade.php (Simplified for context) -->
<div id="roadmap-container">
    <!-- Table structure defined here -->
    <table>
        <thead>...</thead>
        <tbody>
            @foreach ($roadmap as $data)
                <tr>
                    <td>{{ $data->id }}</td>
                    <td>{{ $data->year }}</td>
                    <td>{{ $data->body }}</td>
                    <!-- Action buttons will be Vue-driven -->
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
```

In your Vue component (`RoadmapIndex.vue`), you will use the `mounted()` lifecycle hook to initiate an API call to Laravel and populate this structure dynamically:

```vue
<template>
  <div>
    <!-- The table structure defined above -->
    <table>
      <thead>...</thead>
      <tbody>
        <tr v-for="roadmap in roadmapData" :key="roadmap.id">
          <td>{{ roadmap.id }}</td>
          <td>{{ roadmap.year }}</td>
          <td>{{ roadmap.body }}</td>
          <td>
            <!-- Action links will use Vue methods -->
            <button @click="edit(roadmap.id)">Edit</button>
            <button @click="delete(roadmap.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      roadmapData: [],
    };
  },
  mounted() {
    this.fetchRoadmaps();
  },
  methods: {
    async fetchRoadmaps() {
      try {
        // Fetch data from the Laravel API endpoint
        const response = await axios.get('/api/roadmaps'); 
        this.roadmapData = response.data;
      } catch (error) {
        console.error("Error fetching roadmaps:", error);
      }
    },
    async delete(id) {
      if (confirm('Are you sure?')) {
        await axios.delete(`/api/roadmaps/${id}`);
        this.fetchRoadmaps(); // Refresh the list after deletion
      }
    }
  }
};
</script>
```

## Step 3: Handling Form
