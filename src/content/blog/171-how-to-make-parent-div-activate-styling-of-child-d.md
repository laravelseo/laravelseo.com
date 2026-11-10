---
title: "How to make parent div activate styling of child div for hover and active"
description: "Title: Efficiently Activate Hover Effects Across Child Elements Using CSS Classes and JavaScript Introduction In today's fast paced world of web development..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Content", "JavaScript", "HTML"]
featured: false
---

Title: Efficiently Activate Hover Effects Across Child Elements Using CSS Classes and JavaScript

Introduction
In today's fast-paced world of web development where users expect smooth and interactive user interfaces, hover effects are a popular way to add style and functionality. You have designed a sidebar navigation with an elegant curved border effect, applying different transformations on the elements for enhanced aesthetics. However, you might be looking for ways to apply hover effects across child elements simultaneously without having to manually code each individual element's styles. In this comprehensive blog post, I will explain how to achieve this goal using CSS and JavaScript effectively.

CSS Tips for Simultaneous Hover Effects on Child Elements
There are two main approaches to achieving simultaneous hover effects on multiple child elements within a parent div:
1. Using CSS mixins or Sass variables
2. Applying global CSS selectors

Using CSS Mixins or Sass Variables
CSS Mixins allow you to define reusable styles and apply them to the desired elements with ease. In your case, you might want to create a mixin for the hover background color and another mixin for the text and icon colors:

```css
// Define mixins in your style sheet or Sass file
@mixin nav-item-hover($color) {
  &:hover {
    div.button {
      background-color: $color;
    }

    i, h2 {
      color: $color;
    }
  }
}
```

Then, you can apply the mixins to each child element within your HTML code:

```html
<a href="/dashboard">
  <div class="flex flex-row space-x-8 w-72 text-lg pb-3 text-gray-200">
    <div>
      <!-- Adding the mixin here -->
      @include('nav-item-hover', #'green')
      <!-- End of mixin inclusion -->
      
      <div class="h-8 w-8 rounded transform -translate-x-7" />
      
    </div>
    
    <div class="flex flex-row items-center space-x-8 transform -translate-x-10 -translate-y-1">
      <!-- Adding the mixin here -->
      @include('nav-item-hover', #'green')
      
      
      <i class="bi bi-columns-gap hover:text-green-300 transform translate-x-1" />
      
      <h2 class="hover:font-semibold hover:text-green-300 transform translate-y-1 text-base">Dashboard</h2>
    </div>
  </div>
</a>
```

JavaScript Tip for Simultaneous Hover Effects on Child Elements
Another way to achieve this effect is through JavaScript. You can create a function that listens for the hover event on the parent element and uses CSS classes to apply the desired styles to all child elements at once:

```javascript
// Define a function in your JS file
function handleHover(event) {
  // Get the current hovered child element by using jQuery to select the children within the parent element that are being hovered over.
  let $hoveredChildElements = $(this).find(':hover');
  
  // Iterate through each hovered child element and apply CSS classes for the desired styles. In your case, these include transformations and font weight changes.
  $hoveredChildElements.each((index, el) => {
    if (el.classList.contains('button')) {
      $(el).addClass('bg-green-300'); // Apply hover background color
    } else if (el.classList.contains('bi-columns-gap')) {
      $(el).addClass('hover:text-green-300 transform translate-x-1'); // Apply icon and text hover styles
    } else if (el.classList.contains('h2')) {
      $(el).addClass('hover:font-semibold hover:text-green-300 transform translate-y-1 text-base'); // Apply font weight change, text color, and vertical positioning for the text element
    }
  });
}

// Bind the handler function to the parent div's 'hover' event
let parentDiv = document.querySelector('.flex.flex-row.space-x-8.w-72.text-lg.pb-3.text-gray-200');
parentDiv.addEventListener('mouseenter', handleHover);
parentDiv.addEventListener('mouseleave', () => { // Add a 'mouseleave' event to remove the styles on hover out
  $hoveredChildElements.each((index, el) => {
    $(el).removeClass('bg-green-300'); // Remove hover background color
    if (el.classList.contains('.bi-columns-gap')) {
      $(el).removeClass('hover:text-green-300 transform translate-x-1'); // Remove icon and text hover styles
    } else if (el.classList.contains('.h2')) {
      $(el).removeClass('hover:font-semibold hover:text-green-300 transform translate-y-1 text-base'); // Remove font weight change, text color, and vertical positioning for the text element
    }
  });
});
```

In conclusion, there are two effective methods to implement simultaneous hover effects on child elements within a parent div. While CSS mixins or Sass variables simplify the process using only CSS, JavaScript can provide more flexibility and adaptability across different scenarios. By incorporating these techniques into your workflow, you will create engaging user interfaces that enhance the overall user experience.
