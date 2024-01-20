export class FormulaFieldDependencyError extends Error {
  constructor(fieldId: string, notFoundDependencies: string[]) {
    super(
      `Could not find dependencies ${notFoundDependencies.join(
        ", "
      )} for field ${fieldId}`
    );
  }
}
