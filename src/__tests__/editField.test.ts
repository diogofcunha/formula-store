import { createFormulaStore } from "..";

describe("edit field", () => {
  test("should fail if a listed dependency doesn`t exist", () => {
    const store = createFormulaStore({ onChange: jest.fn() });
    expect(() =>
      store.editField({
        dependencies: ["a-b-c"],
        id: "dfc",
        value: 1,
        calculate: () => 1
      })
    ).toThrowErrorMatchingInlineSnapshot(
      `"Could not find dependencies a-b-c for field dfc"`
    );
  });

  test("should fail if multiple listed dependency don`t exist", () => {
    const store = createFormulaStore({ onChange: jest.fn() });
    expect(() =>
      store.editField({
        dependencies: ["a-b-c", "d-e-f"],
        id: "dfc",
        value: 1,
        calculate: () => 1
      })
    ).toThrowErrorMatchingInlineSnapshot(
      `"Could not find dependencies a-b-c, d-e-f for field dfc"`
    );
  });

  test("should fail if field doesn`t exist", () => {
    const store = createFormulaStore({ onChange: jest.fn() });

    expect(() =>
      store.editField({
        dependencies: [],
        id: "dfc",
        value: 1
      })
    ).toThrowErrorMatchingInlineSnapshot(`"Field "dfc" not found."`);
  });

  test("should fail if trying to add a cyclic dependency to own node", () => {
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
      dependencies: [],
      id: "c",
      value: 4
    });

    const calculateSpyFieldD = jest.fn();

    store.addField({
      dependencies: ["a", "b"],
      id: "d",
      value: 0,
      calculate: calculateSpyFieldD
    });

    calculateSpyFieldD.mockClear();

    expect(() =>
      store.editField({
        dependencies: ["a", "b", "d"],
        id: "d",
        value: 0,
        calculate: calculateSpyFieldD
      })
    ).toThrowErrorMatchingInlineSnapshot(
      `"Can't add field "d" due to circular dependency."`
    );
  });

  test("should fail if trying to add a cyclic dependency due to other nodes", () => {
    const store = createFormulaStore({ onChange: jest.fn() });

    // Add fields for dependencies.
    store.addField({
      dependencies: [],
      id: "a",
      value: 1
    });

    store.addField({
      dependencies: ["a"],
      id: "b",
      value: 3,
      calculate: jest.fn()
    });

    expect(() =>
      store.editField({
        dependencies: ["b"],
        id: "a",
        value: 0,
        calculate: jest.fn()
      })
    ).toThrowErrorMatchingInlineSnapshot(
      `"Can't add field "a" due to circular dependency."`
    );
  });

  test("should calculate correctly when removing a field dependency", () => {
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
      dependencies: [],
      id: "c",
      value: 3
    });

    const calculateSpyFieldD = jest
      .fn()
      .mockImplementation((a, b, c) => a + b + c);

    store.addField({
      dependencies: ["a", "b", "c"],
      id: "d",
      value: 0,
      calculate: calculateSpyFieldD
    });

    const calculateSpyFieldE = jest.fn().mockImplementation((d, c) => d + c);

    store.addField({
      dependencies: ["d", "c"],
      id: "e",
      value: 0,
      calculate: calculateSpyFieldE
    });

    calculateSpyFieldE.mockClear();
    calculateSpyFieldD.mockClear();

    calculateSpyFieldD.mockImplementation((a, b) => a + b);

    store.editField({
      dependencies: ["a", "b"],
      id: "d",
      value: 0,
      calculate: calculateSpyFieldD
    });

    expect(calculateSpyFieldD).toHaveBeenCalledTimes(1);
    expect(calculateSpyFieldD).toHaveBeenCalledWith(1, 3);
    expect(calculateSpyFieldE).toHaveBeenCalledTimes(1);
    expect(calculateSpyFieldE).toHaveBeenCalledWith(4, 3);
  });

  test("should calculate correctly when adding a field dependency", () => {
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
      dependencies: [],
      id: "c",
      value: 4
    });

    const calculateSpyFieldD = jest.fn().mockImplementation((a, b) => a + b);

    store.addField({
      dependencies: ["a", "b"],
      id: "d",
      value: 0,
      calculate: calculateSpyFieldD
    });

    const calculateSpyFieldE = jest.fn().mockImplementation((d, c) => d + c);

    store.addField({
      dependencies: ["d", "c"],
      id: "e",
      value: 0,
      calculate: calculateSpyFieldE
    });

    calculateSpyFieldE.mockClear();
    calculateSpyFieldD.mockClear();

    calculateSpyFieldD.mockImplementation((a, b, c) => a + b + c);

    store.editField({
      dependencies: ["a", "b", "c"],
      id: "d",
      value: 0,
      calculate: calculateSpyFieldD
    });

    expect(calculateSpyFieldD).toHaveBeenCalledTimes(1);
    expect(calculateSpyFieldD).toHaveBeenCalledWith(1, 3, 4);
    expect(calculateSpyFieldE).toHaveBeenCalledTimes(1);
    expect(calculateSpyFieldE).toHaveBeenCalledWith(8, 4);
  });

  test("should not calculate when removing all field dependencies and calculate", () => {
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

    const calculateSpyFieldC = jest.fn().mockImplementation((a, b) => a + b);

    store.addField({
      dependencies: ["a", "b"],
      id: "c",
      value: 0,
      calculate: calculateSpyFieldC
    });

    calculateSpyFieldC.mockClear();

    store.editField({
      dependencies: [],
      id: "c",
      value: 5
    });

    expect(calculateSpyFieldC).not.toHaveBeenCalled();
  });
});
