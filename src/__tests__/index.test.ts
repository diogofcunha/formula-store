import { createFormulaStore } from "..";

describe("createFormulaStore", () => {
  test("should propagate on change when field with dependencies is added", () => {
    const onChange = jest.fn();
    const store = createFormulaStore({ onChange });

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

    expect(onChange).toHaveBeenCalledWith([
      {
        id: "c",
        value: 4
      }
    ]);
  });

  describe("updating field value", () => {
    test("should trigger on change with all dependent changes on simple cases (single update)", () => {
      const onChange = jest.fn();
      const store = createFormulaStore({ onChange });

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

      onChange.mockReset();

      store.updateFieldsValue([{ id: "a", value: 2 }]);

      expect(onChange).toHaveBeenCalledWith([
        {
          id: "a",
          value: 2
        },
        {
          id: "c",
          value: 5
        }
      ]);
    });

    test("should trigger on change with all dependent changes on simple cases (multiple updates)", () => {
      const onChange = jest.fn();
      const store = createFormulaStore({ onChange });

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

      onChange.mockReset();

      store.updateFieldsValue([
        { id: "a", value: 2 },
        { id: "b", value: 6 }
      ]);

      expect(onChange).toHaveBeenCalledWith([
        {
          id: "a",
          value: 2
        },
        {
          id: "b",
          value: 6
        },
        {
          id: "c",
          value: 8
        }
      ]);
    });

    test("should trigger on change with all dependent changes on deep cases (single update)", () => {
      const onChange = jest.fn();
      const store = createFormulaStore({ onChange });

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
      store.addField({
        dependencies: ["c"],
        id: "d",
        value: 0,
        calculate: c => c * 2
      });
      store.addField({
        dependencies: ["d", "a"],
        id: "e",
        value: 0,
        calculate: (d, a) => d - a
      });

      onChange.mockReset();

      store.updateFieldsValue([{ id: "a", value: 2 }]);

      expect(onChange).toHaveBeenCalledWith([
        {
          id: "a",
          value: 2
        },
        {
          id: "c",
          value: 5
        },
        {
          id: "d",
          value: 10
        },
        {
          id: "e",
          value: 8
        }
      ]);
    });

    test("should trigger on change with all dependent changes on deep cases (multiple update)", () => {
      const onChange = jest.fn();
      const store = createFormulaStore({ onChange });

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
      store.addField({
        dependencies: ["c"],
        id: "d",
        value: 0,
        calculate: c => c * 2
      });
      store.addField({
        dependencies: ["d", "a"],
        id: "e",
        value: 0,
        calculate: (d, a) => d - a
      });
      store.addField({
        dependencies: [],
        id: "f",
        value: 5
      });
      store.addField({
        dependencies: ["f", "e"],
        id: "g",
        value: 0,
        calculate: (f, e) => f - e
      });
      store.addField({
        dependencies: ["g"],
        id: "h",
        value: "",
        calculate: g => `Output ${g}`
      });

      onChange.mockReset();

      store.updateFieldsValue([
        { id: "a", value: 2 },
        { id: "f", value: 10 }
      ]);

      expect(onChange).toHaveBeenCalledWith([
        {
          id: "a",
          value: 2
        },
        {
          id: "f",
          value: 10
        },
        {
          id: "c",
          value: 5
        },
        {
          id: "d",
          value: 10
        },
        {
          id: "e",
          value: 8
        },
        {
          id: "g",
          value: 2
        },
        {
          id: "h",
          value: "Output 2"
        }
      ]);
    });
  });

  describe("should remove fields and attached dependencies", () => {
    const onChange = jest.fn();
    const store = createFormulaStore({ onChange });

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
    store.addField({
      dependencies: ["c"],
      id: "d",
      value: 0,
      calculate: c => c * 2
    });
    store.addField({
      dependencies: ["d", "a"],
      id: "e",
      value: 0,
      calculate: (d, a) => d - a
    });
    store.addField({
      dependencies: [],
      id: "f",
      value: 5
    });
    store.addField({
      dependencies: ["f", "e"],
      id: "g",
      value: 0,
      calculate: (f, e) => f - (e || 0)
    });
    store.addField({
      dependencies: ["g"],
      id: "h",
      value: "",
      calculate: g => `Output ${g}`
    });

    store.updateFieldsValue([
      { id: "a", value: 2 },
      { id: "f", value: 10 }
    ]);

    onChange.mockReset();

    const affected = store.removeField("f");

    expect(affected).toEqual(["g", "h"]);

    expect(onChange).toHaveBeenCalledWith([
      {
        id: "g",
        value: 8
      },
      {
        id: "h",
        value: "Output 8"
      }
    ]);
  });
});
