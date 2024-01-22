import { createFormulaStore } from "..";

describe("removeField", () => {
  test("should fail field to remove doesn't exist", () => {
    const store = createFormulaStore({ onChange: jest.fn() });

    store.addField({
      dependencies: [],
      id: "a",
      value: 1
    });

    expect(() => store.removeField("b")).toThrowErrorMatchingInlineSnapshot(
      `"Field "b" not found."`
    );
  });
});
