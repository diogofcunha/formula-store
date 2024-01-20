import {
  FormulaFieldDependencyError,
  FormulaFieldDuplicatedError
} from "./errors";
import { FormulaStore } from "./types";
import { Graph, Node } from "fast-graph";

export function createFormulaStore(): FormulaStore {
  const addedFields = new Map<string, Node<unknown>>();
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

      addedFields.set(id, node);

      if (dependencies.length) {
        node.value = calculate(values);
      }
    }
  };
}
