import { createFormulaStore } from "..";

describe("createFormulaStore", () => {
  test("should propagate on change when field with dependencies is added", () => {
    const onChange = jest.fn();
    const store = createFormulaStore({ onChange });

    // Add fields for dependencies.
    store.addField({
      dependencies: [],
      id: "a",
      value: 1,
      calculate: () => 1
    });

    store.addField({
      dependencies: [],
      id: "b",
      value: 3,
      calculate: () => 3
    });

    store.addField({
      dependencies: ["a", "b"],
      id: "c",
      value: 0,
      calculate: (a, b) => a + b
    });

    expect(onChange).toHaveBeenCalledWith([
      {
        id: "c",
        value: 4
      }
    ]);
  });
});
