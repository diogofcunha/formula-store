import {
  FormulaFieldCircularDependencyError,
  FormulaFieldDependencyError,
  FormulaFieldDuplicatedError,
  FormulaFieldNotFoundError
} from "./errors";
import { FormulaStore, FormulaStoreInput, FormulaUpdate } from "./types";
import { Graph, Node } from "fast-graph";

export function createFormulaStore({
  onChange
}: FormulaStoreInput): FormulaStore {
  const addedFields = new Map<string, Node<unknown>>();
  let dependencyTree: Array<Node<unknown>> = [];
  const fieldGraph = new Graph();

  return {
    addField: ({ id, value, dependencies, calculate }) => {
      if (addedFields.has(id)) {
        throw new FormulaFieldDuplicatedError(id);
      }

      const missingFields = dependencies.filter(d => !addedFields.has(d));

      if (missingFields.length > 0) {
        throw new FormulaFieldDependencyError(id, missingFields);
      }

      const node = new Node(id, value);
      fieldGraph.addNode(node);
      const values = [];

      for (const d of dependencies) {
        const parentField = addedFields.get(d) as Node<unknown>;
        fieldGraph.addEdge(parentField, node);
        values.push(parentField.value);
      }

      try {
        dependencyTree = fieldGraph.kahnTopologicalSort();
      } catch (ex) {
        fieldGraph.removeNode(node);

        throw new FormulaFieldCircularDependencyError(id);
      }

      addedFields.set(id, node);

      if (dependencies.length) {
        node.value = calculate(...values);

        onChange([
          {
            id: node.id,
            value: node.value
          }
        ]);
      }
    },
    updateFieldsValue: fields => {
      const missingFields = fields.filter(d => !addedFields.has(d.id));
      const changes: FormulaUpdate[] = [];

      if (missingFields.length > 0) {
        throw new FormulaFieldNotFoundError(missingFields.map(mf => mf.id));
      }

      for (const { id, value } of fields) {
        const node = addedFields.get(id) as Node<unknown>;

        node.value = value;

        changes.push({
          id: node.id,
          value: node.value
        });
      }

      for (const dependency of dependencyTree) {
        console.log(dependency);
      }
      onChange(changes);
    }
  };
}
