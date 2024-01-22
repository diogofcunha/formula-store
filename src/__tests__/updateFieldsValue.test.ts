import { createFormulaStore } from "..";

describe("updateFieldsValue", () => {
  test("should fail if a listed dependency doesn't exist", () => {
    const store = createFormulaStore({ onChange: jest.fn() });

    store.addField({
      dependencies: [],
      id: "a",
      value: 1
    });

    expect(() =>
      store.updateFieldsValue([
        {
          id: "b",
          value: 1
        },
        {
          id: "a",
          value: 2
        }
      ])
    ).toThrowErrorMatchingInlineSnapshot(`"Field "b" not found."`);
  });

  test("should fail if multiple listed dependency don't exist", () => {
    const store = createFormulaStore({ onChange: jest.fn() });

    store.addField({
      dependencies: [],
      id: "a",
      value: 1
    });

    expect(() =>
      store.updateFieldsValue([
        {
          id: "b",
          value: 1
        },
        {
          id: "a",
          value: 2
        },
        {
          id: "c",
          value: 2
        }
      ])
    ).toThrowErrorMatchingInlineSnapshot(`"Fields "b, c" not found."`);
  });
});
