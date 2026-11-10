---
title: "ChartJS show value in legend (Chart.js V3.5)"
description: "Mastering Chart.js Legends: Showing Values and Labels Directly (V3.5 Guide) As developers building interactive data visualizations, one of the most common..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["JavaScript"]
featured: false
---

As developers building interactive data visualizations, one of the most common requirements is making the legend not just display a color next to a label, but also embed crucial context—like the actual value or metric associated with that entry. You are looking to achieve a result like: `[Color of Data] Car 50` instead of just a generic label association.

Many developers attempt to solve this by manipulating the `legend.title.text` function in Chart.js, as you have shown in your code. However, as we dive into the specifics of Chart.js v3.5 and its rendering pipeline, we need to understand why that approach often falls short and explore the more robust, idiomatic ways to achieve complex legend formatting.

This post will walk you through the limitations of the direct approach and provide a comprehensive solution using data structuring and advanced configuration techniques.

---

## Why Direct Title Overrides Fail in Chart.js

Your attempt to override the title function is a valid starting point:

```javascript
// Your attempted approach:
title: {
  text: function(context) {
    var value = context.dataset.data[context.dataIndex];
    var label = context.label[context.dataIndex];
    return label + ' ' + value; // This often doesn't render as desired in the legend structure
  },
}
```

While this method allows you to access the underlying data, Chart.js’s default legend rendering logic is highly optimized for simple key-value pairs (label: value). When you introduce complex string concatenation inside the title function, it often disrupts how the legend component internally maps the labels and colors to the visual elements, leading to misalignment or unexpected behavior.

The core issue isn't usually a bug in your JavaScript, but rather a limitation in how Chart.js is designed to manage legend entries versus how you want to present complex data relationships.

## The Developer’s Solution: Structuring Data for Clarity

The most reliable way to ensure rich information appears in the legend is to shift the complexity from the chart configuration itself into the *data structure* before it even hits the rendering engine. Instead of relying solely on Chart.js to stitch together disparate pieces, we can pre-format the data into a single, descriptive array.

For pie charts or bar charts, ensure your dataset provides all necessary contextual information in one cohesive object. This approach is highly scalable and keeps your front-end code clean, which aligns perfectly with best practices found in modern application development, whether you are building robust APIs on the backend using frameworks like Laravel. For instance, when structuring complex data sets for visualization, maintain consistency; this principle applies to how you structure your Eloquent relationships or JSON responses from a backend service.

### Implementing Custom Legend Text via Data Mapping

Instead of trying to force the title function to do heavy string manipulation, we will create a separate, unified array that contains exactly what we want the legend to display.

Here is how you can restructure your data preparation:

```javascript
var chartData = {
    labels: ['Car', 'Motorcycle'],
    values: [50, 200],
    colors: ['#FF6384', '#36A2EB'] // Example colors
};

// ... inside your Chart initialization setup ...

options: {
    plugins: {
        legend: {
            display: true,
            labels: function(chart) {
                const legendItems = [];
                
                // Iterate through the data to build custom strings
                for (let i = 0; i < chart.data.labels.length; i++) {
                    const label = chart.data.labels[i];
                    const value = chart.data.datasets[0].data[i];
                    const color = chart.data.datasets[0].backgroundColor[i]; // Assuming you map colors directly

                    // Create the desired format: [Color] Label Value
                    legendItems.push({
                        text: `${color} ${label}: ${value}`,
                        fillStyle: color, // Important for legend coloring
                        index: i
                    });
                }
                return legendItems;
            }
        }
    }
}
```

## Complete Code Example Refinement

By using the `labels` callback function within the legend options, we gain full control over every item rendered in the legend. This pattern allows us to combine data points (label, value, and color) into a single, custom string that is explicitly defined by us, solving the problem without fighting Chart.js's internal rendering logic.

```javascript
var ctx = document.getElementById('top-five').getContext('2d');

// 1. Prepare your core data structure (simulating backend data retrieval)
const pieData = {
    labels: ['Car', 'Motorcycle'],
    dataValues: [50, 200],
    colors: ['#4BC0C0', '#FF9F40'] // Custom colors for demonstration
};

var myChartpie = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: pieData.labels,
    datasets: [{
      label: 'Vehicle Counts',
      data: pieData.dataValues,
      backgroundColor: pieData.colors, // Use the custom colors here
      borderColor: '#fff',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        // Custom function to render complex legend entries
        labels: function(chart) {
          const legendItems = [];
          const dataset = chart.data.datasets[0];

          for (let i = 0; i < chart.data.labels.length; i++) {
            legendItems.push({
              text: `${dataset.backgroundColor[i]} ${chart.data.labels[i]}: ${dataset.data[i]}`,
              fillStyle: dataset.backgroundColor[i], // Set the color for the legend square
              strokeStyle: dataset.borderColor,
              lineWidth: 1,
            });
          }
          return legendItems;
        }
      },
    },
  }
});
```

## Conclusion

Dealing with advanced customizations in visualization libraries like Chart.js requires moving beyond simple property overrides and diving into how the library renders its components. By recognizing that the `legend.title` approach is too narrow, we can achieve sophisticated labeling by leveraging custom callbacks, specifically the `labels` function within the legend options. This method gives you complete control over the final output string, ensuring your data is presented exactly as intended. Whether you are building complex dashboards or optimizing data delivery from a Laravel application, mastering these front-end visualization techniques is key to creating truly insightful user experiences.
