export interface FormulaField {
  id: string;
}

export interface FormulaStore {
  addField: (field: FormulaField, dependsOn: string[]) => void;
}
