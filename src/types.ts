export interface FormulaField<T> {
  id: string;
  value: T;
  dependencies: string[];
}

export interface FormulaStore {
  addField: <T>(field: FormulaField<T>) => void;
}
