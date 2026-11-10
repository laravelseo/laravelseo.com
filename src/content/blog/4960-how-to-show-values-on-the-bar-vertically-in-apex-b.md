---
title: "How to show values on the bar vertically in apex bar chart"
description: "Mastering ApexCharts: How to Display Values Vertically on Bar Charts As a senior developer working with data visualization libraries like ApexCharts, we..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Git"]
featured: false
---

As a senior developer working with data visualization libraries like ApexCharts, we often encounter scenarios where the desired visual outcome conflicts with the default behavior. One frequent challenge is achieving vertical bar charts while correctly displaying data labels (values) positioned on or near those bars. If you are struggling to get your values displayed vertically instead of horizontally, you're not alone—it usually involves fine-tuning specific configuration options within the chart options object.

This post will walk you through the exact steps and code adjustments needed to successfully configure your ApexCharts bar chart to display values vertically, along with a deep dive into best practices for data labeling.

## Understanding the Root Cause of the Issue

The behavior you are observing—the bars appearing horizontally—is primarily controlled by the `plotOptions` configuration. In ApexCharts, setting `horizontal: true` forces the chart to render as a horizontal bar chart. To achieve the standard vertical orientation, you must explicitly set this property to `false`.

However, the difficulty often arises when trying to position the data labels (`dataLabels`) vertically. The positioning logic for labels depends heavily on whether the main axis is horizontal or vertical. When dealing with vertical bars, we need to ensure that the label positioning aligns with the Y-axis values correctly.

## The Solution: Configuring Vertical Bars and Data Labels

To fix your issue and achieve a vertical bar chart with properly displayed values, you need to make precise adjustments to both `plotOptions` and `dataLabels`.

Here is the corrected approach based on the code snippet you provided. We will focus on ensuring the bars are vertical (`horizontal: false`) and adjusting the `dataLabels` positioning accordingly.

### Corrected ApexCharts Configuration

The key change involves correctly setting `horizontal: false` in `bar` options and simplifying the `dataLabels` configuration to let ApexCharts handle the natural vertical alignment.

```javascript
var options = {
    chart: {
        height: 350,
        type: 'bar', // Bar charts are inherently vertical by default for this type
        toolbar: {
            show: true
        }
    },
    plotOptions: {
        bar: {
            horizontal: false, // CRITICAL: Setting this to false makes the bars vertical
            dataLabels: {
                position: 'center', // Center positioning often works best for vertical data labels
                formatter: function (val) {
                    return val; // Display the actual value
                },
            },
        }
    },
    dataLabels: {
        enabled: true,
        position: 'center', // Position labels centrally on the bar
        style: {
            fontSize: '12px',
            colors: ['#000']
        }
    },
    series: [{
        name: 'Packing',
        data: <?php echo json_encode($wd_packing); ?>
    }, {
        name: 'Dispatch',
        data: <?php echo json_encode($wd_dispatch); ?>
    }, {
        name: 'Remaning',
        data: <?php echo json_encode($wd_reaming); ?>
    }],
    xaxis: {
        categories: <?php echo json_encode($wd_week); ?>
    }
};

var chart = new ApexCharts(
    document.querySelector("#weekly_dispatch_graph"),
    options
);
chart.render();
```

### Developer Insights and Best Practices

1.  **Vertical Orientation Control:** By setting `plotOptions.bar.horizontal: false`, you explicitly instruct the chart engine to render bars along the Y-axis (vertically) rather than the X-axis (horizontally). This is the fundamental step for vertical bar charts.
2.  **Data Label Placement:** I have adjusted `dataLabels.position` to `'center'`. When working with vertical bars, placing the value in the center ensures it sits directly on the bar, which is the most intuitive placement for quantitative data. Be cautious with positioning options like `'top'` or `'bottom'`, as they can sometimes lead to labels being clipped if the values are very large or small.
3.  **Separation of Concerns:** In modern application development—whether you are building a robust backend with **Laravel** or focusing on clean frontend logic—it is essential to keep configuration settings distinct and explicit. Relying on default behaviors without explicit configuration often leads to unpredictable results.

## Conclusion

Troubleshooting visualization issues like this requires systematically reviewing the interaction between `plotOptions` and `dataLabels`. By ensuring that you explicitly define the orientation of your bars (`horizontal: false`) and carefully managing the positioning of labels, you can achieve any visual layout you desire in ApexCharts. Always treat chart configuration as a matter of explicit instruction rather than implicit expectation. If you are building complex data applications using frameworks like Laravel, mastering these front-end visualization tools ensures that your data storytelling is accurate and visually compelling.
