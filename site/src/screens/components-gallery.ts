import { createElement } from 'liquidjs';
import { useState, useCallback } from 'liquidjs/hooks';

function preview(title: string, comp: () => ReturnType<typeof createElement>) {
  return createElement(
    'div',
    { className: 'preview-card' },
    createElement('div', { className: 'preview-header' }, title),
    createElement('div', { className: 'preview-body' }, createElement(comp, null)),
  );
}

export function ComponentsGallery() {
  const [openSection, setOpenSection] = useState<string | null>('Form Components');

  const toggle = useCallback(
    ((...args: unknown[]) => {
      const name = args[0] as string;
      setOpenSection((prev: string | null) => (prev === name ? null : name));
    }) as (...args: unknown[]) => unknown,
    [],
  ) as (name: string) => void;

  return createElement(
    'div',
    { className: 'accordion' },
    accordionSection('Form Components', '13 components', openSection, toggle, [
      preview('Toggle', ToggleDemo),
      preview('Text Input', TextInputDemo),
      preview('Checkbox', CheckboxDemo),
      preview('Radio Group', RadioGroupDemo),
      preview('Select', SelectDemo),
      preview('Slider', SliderDemo),
      preview('Number Spinner', NumberSpinnerDemo),
      preview('Color Picker', ColorPickerDemo),
      preview('Date Picker', DatePickerDemo),
      preview('Time Picker', TimePickerDemo),
      preview('File Upload', FileUploadDemo),
      preview('Multiline', MultilineDemo),
      preview('Text Editor', TextEditorDemo),
    ]),
    accordionSection('Data Display', '6 components', openSection, toggle, [
      preview('Badge', BadgeDemo),
      preview('Tag', TagDemo),
      preview('Data Table', DataTableDemo),
      preview('Avatar', AvatarDemo),
      preview('List View', ListViewDemo),
      preview('Virtual Scroll', VirtualScrollDemo),
    ]),
    accordionSection('Feedback', '3 components', openSection, toggle, [
      preview('Alert', AlertDemo),
      preview('Progress Bar', ProgressBarDemo),
      preview('Spinner', SpinnerDemo),
    ]),
    accordionSection('Navigation', '9 components', openSection, toggle, [
      preview('Tabs', TabsDemo),
      preview('Breadcrumb', BreadcrumbDemo),
      preview('Pagination', PaginationDemo),
      preview('Dropdown Menu', DropdownMenuDemo),
      preview('Menu Bar', MenuBarDemo),
      preview('Sidebar', SidebarDemo),
      preview('Stepper', StepperDemo),
      preview('Toolbar', ToolbarDemo),
      preview('Tree Nav', TreeNavDemo),
    ]),
    accordionSection('Layout', '9 components', openSection, toggle, [
      preview('Card', CardDemo),
      preview('Counter', CounterDemo),
      preview('List with Filter', FilterListDemo),
      preview('Flex Container', FlexContainerDemo),
      preview('Grid', GridDemo),
      preview('Panel', PanelDemo),
      preview('Scroll Container', ScrollContainerDemo),
      preview('Splitter', SplitterDemo),
      preview('Tabs Layout', TabsLayoutDemo),
    ]),
    accordionSection('Visualization', '9 components', openSection, toggle, [
      preview('Bar Graph', BarGraphDemo),
      preview('Line Graph', LineGraphDemo),
      preview('Pie Chart', PieChartDemo),
      preview('2D Graph (Force-Directed)', ForceGraphDemo),
      preview('Hypercube (4D)', HypercubeDemo),
      preview('Scatter Plot', ScatterPlotDemo),
      preview('Cartesian Graph (4-leaf Rose)', CartesianRoseDemo),
      preview('Complex Plane (Mandelbrot)', MandelbrotDemo),
      preview('Polar Graph (3-leaf Rose)', PolarRoseDemo),
    ]),
  );
}

function accordionSection(
  title: string,
  subtitle: string,
  openSection: string | null,
  toggle: (name: string) => void,
  children: ReturnType<typeof createElement>[],
) {
  const isOpen = openSection === title;
  return createElement(
    'div',
    { className: 'accordion-section' },
    createElement(
      'button',
      {
        className: `accordion-header ${isOpen ? 'accordion-header--open' : ''}`,
        onClick: () => toggle(title),
      },
      createElement(
        'div',
        { className: 'accordion-header-left' },
        createElement('span', { className: 'accordion-chevron' }, isOpen ? '\u25bc' : '\u25b6'),
        createElement('span', { className: 'accordion-title' }, title),
        createElement('span', { className: 'accordion-subtitle' }, subtitle),
      ),
    ),
    isOpen
      ? createElement('div', { className: 'accordion-body' }, createElement('div', { className: 'preview-grid' }, ...children))
      : null,
  );
}

// ─── Form ─────────────────────────────────────────────────────────────
function ToggleDemo() {
  const [on, setOn] = useState(false);
  return createElement('div', { className: 'demo-toggle', onClick: () => setOn(!on) },
    createElement('div', { className: `demo-toggle-track ${on ? 'on' : ''}` },
      createElement('div', { className: 'demo-toggle-thumb' }),
    ),
    createElement('span', { style: { fontSize: '14px' } }, on ? 'On' : 'Off'),
  );
}

