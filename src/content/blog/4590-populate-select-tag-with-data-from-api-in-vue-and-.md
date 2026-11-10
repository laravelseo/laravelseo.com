---
title: "Populate select tag with data from API in Vue and Axios"
description: "Populate Select Tags with Data from API in Vue and Axios: A Comprehensive Guide As a senior developer working with modern JavaScript frameworks like Vue.js,..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript"]
featured: false
---

As a senior developer working with modern JavaScript frameworks like Vue.js, fetching dynamic data from an external API using tools like Axios is a daily task. One of the most common UI requirements is populating `<select>` elements with fetched options. The challenge often lies not just in making the HTTP request, but in correctly managing the asynchronous state updates within the reactive framework.

The scenario you've presented—populating a "City" select based on a selected "Country"—is a classic example of dependent data loading. Let's dive into how to structure this efficiently using Vue and Axios.

## Understanding the Data Flow Challenge

Your initial attempt shows an understanding of the goal, but the issue lies in how asynchronous operations (API calls) interact with Vue’s reactivity system. When you use `axios.get()`, the code execution pauses until the response arrives. You need to ensure that when the response finally arrives, Vue updates its state (`cities`) correctly so the DOM reflects the new options.

The key mistake in your original method was trying to assign the result directly within the `.then()` block without proper state manipulation for reactivity.

## The Solution: Reactive State Management with Axios

To solve this, we need a clear, sequential data flow:

1.  **Initial Fetch:** Load the list of countries when the component loads.
2.  **Event Trigger:** When the user selects a country, capture that value.
3.  **Dependent Fetch:** Use the selected country ID to trigger a new API request for the corresponding cities.
4.  **State Update:** Store the fetched cities in the Vue data array, which automatically updates the `<select>` options.

### Step-by-Step Implementation Example

Here is how you can refactor your Vue component logic to handle this dependency cleanly. We will assume that your backend (perhaps a Laravel API) provides endpoints for both countries and cities.

```html
<div id="app">
    <label for="country" class="control-label">Country</label>
    <!-- Country Select Box -->
    <select v-model="selectedCountry" @change="fetchCities">
        <option selected disabled value="">Please select one</option>
        <option v-for="country in countries" :key="country.id" :value="country.id">{{ country.name }}</option>
    </select>

    <label for="city" class="control-label">City</label>
    <!-- City Select Box (Populated dynamically) -->
    <select v-model="selectedCity" name="city" id="city" class="form-control">
        <option selected disabled value="">Please select a city</option>
        <option v-for="city in cities" :key="city.id" :value="city.id">{{ city.name }}</option>
    </select>
</div>

<script type="text/javascript">
    new Vue({
      el: '#app',
      data: {
        selectedCountry: '',
        cities: [], // This will hold the cities data
        countries: [] // To hold the country list
      },
      methods: {
          // 1. Function to fetch initial countries
          async fetchCountries() {
              try {
                  const response = await axios.get('http://localhost:8000/api/countries');
                  this.countries = response.data;
              } catch (error) {
                  console.error('Error fetching countries:', error);
              }
          },

          // 2. Function triggered on country change to fetch cities
          async fetchCities() {
              if (!this.selectedCountry) {
                  this.cities = []; // Clear data if no country is selected
                  return;
              }

              try {
                  // Construct the dynamic URL based on the selection
                  const response = await axios.get(`http://localhost:8000/api/cities/country/${this.selectedCountry}`);
                  
                  // Assign the received data directly to the reactive state
                  this.cities = response.data; 
              } catch (error) {
                  console.error('Error fetching cities:', error);
                  this.cities = []; // Clear on error
              }
          }
      },
      // Lifecycle hook to start the process
      mounted() {
          this.fetchCountries();
      }
    });
</script>
```

### Key Takeaways and Best Practices

1.  **Use `async/await` for Clarity:** Using `async/await` (as shown above) makes handling promises much cleaner than deeply nested `.then()` chains, especially when dealing with sequential dependent requests.
2.  **Reactive Data is King:** The crucial step is ensuring that the API response is assigned to a property within the Vue `data` object (`this.cities = response.data`). Because Vue watches this data, it automatically triggers a re-render of the DOM, populating the `<select>` tags with the new options.
3.  **Separation of Concerns:** Notice we separated fetching countries from fetching cities. This keeps the code modular and easier to debug. When dealing with complex relational data, structuring your API endpoints effectively (much like how you would design RESTful resources when building an application using a framework like Laravel) is vital for smooth frontend integration.
4.  **Error Handling:** Always wrap API calls in `try...catch` blocks. If an API request fails (network error, 404, 500 status), catching the error allows you to display user-friendly messages instead of letting the application crash silently.

## Conclusion

Populating complex form elements like `<select>` from dynamic API data in a Vue environment is fundamentally about mastering reactive state management around asynchronous operations. By correctly sequencing your data fetching—fetching parent data first, then using that result to trigger dependent fetches—you can build robust, responsive user interfaces. Remember, whether you are building an application on the frontend or leveraging powerful backend services from frameworks like Laravel, clear data contracts and predictable API responses are the foundation of successful development.
