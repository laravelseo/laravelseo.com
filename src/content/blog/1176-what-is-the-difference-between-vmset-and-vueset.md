---
title: "What is the difference between vm.$set and Vue.set?"
description: "Understanding the Difference Between vm.$set and Vue.set In modern web development, JavaScript frameworks like Vue.js simplify your workflow and enable you..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["JavaScript"]
featured: false
---

Understanding the Difference Between vm.$set and Vue.set

In modern web development, JavaScript frameworks like Vue.js simplify your workflow and enable you to build powerful, responsive applications. In these frameworks, it is essential to understand how data binding works, especially when dealing with dynamic properties in objects. Vue.js provides two methods for this purpose: vm.$set and Vue.set.

First, let us discuss the primary difference between these two methods. Both are used to add new properties to an object or make existing properties reactive, but they differ slightly in their usage contexts. Let's break down each method with a few examples:

1. vm.$set: For Vue Instances
<pre><code>vm.$set('b', 2)
// `vm.b` and `data.b` are now reactive
</code></pre>
In the above example, we use vm.$set to add a new property 'b' with value 2 in the context of a Vue instance (which is accessed via the vm variable). By doing so, whenever you modify the property 'vm.b', it will be detected by the framework and trigger change detection. This keeps your application consistent and reactive.

2. Vue.set: For Plain Data Objects
<pre><code>Vue.set(data, 'c', 3)
// `vm.c` and `data.c` are now reactive
</code></pre>
In this case, you use Vue.set to make a plain data object reactive. You pass the object as 'data' and its property/key where you want to add value (here, 'c') with the desired new value ('3'). Even though these properties are not part of your Vue instance, they can still be detected by the framework due to the usage of Vue.set.

In both cases, the primary difference lies in whether the object is a Vue instance or plain data. However, you might wonder if this distinction is necessary when you have multiple properties to set at once. You may consider using Object.assign() or _.extend() to merge different objects together. Unfortunately, these operations create new objects instead of updating existing ones.

To solve this problem, Vue.js provides a more appropriate solution:
<pre><code>// instead of `Object.assign(this.someObject, { a: 1, b: 2 })`
this.someObject = Object.assign({}, this.someObject, { a: 1, b: 2 })
</code></pre>
In the above example, you first create a new object with the desired properties and then update your existing object by assigning it to the old object combined with the new one. This approach ensures that any changes made will be detected as reactive updates in your Vue application.

In conclusion, while both vm.$set and Vue.set are used for adding or updating properties, they differ based on their contexts (Vue instance vs plain data object). Understanding when to use each method is crucial for maintaining the reactivity of your application. By employing best practices such as creating a new object with updated properties instead of using Object.assign() directly, you can ensure efficient and predictable change detection in your Vue applications.
