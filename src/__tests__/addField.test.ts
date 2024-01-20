import { createFormulaStore } from "../";

test("addField should fail if a listed dependency doesn`t exist", () => {
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

test("addField should fail if multiple listed dependency doesn`t exist", () => {
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

test("addField should fail if trying to re-add field", () => {
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
