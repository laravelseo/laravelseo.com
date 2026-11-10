---
title: "How to pass data from one component to other in vue js?"
description: "How to Pass Data from One Component to Another in Vue.js: A Deep Dive As developers working with modern frontend frameworks like Vue.js, managing data flow..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["JavaScript"]
featured: false
---

As developers working with modern frontend frameworks like Vue.js, managing data flow between components is a fundamental skill. When building complex applications, ensuring that data flows correctly—whether it’s state management within a parent-child relationship or across routed views—is crucial for maintainability.

Many beginners often get stuck on how to bridge the gap between Component A and Component B. In your specific scenario involving `SelectPerson.vue` passing a value to `SelectTimeSlot.vue`, the solution lies in mastering Vue’s component communication methods: **Props** and **Events**.

This post will walk you through the best practices for passing data, addressing the nuances of using routing alongside state management.

---

## Understanding Data Flow in Vue: Props vs. Events

In Vue, components communicate primarily through two mechanisms: **Props** for downward data flow and **Events** (emitting and listening) for upward communication.

### 1. Passing Data Down (Parent to Child): Using Props

The most idiomatic way to pass data from a parent component to a child component is by using **props**. Props allow the parent to define data that the child component can consume, making the relationship unidirectional and explicit.

In your example, `SelectPerson.vue` is the parent, and `SelectTimeSlot.vue` is the child. The number of persons calculated in the first component needs to be available to the second component for display.

### 2. Communicating Actions Upward (Child to Parent): Using Events

If the child component needs to notify the parent that something has happened (e.g., a button was clicked, or a selection was made), it should emit an event. This is crucial for maintaining a clean separation of concerns.

## Solving Your Specific Scenario: Passing Data Across Routes

Your goal involves two steps: managing local state (`inputPersons`) and navigating via Vue Router. We need to ensure the data is correctly available when the transition occurs.

The issue in your initial attempt often stems from trying to pass dynamic state directly during a navigation event, rather than ensuring the necessary state is established *before* the navigation trigger.

Here is how we restructure the flow to achieve seamless data transfer:

### Step 1: Parent Component (`SelectPerson.vue`) - Managing State and Triggering Navigation

The parent component should manage the core data and use an emitted event or a route parameter to pass the necessary context to the next view. For simple navigation, passing the data via state management that the router can pick up is often cleanest.

We will ensure `inputPersons` is available when navigating.

```vue
<!-- SelectPerson.vue -->
<template>
  <div>
    <input type="number" class="form-control" name="numberOfPersons" placeholder="Enter number of persons here" v-model="inputPersons">
    <br>
    <!-- Pass the value directly to the router context or a specific route param if needed -->
    <SelectTimeSlot 
      :personCount="inputPersons" 
      @navigate="selectTimeSlots" 
    />
    <button class="btn btn-default float-right mt-2" v-on:click="selectTimeSlots">Next</button>
  </div>
</template>

<script>
import SelectTimeSlot from './SelectTimeSlot.vue';

export default {
  components: { SelectTimeSlot },
  data(){
    return{
      inputPersons: 0
    }
  },
  methods:{
    selectTimeSlots(){
      // When navigating, we pass the current state data along if needed, 
      // or rely on route parameters. For this example, let's assume passing it via a method call context.
      this.$router.push({name:'SelectTimeSlot', params: { count: this.inputPersons }});
    }
  }
}
</script>
```

### Step 2: Child Component (`SelectTimeSlot.vue`) - Receiving Data via Props

The child component must explicitly declare the data it expects via `props`. This ensures that if the parent passes the required information, the child can use it safely.

```vue
<!-- SelectTimeSlot.vue -->
<template>
  <div>
    <h5>Welcome, You have selected {{ numberOfPersons }} persons.</h5>
  </div>
</template>

<script>
export default {
  // Define the expected props explicitly
  props: {
    numberOfPersons: {
      type: Number,
      required: true
    }
  }
}
</script>
```

### Step 3: Router Setup (Ensuring Data is Received)

In your Vue Router configuration, you would define the route to accept this parameter:

```javascript
// router/index.js
const routes = [
  {
    path: '/timeslots',
    name: 'SelectTimeSlot',
    component: () => import('../components/SelectTimeSlot.vue'),
    props: true // Important for passing data via route params
  }
];
```

## Conclusion: Architectural Best Practices

Passing data between components in Vue should always follow the principle of **"data flows down, actions flow up."**

1.  **For direct component hierarchy (Parent $\rightarrow$ Child):** Use **Props**. This keeps the data explicit and localized.
2.  **For state changes or notifications (Child $\rightarrow$ Parent):** Use **Events** (`$emit`).
3.  **For complex navigation or global state:** Consider using Vuex or Pinia for centralized state, or leverage **Route Parameters** (as demonstrated above) to pass necessary context between routes.

By adhering to these patterns, you ensure your application remains predictable, scalable, and easy to debug. If you are building a backend around this frontend, remember that robust data handling on the client side is just as important as ensuring your Laravel API endpoints correctly handle requests, much like how structured data management is key in modern PHP frameworks like Laravel.
