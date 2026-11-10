---
title: "How to display the index of an array using the vuetify data table?"
description: "Title: Displaying Array Indexes in a Vuetify Data Table Body: In your existing data table code, you've successfully showcased how to display specific..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Technical SEO", "JavaScript"]
featured: false
---

Title: Displaying Array Indexes in a Vuetify Data Table

Body: In your existing data table code, you've successfully showcased how to display specific properties of an array passed from a server response. However, you are looking for a way to also include the index value for each item. This post will provide a comprehensive guide on how to achieve this goal in your Vuetify data table using Vue.js.

First, let's add the index as part of the customers array: 
<pre><code>customers = [{index: 0, id: 1, name: 'John Doe', email: 'john@example.com'}, {index: 1, id: 2, name: 'Mary Smith', email: 'mary@example.com'}, ...]</code></pre>
This array now has an "index" property in addition to the previous properties. Note that we have hard-coded the index values for this example but you can dynamically assign them in your actual code.

Next, let's modify your Vuetify data table code: 
<pre><code>&lt;v-data-table
  v-bind:headers=&quot;headers&quot;
  v-bind:items=&quot;customers&quot;
  v-bind:search=&quot;search&quot;
  v-cloak
  &gt;
  &lt;template slot=&quot;items&quot; scope=&quot;props&quot;&gt;
  &lt;td class=&quot;text-xs-center&quot;&gt;@{{ props.item.index }}&lt;/td&gt;
  &lt;!-- Rest of the table columns remain the same --&gt;
  &lt;/template&gt;
  ...
</code></pre>
The only change here is to add a new column that displays the "index" property, which you have already made available in the customers array. The "@{{ props.item.index }}" part renders the value stored in 'props.item.index' for each row of the data table. 

Now your data table should display both the index and all other specified properties of the array passed from the server response. In case you need to access any property or method on the customer array, you can always use the supplied 'props.item' object within any slot scope.

Although this example uses a hard-coded index value for simplicity, it is better to dynamically assign indexes in your actual code: 
<pre><code>customers = [{id: 1, ...}, {id: 2, ...}, ...]</code></pre>
And then reference this id property within the table to show the index numbers. This approach ensures that your array remains consistent and easier to work with. Furthermore, it will be more efficient if you have a large number of items in the array since calculating the index dynamically can lead to performance issues for larger datasets.

In conclusion, by making slight modifications to your Vuetify data table and ensuring that your customer data is structured appropriately, you can easily display the index numbers along with all other properties of an array. This added context can be useful in various scenarios like tracking changes or identifying specific records within a larger dataset. Now, your table should show customers' index values with the rest of their information, and you will be able to enjoy a more comprehensive view of the data.
