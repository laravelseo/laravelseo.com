---
title: "Is it possible to change props value from method in Vue component?"
description: "Title: Modifying Props Values in Vue Components through Methods Vue's component architecture allows for data passing via props. These values can be updated..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Content", "JavaScript", "HTML"]
featured: false
---

Title: Modifying Props Values in Vue Components through Methods

Vue's component architecture allows for data passing via props. These values can be updated either by simply changing the passed value or modifying it inside the component using methods. While updating props is possible within a Vue application, there are certain aspects to consider when doing so. In this blog post, we will discuss different approaches to modify the prop values from a method in a Vue component.

Firstly, let's look at an example of how you have defined your navigation-form component:

```html
<navigation-form :prop-room-selected='543'>
  <button @click="updateCoachStatus">Update Room Selection</button>
</navigation-form>
```
```javascript
Vue.component('navigation-form', {
  template: '#navigation-form',
  props: ['propRoomSelected'],
  data() {
    return {
      roomSelected: this.propRoomSelected,
    }
  },
  methods:{
      updateCoachStatus: function(event){
         this.propRoomSelected = 67;
      }
  }
})
```

The given code passes a value of 543 for the prop-room-selected, and it contains a button that calls the method updateCoachStatus when clicked. Your goal is to change the room selection to 67 using this function. There are two ways we can achieve this:

1. By directly updating the data property 'roomSelected' inside navigation-form component. In this case, you would modify the data section of your Vue code as follows:

```javascript
data() {
    return {
      roomSelected: 543,
    }
},
methods:{
    updateCoachStatus: function(event){
       this.roomSelected = 67;
    }
}
```

In doing so, the new data will be reflected to the 'propRoomSelected' in the parent component. However, if you intend to change the prop value directly inside the navigation-form component, there is a more efficient way of handling props updates that we discuss next.

2. By emitting an event from your navigation-form component and listening for it in the parent component. This approach allows you to maintain the separation between the components and their data management. To achieve this, firstly, add an emit function in the navigation-form:

```javascript
data() {
    return {
      roomSelected: 543,
    }
},
methods:{
    updateCoachStatus: function(event){
       this.$emit('changeRoomSelection', 67);
    }
}
```
Then, you create a listener in the parent component to receive the emitted event and change the prop accordingly. You should also provide 'propRoomSelected' as a prop to ensure that child components can access it:

```html
<navigation-form :prop-room-selected='543' @changeRoomSelection="updatePropValue">
  <button @click="updateCoachStatus">Update Room Selection</button>
</navigation-form>
```
```javascript
Vue.component('parent', {
    props: ['propRoomSelected'],
    data() {
        return {
            roomSelected: this.propRoomSelected,
        }
    },
    methods:{
        updatePropValue(value) {
            this.roomSelected = value;
        }
    },
    template: '#parent-template'
})
```

This approach ensures that your prop values are consistently updated and maintained in the parent component, while still allowing you to change them from within the child components. In summary, it is possible to update props values through methods in a Vue application, but it is recommended to use the event-based communication approach for better separation of concerns between components.
