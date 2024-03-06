# TTA.js

TTA.js is a simple, abstract Transport Triggered Architecture (TTA) simulator written in Typescript. It's purpose is to explore the TTA concept and to provide a target for a simple compiler.

## Code Structure

Some of the code in this repo will look rather strange. The meat of it is based around a dispatch function that takes a method name and arguments, and applies them to the appropriate method in the object being dispatched. This, along with lexical closures, gives us a simple object system. Why was it written this way? Because I could, and writing it such that the types were preserved was a fun challenge.

### Example

```typescript
const makeCounter = () => {
  let count = 0;
  return dispatch(
    {},
    {
      increment: () => {
        return ++count;
      },
      decrement: () => {
        return --count;
      },
      getCount: () => count,
    }
  );
};

const counter = makeCounter();
counter('increment');
console.log(counter('getCount')); // 1
counter('decrement');
console.log(counter('getCount')); // 0
```