function TextInputDemo() {
  const [value, setValue] = useState('');
  return createElement('div', null,
    createElement('input', {
      type: 'text', placeholder: 'Type something...', value,
      onInput: (e: Event) => setValue((e.target as HTMLInputElement).value),
      style: { padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', width: '100%' },
    }),
    value ? createElement('p', { style: { fontSize: '13px', color: '#64748b', marginTop: '8px' } }, `"${value}" (${value.length} chars)`) : null,
  );
}

function CheckboxDemo() {
  const [checked, setChecked] = useState(false);
  return createElement('label', { style: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' } },
    createElement('input', { type: 'checkbox', checked, onChange: () => setChecked(!checked) }),
    checked ? 'Checked' : 'Unchecked',
  );
}

function RadioGroupDemo() {
  const [selected, setSelected] = useState('small');
  const options = ['small', 'medium', 'large'];
  return createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px' } },
    ...options.map(opt =>
      createElement('label', { key: opt, style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' } },
        createElement('input', { type: 'radio', name: 'size-demo', checked: selected === opt, onChange: () => setSelected(opt) }),
        opt.charAt(0).toUpperCase() + opt.slice(1),
      ),
    ),
  );
}

function SelectDemo() {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const items = ['Apple', 'Banana', 'Cherry', 'Date'];
  return createElement('div', { style: { position: 'relative' } },
    createElement('div', {
      onClick: () => setOpen(!open),
      style: { padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', display: 'flex', justifyContent: 'space-between' },
    }, value || 'Select a fruit...', createElement('span', null, open ? '\u25b2' : '\u25bc')),
    open ? createElement('div', { style: { position: 'absolute', top: '100%', left: '0', right: '0', border: '1px solid #d1d5db', borderRadius: '0 0 6px 6px', background: 'white', zIndex: '10' } },
      ...items.map(item =>
        createElement('div', { key: item, onClick: () => { setValue(item); setOpen(false); }, style: { padding: '6px 12px', cursor: 'pointer', fontSize: '14px' } }, item),
      ),
    ) : null,
  );
}

function SliderDemo() {
  const [value, setValue] = useState(50);
  return createElement('div', null,
    createElement('input', { type: 'range', min: '0', max: '100', value: String(value), onInput: (e: Event) => setValue(Number((e.target as HTMLInputElement).value)), style: { width: '100%' } }),
    createElement('p', { style: { fontSize: '13px', color: '#64748b', marginTop: '4px' } }, `Value: ${value}`),
  );
}

function NumberSpinnerDemo() {
  const [n, setN] = useState(0);
  const btn = { padding: '4px 12px', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', background: '#f8fafc' };
  return createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
    createElement('button', { style: btn, onClick: () => setN(n - 1) }, '-'),
    createElement('span', { style: { fontSize: '18px', fontWeight: '700', minWidth: '32px', textAlign: 'center' } }, String(n)),
    createElement('button', { style: btn, onClick: () => setN(n + 1) }, '+'),
  );
}

// ─── Data Display ─────────────────────────────────────────────────────
function BadgeDemo() {
  const [count, setCount] = useState(3);
  return createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '16px' } },
    createElement('div', { style: { position: 'relative', display: 'inline-block' } },
      createElement('span', { style: { fontSize: '20px' } }, '\ud83d\udce8'),
      createElement('span', { style: { position: 'absolute', top: '-6px', right: '-10px', background: '#ef4444', color: 'white', borderRadius: '10px', padding: '0 6px', fontSize: '11px', fontWeight: '700' } }, String(count)),
    ),
    createElement('button', { onClick: () => setCount(count + 1), style: { fontSize: '12px', padding: '2px 8px', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' } }, '+1'),
    createElement('button', { onClick: () => setCount(0), style: { fontSize: '12px', padding: '2px 8px', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' } }, 'Clear'),
  );
}

function TagDemo() {
  const [tags, setTags] = useState(['LiquidJS', 'TypeScript', 'SPA']);
  return createElement('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap' } },
    ...tags.map(tag =>
      createElement('span', { key: tag, style: { padding: '4px 10px', background: '#eff6ff', color: '#3b82f6', borderRadius: '12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' } },
        tag,
        createElement('span', { onClick: () => setTags(tags.filter(t => t !== tag)), style: { cursor: 'pointer', opacity: '0.6' } }, '\u00d7'),
      ),
    ),
  );
}

function DataTableDemo() {
  const rows = [['Alice', '28', 'Engineer'], ['Bob', '34', 'Designer'], ['Carol', '25', 'Manager']];
  return createElement('table', { className: 'data-table' },
    createElement('thead', null, createElement('tr', null, ...['Name', 'Age', 'Role'].map(h => createElement('th', { key: h }, h)))),
    createElement('tbody', null, ...rows.map((r, i) => createElement('tr', { key: String(i) }, ...r.map((c, j) => createElement('td', { key: String(j) }, c))))),
  );
}

function AvatarDemo() {
  const initials = ['SC', 'AE', 'LJ'];
  const colors = ['#3b82f6', '#10b981', '#f59e0b'];
  return createElement('div', { style: { display: 'flex', gap: '8px' } },
    ...initials.map((init, i) =>
      createElement('div', { key: init, style: { width: '40px', height: '40px', borderRadius: '50%', background: colors[i % colors.length], color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700' } }, init),
    ),
  );
}

// ─── Feedback ─────────────────────────────────────────────────────────
function AlertDemo() {
  const [visible, setVisible] = useState(true);
  if (!visible) return createElement('button', { onClick: () => setVisible(true), style: { padding: '6px 14px', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' } }, 'Show Alert');
  return createElement('div', { style: { padding: '12px 16px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', color: '#1e40af' } },
    createElement('span', null, 'Informational alert built with LiquidJS.'),
    createElement('button', { onClick: () => setVisible(false), style: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#1e40af' } }, '\u00d7'),
  );
}

function ProgressBarDemo() {
  const [value, setValue] = useState(60);
  return createElement('div', null,
    createElement('div', { style: { height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' } },
      createElement('div', { style: { width: `${value}%`, height: '100%', background: '#3b82f6', borderRadius: '4px', transition: 'width 0.3s' } }),
    ),
    createElement('div', { style: { display: 'flex', gap: '8px', marginTop: '8px' } },
      createElement('button', { onClick: () => setValue(Math.max(0, value - 10)), style: { fontSize: '12px', padding: '2px 8px', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' } }, '-10'),
      createElement('span', { style: { fontSize: '13px', color: '#64748b' } }, `${value}%`),
      createElement('button', { onClick: () => setValue(Math.min(100, value + 10)), style: { fontSize: '12px', padding: '2px 8px', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' } }, '+10'),
    ),
  );
}

function SpinnerDemo() {
  return createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } },
    createElement('div', { style: { width: '24px', height: '24px', border: '3px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' } }),
    createElement('span', { style: { fontSize: '14px', color: '#64748b' } }, 'Loading...'),
    createElement('style', null, '@keyframes spin { to { transform: rotate(360deg); } }'),
  );
}

// ─── Navigation ───────────────────────────────────────────────────────
function TabsDemo() {
  const tabs = ['Overview', 'Details', 'Settings'];
  const [active, setActive] = useState(0);
  return createElement('div', null,
    createElement('div', { style: { display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '12px' } },
      ...tabs.map((tab, i) =>
        createElement('button', { key: tab, style: { padding: '6px 14px', border: 'none', borderBottom: i === active ? '2px solid #3b82f6' : '2px solid transparent', background: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: i === active ? '600' : '400', color: i === active ? '#3b82f6' : '#64748b' }, onClick: () => setActive(i) }, tab),
      ),
    ),
    createElement('div', { style: { fontSize: '14px', color: '#64748b' } }, `Content for ${tabs[active]} tab.`),
  );
}

function BreadcrumbDemo() {
  const items = ['Home', 'Products', 'Electronics', 'Phones'];
  return createElement('div', { style: { display: 'flex', gap: '4px', fontSize: '14px' } },
    ...items.map((item, i) =>
      createElement('span', { key: item },
        i > 0 ? createElement('span', { style: { color: '#94a3b8', margin: '0 4px' } }, '/') : null,
        createElement('span', { style: { color: i === items.length - 1 ? '#0f172a' : '#3b82f6', fontWeight: i === items.length - 1 ? '600' : '400' } }, item),
      ),
    ),
  );
}

function PaginationDemo() {
  const [page, setPage] = useState(1);
  const total = 5;
  const btn = (label: string, p: number, active: boolean) =>
    createElement('button', { key: label, onClick: () => setPage(p), style: { padding: '4px 10px', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', background: active ? '#3b82f6' : '#f8fafc', color: active ? 'white' : '#0f172a' } }, label);
  return createElement('div', { style: { display: 'flex', gap: '4px', alignItems: 'center' } },
    btn('\u2190', Math.max(1, page - 1), false),
    ...Array.from({ length: total }, (_, i) => btn(String(i + 1), i + 1, page === i + 1)),
    btn('\u2192', Math.min(total, page + 1), false),
  );
}

// ─── Layout ───────────────────────────────────────────────────────────
function CardDemo() {
  return createElement('div', { style: { border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' } },
    createElement('div', { style: { height: '80px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' } }),
    createElement('div', { style: { padding: '12px 16px' } },
      createElement('h4', { style: { fontSize: '15px', fontWeight: '600', marginBottom: '4px' } }, 'Card Title'),
      createElement('p', { style: { fontSize: '13px', color: '#64748b' } }, 'A simple card with header gradient and body content.'),
    ),
  );
}

function CounterDemo() {
  const [count, setCount] = useState(0);
  const btn = { padding: '6px 16px', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', backgroundColor: '#f8fafc' };
  return createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } },
    createElement('button', { style: btn, onClick: () => setCount(c => c - 1) }, '-'),
    createElement('span', { style: { fontSize: '24px', fontWeight: '700', minWidth: '40px', textAlign: 'center' } }, String(count)),
    createElement('button', { style: btn, onClick: () => setCount(c => c + 1) }, '+'),
  );
}

function FilterListDemo() {
  const items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'];
  const [filter, setFilter] = useState('');
  const filtered = items.filter(i => i.toLowerCase().includes(filter.toLowerCase()));
  return createElement('div', null,
    createElement('input', { type: 'text', placeholder: 'Filter fruits...', value: filter, onInput: (e: Event) => setFilter((e.target as HTMLInputElement).value), style: { padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px', width: '100%', marginBottom: '8px' } }),
    createElement('ul', { style: { listStyle: 'none', fontSize: '14px' } },
      ...filtered.map(item => createElement('li', { key: item, style: { padding: '4px 0', borderBottom: '1px solid #f1f5f9' } }, item)),
    ),
    filtered.length === 0 ? createElement('p', { style: { fontSize: '13px', color: '#94a3b8' } }, 'No matches') : null,
  );
}

// ─── Visualization ────────────────────────────────────────────────────
function BarGraphDemo() {
  const data = [
    { label: 'Q1', value: 42, color: '#3b82f6' },
    { label: 'Q2', value: 67, color: '#10b981' },
    { label: 'Q3', value: 35, color: '#f59e0b' },
    { label: 'Q4', value: 89, color: '#ef4444' },
  ];
  const max = Math.max(...data.map(d => d.value));
  return createElement('div', null,
    createElement('div', { style: { display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px' } },
      ...data.map(d =>
        createElement('div', { key: d.label, style: { flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center' } },
          createElement('span', { style: { fontSize: '11px', fontWeight: '600', marginBottom: '4px' } }, String(d.value)),
          createElement('div', { style: { width: '100%', height: `${Math.round((d.value / max) * 100)}px`, backgroundColor: d.color, borderRadius: '4px 4px 0 0' } }),
          createElement('span', { style: { fontSize: '11px', color: '#64748b', marginTop: '4px' } }, d.label),
        ),
      ),
    ),
  );
}

function LineGraphDemo() {
  const points = [20, 45, 30, 65, 50, 80, 55];
  const max = Math.max(...points);
  const width = 240;
  const height = 100;
  const step = width / (points.length - 1);
  const pathD = points.map((p, i) => {
    const x = i * step;
    const y = height - (p / max) * height;
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');

  return createElement('div', { style: { padding: '8px 0' } },
    createElement('svg', { width: String(width), height: String(height + 10), viewBox: `0 0 ${width} ${height + 10}` },
      createElement('path', { d: pathD, fill: 'none', stroke: '#3b82f6', strokeWidth: '2' }),
      ...points.map((p, i) =>
        createElement('circle', { key: String(i), cx: String(i * step), cy: String(height - (p / max) * height), r: '3', fill: '#3b82f6' }),
      ),
    ),
  );
}

function PieChartDemo() {
  const data = [
    { label: 'TypeScript', value: 60, color: '#3b82f6' },
    { label: 'Go', value: 25, color: '#10b981' },
    { label: 'Other', value: 15, color: '#f59e0b' },
  ];
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 50;
  const cx = 60;
  const cy = 60;
  let startAngle = 0;

  const slices = data.map(d => {
    const angle = (d.value / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(startAngle + angle);
    const y2 = cy + r * Math.sin(startAngle + angle);
    const largeArc = angle > Math.PI ? 1 : 0;
    const path = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`;
    startAngle += angle;
    return createElement('path', { key: d.label, d: path, fill: d.color });
  });

  return createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '16px' } },
    createElement('svg', { width: '120', height: '120', viewBox: '0 0 120 120' }, ...slices),
    createElement('div', { style: { fontSize: '13px' } },
      ...data.map(d =>
        createElement('div', { key: d.label, style: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' } },
          createElement('div', { style: { width: '10px', height: '10px', borderRadius: '2px', backgroundColor: d.color } }),
          createElement('span', null, `${d.label} (${d.value}%)`),
        ),
      ),
    ),
  );
}

function ForceGraphDemo() {
  // Simple force-directed graph layout with interactive vertices
  const [nodes] = useState(() => [
    { id: 'A', x: 80, y: 50, color: '#3b82f6' },
    { id: 'B', x: 160, y: 40, color: '#10b981' },
    { id: 'C', x: 200, y: 110, color: '#f59e0b' },
    { id: 'D', x: 120, y: 130, color: '#ef4444' },
    { id: 'E', x: 40, y: 110, color: '#8b5cf6' },
  ]);
  const edges = [
    ['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'E'], ['E', 'A'], ['A', 'C'], ['B', 'D'],
  ];
  const [hovered, setHovered] = useState<string | null>(null);

  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  return createElement('div', null,
    createElement('svg', { width: '240', height: '160', viewBox: '0 0 240 160', style: { background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' } },
      // Edges
      ...edges.map(([from, to]) => {
        const f = nodeMap.get(from!)!;
        const t = nodeMap.get(to!)!;
        const isHovered = hovered === from || hovered === to;
        return createElement('line', {
          key: `${from}-${to}`,
          x1: String(f.x), y1: String(f.y),
          x2: String(t.x), y2: String(t.y),
          stroke: isHovered ? '#0f172a' : '#94a3b8',
          strokeWidth: isHovered ? '2' : '1.5',
        });
      }),
      // Vertices
      ...nodes.map(n => createElement('g', { key: n.id },
        createElement('circle', {
          cx: String(n.x), cy: String(n.y), r: hovered === n.id ? '12' : '10',
          fill: n.color, stroke: '#fff', strokeWidth: '2',
          style: { cursor: 'pointer', transition: 'r 0.15s' },
          onMouseEnter: () => setHovered(n.id),
          onMouseLeave: () => setHovered(null),
        }),
        createElement('text', {
          x: String(n.x), y: String(n.y + 4),
          textAnchor: 'middle', fill: '#fff', fontSize: '10', fontWeight: '700',
        }, n.id),
      )),
    ),
    createElement('p', { style: { fontSize: '12px', color: '#64748b', marginTop: '6px' } },
      hovered ? `Hovering: vertex ${hovered}` : 'Hover over vertices to highlight connections',
    ),
  );
}

function HypercubeDemo() {
  // Render a small rotating 4D hypercube wireframe
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    let running = true;
    const animate = () => {
      if (!running) return;
      setAngle((a: number) => a + 0.02);
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    return () => { running = false; };
  }, []);

  // Generate 4D hypercube vertices (16 vertices of a tesseract)
  const dim = 4;
  const count = 1 << dim;
  const vertices: [number, number, number, number][] = [];
  for (let i = 0; i < count; i++) {
    vertices.push([
      (i & 1) ? 1 : -1,
      (i & 2) ? 1 : -1,
      (i & 4) ? 1 : -1,
      (i & 8) ? 1 : -1,
    ]);
  }

  // Generate edges (connect vertices that differ by exactly 1 bit)
  const edgePairs: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      const xor = i ^ j;
      if (xor && (xor & (xor - 1)) === 0) edgePairs.push([i, j]);
    }
  }

  // Rotate in the XW and YZ planes
  const cos1 = Math.cos(angle);
  const sin1 = Math.sin(angle);
  const cos2 = Math.cos(angle * 0.7);
  const sin2 = Math.sin(angle * 0.7);

  const project = (v: [number, number, number, number]): [number, number] => {
    // Rotate XW
    const x1 = v[0] * cos1 - v[3] * sin1;
    const w1 = v[0] * sin1 + v[3] * cos1;
    // Rotate YZ
    const y1 = v[1] * cos2 - v[2] * sin2;
    const z1 = v[1] * sin2 + v[2] * cos2;
    // Perspective from 4D to 2D
    const d = 3 / (3 - w1 * 0.3 - z1 * 0.3);
    return [120 + x1 * 40 * d, 80 + y1 * 40 * d];
  };

  const projected = vertices.map(project);
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

  return createElement('svg', { width: '240', height: '160', viewBox: '0 0 240 160', style: { background: '#0f172a', borderRadius: '6px' } },
    // Edges
    ...edgePairs.map(([i, j]) =>
      createElement('line', {
        key: `e${i}-${j}`,
        x1: String(projected[i]![0]), y1: String(projected[i]![1]),
        x2: String(projected[j]![0]), y2: String(projected[j]![1]),
        stroke: '#334155', strokeWidth: '1',
      }),
    ),
    // Vertices
    ...projected.map((p, i) =>
      createElement('circle', {
        key: `v${i}`, cx: String(p[0]), cy: String(p[1]), r: '3',
        fill: colors[i % colors.length]!,
      }),
    ),
  );
}

function ScatterPlotDemo() {
  const points = [
    { x: 20, y: 80 }, { x: 45, y: 55 }, { x: 70, y: 90 }, { x: 90, y: 30 },
    { x: 120, y: 65 }, { x: 150, y: 20 }, { x: 170, y: 50 }, { x: 200, y: 35 },
    { x: 60, y: 40 }, { x: 130, y: 75 }, { x: 180, y: 85 }, { x: 100, y: 100 },
  ];
  const [hovered, setHovered] = useState(-1);

  return createElement('svg', { width: '240', height: '120', viewBox: '0 0 240 120', style: { background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' } },
    // Axes
    createElement('line', { x1: '15', y1: '5', x2: '15', y2: '115', stroke: '#d1d5db', strokeWidth: '1' }),
    createElement('line', { x1: '15', y1: '115', x2: '235', y2: '115', stroke: '#d1d5db', strokeWidth: '1' }),
    // Points
    ...points.map((p, i) =>
      createElement('circle', {
        key: String(i), cx: String(p.x + 15), cy: String(p.y),
        r: hovered === i ? '6' : '4',
        fill: '#3b82f6', opacity: hovered === i ? '1' : '0.7',
        style: { cursor: 'pointer', transition: 'r 0.15s' },
        onMouseEnter: () => setHovered(i),
        onMouseLeave: () => setHovered(-1),
      }),
    ),
  );
}

// ─── Form (additional) ──────────────────────────────────────────────

function ColorPickerDemo() {
  const presets = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  const [color, setColor] = useState(presets[0]!);
  return createElement('div', null,
    createElement('div', { style: { width: '64px', height: '64px', borderRadius: '8px', backgroundColor: color, border: '1px solid #e2e8f0', marginBottom: '8px' } }),
    createElement('p', { style: { fontSize: '13px', color: '#64748b', marginBottom: '8px' } }, color),
    createElement('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap' } },
      ...presets.map(c =>
        createElement('button', {
          key: c,
          onClick: () => setColor(c),
          style: {
            width: '28px', height: '28px', borderRadius: '4px', backgroundColor: c, border: color === c ? '2px solid #0f172a' : '2px solid transparent', cursor: 'pointer', padding: '0',
          },
        }),
      ),
    ),
  );
}

function DatePickerDemo() {
  const [value, setValue] = useState('2026-04-24');
  return createElement('div', null,
    createElement('input', {
      type: 'date', value,
      onInput: (e: Event) => setValue((e.target as HTMLInputElement).value),
      style: { padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', width: '100%' },
    }),
    value ? createElement('p', { style: { fontSize: '13px', color: '#64748b', marginTop: '8px' } }, `Selected: ${value}`) : null,
  );
}

function TimePickerDemo() {
  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(30);
  const [ampm, setAmpm] = useState<'AM' | 'PM'>('AM');
  const sel = { padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', background: '#f8fafc' };
  const toggleStyle = (active: boolean) => ({ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', background: active ? '#3b82f6' : '#f8fafc', color: active ? 'white' : '#0f172a' });
  return createElement('div', null,
    createElement('div', { style: { display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '8px' } },
      createElement('select', { value: String(hour), onChange: (e: Event) => setHour(Number((e.target as HTMLSelectElement).value)), style: sel },
        ...Array.from({ length: 12 }, (_, i) => createElement('option', { key: String(i + 1), value: String(i + 1) }, String(i + 1).padStart(2, '0'))),
      ),
      createElement('span', { style: { fontWeight: '600' } }, ':'),
      createElement('select', { value: String(minute), onChange: (e: Event) => setMinute(Number((e.target as HTMLSelectElement).value)), style: sel },
        ...Array.from({ length: 60 }, (_, i) => createElement('option', { key: String(i), value: String(i) }, String(i).padStart(2, '0'))),
      ),
      createElement('button', { onClick: () => setAmpm('AM'), style: toggleStyle(ampm === 'AM') }, 'AM'),
      createElement('button', { onClick: () => setAmpm('PM'), style: toggleStyle(ampm === 'PM') }, 'PM'),
    ),
    createElement('p', { style: { fontSize: '13px', color: '#64748b' } }, `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${ampm}`),
  );
}

function FileUploadDemo() {
  const [files, setFiles] = useState<string[]>(['document.pdf', 'photo.png']);
  const mockNames = ['report.xlsx', 'notes.txt', 'image.jpg', 'data.csv'];
  const [idx, setIdx] = useState(0);
  const addFile = () => {
    setFiles((prev: string[]) => [...prev, mockNames[idx % mockNames.length]!]);
    setIdx((i: number) => i + 1);
  };
  return createElement('div', null,
    createElement('div', {
      onClick: addFile,
      style: { border: '2px dashed #d1d5db', borderRadius: '8px', padding: '24px', textAlign: 'center', cursor: 'pointer', color: '#64748b', fontSize: '14px', background: '#f8fafc' },
    }, 'Click to upload'),
    files.length > 0
      ? createElement('ul', { style: { listStyle: 'none', padding: '0', marginTop: '8px', fontSize: '13px' } },
          ...files.map((f, i) =>
            createElement('li', { key: `${f}-${i}`, style: { padding: '4px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
              createElement('span', null, f),
              createElement('span', {
                onClick: () => setFiles((prev: string[]) => prev.filter((_, j) => j !== i)),
                style: { cursor: 'pointer', color: '#ef4444', fontSize: '14px' },
              }, '\u00d7'),
            ),
          ),
        )
      : null,
  );
}

function MultilineDemo() {
  const [text, setText] = useState('');
  const maxLen = 200;
  return createElement('div', null,
    createElement('textarea', {
      value: text,
      onInput: (e: Event) => setText((e.target as HTMLTextAreaElement).value),
      placeholder: 'Type your message...',
      style: { width: '100%', minHeight: '80px', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', resize: 'vertical' },
    }),
    createElement('p', { style: { fontSize: '12px', color: text.length > maxLen ? '#ef4444' : '#64748b', marginTop: '4px', textAlign: 'right' } }, `${text.length} / ${maxLen}`),
  );
}

function TextEditorDemo() {
  const [text, setText] = useState('');
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const tbtn = (label: string, active: boolean, toggle: () => void) =>
    createElement('button', {
      onClick: toggle,
      style: { padding: '4px 10px', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: label === 'B' ? '700' : '400', fontStyle: label === 'I' ? 'italic' : 'normal', textDecoration: label === 'U' ? 'underline' : 'none', background: active ? '#3b82f6' : '#f8fafc', color: active ? 'white' : '#0f172a' },
    }, label);
  return createElement('div', null,
    createElement('div', { style: { display: 'flex', gap: '4px', marginBottom: '6px', padding: '4px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' } },
      tbtn('B', bold, () => setBold(!bold)),
      tbtn('I', italic, () => setItalic(!italic)),
      tbtn('U', underline, () => setUnderline(!underline)),
    ),
    createElement('textarea', {
      value: text,
      onInput: (e: Event) => setText((e.target as HTMLTextAreaElement).value),
      placeholder: 'Start typing...',
      style: { width: '100%', minHeight: '64px', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', fontWeight: bold ? '700' : '400', fontStyle: italic ? 'italic' : 'normal', textDecoration: underline ? 'underline' : 'none', resize: 'vertical' },
    }),
  );
}

// ─── Navigation (additional) ────────────────────────────────────────

function DropdownMenuDemo() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const items = ['Profile', 'Settings', 'Help', 'Log out'];
  return createElement('div', { style: { position: 'relative' } },
    createElement('button', {
      onClick: () => setOpen(!open),
      style: { padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', background: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' },
    }, selected || 'Menu', createElement('span', null, open ? '\u25b2' : '\u25bc')),
    open ? createElement('div', { style: { position: 'absolute', top: '100%', left: '0', marginTop: '4px', minWidth: '140px', border: '1px solid #e2e8f0', borderRadius: '6px', background: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', zIndex: '10', overflow: 'hidden' } },
      ...items.map(item =>
        createElement('div', {
          key: item,
          onClick: () => { setSelected(item); setOpen(false); },
          style: { padding: '8px 14px', cursor: 'pointer', fontSize: '14px', borderBottom: '1px solid #f1f5f9' },
        }, item),
      ),
    ) : null,
  );
}

function MenuBarDemo() {
  const [active, setActive] = useState<string | null>(null);
  const menus = ['File', 'Edit', 'View', 'Help'];
  return createElement('div', { style: { display: 'flex', gap: '0', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' } },
    ...menus.map(m =>
      createElement('button', {
        key: m,
        onClick: () => setActive(active === m ? null : m),
        style: { padding: '8px 16px', border: 'none', borderRight: '1px solid #e2e8f0', cursor: 'pointer', fontSize: '14px', background: active === m ? '#3b82f6' : 'transparent', color: active === m ? 'white' : '#0f172a', fontWeight: active === m ? '600' : '400' },
      }, m),
    ),
  );
}

function SidebarDemo() {
  const items = ['Dashboard', 'Projects', 'Messages', 'Settings'];
  const [active, setActive] = useState('Dashboard');
  return createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '2px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px', minWidth: '140px' } },
    ...items.map(item =>
      createElement('button', {
        key: item,
        onClick: () => setActive(item),
        style: { padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', textAlign: 'left', background: active === item ? '#3b82f6' : 'transparent', color: active === item ? 'white' : '#0f172a', fontWeight: active === item ? '600' : '400', borderLeft: active === item ? '3px solid #1d4ed8' : '3px solid transparent' },
      }, item),
    ),
  );
}

function StepperDemo() {
  const steps = ['Details', 'Address', 'Payment', 'Confirm'];
  const [current, setCurrent] = useState(0);
  return createElement('div', null,
    createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '0', marginBottom: '12px' } },
      ...steps.map((step, i) =>
        createElement('div', { key: step, style: { display: 'flex', alignItems: 'center' } },
          createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
            createElement('div', { style: { width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', background: i <= current ? '#3b82f6' : '#e2e8f0', color: i <= current ? 'white' : '#64748b' } }, String(i + 1)),
            createElement('span', { style: { fontSize: '11px', color: i <= current ? '#3b82f6' : '#64748b', marginTop: '4px', whiteSpace: 'nowrap' } }, step),
          ),
          i < steps.length - 1
            ? createElement('div', { style: { width: '24px', height: '2px', background: i < current ? '#3b82f6' : '#e2e8f0', margin: '0 4px', marginBottom: '18px' } })
            : null,
        ),
      ),
    ),
    createElement('div', { style: { display: 'flex', gap: '8px' } },
      createElement('button', {
        onClick: () => setCurrent(Math.max(0, current - 1)),
        disabled: current === 0,
        style: { padding: '6px 14px', border: '1px solid #d1d5db', borderRadius: '6px', cursor: current === 0 ? 'default' : 'pointer', fontSize: '13px', background: '#f8fafc', opacity: current === 0 ? '0.5' : '1' },
      }, 'Back'),
      createElement('button', {
        onClick: () => setCurrent(Math.min(steps.length - 1, current + 1)),
        disabled: current === steps.length - 1,
        style: { padding: '6px 14px', border: 'none', borderRadius: '6px', cursor: current === steps.length - 1 ? 'default' : 'pointer', fontSize: '13px', background: '#3b82f6', color: 'white', opacity: current === steps.length - 1 ? '0.5' : '1' },
      }, 'Next'),
    ),
  );
}

function ToolbarDemo() {
  const [active, setActive] = useState<string[]>([]);
  const toggle = (id: string) => setActive((prev: string[]) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const items = [
    { id: 'bold', label: 'B', fontWeight: '700' },
    { id: 'italic', label: 'I', fontStyle: 'italic' },
    { id: 'underline', label: 'U', textDecoration: 'underline' },
  ];
  return createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '2px', padding: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' } },
    ...items.map(item =>
      createElement('button', {
        key: item.id,
        onClick: () => toggle(item.id),
        style: { padding: '6px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: item.fontWeight || '400', fontStyle: item.fontStyle || 'normal', textDecoration: item.textDecoration || 'none', background: active.includes(item.id) ? '#3b82f6' : 'transparent', color: active.includes(item.id) ? 'white' : '#0f172a' },
      }, item.label),
    ),
    createElement('div', { style: { width: '1px', height: '20px', background: '#e2e8f0', margin: '0 4px' } }),
    createElement('button', { style: { padding: '6px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', background: 'transparent', color: '#3b82f6', textDecoration: 'underline' } }, 'Link'),
  );
}

function TreeNavDemo() {
  const [expanded, setExpanded] = useState<string[]>(['src']);
  const toggle = (id: string) => setExpanded((prev: string[]) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const treeItem = (id: string, label: string, depth: number, children?: ReturnType<typeof createElement>[]) => {
    const hasChildren = children && children.length > 0;
    const isOpen = expanded.includes(id);
    return createElement('div', { key: id },
      createElement('div', {
        onClick: hasChildren ? () => toggle(id) : undefined,
        style: { display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', paddingLeft: `${8 + depth * 16}px`, cursor: hasChildren ? 'pointer' : 'default', fontSize: '14px', borderRadius: '4px' },
      },
        hasChildren
          ? createElement('span', { style: { fontSize: '10px', color: '#64748b', width: '12px' } }, isOpen ? '\u25bc' : '\u25b6')
          : createElement('span', { style: { width: '12px' } }),
        createElement('span', { style: { color: hasChildren ? '#0f172a' : '#64748b' } }, label),
      ),
      hasChildren && isOpen
        ? createElement('div', null, ...children!)
        : null,
    );
  };

  return createElement('div', { style: { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px 0' } },
    treeItem('src', 'src', 0, [
      treeItem('components', 'components', 1, [
        treeItem('button', 'Button.ts', 2),
        treeItem('input', 'Input.ts', 2),
      ]),
      treeItem('hooks', 'hooks', 1, [
        treeItem('useState', 'useState.ts', 2),
        treeItem('useEffect', 'useEffect.ts', 2),
      ]),
      treeItem('index', 'index.ts', 1),
    ]),
    treeItem('tests', 'tests', 0, [
      treeItem('unit', 'unit', 1, [
        treeItem('test1', 'Button.test.ts', 2),
      ]),
    ]),
  );
}

// ─── Data Display (additional) ────────────────────────────────────────
function ListViewDemo() {
  const items = ['Design System', 'Component Library', 'API Reference', 'Testing Guide', 'Deployment'];
  const [selected, setSelected] = useState(0);
  return createElement('div', { style: { border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' } },
    ...items.map((item, i) =>
      createElement('div', {
        key: item,
        onClick: () => setSelected(i),
        style: {
          padding: '10px 14px', fontSize: '14px', cursor: 'pointer',
          backgroundColor: i === selected ? '#eff6ff' : 'transparent',
          borderLeft: i === selected ? '3px solid #3b82f6' : '3px solid transparent',
          borderBottom: i < items.length - 1 ? '1px solid #f1f5f9' : 'none',
        },
      }, item),
    ),
  );
}

function VirtualScrollDemo() {
  const [scrollTop, setScrollTop] = useState(0);
  const itemHeight = 28;
  const containerHeight = 120;
  const totalItems = 1000;
  const startIdx = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(containerHeight / itemHeight) + 1;

  return createElement('div', null,
    createElement('div', {
      style: { height: `${containerHeight}px`, overflow: 'auto', border: '1px solid #e2e8f0', borderRadius: '6px', position: 'relative' },
      onScroll: (e: Event) => setScrollTop((e.target as HTMLElement).scrollTop),
    },
      createElement('div', { style: { height: `${totalItems * itemHeight}px`, position: 'relative' } },
        ...Array.from({ length: Math.min(visibleCount, totalItems - startIdx) }, (_, i) => {
          const idx = startIdx + i;
          return createElement('div', {
            key: String(idx),
            style: { position: 'absolute', top: `${idx * itemHeight}px`, left: '0', right: '0', height: `${itemHeight}px`, padding: '4px 12px', fontSize: '13px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center' },
          }, `Row ${idx + 1} of ${totalItems}`);
        }),
      ),
    ),
    createElement('p', { style: { fontSize: '11px', color: '#94a3b8', marginTop: '4px' } }, `Rendering ${visibleCount} of ${totalItems} items`),
  );
}

// ─── Layout (additional) ──────────────────────────────────────────────
function FlexContainerDemo() {
  const [direction, setDirection] = useState<'row' | 'column'>('row');
  const box = (color: string, label: string) =>
    createElement('div', { key: label, style: { width: '50px', height: '40px', backgroundColor: color, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', fontWeight: '600' } }, label);
  return createElement('div', null,
    createElement('div', { style: { display: 'flex', gap: '6px', marginBottom: '8px' } },
      createElement('button', { onClick: () => setDirection('row'), style: { padding: '3px 10px', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', background: direction === 'row' ? '#3b82f6' : '#f8fafc', color: direction === 'row' ? 'white' : '#0f172a' } }, 'Row'),
      createElement('button', { onClick: () => setDirection('column'), style: { padding: '3px 10px', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', background: direction === 'column' ? '#3b82f6' : '#f8fafc', color: direction === 'column' ? 'white' : '#0f172a' } }, 'Column'),
    ),
    createElement('div', { style: { display: 'flex', flexDirection: direction, gap: '8px', padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' } },
      box('#3b82f6', 'A'), box('#10b981', 'B'), box('#f59e0b', 'C'),
    ),
  );
}

function GridDemo() {
  return createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' } },
    ...Array.from({ length: 6 }, (_, i) =>
      createElement('div', { key: String(i), style: { padding: '16px', textAlign: 'center', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', fontWeight: '600', color: '#64748b' } }, `Cell ${i + 1}`),
    ),
  );
}

function PanelDemo() {
  const [collapsed, setCollapsed] = useState(false);
  return createElement('div', { style: { border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' } },
    createElement('div', {
      onClick: () => setCollapsed(!collapsed),
      style: { padding: '10px 14px', background: '#f8fafc', borderBottom: collapsed ? 'none' : '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', fontWeight: '600' },
    }, 'Panel Header', createElement('span', { style: { fontSize: '10px', color: '#94a3b8' } }, collapsed ? '\u25b6' : '\u25bc')),
    collapsed ? null : createElement('div', { style: { padding: '14px', fontSize: '13px', color: '#64748b' } }, 'Panel content area. Click the header to collapse.'),
  );
}

function ScrollContainerDemo() {
  return createElement('div', { style: { height: '100px', overflow: 'auto', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px 12px', fontSize: '13px', lineHeight: '1.8' } },
    ...Array.from({ length: 12 }, (_, i) =>
      createElement('div', { key: String(i) }, `Scrollable item ${i + 1}`),
    ),
  );
}

function SplitterDemo() {
  const [leftWidth, setLeftWidth] = useState(50);
  return createElement('div', null,
    createElement('div', { style: { display: 'flex', height: '80px', border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' } },
      createElement('div', { style: { width: `${leftWidth}%`, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#3b82f6', fontWeight: '600' } }, `Left (${leftWidth}%)`),
      createElement('div', { style: { width: '4px', background: '#d1d5db', cursor: 'col-resize', flexShrink: '0' } }),
      createElement('div', { style: { flex: '1', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#16a34a', fontWeight: '600' } }, `Right (${100 - leftWidth}%)`),
    ),
    createElement('input', { type: 'range', min: '20', max: '80', value: String(leftWidth), onInput: (e: Event) => setLeftWidth(Number((e.target as HTMLInputElement).value)), style: { width: '100%', marginTop: '8px' } }),
  );
}

function TabsLayoutDemo() {
  const [active, setActive] = useState(0);
  const tabs = ['Content', 'Sidebar', 'Footer'];
  return createElement('div', { style: { border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' } },
    createElement('div', { style: { display: 'flex', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' } },
      ...tabs.map((t, i) =>
        createElement('button', { key: t, onClick: () => setActive(i), style: { padding: '8px 16px', border: 'none', background: i === active ? 'white' : 'transparent', borderBottom: i === active ? '2px solid #3b82f6' : '2px solid transparent', cursor: 'pointer', fontSize: '13px', fontWeight: i === active ? '600' : '400', color: i === active ? '#3b82f6' : '#64748b' } }, t),
      ),
    ),
    createElement('div', { style: { padding: '14px', fontSize: '13px', color: '#64748b', minHeight: '40px' } }, `Layout region: ${tabs[active]}`),
  );
}

// ─── New Graph Components ─────────────────────────────────────────────

function CartesianRoseDemo() {
  // 4-leaf rose: r = cos(2θ) in Cartesian coords
  const [hovered, setHovered] = useState<number | null>(null);
  const samples = 300;
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = (i / samples) * 2 * Math.PI;
    const r = Math.cos(2 * t);
    points.push({ x: r * Math.cos(t), y: r * Math.sin(t) });
  }
  const w = 220;
  const h = 180;
  const scale = 70;
  const cx = w / 2;
  const cy = h / 2;
  const toSvg = (p: { x: number; y: number }) => ({ sx: cx + p.x * scale, sy: cy - p.y * scale });
  const pathD = points.map((p, i) => { const s = toSvg(p); return `${i === 0 ? 'M' : 'L'}${s.sx.toFixed(1)},${s.sy.toFixed(1)}`; }).join(' ');

  return createElement('div', null,
    createElement('svg', { width: String(w), height: String(h), viewBox: `0 0 ${w} ${h}`, style: { background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' } },
      createElement('line', { x1: '0', y1: String(cy), x2: String(w), y2: String(cy), stroke: '#d1d5db', strokeWidth: '1' }),
      createElement('line', { x1: String(cx), y1: '0', x2: String(cx), y2: String(h), stroke: '#d1d5db', strokeWidth: '1' }),
      createElement('path', { d: pathD, fill: 'none', stroke: '#3b82f6', strokeWidth: '2' }),
      ...points.filter((_, i) => i % 15 === 0).map((p, i) => {
        const s = toSvg(p);
        return createElement('circle', {
          key: String(i), cx: String(s.sx), cy: String(s.sy), r: hovered === i ? '5' : '3',
          fill: '#3b82f6', style: { cursor: 'pointer' },
          onMouseEnter: () => setHovered(i),
          onMouseLeave: () => setHovered(null),
        });
      }),
    ),
    createElement('p', { style: { fontSize: '11px', color: '#94a3b8', marginTop: '4px' } }, 'r = cos(2\u03b8) — 4-leaf rose, pan/zoom supported'),
  );
}

function MandelbrotDemo() {
  const [info, setInfo] = useState('Hover to see coordinates');
  const w = 220;
  const h = 160;
  const reMin = -2.2;
  const reMax = 0.8;
  const imMin = -1.2;
  const imMax = 1.2;
  const maxIter = 50;

  // Generate pixel data as colored divs (canvas not available in createElement)
  const resolution = 4;
  const cols = Math.floor(w / resolution);
  const rows = Math.floor(h / resolution);
  const pixels: { x: number; y: number; color: string; re: number; im: number }[] = [];

  for (let py = 0; py < rows; py++) {
    for (let px = 0; px < cols; px++) {
      const re = reMin + (px / cols) * (reMax - reMin);
      const im = imMin + (py / rows) * (imMax - imMin);
      let zr = 0;
      let zi = 0;
      let iter = 0;
      while (zr * zr + zi * zi <= 4 && iter < maxIter) {
        const tmp = zr * zr - zi * zi + re;
        zi = 2 * zr * zi + im;
        zr = tmp;
        iter++;
      }
      const hue = iter === maxIter ? 0 : Math.round((iter / maxIter) * 270);
      const color = iter === maxIter ? '#000' : `hsl(${hue}, 80%, 50%)`;
      pixels.push({ x: px * resolution, y: py * resolution, color, re, im });
    }
  }

  return createElement('div', null,
    createElement('div', {
      style: { width: `${w}px`, height: `${h}px`, position: 'relative', borderRadius: '6px', overflow: 'hidden', border: '1px solid #e2e8f0' },
    },
      ...pixels.map((p, i) =>
        createElement('div', {
          key: String(i),
          style: { position: 'absolute', left: `${p.x}px`, top: `${p.y}px`, width: `${resolution}px`, height: `${resolution}px`, backgroundColor: p.color },
          onMouseEnter: () => setInfo(`z = ${p.re.toFixed(3)} + ${p.im.toFixed(3)}i`),
        }),
      ),
    ),
    createElement('p', { style: { fontSize: '11px', color: '#94a3b8', marginTop: '4px' } }, info),
  );
}

function PolarRoseDemo() {
  const [hovered, setHovered] = useState<number | null>(null);
  const samples = 270;
  const w = 220;
  const h = 200;
  const cx = w / 2;
  const cy = h / 2;
  const scale = 70;

  const points: { x: number; y: number; r: number; theta: number }[] = [];
  for (let i = 0; i <= samples; i++) {
    const theta = (i / samples) * 2 * Math.PI;
    const r = Math.cos(3 * theta);
    points.push({ x: cx + r * Math.cos(theta) * scale, y: cy - r * Math.sin(theta) * scale, r, theta });
  }

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  // Concentric circles
  const circles = [0.25, 0.5, 0.75, 1.0];

  return createElement('div', null,
    createElement('svg', { width: String(w), height: String(h), viewBox: `0 0 ${w} ${h}`, style: { background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' } },
      // Grid circles
      ...circles.map(r =>
        createElement('circle', { key: String(r), cx: String(cx), cy: String(cy), r: String(r * scale), fill: 'none', stroke: '#e2e8f0', strokeWidth: '1' }),
      ),
      // Axis lines
      createElement('line', { x1: '0', y1: String(cy), x2: String(w), y2: String(cy), stroke: '#d1d5db', strokeWidth: '1' }),
      createElement('line', { x1: String(cx), y1: '0', x2: String(cx), y2: String(h), stroke: '#d1d5db', strokeWidth: '1' }),
      // Curve
      createElement('path', { d: pathD, fill: 'none', stroke: '#8b5cf6', strokeWidth: '2' }),
      // Sample points
      ...points.filter((_, i) => i % 13 === 0).map((p, i) =>
        createElement('circle', {
          key: `p${i}`, cx: String(p.x), cy: String(p.y), r: hovered === i ? '5' : '3',
          fill: '#8b5cf6', style: { cursor: 'pointer' },
          onMouseEnter: () => setHovered(i),
          onMouseLeave: () => setHovered(null),
        }),
      ),
    ),
    createElement('p', { style: { fontSize: '11px', color: '#94a3b8', marginTop: '4px' } }, 'r = cos(3\u03b8) — 3-leaf rose, polar coordinates'),
  );
}
