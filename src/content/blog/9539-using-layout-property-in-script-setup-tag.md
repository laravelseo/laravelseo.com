---
title: "Using layout property in <script setup> tag"
description: "Using Layout Properties in Vue 3 : Bridging Options API and Composition API As developers transitioning from older Vue patterns or working within..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["JavaScript"]
featured: false
---

As developers transitioning from older Vue patterns or working within frameworks like Inertia.js, you often encounter syntax shifts. One common point of confusion is how to manage component-level configurations, such as defining a shared layout, when migrating to the modern Vue 3 `<script setup>` syntax.

The question at hand is: **Is there a direct equivalent to using `export default { layout: Layout; }` within a `<script setup>` block?**

The short answer is no, not in the exact same structural sense. The shift from the Options API (which uses object exports) to the Composition API (`<script setup>`) changes how component metadata and state are defined. However, there are perfectly idiomatic and more powerful ways to achieve the *same outcome*—defining or applying a layout structure—using Composition API principles.

## Understanding the Shift: Options API vs. `<script setup>`

In the traditional Vue Options API, defining component-wide configuration like a layout was straightforward:

```javascript
// Options API Example (Legacy)
export default {
  layout: Layout, // Where Layout is a component or structure reference
  data() { /* ... */ }
}
```

This pattern relies on exporting an object literal. The `<script setup>` syntax, however, embraces the Composition API, which favors explicit imports and reactive state management over object definitions. When you use `<script setup>`, you are defining a function body that is automatically exposed to the template, rather than defining a component configuration object directly at the top level.

## The Solution: Composition-Based Layout Management

To handle layout logic in `<script setup>`, we move away from exporting a simple property and instead leverage the power of component composition and props management. Instead of embedding the layout reference directly as an export, we define how the component *uses* that layout, often by receiving it as a prop or defining internal reactive state based on external context (which is very common in Inertia applications where layouts are managed centrally).

Here is the recommended pattern for achieving the goal:

### Method 1: Passing Layout via Props (The Cleanest Approach)

If the layout structure is something that needs to be injected by a parent component or the Inertia controller, passing it down via props is the most declarative and reusable method.

```vue
<script setup>
import { defineProps } from 'vue';

// Define the expected props, including the layout structure
const props = defineProps({
  layout: {
    type: Object, // Or whatever type your layout object is
    required: true
  }
});

// Now you can use 'props.layout' throughout the component logic
console.log('Received Layout:', props.layout);

// Example usage in template (assuming 'layout' is accessible)
// <div :class="layout.container">...</div> 
</script>

<template>
  <!-- Component content using the injected layout -->
  <div>Content inside the provided layout structure.</div>
</template>
```

### Method 2: Defining Layout Structure Internally (For Self-Contained Components)

If your component is responsible for defining *which* layout it uses based on internal logic or context, you define this within the setup function itself, using standard JavaScript objects or reactive references. This keeps the definition inside the Composition API paradigm.

```vue
<script setup>
import { computed } from 'vue';

// Define the data structure for the layout internally
const componentLayout = {
  header: 'app-header',
  main: 'content-area',
  footer: 'app-footer'
};

// You can expose this configuration via a computed property or direct export if needed,
// but often it's best used internally.
const layoutConfig = computed(() => componentLayout);

// If you absolutely must share this structure globally (e.g., within an Inertia context), 
// you return it explicitly:
// const layout = { /* ... */ }; // This is not exported directly, but the variable is available for template use.
</script>

<template>
  <!-- Use the internally defined configuration -->
  <header :class="layoutConfig.header"></header>
  <main :class="layoutConfig.main"></main>
  <footer><p>{{ layoutConfig.footer }}</p></footer>
</template>
```

## Conclusion: Embracing Composition for Structure

The key takeaway is that `<script setup>` pushes us toward a more explicit, functional approach to component definition. Instead of relying on an exported object structure (Options API), we use the Composition API's tools—`defineProps`, `defineEmits`, and reactive state—to manage data flow.

For complex requirements like defining a shared layout in an Inertia context or any large Vue application, passing configuration via **props** (Method 1) is the most robust pattern. It promotes separation of concerns, making your components more reusable and easier to test, which aligns perfectly with the architectural principles seen in modern frameworks like Laravel and its ecosystem. By embracing these patterns, you write cleaner, more predictable code.
