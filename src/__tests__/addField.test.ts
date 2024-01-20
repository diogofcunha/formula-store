import { createFormulaStore } from "../";

describe("addField", () => {
  test("should fail if a listed dependency doesn`t exist", () => {
    const store = createFormulaStore();
    expect(() =>
      store.addField({
        dependencies: ["a-b-c"],
        id: "dfc",
        value: 1,
        calculate: () => 1
      })
    ).toThrowErrorMatchingInlineSnapshot(
      `"Could not find dependencies a-b-c for field dfc"`
    );
  });

  test("should fail if multiple listed dependency doesn`t exist", () => {
    const store = createFormulaStore();
    expect(() =>
      store.addField({
        dependencies: ["a-b-c", "d-e-f"],
        id: "dfc",
        value: 1,
        calculate: () => 1
      })
    ).toThrowErrorMatchingInlineSnapshot(
      `"Could not find dependencies a-b-c, d-e-f for field dfc"`
    );
  });

  test("should fail if trying to re-add field", () => {
    const store = createFormulaStore();

    store.addField({
      dependencies: [],
      id: "dfc",
      value: 1,
      calculate: () => 1
    });

    expect(() =>
      store.addField({
        dependencies: [],
        id: "dfc",
        value: 1,
        calculate: () => 1
      })
    ).toThrowErrorMatchingInlineSnapshot(
      `"Formula field "dfc" already exists, please delete the field if you want to update it."`
    );
  });

  test("should calculate correctly when adding field with dependencies", () => {
    const store = createFormulaStore();

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

    const calculateSpy = jest.fn();

    store.addField({
      dependencies: ["a", "b"],
      id: "c",
      value: 0,
      calculate: calculateSpy
    });

    expect(calculateSpy).toHaveBeenCalledTimes(1);
    expect(calculateSpy).toHaveBeenCalledWith([1, 3]);
  });

  test("shouldn't calculate when adding field without dependencies", () => {
    const store = createFormulaStore();

    const calculateSpy = jest.fn();

    store.addField({
      dependencies: [],
      id: "c",
      value: 0,
      calculate: calculateSpy
    });

    expect(calculateSpy).toHaveBeenCalledTimes(0);
  });
});
