export interface FormulaField<T> {
  id: string;
  value: T;
  dependencies: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  calculate: (...dependencies: any[]) => T;
}

export interface FormulaStore {
  addField: <T>(field: FormulaField<T>) => void;
}
