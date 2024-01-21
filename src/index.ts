import {
  FormulaFieldCircularDependencyError,
  FormulaFieldDependencyError,
  FormulaFieldDuplicatedError,
  FormulaFieldNotFoundError
} from "./errors";
import {
  FormulaField,
  FormulaStore,
  FormulaStoreInput,
  FormulaUpdate
} from "./types";
import { Graph, Node, SearchAlgorithmNodeBehavior } from "fast-graph";

type AddedField = Node<unknown> & Pick<FormulaField<unknown>, "calculate">;

export function createFormulaStore({
  onChange
}: FormulaStoreInput): FormulaStore {
  const addedFields = new Map<string, AddedField>();
  let dependencyTree: Array<Node<unknown>> = [];
  const fieldGraph = new Graph();

  return {
    removeField: fieldId => {
      if (!addedFields.has(fieldId)) {
        throw new FormulaFieldNotFoundError(fieldId);
      }

      const field = addedFields.get(fieldId) as AddedField;

      addedFields.delete(fieldId);
      fieldGraph.removeNode(field);
      dependencyTree = fieldGraph.kahnTopologicalSort();
    },
    addField: ({ id, value, dependencies, calculate }) => {
      if (addedFields.has(id)) {
        throw new FormulaFieldDuplicatedError(id);
      }

      const missingFields = dependencies.filter(d => !addedFields.has(d));

      if (missingFields.length > 0) {
        throw new FormulaFieldDependencyError(id, missingFields);
      }

      const node: AddedField = new Node(id, value);

      if (calculate) {
        node.calculate = calculate;
      }

      fieldGraph.addNode(node);
      const values = [];

      for (const d of dependencies) {
        const parentField = addedFields.get(d) as AddedField;
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

      if (dependencies.length && calculate) {
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

      const possiblyTouchedFields = new Set<string>();

      for (const { id, value } of fields) {
        const node = addedFields.get(id) as AddedField;

        node.value = value;

        changes.push({
          id: node.id,
          value: node.value
        });

        possiblyTouchedFields.add(id);

        fieldGraph.bfs(n => {
          possiblyTouchedFields.add(n.id);

          return SearchAlgorithmNodeBehavior.continue;
        }, node);
      }

      for (const dep of dependencyTree) {
        if (!possiblyTouchedFields.has(dep.id)) {
          continue;
        }

        const node = addedFields.get(dep.id) as AddedField;

        if (node.calculate) {
          node.value = node.calculate(
            ...node.incomingNeighbors.map(n => {
              const field = addedFields.get(n) as AddedField;

              return field.value;
            })
          );

          changes.push({
            id: node.id,
            value: node.value
          });
        }
      }

      onChange(changes);
    }
  };
}
