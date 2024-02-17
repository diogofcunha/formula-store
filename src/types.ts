/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Represents a field that is either a direct formula
 * or a field that will be used inside another formula.
 * @template T - The type of the field value.
 */
export interface FormulaField<T> {
  /**
   * Unique identifier for the formula field.
   */
  id: string;
  /**
   * The current value of the formula field.
   */
  value: T;
  /**
   * An array of other formula field ids representing the dependencies of the formula field.
   */
  dependencies: string[];
  /**
   * A function that calculates the new value based on the provided dependencies.
   * Optional: If not provided, the value is assumed to be static.
   * @param {...any} dependencies - The values of the dependencies.
   * @returns {T} - The calculated value.
   */
  calculate?: (...dependencies: any[]) => T;
}

/**
 * Represents an update for a formula field in the store.
 */
export interface FormulaUpdate {
  /**
   * Unique identifier for the formula field to be updated.
   */
  id: string;
  /**
   * The new value for the formula field.
   */
  value: unknown;
}

/**
 * Represents the input configuration for the FormulaStore.
 */
export interface FormulaStoreInput {
  /**
   * A callback function to be called when formula fields are updated.
   * @param {FormulaUpdate[]} updates - An array of updates for the formula fields.
   */
  onChange: (updates: FormulaUpdate[]) => void;
}

/**
 * Represents a store for managing formula fields.
 */
export interface FormulaStore {
  /**
   * Adds a new formula field to the store.
   * @template T - The type of the field value.
   */
  addField: <T>(field: FormulaField<T>) => void;
  /**
   * Edits a formula field in the store.
   * @template T - The type of the field value.
   */
  editField: <T>(field: FormulaField<T>) => void;
  /**
   * Removes a formula field from the store based on its identifier.
   * @returns {string[]} - An array of the field identifiers affected by the removal.
   */
  removeField: (fieldId: string) => string[];
  /**
   * Updates the values of multiple formula fields in the store.
   */
  updateFieldsValue: (
    fields: Array<Pick<FormulaField<any>, "value" | "id">>
  ) => void;
}
