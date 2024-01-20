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
    addField: ({ id, value, dependencies }) => {
      if (addedFields.has(id)) {
        throw new FormulaFieldDuplicatedError(id);
      }

      const missingFields = dependencies.filter(d => !addedFields.has(d));

      if (missingFields.length > 0) {
        throw new FormulaFieldDependencyError(id, missingFields);
      }

      const node = new Node(id, value);
      fieldGraph.addNode(node);

      for (const d of dependencies) {
        const parentField = addedFields.get(d) as Node<unknown>;
        fieldGraph.addEdge(parentField, node);
      }

      addedFields.set(id, node);
    }
  };
}
