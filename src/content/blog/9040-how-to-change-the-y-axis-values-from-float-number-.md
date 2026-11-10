---
title: "how to change the Y-axis values from float number to integer in chartjs?"
description: "How to Change Y Axis Values from Float Number to Integer in Chart.js As developers working with data visualization libraries like Chart.js, we frequently..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["JavaScript"]
featured: false
---

As developers working with data visualization libraries like Chart.js, we frequently encounter situations where the raw data consists of floating-point numbers (decimals), but the visual presentation—specifically the Y-axis scale—requires discrete integer values. This is a common requirement when visualizing counts, quantities, or discrete categories where fractional units are meaningless (e.g., number of users, items sold).

In your provided scenario, you are dealing with data like `people_isProcessing` and `people_isReceived`, which are likely real numbers. To achieve the desired effect of showing only integer ticks on your Y-axis in Chart.js, we need to manipulate the scale configuration within the chart options.

This guide will walk you through the most effective methods to quantize your Y-axis data, ensuring a clean and easily readable visualization.

## Understanding Chart.js Axis Scaling

By default, Chart.js automatically calculates the appropriate scale based on the minimum and maximum values present in your dataset. If your data is `[10.5, 25.7, 30.0]`, the axis will naturally span from slightly below 10.5 to slightly above 30.0. To force this scale to snap to integers, you must explicitly define how the ticks should be generated.

The key area for control is the `options.scales` object. We will focus on configuring the Y-axis (`y`).

## Method 1: Using `ticks.stepSize` for Quantization

The simplest and most direct way to force integer steps across the axis is by setting the `stepSize` property within the scale configuration. This tells Chart.js the increment value between each tick mark.

If you want every unit on your Y-axis to represent a whole number, setting the `stepSize` to `1` will ensure that only integers are displayed as labels.

### Implementation Example

We need to modify the `options` object where we define the scale settings:

```javascript
window.onload = function() {
  var chartEl = document.getElementById("chart");
  window.myLine = new Chart(chartEl, {
    type: 'line',
    data: lineChartData,
    options: {
      title: {
        display: true,
        text: 'Kindmate - Chart Static Donate'
      },
      scales: {
        y: {
          // *** KEY CHANGE HERE ***
          beginAtZero: true, // Ensures the scale starts at 0
          ticks: {
            stepSize: 1 // Forces the ticks to increment by exactly 1
          }
        }
      },
      tooltips: {
        enabled: true,
        mode: 'index',
        position: 'nearest',
        custom: customTooltips
      }
    }
  });
});
```

### Explanation of the Code

By adding `stepSize: 1` inside the `y.ticks` configuration, you instruct Chart.js to calculate the axis labels by taking the existing scale range and dividing it into steps of one unit. This effectively rounds or quantizes the displayed values to integers. This approach is highly practical when dealing with data that represents discrete counts, which aligns well with robust data handling principles often employed in backend frameworks like Laravel where data integrity is paramount.

## Method 2: Customizing Ticks with a Callback (Advanced)

For more complex scenarios, such as needing specific rounding rules or custom formatting that goes beyond simple stepping, you can use the `ticks.callback` function. This function allows you to define exactly what string value should be displayed for each tick position.

While Method 1 is sufficient for forcing integers, this method gives you granular control over the label presentation:

```javascript
// Inside options.scales.y.ticks:
ticks: {
    callback: function(value, index, values) {
        // Use Math.round() or parseInt() to ensure only integers are displayed
        return Math.round(value); 
    }
}
```

This callback receives the raw numerical value (`value`) and uses it to generate the label string for the chart axis. This is useful if you need to handle negative numbers, specific decimal rounding, or complex formatting rules before they are rendered on the screen.

## Conclusion

Changing Y-axis values from float to integer in Chart.js is achieved by leveraging the configuration options within the `options.scales` object. For most use cases where you simply want discrete integer steps, setting `ticks.stepSize: 1` is the cleanest and most performant solution. By mastering these scale configurations, you gain complete control over how your data is visually represented, ensuring your dashboards are not only informative but also perfectly presented.

If you are building complex applications with robust data management, understanding how data structures map to visualization libraries—much like ensuring clean data flow in a Laravel application—is crucial for creating highly effective user interfaces. For more insights into efficient data handling and architecture, explore resources on the [Laravel Company website](https://laravelcompany.com).
