# Screen Reader Status Message Tutorial

### What is this?

An example of a Screen Reader Status Message for live page updates.

### Where would you use this?

React applications where actions can change the state of the screen in a way visual users can easily identify, but would not automatically indicate to screen reader users. Not only does this help create an equal experience for visual and screen reader users, it can help your app meet [Success Criteria 4.1.3 for WCAG 2.1/2.2](https://www.w3.org/WAI/WCAG22/quickref/#status-messages).

### Why a component?

A component provides a reusable structure that can be inserted as needed with minimal overhead. A component can also be easily used by both functional React components and class components.

### How to validate usage?

Unit tests are included, but to fully validate usage, manual testing should be done to ensure it passes these tests from [WCAG Technique ARIA22](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA22):

1. Check that the container destined to hold the status message has a role attribute with a value of status before the status message occurs.
2. Check that when the status message is triggered, it is inside the container.
3. Check that elements or attributes that provide information equivalent to the visual experience for the status message (such as a shopping cart image with proper alt text) also reside in the container.
