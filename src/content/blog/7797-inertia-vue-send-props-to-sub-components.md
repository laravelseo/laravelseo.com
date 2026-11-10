---
title: "inertia + vue, send props to sub components?"
description: "Inertia + Vue: Handling Data Flow in Nested Components—Avoiding Prop Drilling As developers working with modern full stack frameworks like Laravel and Vue..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript"]
featured: false
---

As developers working with modern full-stack frameworks like Laravel and Vue via Inertia.js, we frequently encounter architectural challenges related to data flow, especially when dealing with deeply nested component hierarchies. The scenario you described—passing data from a top-level page down through an intermediate component only to reach the final destination—is the classic problem of "prop drilling."

This post will dive into why this happens in the context of Inertia and Vue, examine the standard solutions, and explore more advanced architectural patterns to achieve cleaner, more scalable component communication.

## The Prop Drilling Dilemma in Inertia/Vue

In your example structure: `Page` passes data (`foo`) to `Component`. If the `Page` component itself does not perform any logic or rendering based on `foo`, passing that prop down serves no immediate purpose other than transit. While technically functional, this practice quickly becomes cumbersome and violates the principle of separation of concerns.

The standard Vue way is:

```vue
<!-- Page.vue -->
<template>
  <Component :foo="dataFromController" />
</template>
```

This forces `Page` to acknowledge and pass data it doesn't need, creating unnecessary coupling between the intermediate layer and the deeply nested child.

## Architectural Solutions for Cleaner Data Flow

Instead of relying solely on prop drilling for simple data transfer, senior developers opt for solutions that manage state externally or utilize reactive patterns. Here are three effective approaches:

### 1. State Management with Pinia (The Recommended Approach)

For complex applications where data needs to be accessible across many components regardless of their depth, global state management is the superior pattern. By using a centralized store like Pinia, you decouple the data source from the component hierarchy. The `Page` component can interact with the store, and any deeply nested `Component` can subscribe directly to the required data without needing it explicitly passed down via props.

**How it works:**
The data (e.g., the model results) is fetched once, stored in the Pinia store, and components pull what they need directly from the store. This makes the component tree more independent and easier to refactor. As detailed in Laravel’s philosophy on building robust applications, managing state centrally leads to more maintainable code.

### 2. Direct API/Inertia Calls (Decoupling Data Fetching)

If the data being passed is dynamic or expensive to calculate, avoid passing it down at all. Instead, let each component be responsible for fetching its own required data. If `Component` needs `foo`, it can initiate a new Inertia request to the backend endpoint that provides that specific data, completely decoupling it from the parent's state.

This approach ensures that components remain highly focused on their responsibilities, which is crucial when scaling large applications built on Laravel services.

### 3. Utilizing Vue Slots for Contextual Data

If the intent of passing `foo` to `Component` is purely to provide context or theme information rather than direct data manipulation, consider using Vue slots. Slots allow the parent (`Page`) to inject content or contextual data into a specific area of the child component's template, which often feels more semantically correct than prop passing for structural elements.

## Conclusion

While explicitly passing props is the most straightforward mechanism in Vue, relying on it for deep nesting leads to maintenance headaches. For complex Inertia applications involving nested views, we should treat props as a tool for *immediate* data transfer and use state management (like Pinia) or decoupled API calls for true application-wide data flow. By adopting these patterns, you ensure that your components remain loosely coupled, scalable, and adhere to best practices for building robust Laravel/Vue applications.
