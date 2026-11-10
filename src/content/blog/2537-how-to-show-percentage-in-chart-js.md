---
title: "How to show percentage (%) in chart js"
description: "How to Display Percentages (%) Accurately in Chart.js: A Deep Dive As a senior developer working with modern stacks like Vue.js and Laravel, you frequently..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "JavaScript"]
featured: false
---

As a senior developer working with modern stacks like Vue.js and Laravel, you frequently encounter scenarios where backend calculations are correct, but the frontend visualization needs fine-tuning. Showing percentage signs correctly within a Chart.js visualization often involves understanding how to leverage the chart's built-in features, specifically data labels and tooltip configuration.

The issue you are facing—not seeing the '%' sign even when the data is calculated as a percentage—usually stems from not explicitly instructing Chart.js on *how* to format and display those values on the slices or in the hover tooltips.

This guide will walk you through refining your setup to ensure your percentage data is displayed clearly and professionally in your Doughnut chart.

## Understanding the Data Flow

Before diving into the fix, let's review your data flow:
1.  **Laravel Controller:** Performs the complex SQL calculation to determine service counts based on bookings for the current date.
