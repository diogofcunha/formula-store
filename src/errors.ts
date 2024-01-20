export class FormulaFieldDependencyError extends Error {
  constructor(fieldId: string, notFoundDependencies: string[]) {
    super(
      `Could not find dependencies ${notFoundDependencies.join(
        ", "
      )} for field ${fieldId}`
    );
  }
}

export class FormulaFieldDuplicatedError extends Error {
  constructor(fieldId: string) {
    super(
      `Formula field "${fieldId}" already exists, please delete the field if you want to update it.`
    );
  }
}
