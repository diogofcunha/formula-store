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

  const checkFields = (fieldId: string, dependencies: string[]) => {
    const missingFields = dependencies.filter(d => !addedFields.has(d));

    if (missingFields.length > 0) {
      throw new FormulaFieldDependencyError(fieldId, missingFields);
    }
  };

  const getPossibleTouchedFieldsOnNodeChange = (
    node: AddedField,
    possiblyTouchedFields = new Set<string>()
  ) => {
    fieldGraph.bfs(n => {
      possiblyTouchedFields.add(n.id);

      return SearchAlgorithmNodeBehavior.continue;
    }, node);

    return possiblyTouchedFields;
  };

  const computeRangeEditValueChanges = (
    possiblyTouchedFields: Set<string>,
    changes: FormulaUpdate[]
  ) => {
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
  };

  const onFieldChanged = (
    node: AddedField,
    dependencies: string[]
  ): FormulaUpdate[] => {
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

      throw new FormulaFieldCircularDependencyError(node.id);
    }

    addedFields.set(node.id, node);

    if (dependencies.length && node.calculate) {
      node.value = node.calculate(...values);

      return [
        {
          id: node.id,
          value: node.value
        }
      ];
    }

    return [];
  };

  const getFieldsToRecalculateOnNodeChanges = (field: AddedField) => {
    const fieldToRecalculate: Map<string, Required<AddedField>> = new Map();

    fieldGraph.bfs(n => {
      const f = addedFields.get(n.id) as AddedField;

      if (f.calculate) {
        fieldToRecalculate.set(f.id, f as Required<AddedField>);
      }

      return SearchAlgorithmNodeBehavior.continue;
    }, field);

    return fieldToRecalculate;
  };

  return {
    removeField: fieldId => {
      if (!addedFields.has(fieldId)) {
        throw new FormulaFieldNotFoundError(fieldId);
      }

      const field = addedFields.get(fieldId) as AddedField;
      const fieldToRecalculate = getFieldsToRecalculateOnNodeChanges(field);

      addedFields.delete(fieldId);
      fieldGraph.removeNode(field);
      dependencyTree = fieldGraph.kahnTopologicalSort();

      const changes: FormulaUpdate[] = [];

      for (const dep of dependencyTree) {
        const node = fieldToRecalculate.get(dep.id);

        if (!node) {
          continue;
        }

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

      onChange(changes);

      return changes.map(c => c.id);
    },
    editField: () => {
      //
    },
    addField: ({ id, value, dependencies, calculate }) => {
      if (addedFields.has(id)) {
        throw new FormulaFieldDuplicatedError(id);
      }

      checkFields(id, dependencies);

      const node: AddedField = new Node(id, value);

      if (calculate) {
        node.calculate = calculate;
      }

      fieldGraph.addNode(node);
      const changes = onFieldChanged(node, dependencies);

      if (changes.length) {
        onChange(changes);
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

        getPossibleTouchedFieldsOnNodeChange(node, possiblyTouchedFields);
      }

      computeRangeEditValueChanges(possiblyTouchedFields, changes);

      onChange(changes);
    }
  };
}
