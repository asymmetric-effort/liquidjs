# TreeNav

Accessible tree navigation component. Renders a hierarchical tree with expand/collapse toggling, connector lines, keyboard navigation, and optional custom node rendering. Built on NavWrapper with `role="tree"`.

## Import

```ts
import { TreeNav, TreeNode } from '@liquidjs/components/nav/treenav';
import type { TreeNavProps, TreeNodeData } from '@liquidjs/components/nav/treenav';
```

## Props

### TreeNavProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `root` | `TreeNodeData` | *required* | Tree data structure (nested object). |
| `onNodeClick` | `(node: TreeNode) => void` | `undefined` | Fired when a node label is clicked. |
| `onNodeExpand` | `(node: TreeNode) => void` | `undefined` | Fired when a node is expanded. |
| `onNodeCollapse` | `(node: TreeNode) => void` | `undefined` | Fired when a node is collapsed. |
| `selectedId` | `string` | `undefined` | ID of the currently selected node. |
| `expandAll` | `boolean` | `false` | Start with all nodes expanded. |
| `lineColor` | `string` | `'#000'` | Color of connector lines. |
| `lineWidth` | `number` | `1` | Width of connector lines in pixels. |
| `indentPx` | `number` | `20` | Pixels of indentation per depth level. |
| `iconExpanded` | `string` | `'\u2212'` (minus) | Icon shown for expanded non-leaf nodes. |
| `iconCollapsed` | `string` | `'+'` | Icon shown for collapsed non-leaf nodes. |
| `nodeStyle` | `NavItemStyle` | `{}` | Styling for individual node items. |
| `wrapperStyle` | `NavWrapperStyle` | `undefined` | Styling for the outer NavWrapper. |
| `renderNode` | `(node: TreeNode, isSelected: boolean) => unknown` | `undefined` | Custom node renderer for full control over node appearance. |

### TreeNodeData

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | `string` | *required* | Unique identifier for the node. |
| `label` | `string` | *required* | Display label. |
| `children` | `TreeNodeData[]` | `[]` | Nested child nodes. |
| `expanded` | `boolean` | `false` | Whether the node starts expanded. |
| `icon` | `string` | `undefined` | Text or emoji icon displayed alongside the label. |
| `metadata` | `Record<string, unknown>` | `{}` | Extensible payload for attaching arbitrary data. |

## Usage

```ts
import { createElement } from '@liquidjs/core';
import { TreeNav } from '@liquidjs/components/nav/treenav';

const tree = createElement(TreeNav, {
  root: {
    id: 'root',
    label: 'Project',
    children: [
      {
        id: 'src',
        label: 'src',
        icon: 'F',
        children: [
          { id: 'index', label: 'index.ts' },
          { id: 'app', label: 'App.ts' },
        ],
      },
      { id: 'readme', label: 'README.md' },
      { id: 'package', label: 'package.json' },
    ],
  },
  selectedId: 'index',
  expandAll: true,
  onNodeClick: (node) => console.log('Selected:', node.label),
});
```

## Features

- **Hierarchical tree rendering** -- nested data is rendered with visual indentation and connector lines.
- **Expand/collapse toggling** -- non-leaf nodes can be expanded or collapsed by clicking the toggle icon.
- **Connector lines** -- vertical and horizontal lines visually connect parent and child nodes.
- **Configurable indentation** -- control indent depth, line color, and line width.
- **Custom node rendering** -- provide a `renderNode` function for full control over node appearance.
- **Expand all** -- optionally start with the entire tree expanded.
- **TreeNode data model** -- the `TreeNode` class supports traversal (`walk`, `find`), mutation (`addChild`, `removeChild`), and arbitrary metadata.
- **Event callbacks** -- separate callbacks for node click, expand, and collapse events.

## Accessibility

- The outer wrapper uses `role="tree"` with an `aria-label` of "Tree navigation".
- Each node row uses `role="treeitem"`.
- Non-leaf nodes have `aria-expanded` indicating their open/closed state.
- Selected nodes are marked with `aria-selected="true"`.
- Each node reports its depth via `aria-level` (1-based).
- Full keyboard navigation: ArrowDown/ArrowUp move between visible nodes, ArrowRight expands or enters children, ArrowLeft collapses or moves to parent.
- Enter selects a node; Space toggles expand/collapse.
- Home and End keys jump to the first and last visible nodes.
- Connector lines and toggle icons are hidden from assistive technology with `aria-hidden="true"`.
- Roving tabindex ensures only the focused node is in the tab order.
