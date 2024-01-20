import { FormulaField } from "./types";

export class FormulaFieldDependencyError extends Error {
  constructor(field: FormulaField, notFoundDependencies: string[]) {
    super(
      `Could not find dependencies ${notFoundDependencies.join(
        ", "
      )} for field ${field.id}`
    );
  }
}
