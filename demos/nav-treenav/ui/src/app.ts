import { createElement } from 'specifyjs';
import { useState, useCallback } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';
import { TreeNav, TreeNode } from '../../../../components/nav/treenav/src/index';
import type { TreeNodeData } from '../../../../components/nav/treenav/src/index';

function App() {
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [lastEvent, setLastEvent] = useState('None');

  const treeData: TreeNodeData = {
    id: 'root',
    label: 'Project',
    icon: 'P',
    expanded: true,
    children: [
      {
        id: 'src',
        label: 'src',
        icon: 'D',
        children: [
          { id: 'index', label: 'index.ts', icon: 'F' },
          { id: 'app', label: 'app.ts', icon: 'F' },
          {
            id: 'components',
            label: 'components',
            icon: 'D',
            children: [
              { id: 'header', label: 'Header.ts', icon: 'F' },
              { id: 'footer', label: 'Footer.ts', icon: 'F' },
            ],
          },
        ],
      },
      {
        id: 'tests',
        label: 'tests',
        icon: 'T',
        children: [
          { id: 'unit', label: 'unit.test.ts', icon: 'F' },
          { id: 'e2e', label: 'e2e.test.ts', icon: 'F' },
        ],
      },
      { id: 'readme', label: 'README.md', icon: 'F' },
      { id: 'package', label: 'package.json', icon: 'F' },
    ],
  };

  const handleNodeClick = useCallback((node: TreeNode) => {
    setSelectedId(node.id);
    setLastEvent(`Clicked: ${node.label}`);
  }, []);

  const handleNodeExpand = useCallback((node: TreeNode) => {
    setLastEvent(`Expanded: ${node.label}`);
  }, []);

  const handleNodeCollapse = useCallback((node: TreeNode) => {
    setLastEvent(`Collapsed: ${node.label}`);
  }, []);

  return createElement(
    'div',
    { style: { padding: '40px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' } },
    createElement('h1', null, 'TreeNav Demo'),
    createElement(
      'div',
      { style: { marginBottom: '16px' } },
      createElement(TreeNav, {
        root: treeData,
        selectedId,
        onNodeClick: handleNodeClick,
        onNodeExpand: handleNodeExpand,
        onNodeCollapse: handleNodeCollapse,
        wrapperStyle: { width: '320px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
      }),
    ),
    createElement(
      'div',
      { style: { padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px' } },
      createElement('strong', null, 'Last event: '),
      createElement('span', null, lastEvent),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
