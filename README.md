# formula-store

[![CircleCI](https://circleci.com/gh/diogofcunha/formula-store.svg?style=svg)](https://circleci.com/gh/diogofcunha/formula-store)
[![npm package][npm-badge]][npm]

[npm-badge]: https://img.shields.io/npm/v/formula-store.png?style=flat-square
[npm]: https://www.npmjs.com/package/formula-store

A versatile and efficient package for managing and calculating formula fields in a store.

## Description

🧮 `formula-store` is a TypeScript library designed to provide a flexible solution for handling formula fields. It enables you to manage dependencies, calculate values, and receive updates seamlessly. This package is well-suited for scenarios where dynamic formula-based computations are crucial and performance and robust api design matters.

## Install

```bash
yarn add formula-store
```

```bash
npm install formula-store
```

## Usage

### 1. Create Formula Store

Initialize a `FormulaStore` to manage and update formula fields.

```typescript
import { createFormulaStore } from "formula-store";

// Example Usage:
const store = createFormulaStore({
  onChange: updates => {
    // Handle updates when formula fields change.
  }
});
```

### 2. Define Formula Fields

Create instances of `FormulaField` representing the formula fields you want to manage in your store.

```typescript
import { FormulaField, FormulaStore } from "formula-store";

// Example Usage:
const myFormulaField: FormulaField<number> = {
  id: "uniqueId",
  value: 42,
  dependencies: ["dependencyA", "dependencyB"],
  calculate: (dependencyA, dependencyB) => dependencyA + dependencyB
};
```

### 3. Use Formula Store

Utilize the store to manage formula fields and receive updates.

```typescript
// Example Usage:
// Add fields for dependencies.
store.addField({
  dependencies: [],
  id: "a",
  value: 1
});

store.addField({
  dependencies: [],
  id: "b",
  value: 3
});

store.addField({
  dependencies: ["a", "b"],
  id: "c",
  value: 0,
  calculate: (a, b) => a + b
});

// Update the values of formula fields in the store.
store.updateFieldsValue([
  { id: "a", value: 2 }
  // Add more updates as needed.
]);

// Remove a formula field from the store.
const affectedFields = store.removeField("a");
console.log("Affected Fields: ", affectedFields);

// Get previously added field.
const fieldA = store.getFieldById("a");
console.log("Field a: ", fieldA);
```

## API Reference

### `FormulaField<T>`

Represents a field that is either a direct formula or a field that will be used inside another formula.

- `id`: Unique identifier for the formula field.
- `value`: The current value of the formula field.
- `dependencies`: An array of other formula field ids representing the dependencies of the formula field.
- `calculate`: A function that calculates the new value based on the provided dependencies. (Optional)

### `FormulaUpdate`

Represents an update for a formula field in the store.

- `id`: Unique identifier for the formula field to be updated.
- `value`: The new value for the formula field.

### `FormulaStoreInput`

Represents the input configuration for the FormulaStore.

- `onChange`: A callback function to be called when formula fields are updated.

### `FormulaStore`

Represents a store for managing formula fields.

- `addField`: Adds a new formula field to the store.
- `removeField`: Removes a formula field from the store based on its identifier.
- `updateFieldsValue`: Updates the values of multiple formula fields in the store.
- `getFieldById`: Gets a field from the store by id.

## Contributing

Contributions are welcome! Please submit a pull request with any improvements or bug fixes. Make sure to add tests for any new features and bug fixes, and ensure that the existing tests pass.

## License

This project is licensed under the MIT License.

## Contact

If you need help or have questions, feel free to open an issue in the GitHub repository.
