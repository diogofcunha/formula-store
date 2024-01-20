export class FormulaFieldDependencyError extends Error {
  constructor(fieldId: string, notFoundDependencies: string[]) {
    super(
      `Could not find dependencies ${notFoundDependencies.join(
        ", "
      )} for field ${fieldId}`
    );
  }
}
export class FormulaFieldCircularDependencyError extends Error {
  constructor(fieldId: string) {
    super(`Can't add field "${fieldId}" due to circular dependency.`);
  }
}

export class FormulaFieldDuplicatedError extends Error {
  constructor(fieldId: string) {
    super(
      `Formula field "${fieldId}" already exists, please delete the field if you want to update it.`
    );
  }
}
