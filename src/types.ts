/* eslint-disable @typescript-eslint/no-explicit-any */

export interface FormulaField<T> {
  id: string;
  value: T;
  dependencies: string[];
  calculate: (...dependencies: any[]) => T;
}

export interface FormulaUpdate {
  id: string;
  value: unknown;
}

export interface FormulaStoreInput {
  onChange: (updates: FormulaUpdate[]) => void;
}

export interface FormulaStore {
  addField: <T>(field: FormulaField<T>) => void;
  updateFieldsValue: (
    fields: Array<Pick<FormulaField<any>, "value" | "id">>
  ) => void;
}
