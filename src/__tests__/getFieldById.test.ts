import { createFormulaStore } from "..";

describe("getFieldById", () => {
  test("should fail if field doesn`t exist", () => {
    const store = createFormulaStore({ onChange: jest.fn() });

    expect(() => store.getFieldById("abc")).toThrowErrorMatchingInlineSnapshot(
      `"Field "abc" not found."`
    );
  });

  test("should get added and edited fields", () => {
    const store = createFormulaStore({ onChange: jest.fn() });

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

    expect(store.getFieldById("a")).toEqual({
      id: "a",
      incomingNeighbors: [],
      value: 1
    });

    expect(store.getFieldById("b")).toEqual({
      id: "b",
      incomingNeighbors: [],
      value: 3
    });

    expect(store.getFieldById("c")).toEqual({
      id: "c",
      calculate: expect.any(Function),
      incomingNeighbors: ["a", "b"],
      value: 4
    });

    store.editField({
      dependencies: ["a", "b"],
      id: "c",
      value: 0,
      calculate: (a, b) => (a + b) * 2
    });

    expect(store.getFieldById("c")).toEqual({
      id: "c",
      calculate: expect.any(Function),
      incomingNeighbors: ["a", "b"],
      value: 8
    });
  });
});
