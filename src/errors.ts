export class FormulaFieldDependencyError extends Error {
  constructor(fieldId: string, notFoundDependencies: string[]) {
    super(
      `Could not find dependencies ${notFoundDependencies.join(
        ", "
      )} for field ${fieldId}`
    );
  }
}

export class FormulaFieldNotFoundError extends Error {
  constructor(fieldId: string | string[]) {
    const prefix =
      Array.isArray(fieldId) && fieldId.length > 1
        ? `Fields "${fieldId.join(", ")}"`
        : `Field "${Array.isArray(fieldId) ? fieldId[0] : fieldId}"`;
    super(`${prefix} not found.`);
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
