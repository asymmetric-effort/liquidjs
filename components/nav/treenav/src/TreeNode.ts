/**
 * TreeNode — Extensible data model for tree navigation nodes.
 *
 * Represents a single node in a hierarchical tree structure. Supports
 * arbitrary metadata for extensibility, parent/child traversal, and
 * expand/collapse state management. Developers can subclass TreeNode or
 * attach custom data via the `metadata` field.
 */

// -- Types ------------------------------------------------------------------

export interface TreeNodeData {
  /** Unique identifier for the node */
  id: string;
  /** Display label */
  label: string;
  /** Nested child nodes */
  children?: TreeNodeData[];
  /** Whether the node starts expanded (default: false) */
  expanded?: boolean;
  /** Text or emoji icon displayed alongside the label */
  icon?: string;
  /** Extensible payload — attach arbitrary data here */
  metadata?: Record<string, unknown>;
}

// -- Class ------------------------------------------------------------------

export class TreeNode {
  id: string;
  label: string;
  children: TreeNode[];
  expanded: boolean;
  icon: string | null;
  metadata: Record<string, unknown>;
  parent: TreeNode | null;
  depth: number;

  constructor(data: TreeNodeData, parent?: TreeNode) {
    this.id = data.id;
    this.label = data.label;
    this.expanded = data.expanded ?? false;
    this.icon = data.icon ?? null;
    this.metadata = data.metadata ?? {};
    this.parent = parent ?? null;
    this.depth = parent ? parent.depth + 1 : 0;

    this.children = (data.children ?? []).map(
      (childData) => new TreeNode(childData, this),
    );
  }

  // -- Factory --------------------------------------------------------------

  /**
   * Build a full TreeNode tree from nested data.
   */
  static fromData(data: TreeNodeData): TreeNode {
    return new TreeNode(data);
  }

  // -- Traversal ------------------------------------------------------------

  /**
   * Returns true if the node has no children.
   */
  isLeaf(): boolean {
    return this.children.length === 0;
  }

  /**
   * Returns true if the node has no parent (root of the tree).
   */
  isRoot(): boolean {
    return this.parent === null;
  }

  /**
   * Depth-first walk of this node and all descendants.
   * The callback receives each node and its depth.
   */
  walk(fn: (node: TreeNode, depth: number) => void): void {
    fn(this, this.depth);
    for (const child of this.children) {
      child.walk(fn);
    }
  }

  /**
   * Find a descendant (or self) by id. Returns null if not found.
   */
  find(id: string): TreeNode | null {
    if (this.id === id) return this;
    for (const child of this.children) {
      const found = child.find(id);
      if (found) return found;
    }
    return null;
  }

  // -- Mutation -------------------------------------------------------------

  /**
   * Toggle the expanded/collapsed state.
   */
  toggle(): void {
    this.expanded = !this.expanded;
  }

  /**
   * Expand this node (show children).
   */
  expand(): void {
    this.expanded = true;
  }

  /**
   * Collapse this node (hide children).
   */
  collapse(): void {
    this.expanded = false;
  }

  /**
   * Add a child node from data. Returns the newly created TreeNode.
   */
  addChild(data: TreeNodeData): TreeNode {
    const child = new TreeNode(data, this);
    this.children.push(child);
    return child;
  }

  /**
   * Remove a direct child by id. Returns true if a child was removed.
   */
  removeChild(id: string): boolean {
    const idx = this.children.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    this.children.splice(idx, 1);
    return true;
  }
}
