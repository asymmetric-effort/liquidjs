import { createElement } from 'liquidjs';
import { useState, useCallback, useEffect, useRef, useHead } from 'liquidjs/hooks';

function preview(title: string, comp: () => ReturnType<typeof createElement>) {
  return createElement(PreviewCard, { title, component: comp });
}

function PreviewCard(props: { title: string; component: () => ReturnType<typeof createElement> }) {
  const [collapsed, setCollapsed] = useState(false);
  return createElement(
    'div',
    { className: 'preview-card' },
    createElement(
      'div',
      {
        className: 'preview-header',
        onDblClick: () => setCollapsed(!collapsed),
        style: { cursor: 'pointer', userSelect: 'none' },
      },
      props.title,
      createElement('span', { style: { float: 'right', fontSize: '10px', color: '#94a3b8' } }, collapsed ? '\u25b6' : '\u25bc'),
    ),
    collapsed ? null : createElement('div', { className: 'preview-body' }, createElement(props.component, null)),
  );
}

export function ComponentsGallery() {
  useHead({
    title: 'Component Gallery — LiquidJS',
    description: 'Live interactive previews of 80+ LiquidJS components: forms, data display, charts, visualizations.',
    keywords: 'liquidjs, components, gallery, visualization, charts, forms, interactive',
    author: 'Asymmetric Effort, LLC',
  });

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
    accordionSection('Form Components', '17 components', openSection, toggle, [
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
      preview('Sign Up Form', SignUpFormDemo),
      preview('Settings Panel', SettingsPanelDemo),
      preview('Search Suggestions', SearchSuggestionsDemo),
      preview('Multi-Step Wizard', MultiStepWizardDemo),
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
    accordionSection('Charts & Graphs', '12 components', openSection, toggle, [
      preview('Bar Graph', BarGraphDemo),
      preview('Line Graph', LineGraphDemo),
      preview('Time-Series', TimeSeriesDemo),
      preview('Pie Chart', PieChartDemo),
      preview('Donut Chart', DonutChartDemo),
      preview('Histogram', HistogramDemo),
      preview('Box Plot', BoxPlotDemo),
      preview('Scatter Plot', ScatterPlotDemo),
      preview('Bubble Chart', BubbleChartDemo),
      preview('Lollipop Chart', LollipopDemo),
      preview('Waterfall Chart', WaterfallDemo),
      preview('Funnel Chart', FunnelDemo),
    ]),
    accordionSection('Data & Analytics', '9 components', openSection, toggle, [
      preview('Heat Map', HeatMapDemo),
      preview('Calendar Heat Map', CalendarHeatMapDemo),
      preview('Gauge', GaugeDemo),
      preview('Radar Chart', RadarDemo),
      preview('Big Number', BigNumberDemo),
      preview('Word Cloud', WordCloudDemo),
      preview('Pivot Table', PivotTableDemo),
      preview('Matrix', MatrixDemo),
      preview('Gantt Chart', GanttDemo),
    ]),
    accordionSection('Hierarchical & Relational', '9 components', openSection, toggle, [
      preview('Tree Map', TreeMapDemo),
      preview('Sunburst', SunburstDemo),
      preview('Sankey Diagram', SankeyDemo),
      preview('Chord Diagram', ChordDemo),
      preview('Force-Directed Graph', ForceGraphDemo),
      preview('Partition Diagram', PartitionDemo),
      preview('Decomposition Tree', DecompositionTreeDemo),
      preview('Geospatial Map', GeoMapDemo),
      preview('Vector Field', VectorFieldDemo),
    ]),
    accordionSection('Mathematical', '3 components', openSection, toggle, [
      preview('Cartesian Graph (4-leaf Rose)', CartesianRoseDemo),
      preview('Complex Plane (Mandelbrot)', MandelbrotDemo),
      preview('Polar Graph (3-leaf Rose)', PolarRoseDemo),
    ]),
    accordionSection('3D & Advanced', '2 components', openSection, toggle, [
      preview('Hypercube (4D)', HypercubeDemo),
      preview('3D Layers', ThreeDLayersDemo),
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
  // Force-directed graph with physics simulation
  const initNodes = () => [
    { id: 'A', x: 80, y: 50, vx: 0, vy: 0, locked: false, color: '#3b82f6' },
    { id: 'B', x: 160, y: 40, vx: 0, vy: 0, locked: false, color: '#10b981' },
    { id: 'C', x: 200, y: 110, vx: 0, vy: 0, locked: false, color: '#f59e0b' },
    { id: 'D', x: 120, y: 130, vx: 0, vy: 0, locked: false, color: '#ef4444' },
    { id: 'E', x: 40, y: 110, vx: 0, vy: 0, locked: false, color: '#8b5cf6' },
  ];
  const edgePairs = [['A','B'],['B','C'],['C','D'],['D','E'],['E','A'],['A','C'],['B','D']];
  const [nodes, setNodes] = useState(initNodes);
  const [hovered, setHovered] = useState<string | null>(null);
  const draggingRef = useRef<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const w = 240, h = 160, cx = w / 2, cy = h / 2;

  // Physics simulation
  useEffect(() => {
    let running = true;
    const step = () => {
      if (!running) return;
      setNodes((prev: typeof nodes) => {
        const next = prev.map(n => ({ ...n }));
        for (let i = 0; i < next.length; i++) {
          if (next[i]!.locked) continue;
          let fx = 0, fy = 0;
          // Repulsion between all nodes
          for (let j = 0; j < next.length; j++) {
            if (i === j) continue;
            const dx = next[i]!.x - next[j]!.x, dy = next[i]!.y - next[j]!.y;
            const d = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
            const f = 800 / (d * d);
            fx += (dx / d) * f; fy += (dy / d) * f;
          }
          // Attraction along edges
          for (const [a, b] of edgePairs) {
            const ni = next[i]!;
            if (ni.id !== a && ni.id !== b) continue;
            const other = next.find(n => n.id === (ni.id === a ? b : a))!;
            const dx = other.x - ni.x, dy = other.y - ni.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            const f = (d - 60) * 0.02;
            fx += (dx / Math.max(d, 1)) * f; fy += (dy / Math.max(d, 1)) * f;
          }
          // Center gravity
          fx += (cx - next[i]!.x) * 0.005; fy += (cy - next[i]!.y) * 0.005;
          next[i]!.vx = (next[i]!.vx + fx) * 0.8; next[i]!.vy = (next[i]!.vy + fy) * 0.8;
          next[i]!.x = Math.max(12, Math.min(w - 12, next[i]!.x + next[i]!.vx));
          next[i]!.y = Math.max(12, Math.min(h - 12, next[i]!.y + next[i]!.vy));
        }
        return next;
      });
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    return () => { running = false; };
  }, []);

  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const lockNode = (id: string) => setNodes((prev: typeof nodes) => prev.map(n => n.id === id ? { ...n, locked: !n.locked } : n));

  const getSvgPoint = (e: Event): { x: number; y: number } => {
    const me = e as MouseEvent;
    const svg = svgRef.current;
    if (!svg) return { x: me.clientX, y: me.clientY };
    const rect = (svg as unknown as Element).getBoundingClientRect();
    return { x: me.clientX - rect.left, y: me.clientY - rect.top };
  };
  const handleMouseDown = (id: string) => { draggingRef.current = id; setNodes((prev: typeof nodes) => prev.map(n => n.id === id ? { ...n, locked: true, vx: 0, vy: 0 } : n)); };
  const handleMouseMove = (e: Event) => {
    if (!draggingRef.current) return;
    const pt = getSvgPoint(e);
    const id = draggingRef.current;
    setNodes((prev: typeof nodes) => prev.map(n => n.id === id ? { ...n, x: Math.max(12, Math.min(w - 12, pt.x)), y: Math.max(12, Math.min(h - 12, pt.y)) } : n));
  };
  const handleMouseUp = () => { draggingRef.current = null; };

  return createElement('div', null,
    createElement('svg', { ref: svgRef, width: String(w), height: String(h), viewBox: `0 0 ${w} ${h}`, style: { background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', cursor: draggingRef.current ? 'grabbing' : 'default' }, onMouseMove: handleMouseMove, onMouseUp: handleMouseUp, onMouseLeave: handleMouseUp },
      ...edgePairs.map(([from, to]) => {
        const f = nodeMap.get(from!)!, t = nodeMap.get(to!)!;
        return createElement('line', { key: `${from}-${to}`, x1: String(f.x), y1: String(f.y), x2: String(t.x), y2: String(t.y), stroke: hovered === from || hovered === to ? '#0f172a' : '#94a3b8', strokeWidth: hovered === from || hovered === to ? '2' : '1.5' });
      }),
      ...nodes.map(n => createElement('g', { key: n.id },
        createElement('circle', {
          cx: String(n.x), cy: String(n.y), r: hovered === n.id ? '12' : '10',
          fill: n.color, stroke: n.locked ? '#0f172a' : '#fff', strokeWidth: n.locked ? '3' : '2',
          style: { cursor: draggingRef.current === n.id ? 'grabbing' : 'grab' },
          onMouseDown: () => handleMouseDown(n.id),
          onDblClick: () => lockNode(n.id),
          onMouseEnter: () => setHovered(n.id),
          onMouseLeave: () => setHovered(null),
        }),
        createElement('text', { x: String(n.x), y: String(n.y + 4), textAnchor: 'middle', fill: '#fff', fontSize: '10', fontWeight: '700', style: { pointerEvents: 'none' } }, n.id),
      )),
    ),
    createElement('p', { style: { fontSize: '12px', color: '#64748b', marginTop: '6px' } },
      hovered ? `Vertex ${hovered}${nodeMap.get(hovered)?.locked ? ' (locked)' : ''} — drag to move, dblclick to lock/unlock` : 'Drag vertices to reposition — double-click to lock',
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
  const [files, setFiles] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFiles = (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (input.files) {
      const names = Array.from(input.files).map((f: File) => f.name);
      setFiles((prev: string[]) => [...prev, ...names]);
    }
    input.value = '';
  };
  return createElement('div', null,
    createElement('input', {
      ref: inputRef,
      type: 'file',
      multiple: true,
      onChange: handleFiles,
      style: { display: 'none' },
    }),
    createElement('div', {
      onClick: () => inputRef.current?.click(),
      style: { border: '2px dashed #d1d5db', borderRadius: '8px', padding: '24px', textAlign: 'center', cursor: 'pointer', color: '#64748b', fontSize: '14px', background: '#f8fafc' },
    }, files.length === 0 ? 'Click to select files' : 'Click to add more files'),
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
  const editorRef = useRef<HTMLDivElement>(null);
  const execCmd = (cmd: string, val?: string) => { document.execCommand(cmd, false, val); editorRef.current?.focus(); };
  const tbtn = (label: string, cmd: string, title?: string) =>
    createElement('button', { onMouseDown: (e: Event) => e.preventDefault(), onClick: () => execCmd(cmd), title: title ?? cmd, style: { padding: '2px 7px', border: '1px solid #d1d5db', borderRadius: '3px', cursor: 'pointer', fontSize: '12px', fontWeight: label === 'B' ? '700' : '400', fontStyle: label === 'I' ? 'italic' : 'normal', textDecoration: label === 'U' ? 'underline' : label === 'S' ? 'line-through' : 'none', background: '#f8fafc', color: '#0f172a', lineHeight: '1.4' } }, label);
  const ibtn = (icon: string, action: () => void, title: string) =>
    createElement('button', { onMouseDown: (e: Event) => e.preventDefault(), onClick: action, title, style: { padding: '2px 6px', border: '1px solid #d1d5db', borderRadius: '3px', cursor: 'pointer', fontSize: '14px', background: '#f8fafc', lineHeight: '1' } }, icon);
  const sep = () => createElement('div', { style: { width: '1px', background: '#d1d5db', margin: '0 2px', alignSelf: 'stretch' } });
  const fonts = ['Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Garamond', 'Courier New', 'Lucida Console', 'Monaco', 'Verdana', 'Trebuchet MS', 'Palatino', 'Impact', 'Comic Sans MS', 'Tahoma', 'Segoe UI', 'system-ui', 'sans-serif', 'serif', 'monospace', 'cursive', 'fantasy'];
  const sizes = ['1','2','3','4','5','6','7'];
  const insertLink = () => { const url = prompt('Enter URL:'); if (url) execCmd('createLink', url); };
  const insertImage = () => { const url = prompt('Enter image URL:'); if (url) execCmd('insertImage', url); };
  const insertCode = () => { const sel = window.getSelection(); if (sel && sel.rangeCount > 0) { const range = sel.getRangeAt(0); const code = document.createElement('pre'); code.style.cssText = 'background:#1e293b;color:#e2e8f0;padding:8px 12px;border-radius:6px;font-family:monospace;font-size:13px;overflow-x:auto;white-space:pre'; code.textContent = range.toString() || 'code block'; range.deleteContents(); range.insertNode(code); } };
  const insertMath = () => { const tex = prompt('Enter LaTeX (e.g. x^2 + y^2 = r^2):'); if (tex) { const span = document.createElement('span'); span.style.cssText = 'font-family:serif;font-style:italic;background:#f5f3ff;padding:2px 6px;border-radius:3px;color:#6366f1;border:1px solid #e0e7ff'; span.textContent = tex.replace(/\^(\w+)/g, '\u02e2\u1d58\u1d56').replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1/$2)').replace(/\\sqrt\{([^}]+)\}/g, '\u221a($1)'); span.title = `LaTeX: ${tex}`; const sel = window.getSelection(); if (sel && sel.rangeCount > 0) { sel.getRangeAt(0).insertNode(span); } } };
  const handlePaste = (e: Event) => {
    const ce = e as ClipboardEvent;
    if (ce.clipboardData) {
      const items = ce.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item && item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) { const reader = new FileReader(); reader.onload = () => { execCmd('insertImage', reader.result as string); }; reader.readAsDataURL(file); }
          return;
        }
      }
    }
  };

  return createElement('div', null,
    // Toolbar row 1: formatting
    createElement('div', { style: { display: 'flex', gap: '3px', marginBottom: '2px', padding: '4px', background: '#f8fafc', borderRadius: '6px 6px 0 0', border: '1px solid #e2e8f0', borderBottom: 'none', flexWrap: 'wrap', alignItems: 'center' } },
      tbtn('B', 'bold', 'Bold'), tbtn('I', 'italic', 'Italic'), tbtn('U', 'underline', 'Underline'), tbtn('S', 'strikeThrough', 'Strikethrough'),
      sep(),
      createElement('select', { onMouseDown: (e: Event) => e.preventDefault(), onChange: (e: Event) => execCmd('fontSize', (e.target as HTMLSelectElement).value), title: 'Font size', style: { padding: '1px 2px', border: '1px solid #d1d5db', borderRadius: '3px', fontSize: '11px', cursor: 'pointer' } },
        ...sizes.map(s => createElement('option', { key: s, value: s }, `Size ${s}`)),
      ),
      createElement('select', { onMouseDown: (e: Event) => e.preventDefault(), onChange: (e: Event) => execCmd('fontName', (e.target as HTMLSelectElement).value), title: 'Font family', style: { padding: '1px 2px', border: '1px solid #d1d5db', borderRadius: '3px', fontSize: '11px', cursor: 'pointer', maxWidth: '100px' } },
        ...fonts.map(f => createElement('option', { key: f, value: f, style: { fontFamily: f } }, f)),
      ),
      sep(),
      createElement('input', { type: 'color', value: '#000000', onInput: (e: Event) => execCmd('foreColor', (e.target as HTMLInputElement).value), title: 'Text color', style: { width: '22px', height: '20px', border: 'none', cursor: 'pointer', padding: '0' } }),
      createElement('input', { type: 'color', value: '#ffff00', onInput: (e: Event) => execCmd('hiliteColor', (e.target as HTMLInputElement).value), title: 'Highlight color', style: { width: '22px', height: '20px', border: 'none', cursor: 'pointer', padding: '0' } }),
    ),
    // Toolbar row 2: insert
    createElement('div', { style: { display: 'flex', gap: '3px', marginBottom: '6px', padding: '4px', background: '#f8fafc', borderRadius: '0 0 6px 6px', border: '1px solid #e2e8f0', flexWrap: 'wrap', alignItems: 'center' } },
      ibtn('\ud83d\udd17', insertLink, 'Insert link'),
      ibtn('\ud83d\uddbc', insertImage, 'Insert image'),
      ibtn('\u2328', insertCode, 'Code block'),
      ibtn('\u03a3', insertMath, 'LaTeX math'),
      sep(),
      ibtn('\u2190', () => execCmd('undo'), 'Undo'),
      ibtn('\u2192', () => execCmd('redo'), 'Redo'),
      sep(),
      ibtn('\u2261', () => execCmd('justifyLeft'), 'Align left'),
      ibtn('\u2263', () => execCmd('justifyCenter'), 'Center'),
      ibtn('\u2262', () => execCmd('justifyRight'), 'Align right'),
      sep(),
      ibtn('\u2022', () => execCmd('insertUnorderedList'), 'Bullet list'),
      ibtn('1.', () => execCmd('insertOrderedList'), 'Numbered list'),
    ),
    // Editor area
    createElement('div', {
      ref: editorRef,
      contentEditable: 'true',
      onPaste: handlePaste,
      dangerouslySetInnerHTML: { __html: 'Select <b>text</b> and format with the toolbar. Try <i>fonts</i>, <span style="color:#3b82f6">colors</span>, <s>strikethrough</s>, <a href="#">links</a>, images, <pre style="background:#1e293b;color:#e2e8f0;padding:4px 8px;border-radius:4px;display:inline;font-size:12px">code</pre>, and <span style="font-family:serif;font-style:italic;color:#6366f1;background:#f5f3ff;padding:1px 4px;border-radius:2px">x\u00b2 + y\u00b2 = r\u00b2</span> math.' },
      style: { width: '100%', minHeight: '120px', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none', lineHeight: '1.7', cursor: 'text', overflowY: 'auto', maxHeight: '300px' },
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
  const [open, setOpen] = useState<string | null>(null);
  const menus: Record<string, string[]> = {
    File: ['New', 'Open', 'Save', 'Export'],
    Edit: ['Undo', 'Redo', 'Cut', 'Copy', 'Paste'],
    View: ['Zoom In', 'Zoom Out', 'Full Screen'],
    Help: ['Documentation', 'About'],
  };
  return createElement('div', { style: { position: 'relative', display: 'flex', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'visible' } },
    ...Object.keys(menus).map(m =>
      createElement('div', { key: m, style: { position: 'relative' },
        onMouseEnter: () => setOpen(m),
        onMouseLeave: () => setOpen(null),
      },
        createElement('button', {
          style: { padding: '8px 16px', border: 'none', borderRight: '1px solid #e2e8f0', cursor: 'pointer', fontSize: '14px', background: open === m ? '#3b82f6' : 'transparent', color: open === m ? 'white' : '#0f172a', fontWeight: open === m ? '600' : '400' },
        }, m),
        open === m ? createElement('div', {
          style: { position: 'absolute', top: '100%', left: '0', background: 'white', border: '1px solid #e2e8f0', borderRadius: '0 0 6px 6px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: '10', minWidth: '120px' },
        },
          ...menus[m]!.map(item =>
            createElement('div', { key: item, style: { padding: '6px 14px', fontSize: '13px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' },
              onMouseEnter: (e: Event) => { (e.target as HTMLElement).style.background = '#f1f5f9'; },
              onMouseLeave: (e: Event) => { (e.target as HTMLElement).style.background = 'transparent'; },
            }, item),
          ),
        ) : null,
      ),
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
  const [hovered, setHovered] = useState<string | null>(null);
  const toggle = (id: string) => setActive((prev: string[]) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const icons: { id: string; icon: string; tooltip: string }[] = [
    { id: 'home', icon: '\u2302', tooltip: 'Home' },
    { id: 'search', icon: '\ud83d\udd0d', tooltip: 'Search' },
    { id: 'save', icon: '\ud83d\udcbe', tooltip: 'Save' },
    { id: 'undo', icon: '\u21a9', tooltip: 'Undo' },
    { id: 'redo', icon: '\u21aa', tooltip: 'Redo' },
    { id: 'copy', icon: '\ud83d\udccb', tooltip: 'Copy' },
    { id: 'delete', icon: '\ud83d\uddd1', tooltip: 'Delete' },
    { id: 'settings', icon: '\u2699', tooltip: 'Settings' },
  ];
  const ibtn = (item: typeof icons[0]) =>
    createElement('button', {
      key: item.id, onClick: () => toggle(item.id),
      onMouseEnter: () => setHovered(item.id),
      onMouseLeave: () => setHovered(null),
      title: item.tooltip,
      style: { padding: '6px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', background: active.includes(item.id) ? '#3b82f6' : hovered === item.id ? '#e2e8f0' : 'transparent', color: active.includes(item.id) ? 'white' : '#0f172a', transition: 'background 0.1s', lineHeight: '1' },
    }, item.icon);
  const sep = () => createElement('div', { style: { width: '1px', height: '24px', background: '#e2e8f0', margin: '0 4px' } });
  return createElement('div', null,
    createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '2px', padding: '4px 6px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' } },
      ibtn(icons[0]!), ibtn(icons[1]!), ibtn(icons[2]!),
      sep(),
      ibtn(icons[3]!), ibtn(icons[4]!), ibtn(icons[5]!),
      sep(),
      ibtn(icons[6]!), ibtn(icons[7]!),
    ),
    createElement('p', { style: { fontSize: '11px', color: '#94a3b8', marginTop: '6px' } },
      hovered ? `${icons.find(i => i.id === hovered)?.tooltip}` : 'Hover for tooltip — click to toggle',
    ),
  );
}

function TreeNavDemo() {
  const [expanded, setExpanded] = useState<string[]>(['src']);
  const [event, setEvent] = useState('');
  const toggle = (id: string) => setExpanded((prev: string[]) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const treeItem = (id: string, label: string, depth: number, children?: ReturnType<typeof createElement>[]) => {
    const hasChildren = children && children.length > 0;
    const isOpen = expanded.includes(id);
    return createElement('div', { key: id },
      createElement('div', {
        onClick: () => { if (hasChildren) toggle(id); setEvent(`click: ${label}`); },
        onDblClick: () => setEvent(`dblclick: ${label}`),
        onContextMenu: (e: Event) => { e.preventDefault(); setEvent(`right-click: ${label}`); },
        onMouseEnter: () => setEvent(`hover: ${label}`),
        style: { display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', paddingLeft: `${8 + depth * 16}px`, cursor: 'pointer', fontSize: '14px', borderRadius: '4px' },
      },
        hasChildren
          ? createElement('span', { style: { fontSize: '10px', color: '#64748b', width: '12px' } }, isOpen ? '\u25bc' : '\u25b6')
          : createElement('span', { style: { width: '12px', fontSize: '10px', color: '#94a3b8' } }, '\u25cf'),
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
    event ? createElement('p', { style: { fontSize: '11px', color: '#3b82f6', marginTop: '6px', padding: '0 8px' } }, `Event: ${event}`) : null,
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

// ─── Interactive Forms (copied from interactive-forms.ts) ─────────────

function formInputStyle() {
  return { padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', width: '100%', outline: 'none', boxSizing: 'border-box' as const };
}

function formBtnStyle() {
  return { padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', backgroundColor: '#f8fafc' };
}

function formField(label: string, value: string, onChange: (v: string) => void, error: string | undefined, type: string, placeholder: string) {
  return createElement('div', null,
    createElement('label', { style: { fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '4px' } }, label),
    createElement('input', {
      type, value, placeholder,
      onInput: (e: Event) => onChange((e.target as HTMLInputElement).value),
      style: { ...formInputStyle(), borderColor: error ? '#ef4444' : '#d1d5db' },
    }),
    error ? createElement('p', { style: { fontSize: '12px', color: '#ef4444', marginTop: '2px' } }, error) : null,
  );
}

function formToggleRow(label: string, on: boolean, onClick: () => void) {
  return createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
    createElement('span', { style: { fontSize: '14px' } }, label),
    createElement('div', { className: 'demo-toggle', onClick },
      createElement('div', { className: `demo-toggle-track ${on ? 'on' : ''}` },
        createElement('div', { className: 'demo-toggle-thumb' }),
      ),
    ),
  );
}

function SignUpFormDemo() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(() => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!email.includes('@')) e.email = 'Valid email required';
    return e;
  }, [name, email]);

  const handleSubmit = useCallback(() => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) setSubmitted(true);
  }, [validate]);

  if (submitted) {
    return createElement('div', { style: { textAlign: 'center', padding: '20px' } },
      createElement('div', { style: { fontSize: '24px', marginBottom: '8px' } }, '\u2705'),
      createElement('p', { style: { fontWeight: '600' } }, `Welcome, ${name}!`),
      createElement('button', {
        onClick: () => { setSubmitted(false); setName(''); setEmail(''); },
        style: formBtnStyle(),
      }, 'Reset'),
    );
  }

  return createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px' } },
    formField('Name', name, (v: string) => setName(v), errors.name, 'text', 'Your name'),
    formField('Email', email, (v: string) => setEmail(v), errors.email, 'email', 'you@example.com'),
    createElement('button', { onClick: handleSubmit, style: { ...formBtnStyle(), backgroundColor: '#3b82f6', color: 'white', border: 'none' } }, 'Sign Up'),
  );
}

function SettingsPanelDemo() {
  const [dark, setDark] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [fontSize, setFontSize] = useState(14);

  return createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px' } },
    formToggleRow('Dark Mode', dark, () => setDark(!dark)),
    formToggleRow('Notifications', notifications, () => setNotifications(!notifications)),
    createElement('div', null,
      createElement('label', { style: { fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '4px' } }, `Font Size: ${fontSize}px`),
      createElement('input', {
        type: 'range', min: '10', max: '24', value: String(fontSize),
        onInput: (e: Event) => setFontSize(Number((e.target as HTMLInputElement).value)),
        style: { width: '100%' },
      }),
    ),
    createElement('div', {
      style: {
        padding: '12px',
        borderRadius: '6px',
        fontSize: `${fontSize}px`,
        background: dark ? '#1e293b' : '#f8fafc',
        color: dark ? '#e2e8f0' : '#0f172a',
        border: '1px solid #e2e8f0',
      },
    }, `Preview text at ${fontSize}px`),
  );
}

function SearchSuggestionsDemo() {
  const items = ['React', 'LiquidJS', 'Vue', 'Angular', 'Svelte', 'Solid', 'Preact', 'Lit', 'Qwik', 'Astro'];
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('');

  const matches = query.length > 0
    ? items.filter(i => i.toLowerCase().includes(query.toLowerCase()))
    : [];

  return createElement('div', null,
    createElement('input', {
      type: 'text', value: query, placeholder: 'Search frameworks...',
      onInput: (e: Event) => { setQuery((e.target as HTMLInputElement).value); setSelected(''); },
      style: formInputStyle(),
    }),
    matches.length > 0 && !selected
      ? createElement('ul', { style: { listStyle: 'none', border: '1px solid #e2e8f0', borderRadius: '0 0 6px 6px', borderTop: 'none', maxHeight: '120px', overflowY: 'auto' } },
          ...matches.map(m =>
            createElement('li', {
              key: m,
              onClick: () => { setSelected(m); setQuery(m); },
              style: { padding: '6px 12px', cursor: 'pointer', fontSize: '13px', borderBottom: '1px solid #f1f5f9' },
            }, m),
          ),
        )
      : null,
    selected
      ? createElement('p', { style: { fontSize: '13px', color: '#16a34a', marginTop: '8px' } }, `Selected: ${selected}`)
      : null,
  );
}

function MultiStepWizardDemo() {
  const [step, setStep] = useState(0);
  const steps = ['Account', 'Profile', 'Confirm'];

  const stepIndicator = createElement('div', { style: { display: 'flex', gap: '4px', marginBottom: '16px' } },
    ...steps.map((s, i) =>
      createElement('div', {
        key: s,
        style: {
          flex: '1', height: '4px', borderRadius: '2px',
          backgroundColor: i <= step ? '#3b82f6' : '#e2e8f0',
          transition: 'background-color 0.2s',
        },
      }),
    ),
  );

  const content = createElement('div', { style: { textAlign: 'center', padding: '16px 0', fontSize: '14px', color: '#64748b' } },
    `Step ${step + 1}: ${steps[step]}`,
  );

  return createElement('div', null,
    stepIndicator,
    content,
    createElement('div', { style: { display: 'flex', gap: '8px', justifyContent: 'center' } },
      step > 0
        ? createElement('button', { onClick: () => setStep(step - 1), style: formBtnStyle() }, 'Back')
        : null,
      step < steps.length - 1
        ? createElement('button', { onClick: () => setStep(step + 1), style: { ...formBtnStyle(), backgroundColor: '#3b82f6', color: 'white', border: 'none' } }, 'Next')
        : createElement('button', { onClick: () => setStep(0), style: { ...formBtnStyle(), backgroundColor: '#16a34a', color: 'white', border: 'none' } }, 'Finish'),
    ),
  );
}

// ─── Visualization Demos ────────────────────────────────────────────

function TimeSeriesDemo() {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const values = [32, 45, 38, 62, 55, 78, 85, 72, 90, 68, 54, 42];
  const [hovered, setHovered] = useState(-1);
  const w = 280, h = 120, pad = 25;
  const max = Math.max(...values);
  const stepX = (w - pad * 2) / (values.length - 1);

  const pathD = values.map((v, i) => {
    const x = pad + i * stepX;
    const y = h - pad - (v / max) * (h - pad * 2);
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');

  return createElement('svg', { width: String(w), height: String(h + 20), viewBox: `0 0 ${w} ${h + 20}`, style: { background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' } },
    createElement('line', { x1: String(pad), y1: String(h - pad), x2: String(w - pad), y2: String(h - pad), stroke: '#d1d5db', strokeWidth: '1' }),
    createElement('path', { d: pathD, fill: 'none', stroke: '#3b82f6', strokeWidth: '2' }),
    ...values.map((v, i) => {
      const x = pad + i * stepX;
      const y = h - pad - (v / max) * (h - pad * 2);
      return createElement('g', { key: String(i) },
        createElement('circle', {
          cx: String(x), cy: String(y), r: hovered === i ? '5' : '3',
          fill: '#3b82f6', opacity: hovered === i ? '1' : '0.7',
          style: { cursor: 'pointer', transition: 'r 0.15s' },
          onMouseEnter: () => setHovered(i),
          onMouseLeave: () => setHovered(-1),
        }),
        createElement('text', { x: String(x), y: String(h - 8), textAnchor: 'middle', fontSize: '8', fill: '#64748b' }, months[i]),
        hovered === i
          ? createElement('text', { x: String(x), y: String(y - 10), textAnchor: 'middle', fontSize: '10', fill: '#0f172a', fontWeight: '600' }, String(v))
          : null,
      );
    }),
  );
}

function DonutChartDemo() {
  const data = [
    { label: 'Desktop', value: 45, color: '#3b82f6' },
    { label: 'Mobile', value: 30, color: '#10b981' },
    { label: 'Tablet', value: 15, color: '#f59e0b' },
    { label: 'Other', value: 10, color: '#8b5cf6' },
  ];
  const [hovered, setHovered] = useState(-1);
  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = 60, cy = 60, outer = 50, inner = 30;
  let startAngle = -Math.PI / 2;

  const arcs = data.map((d, i) => {
    const angle = (d.value / total) * 2 * Math.PI;
    const x1 = cx + outer * Math.cos(startAngle), y1 = cy + outer * Math.sin(startAngle);
    const x2 = cx + outer * Math.cos(startAngle + angle), y2 = cy + outer * Math.sin(startAngle + angle);
    const ix1 = cx + inner * Math.cos(startAngle + angle), iy1 = cy + inner * Math.sin(startAngle + angle);
    const ix2 = cx + inner * Math.cos(startAngle), iy2 = cy + inner * Math.sin(startAngle);
    const large = angle > Math.PI ? 1 : 0;
    const path = `M${x1},${y1} A${outer},${outer} 0 ${large} 1 ${x2},${y2} L${ix1},${iy1} A${inner},${inner} 0 ${large} 0 ${ix2},${iy2} Z`;
    startAngle += angle;
    return createElement('path', {
      key: d.label, d: path, fill: d.color,
      opacity: hovered === i ? '1' : '0.8',
      style: { cursor: 'pointer', transition: 'opacity 0.15s' },
      onMouseEnter: () => setHovered(i),
      onMouseLeave: () => setHovered(-1),
    });
  });

  return createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '16px' } },
    createElement('svg', { width: '120', height: '120', viewBox: '0 0 120 120' }, ...arcs),
    createElement('div', { style: { fontSize: '12px' } },
      ...data.map((d, i) =>
        createElement('div', { key: d.label, style: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontWeight: hovered === i ? '700' : '400' } },
          createElement('div', { style: { width: '10px', height: '10px', borderRadius: '2px', backgroundColor: d.color } }),
          createElement('span', null, `${d.label} ${d.value}%`),
        ),
      ),
    ),
  );
}

function HistogramDemo() {
  const bins = [3, 7, 12, 18, 25, 22, 15, 9, 5, 2];
  const labels = ['0-9','10-19','20-29','30-39','40-49','50-59','60-69','70-79','80-89','90-99'];
  const [hovered, setHovered] = useState(-1);
  const w = 260, h = 120, pad = 20;
  const max = Math.max(...bins);
  const barW = (w - pad * 2) / bins.length;

  return createElement('svg', { width: String(w), height: String(h + 20), viewBox: `0 0 ${w} ${h + 20}`, style: { background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' } },
    createElement('line', { x1: String(pad), y1: String(h), x2: String(w - pad), y2: String(h), stroke: '#d1d5db', strokeWidth: '1' }),
    ...bins.map((count, i) => {
      const barH = (count / max) * (h - pad);
      const x = pad + i * barW;
      const y = h - barH;
      return createElement('g', { key: String(i) },
        createElement('rect', {
          x: String(x + 1), y: String(y), width: String(barW - 2), height: String(barH),
          fill: '#3b82f6', opacity: hovered === i ? '1' : '0.7',
          style: { cursor: 'pointer', transition: 'opacity 0.15s' },
          onMouseEnter: () => setHovered(i),
          onMouseLeave: () => setHovered(-1),
        }),
        hovered === i
          ? createElement('text', { x: String(x + barW / 2), y: String(y - 4), textAnchor: 'middle', fontSize: '10', fill: '#0f172a', fontWeight: '600' }, `n=${count}`)
          : null,
        createElement('text', { x: String(x + barW / 2), y: String(h + 14), textAnchor: 'end', fontSize: '7', fill: '#64748b', transform: `rotate(-45, ${x + barW / 2}, ${h + 14})` }, labels[i]),
      );
    }),
  );
}

function BoxPlotDemo() {
  const stats = { min: 35000, q1: 52000, median: 68000, q3: 85000, max: 120000 };
  const [hovered, setHovered] = useState<string | null>(null);
  const w = 260, h = 80, pad = 30;
  const range = stats.max - stats.min;
  const scale = (v: number) => pad + ((v - stats.min) / range) * (w - pad * 2);

  const fmt = (v: number) => `$${Math.round(v / 1000)}k`;
  const cy = 40;

  return createElement('svg', { width: String(w), height: String(h), viewBox: `0 0 ${w} ${h}`, style: { background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' } },
    createElement('line', { x1: String(scale(stats.min)), y1: String(cy), x2: String(scale(stats.q1)), y2: String(cy), stroke: '#64748b', strokeWidth: '2' }),
    createElement('line', { x1: String(scale(stats.q3)), y1: String(cy), x2: String(scale(stats.max)), y2: String(cy), stroke: '#64748b', strokeWidth: '2' }),
    createElement('rect', {
      x: String(scale(stats.q1)), y: String(cy - 15), width: String(scale(stats.q3) - scale(stats.q1)), height: '30',
      fill: hovered === 'box' ? '#3b82f6' : '#93c5fd', stroke: '#3b82f6', strokeWidth: '1.5', rx: '3',
      style: { cursor: 'pointer', transition: 'fill 0.15s' },
      onMouseEnter: () => setHovered('box'),
      onMouseLeave: () => setHovered(null),
    }),
    createElement('line', { x1: String(scale(stats.median)), y1: String(cy - 15), x2: String(scale(stats.median)), y2: String(cy + 15), stroke: '#1d4ed8', strokeWidth: '2' }),
    ...(['min', 'q1', 'median', 'q3', 'max'] as const).map(k => {
      const x = scale(stats[k]);
      return createElement('g', { key: k,
        onMouseEnter: () => setHovered(k),
        onMouseLeave: () => setHovered(null),
      },
        createElement('line', { x1: String(x), y1: String(cy - 10), x2: String(x), y2: String(cy + 10), stroke: '#1d4ed8', strokeWidth: k === 'min' || k === 'max' ? '1.5' : '0' }),
        hovered === k
          ? createElement('text', { x: String(x), y: '12', textAnchor: 'middle', fontSize: '10', fill: '#0f172a', fontWeight: '600' }, `${k}: ${fmt(stats[k])}`)
          : null,
      );
    }),
    createElement('text', { x: String(scale(stats.min)), y: String(h - 4), textAnchor: 'middle', fontSize: '9', fill: '#64748b' }, fmt(stats.min)),
    createElement('text', { x: String(scale(stats.max)), y: String(h - 4), textAnchor: 'middle', fontSize: '9', fill: '#64748b' }, fmt(stats.max)),
    hovered === 'box'
      ? createElement('text', { x: String((scale(stats.q1) + scale(stats.q3)) / 2), y: '12', textAnchor: 'middle', fontSize: '10', fill: '#0f172a', fontWeight: '600' },
          `IQR: ${fmt(stats.q1)}-${fmt(stats.q3)}`)
      : null,
  );
}

function BubbleChartDemo() {
  const data = [
    { label: 'React', x: 40, y: 30, r: 22, color: '#3b82f6' },
    { label: 'Vue', x: 100, y: 55, r: 16, color: '#10b981' },
    { label: 'Angular', x: 170, y: 40, r: 18, color: '#ef4444' },
    { label: 'Svelte', x: 65, y: 80, r: 12, color: '#f59e0b' },
    { label: 'Solid', x: 140, y: 85, r: 10, color: '#8b5cf6' },
    { label: 'Liquid', x: 210, y: 65, r: 20, color: '#ec4899' },
  ];
  const [hovered, setHovered] = useState(-1);

  return createElement('svg', { width: '260', height: '120', viewBox: '0 0 260 120', style: { background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' } },
    ...data.map((d, i) =>
      createElement('g', { key: d.label,
        onMouseEnter: () => setHovered(i),
        onMouseLeave: () => setHovered(-1),
        style: { cursor: 'pointer' },
      },
        createElement('circle', {
          cx: String(d.x), cy: String(d.y), r: String(hovered === i ? d.r + 3 : d.r),
          fill: d.color, opacity: hovered === i ? '1' : '0.6',
          style: { transition: 'r 0.15s, opacity 0.15s' },
        }),
        hovered === i
          ? createElement('text', { x: String(d.x), y: String(d.y - d.r - 6), textAnchor: 'middle', fontSize: '10', fill: '#0f172a', fontWeight: '600' },
              `${d.label}: ${d.r * 5}`)
          : null,
      ),
    ),
  );
}

function LollipopDemo() {
  const data = [
    { label: 'Mon', value: 42 }, { label: 'Tue', value: 65 },
    { label: 'Wed', value: 38 }, { label: 'Thu', value: 78 },
    { label: 'Fri', value: 55 }, { label: 'Sat', value: 90 },
  ];
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  const [hovered, setHovered] = useState(-1);
  const w = 240, h = 120, pad = 20;
  const max = Math.max(...data.map(d => d.value));
  const gap = (w - pad * 2) / data.length;

  return createElement('svg', { width: String(w), height: String(h + 15), viewBox: `0 0 ${w} ${h + 15}`, style: { background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' } },
    createElement('line', { x1: String(pad), y1: String(h), x2: String(w - pad), y2: String(h), stroke: '#d1d5db', strokeWidth: '1' }),
    ...data.map((d, i) => {
      const x = pad + gap * i + gap / 2;
      const y = h - (d.value / max) * (h - pad * 2);
      return createElement('g', { key: d.label,
        onMouseEnter: () => setHovered(i),
        onMouseLeave: () => setHovered(-1),
        style: { cursor: 'pointer' },
      },
        createElement('line', { x1: String(x), y1: String(h), x2: String(x), y2: String(y), stroke: colors[i], strokeWidth: '2' }),
        createElement('circle', {
          cx: String(x), cy: String(y), r: hovered === i ? '7' : '5',
          fill: colors[i], opacity: hovered === i ? '1' : '0.8',
          style: { transition: 'r 0.15s' },
        }),
        createElement('text', { x: String(x), y: String(h + 12), textAnchor: 'middle', fontSize: '9', fill: '#64748b' }, d.label),
        hovered === i
          ? createElement('text', { x: String(x), y: String(y - 10), textAnchor: 'middle', fontSize: '10', fill: '#0f172a', fontWeight: '600' }, String(d.value))
          : null,
      );
    }),
  );
}

function WaterfallDemo() {
  const data = [
    { label: 'Revenue', value: 500, type: 'pos' as const },
    { label: 'COGS', value: -200, type: 'neg' as const },
    { label: 'OpEx', value: -120, type: 'neg' as const },
    { label: 'Tax', value: -45, type: 'neg' as const },
    { label: 'Profit', value: 135, type: 'total' as const },
  ];
  const [hovered, setHovered] = useState(-1);
  const w = 260, h = 120, pad = 20;
  const maxVal = 500;
  const barW = (w - pad * 2) / data.length;

  let running = 0;
  const bars = data.map((d, i) => {
    let top: number, barH: number, color: string;
    if (d.type === 'total') {
      top = h - (d.value / maxVal) * (h - pad * 2);
      barH = (d.value / maxVal) * (h - pad * 2);
      color = '#3b82f6';
    } else if (d.type === 'pos') {
      top = h - ((running + d.value) / maxVal) * (h - pad * 2);
      barH = (d.value / maxVal) * (h - pad * 2);
      color = '#10b981';
    } else {
      top = h - (running / maxVal) * (h - pad * 2);
      barH = (Math.abs(d.value) / maxVal) * (h - pad * 2);
      color = '#ef4444';
    }
    if (d.type !== 'total') running += d.value;
    const x = pad + i * barW;
    return createElement('g', { key: d.label,
      onMouseEnter: () => setHovered(i),
      onMouseLeave: () => setHovered(-1),
      style: { cursor: 'pointer' },
    },
      createElement('rect', {
        x: String(x + 4), y: String(top), width: String(barW - 8), height: String(barH),
        fill: color, opacity: hovered === i ? '1' : '0.75', rx: '2',
        style: { transition: 'opacity 0.15s' },
      }),
      createElement('text', { x: String(x + barW / 2), y: String(h + 12), textAnchor: 'middle', fontSize: '8', fill: '#64748b' }, d.label),
      hovered === i
        ? createElement('text', { x: String(x + barW / 2), y: String(top - 4), textAnchor: 'middle', fontSize: '10', fill: '#0f172a', fontWeight: '600' },
            `${d.value > 0 ? '+' : ''}${d.value}`)
        : null,
    );
  });

  return createElement('svg', { width: String(w), height: String(h + 20), viewBox: `0 0 ${w} ${h + 20}`, style: { background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' } },
    createElement('line', { x1: String(pad), y1: String(h), x2: String(w - pad), y2: String(h), stroke: '#d1d5db', strokeWidth: '1' }),
    ...bars,
  );
}

function FunnelDemo() {
  const data = [
    { label: 'Visitors', count: 10000 },
    { label: 'Leads', count: 4200 },
    { label: 'Trials', count: 1800 },
    { label: 'Customers', count: 600 },
  ];
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
  const [hovered, setHovered] = useState(-1);
  const w = 260, segH = 28, pad = 20;
  const maxCount = data[0]!.count;
  const h = data.length * segH + pad;

  return createElement('svg', { width: String(w), height: String(h), viewBox: `0 0 ${w} ${h}`, style: { background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' } },
    ...data.map((d, i) => {
      const thisW = (d.count / maxCount) * (w - pad * 2);
      const nextW = i < data.length - 1 ? (data[i + 1]!.count / maxCount) * (w - pad * 2) : thisW * 0.7;
      const x1 = (w - thisW) / 2, x2 = (w + thisW) / 2;
      const x3 = (w + nextW) / 2, x4 = (w - nextW) / 2;
      const y1 = i * segH + 5, y2 = y1 + segH - 2;
      const path = `M${x1},${y1} L${x2},${y1} L${x3},${y2} L${x4},${y2} Z`;
      const pct = Math.round((d.count / maxCount) * 100);
      return createElement('g', { key: d.label,
        onMouseEnter: () => setHovered(i),
        onMouseLeave: () => setHovered(-1),
        style: { cursor: 'pointer' },
      },
        createElement('path', {
          d: path, fill: colors[i], opacity: hovered === i ? '1' : '0.75',
          style: { transition: 'opacity 0.15s' },
        }),
        createElement('text', {
          x: String(w / 2), y: String(y1 + segH / 2 + 3), textAnchor: 'middle',
          fontSize: '10', fill: 'white', fontWeight: '600',
        }, hovered === i ? `${d.label}: ${d.count.toLocaleString()} (${pct}%)` : d.label),
      );
    }),
  );
}

function BigNumberDemo() {
  const [hovered, setHovered] = useState(false);
  const sparkline = [18, 22, 19, 28, 25, 32, 30, 38, 35, 42, 40, 48];
  const w = 80, h = 24;
  const max = Math.max(...sparkline), min = Math.min(...sparkline);
  const step = w / (sparkline.length - 1);
  const pathD = sparkline.map((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / (max - min)) * h;
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');

  return createElement('div', {
    style: {
      textAlign: 'center', padding: '16px', background: hovered ? '#f0f9ff' : '#f8fafc',
      borderRadius: '8px', border: '1px solid #e2e8f0', transition: 'background 0.2s', cursor: 'pointer',
    },
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  },
    createElement('div', { style: { fontSize: '11px', color: '#64748b', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' } }, 'Revenue'),
    createElement('div', { style: { fontSize: '28px', fontWeight: '700', color: '#0f172a' } }, '$1.2M'),
    createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px' } },
      createElement('span', { style: { fontSize: '13px', color: '#10b981', fontWeight: '600' } }, '\u25B2 12.5%'),
      createElement('svg', { width: String(w), height: String(h), viewBox: `0 0 ${w} ${h}` },
        createElement('path', { d: pathD, fill: 'none', stroke: '#10b981', strokeWidth: '1.5' }),
      ),
    ),
  );
}

function GaugeDemo() {
  const value = 72;
  const [hovered, setHovered] = useState(false);
  const cx = 100, cy = 90, r = 70;
  const startAngle = Math.PI, endAngle = 2 * Math.PI;
  const segments = [
    { from: 0, to: 0.33, color: '#ef4444' },
    { from: 0.33, to: 0.66, color: '#f59e0b' },
    { from: 0.66, to: 1, color: '#10b981' },
  ];

  const arcPath = (fromPct: number, toPct: number) => {
    const a1 = startAngle + fromPct * Math.PI;
    const a2 = startAngle + toPct * Math.PI;
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
    return `M${x1},${y1} A${r},${r} 0 0 1 ${x2},${y2}`;
  };

  const needleAngle = startAngle + (value / 100) * Math.PI;
  const nx = cx + (r - 15) * Math.cos(needleAngle);
  const ny = cy + (r - 15) * Math.sin(needleAngle);

  return createElement('svg', {
    width: '200', height: '110', viewBox: '0 0 200 110',
    style: { background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', cursor: 'pointer' },
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  },
    ...segments.map(s =>
      createElement('path', { key: String(s.from), d: arcPath(s.from, s.to), fill: 'none', stroke: s.color, strokeWidth: '12', strokeLinecap: 'round', opacity: hovered ? '1' : '0.7' }),
    ),
    createElement('line', { x1: String(cx), y1: String(cy), x2: String(nx), y2: String(ny), stroke: '#0f172a', strokeWidth: '2.5', strokeLinecap: 'round' }),
    createElement('circle', { cx: String(cx), cy: String(cy), r: '4', fill: '#0f172a' }),
    createElement('text', { x: String(cx), y: String(cy + (hovered ? 0 : 0)), textAnchor: 'middle', fontSize: hovered ? '16' : '14', fill: '#0f172a', fontWeight: '700', dy: '-8' }, `${value}%`),
    hovered
      ? createElement('text', { x: String(cx), y: String(cy + 6), textAnchor: 'middle', fontSize: '9', fill: '#64748b' }, 'System Health')
      : null,
  );
}

function RadarDemo() {
  const axes = ['Speed', 'Power', 'Range', 'Efficiency', 'Durability'];
  const values = [0.8, 0.65, 0.9, 0.7, 0.85];
  const [hovered, setHovered] = useState(-1);
  const cx = 100, cy = 90, r = 65;
  const angleStep = (2 * Math.PI) / axes.length;
  const startOff = -Math.PI / 2;

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const grids = gridLevels.map(level => {
    const pts = axes.map((_, i) => {
      const a = startOff + i * angleStep;
      return `${cx + r * level * Math.cos(a)},${cy + r * level * Math.sin(a)}`;
    }).join(' ');
    return createElement('polygon', { key: String(level), points: pts, fill: 'none', stroke: '#e2e8f0', strokeWidth: '0.5' });
  });

  const dataPoints = values.map((v, i) => {
    const a = startOff + i * angleStep;
    return { x: cx + r * v * Math.cos(a), y: cy + r * v * Math.sin(a) };
  });
  const polyPts = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  const axisLines = axes.map((label, i) => {
    const a = startOff + i * angleStep;
    const ex = cx + r * Math.cos(a), ey = cy + r * Math.sin(a);
    const lx = cx + (r + 14) * Math.cos(a), ly = cy + (r + 14) * Math.sin(a);
    return createElement('g', { key: label },
      createElement('line', { x1: String(cx), y1: String(cy), x2: String(ex), y2: String(ey), stroke: '#d1d5db', strokeWidth: '0.5' }),
      createElement('text', { x: String(lx), y: String(ly + 3), textAnchor: 'middle', fontSize: '8', fill: hovered === i ? '#0f172a' : '#64748b', fontWeight: hovered === i ? '700' : '400' }, label),
    );
  });

  return createElement('svg', { width: '200', height: '180', viewBox: '0 0 200 180', style: { background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' } },
    ...grids,
    ...axisLines,
    createElement('polygon', { points: polyPts, fill: '#3b82f6', fillOpacity: '0.2', stroke: '#3b82f6', strokeWidth: '1.5' }),
    ...dataPoints.map((p, i) =>
      createElement('circle', {
        key: String(i), cx: String(p.x), cy: String(p.y),
        r: hovered === i ? '6' : '4', fill: '#3b82f6', opacity: hovered === i ? '1' : '0.8',
        style: { cursor: 'pointer', transition: 'r 0.15s' },
        onMouseEnter: () => setHovered(i),
        onMouseLeave: () => setHovered(-1),
      }),
    ),
    hovered >= 0
      ? createElement('text', { x: String(dataPoints[hovered]!.x), y: String(dataPoints[hovered]!.y - 10), textAnchor: 'middle', fontSize: '10', fill: '#0f172a', fontWeight: '600' },
          `${axes[hovered]}: ${Math.round(values[hovered]! * 100)}`)
      : null,
  );
}

function WordCloudDemo() {
  const words = [
    { text: 'TypeScript', size: 28, x: 60, y: 35, color: '#3b82f6', rotate: 0 },
    { text: 'Components', size: 22, x: 170, y: 50, color: '#10b981', rotate: -10 },
    { text: 'Hooks', size: 24, x: 40, y: 75, color: '#f59e0b', rotate: 5 },
    { text: 'Virtual DOM', size: 18, x: 200, y: 90, color: '#ef4444', rotate: -5 },
    { text: 'State', size: 20, x: 120, y: 25, color: '#8b5cf6', rotate: 8 },
    { text: 'Rendering', size: 16, x: 100, y: 95, color: '#ec4899', rotate: -8 },
    { text: 'Effects', size: 19, x: 230, y: 30, color: '#06b6d4', rotate: 12 },
    { text: 'Context', size: 17, x: 160, y: 100, color: '#84cc16', rotate: -3 },
    { text: 'JSX', size: 26, x: 30, y: 105, color: '#3b82f6', rotate: 0 },
    { text: 'Refs', size: 15, x: 250, y: 65, color: '#10b981', rotate: 6 },
  ];
  const [hovered, setHovered] = useState(-1);

  return createElement('svg', { width: '280', height: '120', viewBox: '0 0 280 120', style: { background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' } },
    ...words.map((w, i) =>
      createElement('text', {
        key: w.text, x: String(w.x), y: String(w.y),
        fontSize: String(hovered === i ? w.size + 4 : w.size),
        fill: w.color,
        opacity: hovered === i ? '1' : '0.7',
        fontWeight: hovered === i ? '800' : '600',
        transform: `rotate(${w.rotate}, ${w.x}, ${w.y})`,
        style: { cursor: 'pointer', transition: 'font-size 0.15s, opacity 0.15s' },
        onMouseEnter: () => setHovered(i),
        onMouseLeave: () => setHovered(-1),
      }, w.text),
    ),
  );
}

function HeatMapDemo() {
  const [hover, setHover] = useState<string | null>(null);
  const data = Array.from({ length: 30 }, (_, i) => Math.floor(Math.random() * 100));
  const cols = 6, rows = 5, size = 36, gap = 2;
  return createElement('svg', { width: (size + gap) * cols, height: (size + gap) * rows + 20 },
    ...data.map((v, i) => {
      const x = (i % cols) * (size + gap), y = Math.floor(i / cols) * (size + gap);
      const intensity = Math.round((v / 100) * 255);
      const key = `${Math.floor(i / cols)}-${i % cols}`;
      return createElement('g', { key },
        createElement('rect', {
          x, y, width: size, height: size, rx: 4,
          fill: `rgb(${255 - intensity},${255 - intensity},255)`,
          stroke: hover === key ? '#1e40af' : 'none', strokeWidth: 2,
          onMouseEnter: () => setHover(key), onMouseLeave: () => setHover(null),
        }),
        hover === key ? createElement('text', { x: x + size / 2, y: y + size / 2 + 4, textAnchor: 'middle', fontSize: 11, fill: v > 50 ? '#fff' : '#333' }, `${v}`) : null,
      );
    }),
  );
}

function CalendarHeatMapDemo() {
  const [hover, setHover] = useState<number | null>(null);
  const cells = Array.from({ length: 84 }, (_, i) => Math.floor(Math.random() * 5));
  const cols = 12, size = 14, gap = 2;
  const greens = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
  return createElement('svg', { width: (size + gap) * cols + 4, height: (size + gap) * 7 + 20 },
    ...cells.map((v, i) => {
      const x = Math.floor(i / 7) * (size + gap) + 2, y = (i % 7) * (size + gap) + 2;
      return createElement('g', { key: i },
        createElement('rect', {
          x, y, width: size, height: size, rx: 2, fill: greens[v],
          stroke: hover === i ? '#333' : 'none', strokeWidth: 1,
          onMouseEnter: () => setHover(i), onMouseLeave: () => setHover(null),
        }),
        hover === i ? createElement('text', { x: x + size / 2, y: y - 3, textAnchor: 'middle', fontSize: 9, fill: '#333' }, `W${Math.floor(i / 7) + 1}D${(i % 7) + 1}: ${v}`) : null,
      );
    }),
  );
}

function PivotTableDemo() {
  const [hover, setHover] = useState<string | null>(null);
  const products = ['Widget', 'Gadget', 'Doohickey'];
  const regions = ['North', 'South', 'East', 'West'];
  const data: Record<string, Record<string, number>> = {
    Widget: { North: 120, South: 95, East: 140, West: 80 },
    Gadget: { North: 65, South: 110, East: 75, West: 130 },
    Doohickey: { North: 90, South: 55, East: 100, West: 70 },
  };
  const cellStyle = (key: string) => ({
    padding: '6px 12px', textAlign: 'right' as const, cursor: 'pointer',
    backgroundColor: hover === key ? '#dbeafe' : 'transparent', transition: 'background-color 0.15s',
  });
  return createElement('table', { className: 'data-table', style: { fontSize: '13px', borderCollapse: 'collapse' as const, width: '100%' } },
    createElement('thead', null,
      createElement('tr', null,
        createElement('th', { style: { padding: '6px 12px', textAlign: 'left' as const } }, 'Product'),
        ...regions.map(r => createElement('th', { key: r, style: { padding: '6px 12px' } }, r)),
        createElement('th', { style: { padding: '6px 12px' } }, 'Total'),
      ),
    ),
    createElement('tbody', null,
      ...products.map(p => {
        const total = regions.reduce((s, r) => s + data[p][r], 0);
        return createElement('tr', { key: p },
          createElement('td', { style: { padding: '6px 12px', fontWeight: 600 } }, p),
          ...regions.map(r => {
            const key = `${p}-${r}`;
            return createElement('td', { key, style: cellStyle(key), onMouseEnter: () => setHover(key), onMouseLeave: () => setHover(null) }, `${data[p][r]}`);
          }),
          createElement('td', { style: { padding: '6px 12px', fontWeight: 600 } }, `${total}`),
        );
      }),
    ),
  );
}

function MatrixDemo() {
  const [hover, setHover] = useState<string | null>(null);
  const labels = ['A', 'B', 'C', 'D', 'E'];
  const n = labels.length, size = 40, r = 14;
  const vals = [
    [1, 0.8, -0.3, 0.5, -0.1],
    [0.8, 1, -0.5, 0.3, 0.2],
    [-0.3, -0.5, 1, -0.7, 0.6],
    [0.5, 0.3, -0.7, 1, -0.4],
    [-0.1, 0.2, 0.6, -0.4, 1],
  ];
  return createElement('svg', { width: size * n + 30, height: size * n + 30 },
    ...labels.map((l, i) => createElement('text', { key: `lx${i}`, x: 25 + i * size + size / 2, y: 12, textAnchor: 'middle', fontSize: 11, fill: '#475569' }, l)),
    ...labels.map((l, i) => createElement('text', { key: `ly${i}`, x: 12, y: 25 + i * size + size / 2 + 4, textAnchor: 'middle', fontSize: 11, fill: '#475569' }, l)),
    ...vals.flatMap((row, i) => row.map((v, j) => {
      const key = `${i}-${j}`;
      const color = v >= 0 ? `rgba(59,130,246,${Math.abs(v)})` : `rgba(239,68,68,${Math.abs(v)})`;
      return createElement('circle', {
        key, cx: 25 + j * size + size / 2, cy: 25 + i * size + size / 2, r: hover === key ? r + 2 : r,
        fill: color, stroke: hover === key ? '#1e293b' : 'none', strokeWidth: 1.5,
        onMouseEnter: () => setHover(key), onMouseLeave: () => setHover(null),
      });
    })),
    hover ? createElement('text', { x: size * n / 2 + 25, y: size * n + 28, textAnchor: 'middle', fontSize: 10, fill: '#334155' },
      `r=${vals[+hover.split('-')[0]][+hover.split('-')[1]].toFixed(1)}`) : null,
  );
}

function GanttDemo() {
  const [hover, setHover] = useState<number | null>(null);
  const tasks = [
    { name: 'Design', start: 0, end: 3, color: '#3b82f6' },
    { name: 'Backend', start: 2, end: 6, color: '#10b981' },
    { name: 'Frontend', start: 4, end: 8, color: '#f59e0b' },
    { name: 'Testing', start: 7, end: 10, color: '#ef4444' },
    { name: 'Deploy', start: 9, end: 11, color: '#8b5cf6' },
  ];
  const w = 280, barH = 24, gap = 4, maxEnd = 11, scale = (w - 80) / maxEnd;
  return createElement('svg', { width: w, height: tasks.length * (barH + gap) + 20 },
    ...tasks.map((t, i) => {
      const y = i * (barH + gap) + 4;
      return createElement('g', { key: i, onMouseEnter: () => setHover(i), onMouseLeave: () => setHover(null) },
        createElement('text', { x: 2, y: y + barH / 2 + 4, fontSize: 11, fill: '#475569' }, t.name),
        createElement('rect', {
          x: 70 + t.start * scale, y, width: (t.end - t.start) * scale, height: barH, rx: 4,
          fill: t.color, opacity: hover === i ? 1 : 0.75,
        }),
        hover === i ? createElement('text', { x: 70 + t.end * scale + 4, y: y + barH / 2 + 4, fontSize: 10, fill: '#334155' },
          `Day ${t.start}-${t.end}`) : null,
      );
    }),
  );
}

function TreeMapDemo() {
  const [hover, setHover] = useState<number | null>(null);
  const items = [
    { label: 'Sales', value: 40, color: '#3b82f6' },
    { label: 'Marketing', value: 25, color: '#10b981' },
    { label: 'Engineering', value: 20, color: '#f59e0b' },
    { label: 'Support', value: 8, color: '#ef4444' },
    { label: 'HR', value: 4, color: '#8b5cf6' },
    { label: 'Legal', value: 3, color: '#ec4899' },
  ];
  const total = items.reduce((s, d) => s + d.value, 0);
  const W = 260, H = 160;
  let cx = 0;
  const rects = items.map((d, i) => {
    const rw = (d.value / total) * W;
    const rect = { x: cx, w: rw, ...d, i };
    cx += rw;
    return rect;
  });
  return createElement('svg', { width: W, height: H + 20 },
    ...rects.map(r => createElement('g', { key: r.i, onMouseEnter: () => setHover(r.i), onMouseLeave: () => setHover(null) },
      createElement('rect', { x: r.x, y: 0, width: r.w, height: H, fill: r.color, opacity: hover === r.i ? 1 : 0.7, stroke: '#fff', strokeWidth: 2 }),
      r.w > 30 ? createElement('text', { x: r.x + r.w / 2, y: H / 2, textAnchor: 'middle', fontSize: 10, fill: '#fff', fontWeight: 600 }, r.label) : null,
      hover === r.i ? createElement('text', { x: r.x + r.w / 2, y: H + 14, textAnchor: 'middle', fontSize: 10, fill: '#334155' }, `${r.label}: ${r.value}`) : null,
    )),
  );
}

function SunburstDemo() {
  const [hover, setHover] = useState<string | null>(null);
  const cats = [
    { name: 'Tech', angle: 0, span: 120, color: '#3b82f6', subs: [{ name: 'Web', span: 60 }, { name: 'Mobile', span: 60 }] },
    { name: 'Sales', angle: 120, span: 120, color: '#10b981', subs: [{ name: 'Direct', span: 40 }, { name: 'Online', span: 40 }, { name: 'Partner', span: 40 }] },
    { name: 'Ops', angle: 240, span: 120, color: '#f59e0b', subs: [{ name: 'Logistics', span: 50 }, { name: 'Support', span: 70 }] },
  ];
  const cx = 120, cy = 120, r1 = 40, r2 = 75, r3 = 105;
  const arc = (r: number, a1: number, a2: number) => {
    const rad = (d: number) => (d - 90) * Math.PI / 180;
    const x1 = cx + r * Math.cos(rad(a1)), y1 = cy + r * Math.sin(rad(a1));
    const x2 = cx + r * Math.cos(rad(a2)), y2 = cy + r * Math.sin(rad(a2));
    const large = a2 - a1 > 180 ? 1 : 0;
    return `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`;
  };
  const elems: ReturnType<typeof createElement>[] = [];
  cats.forEach(c => {
    elems.push(createElement('path', { key: c.name, d: arc(r2, c.angle, c.angle + c.span), fill: c.color, opacity: hover === c.name ? 1 : 0.7, stroke: '#fff', strokeWidth: 2, onMouseEnter: () => setHover(c.name), onMouseLeave: () => setHover(null) }));
    let sa = c.angle;
    c.subs.forEach((s, si) => {
      const key = `${c.name}-${si}`;
      elems.push(createElement('path', { key, d: arc(r3, sa, sa + s.span).replace(`M${cx},${cy}`, `M${cx + (r2 + 1) * Math.cos((sa + s.span / 2 - 90) * Math.PI / 180)},${cy + (r2 + 1) * Math.sin((sa + s.span / 2 - 90) * Math.PI / 180)}`).replace(/Z$/, ''),
        fill: c.color, opacity: hover === key ? 0.9 : 0.45, stroke: '#fff', strokeWidth: 1, onMouseEnter: () => setHover(key), onMouseLeave: () => setHover(null) }));
      sa += s.span;
    });
  });
  return createElement('svg', { width: 240, height: 240 },
    ...elems,
    hover ? createElement('text', { x: cx, y: cy + 4, textAnchor: 'middle', fontSize: 11, fill: '#1e293b', fontWeight: 600 }, hover.replace('-', ' ')) : null,
  );
}

function SankeyDemo() {
  const [hover, setHover] = useState<number | null>(null);
  const sources = [{ y: 10, h: 50, label: 'A', color: '#3b82f6' }, { y: 70, h: 40, label: 'B', color: '#10b981' }, { y: 120, h: 30, label: 'C', color: '#f59e0b' }];
  const targets = [{ y: 5, h: 45, label: 'X', color: '#ef4444' }, { y: 60, h: 35, label: 'Y', color: '#8b5cf6' }, { y: 105, h: 50, label: 'Z', color: '#ec4899' }];
  const flows = [
    { si: 0, ti: 0, w: 20, sy: 10, ty: 5 }, { si: 0, ti: 1, w: 15, sy: 30, ty: 60 }, { si: 0, ti: 2, w: 15, sy: 45, ty: 105 },
    { si: 1, ti: 0, w: 15, sy: 70, ty: 25 }, { si: 1, ti: 1, w: 15, sy: 85, ty: 75 }, { si: 1, ti: 2, w: 10, sy: 100, ty: 120 },
    { si: 2, ti: 0, w: 10, sy: 120, ty: 40 }, { si: 2, ti: 1, w: 5, sy: 130, ty: 90 }, { si: 2, ti: 2, w: 15, sy: 135, ty: 130 },
  ];
  const sx = 10, tx = 230, W = 280;
  return createElement('svg', { width: W, height: 170 },
    ...sources.map((s, i) => createElement('rect', { key: `s${i}`, x: sx, y: s.y, width: 20, height: s.h, fill: s.color, rx: 3 })),
    ...targets.map((t, i) => createElement('rect', { key: `t${i}`, x: tx, y: t.y, width: 20, height: t.h, fill: t.color, rx: 3 })),
    ...flows.map((f, i) => createElement('path', {
      key: `f${i}`, fill: 'none', stroke: sources[f.si].color, strokeWidth: f.w * 0.6, opacity: hover === i ? 0.7 : 0.2,
      d: `M${sx + 20},${f.sy + f.w / 2} C${sx + 80},${f.sy + f.w / 2} ${tx - 60},${f.ty + f.w / 2} ${tx},${f.ty + f.w / 2}`,
      onMouseEnter: () => setHover(i), onMouseLeave: () => setHover(null),
    })),
    ...sources.map((s, i) => createElement('text', { key: `sl${i}`, x: sx + 10, y: s.y + s.h / 2 + 4, textAnchor: 'middle', fontSize: 11, fill: '#fff', fontWeight: 600 }, s.label)),
    ...targets.map((t, i) => createElement('text', { key: `tl${i}`, x: tx + 10, y: t.y + t.h / 2 + 4, textAnchor: 'middle', fontSize: 11, fill: '#fff', fontWeight: 600 }, t.label)),
    hover !== null ? createElement('text', { x: W / 2, y: 165, textAnchor: 'middle', fontSize: 10, fill: '#334155' },
      `${sources[flows[hover].si].label} → ${targets[flows[hover].ti].label}: ${flows[hover].w}`) : null,
  );
}

function ChordDemo() {
  const [hover, setHover] = useState<number | null>(null);
  const entities = ['Alpha', 'Beta', 'Gamma', 'Delta'];
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
  const matrix = [[0, 25, 15, 10], [25, 0, 20, 5], [15, 20, 0, 30], [10, 5, 30, 0]];
  const cx = 110, cy = 110, R = 90, arcW = 12;
  const n = entities.length, segAngle = 360 / n;
  const rad = (d: number) => (d - 90) * Math.PI / 180;
  const arcPath = (r: number, a1: number, a2: number) => {
    const x1 = cx + r * Math.cos(rad(a1)), y1 = cy + r * Math.sin(rad(a1));
    const x2 = cx + r * Math.cos(rad(a2)), y2 = cy + r * Math.sin(rad(a2));
    return `M${x1},${y1} A${r},${r} 0 0 1 ${x2},${y2}`;
  };
  const chords: ReturnType<typeof createElement>[] = [];
  let idx = 0;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const a1 = i * segAngle + segAngle / 2, a2 = j * segAngle + segAngle / 2;
    const ci = idx++;
    chords.push(createElement('path', {
      key: `ch${ci}`, fill: 'none', stroke: colors[i], strokeWidth: matrix[i][j] * 0.15 + 1,
      opacity: hover === ci ? 0.8 : 0.25,
      d: `M${cx + (R - arcW) * Math.cos(rad(a1))},${cy + (R - arcW) * Math.sin(rad(a1))} Q${cx},${cy} ${cx + (R - arcW) * Math.cos(rad(a2))},${cy + (R - arcW) * Math.sin(rad(a2))}`,
      onMouseEnter: () => setHover(ci), onMouseLeave: () => setHover(null),
    }));
  }
  return createElement('svg', { width: 220, height: 240 },
    ...entities.map((e, i) => createElement('path', { key: `a${i}`, d: arcPath(R, i * segAngle + 5, (i + 1) * segAngle - 5), fill: 'none', stroke: colors[i], strokeWidth: arcW, strokeLinecap: 'round' })),
    ...entities.map((e, i) => {
      const a = i * segAngle + segAngle / 2;
      return createElement('text', { key: `l${i}`, x: cx + (R + 16) * Math.cos(rad(a)), y: cy + (R + 16) * Math.sin(rad(a)) + 4, textAnchor: 'middle', fontSize: 10, fill: '#475569' }, e);
    }),
    ...chords,
    hover !== null ? createElement('text', { x: cx, y: 235, textAnchor: 'middle', fontSize: 10, fill: '#334155' }, 'Hover a ribbon for details') : null,
  );
}

function PartitionDemo() {
  const [hover, setHover] = useState<string | null>(null);
  const W = 280, rowH = 30;
  const tree = [
    { id: 'root', label: 'Root', x: 0, w: W, level: 0, color: '#3b82f6' },
    { id: 'a', label: 'Group A', x: 0, w: W * 0.6, level: 1, color: '#10b981' },
    { id: 'b', label: 'Group B', x: W * 0.6, w: W * 0.4, level: 1, color: '#f59e0b' },
    { id: 'a1', label: 'A-1', x: 0, w: W * 0.35, level: 2, color: '#06b6d4' },
    { id: 'a2', label: 'A-2', x: W * 0.35, w: W * 0.25, level: 2, color: '#8b5cf6' },
    { id: 'b1', label: 'B-1', x: W * 0.6, w: W * 0.2, level: 2, color: '#ef4444' },
    { id: 'b2', label: 'B-2', x: W * 0.6 + W * 0.2, w: W * 0.2, level: 2, color: '#ec4899' },
  ];
  return createElement('svg', { width: W, height: rowH * 3 + 20 },
    ...tree.map(n => createElement('g', { key: n.id, onMouseEnter: () => setHover(n.id), onMouseLeave: () => setHover(null) },
      createElement('rect', { x: n.x + 1, y: n.level * rowH + 1, width: n.w - 2, height: rowH - 2, rx: 3, fill: n.color, opacity: hover === n.id ? 1 : 0.7, stroke: '#fff', strokeWidth: 1 }),
      n.w > 40 ? createElement('text', { x: n.x + n.w / 2, y: n.level * rowH + rowH / 2 + 4, textAnchor: 'middle', fontSize: 10, fill: '#fff', fontWeight: 600 }, n.label) : null,
    )),
    hover ? createElement('text', { x: W / 2, y: rowH * 3 + 15, textAnchor: 'middle', fontSize: 10, fill: '#334155' }, `Node: ${hover}`) : null,
  );
}

function DecompositionTreeDemo() {
  const [hover, setHover] = useState<string | null>(null);
  const nodes = [
    { id: 'R', x: 20, y: 80, label: 'Revenue' },
    { id: 'P', x: 110, y: 30, label: 'Product' }, { id: 'S', x: 110, y: 80, label: 'Service' }, { id: 'L', x: 110, y: 130, label: 'License' },
    { id: 'P1', x: 210, y: 10, label: 'HW' }, { id: 'P2', x: 210, y: 50, label: 'SW' },
    { id: 'S1', x: 210, y: 70, label: 'Consult' }, { id: 'S2', x: 210, y: 100, label: 'Support' },
    { id: 'L1', x: 210, y: 120, label: 'Annual' }, { id: 'L2', x: 210, y: 150, label: 'Monthly' },
  ];
  const edges = [['R', 'P'], ['R', 'S'], ['R', 'L'], ['P', 'P1'], ['P', 'P2'], ['S', 'S1'], ['S', 'S2'], ['L', 'L1'], ['L', 'L2']];
  const find = (id: string) => nodes.find(n => n.id === id)!;
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
  const isOnPath = (id: string): boolean => {
    if (!hover) return false;
    if (id === hover) return true;
    return edges.some(([a, b]) => (b === id && isOnPath(a)) || (a === id && isOnPath(b) && find(b).x > find(a).x && isOnPath(b)));
  };
  return createElement('svg', { width: 290, height: 170 },
    ...edges.map(([a, b], i) => {
      const na = find(a), nb = find(b);
      return createElement('line', { key: `e${i}`, x1: na.x + 35, y1: na.y + 10, x2: nb.x, y2: nb.y + 10, stroke: hover && (hover === a || hover === b) ? '#1e293b' : '#cbd5e1', strokeWidth: 1.5 });
    }),
    ...nodes.map((n, i) => createElement('g', { key: n.id, onMouseEnter: () => setHover(n.id), onMouseLeave: () => setHover(null) },
      createElement('rect', { x: n.x, y: n.y, width: n.x < 100 ? 55 : 50, height: 22, rx: 4, fill: colors[i % colors.length], opacity: hover === n.id ? 1 : 0.7 }),
      createElement('text', { x: n.x + (n.x < 100 ? 27 : 25), y: n.y + 14, textAnchor: 'middle', fontSize: 9, fill: '#fff', fontWeight: 600 }, n.label),
    )),
  );
}

function GeoMapDemo() {
  const [hover, setHover] = useState<string | null>(null);
  const states = [
    { id: 'WA', x: 20, y: 10, w: 40, h: 30, value: 85, color: '#3b82f6' },
    { id: 'MT', x: 65, y: 10, w: 50, h: 25, value: 30, color: '#10b981' },
    { id: 'NY', x: 200, y: 25, w: 35, h: 30, value: 95, color: '#ef4444' },
    { id: 'CA', x: 15, y: 50, w: 30, h: 60, value: 100, color: '#f59e0b' },
    { id: 'TX', x: 100, y: 80, w: 55, h: 45, value: 78, color: '#8b5cf6' },
    { id: 'FL', x: 190, y: 90, w: 40, h: 35, value: 65, color: '#ec4899' },
  ];
  return createElement('svg', { width: 260, height: 150 },
    createElement('rect', { x: 5, y: 5, width: 250, height: 130, rx: 8, fill: '#f1f5f9', stroke: '#e2e8f0' }),
    ...states.map(s => createElement('g', { key: s.id, onMouseEnter: () => setHover(s.id), onMouseLeave: () => setHover(null) },
      createElement('rect', { x: s.x, y: s.y, width: s.w, height: s.h, rx: 3, fill: s.color, opacity: hover === s.id ? 1 : 0.6, stroke: hover === s.id ? '#1e293b' : '#fff', strokeWidth: hover === s.id ? 2 : 1 }),
      createElement('text', { x: s.x + s.w / 2, y: s.y + s.h / 2 + 4, textAnchor: 'middle', fontSize: 10, fill: '#fff', fontWeight: 600 }, s.id),
    )),
    hover ? createElement('text', { x: 130, y: 145, textAnchor: 'middle', fontSize: 10, fill: '#334155' },
      `${hover}: value ${states.find(s => s.id === hover)!.value}`) : null,
  );
}

function VectorFieldDemo() {
  const [hover, setHover] = useState<string | null>(null);
  const cols = 8, rows = 6, spacing = 32, pad = 20;
  const arrows = Array.from({ length: cols * rows }, (_, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const angle = (col * 30 + row * 45) % 360;
    const mag = 0.4 + ((col + row) % 4) * 0.2;
    return { col, row, angle, mag };
  });
  return createElement('svg', { width: cols * spacing + pad * 2, height: rows * spacing + pad * 2 + 16 },
    ...arrows.map((a, i) => {
      const cx = pad + a.col * spacing + spacing / 2, cy = pad + a.row * spacing + spacing / 2;
      const len = a.mag * 12;
      const key = `${a.row}-${a.col}`;
      return createElement('g', { key, transform: `translate(${cx},${cy}) rotate(${a.angle})`, onMouseEnter: () => setHover(key), onMouseLeave: () => setHover(null) },
        createElement('line', { x1: -len, y1: 0, x2: len, y2: 0, stroke: hover === key ? '#1e293b' : '#3b82f6', strokeWidth: hover === key ? 2 : 1.5 }),
        createElement('polygon', { points: `${len},0 ${len - 4},-3 ${len - 4},3`, fill: hover === key ? '#1e293b' : '#3b82f6' }),
      );
    }),
    hover ? createElement('text', { x: (cols * spacing + pad * 2) / 2, y: rows * spacing + pad * 2 + 12, textAnchor: 'middle', fontSize: 10, fill: '#334155' },
      `[${hover}] angle=${arrows[+hover.split('-')[0] * cols + +hover.split('-')[1]]?.angle}° mag=${arrows[+hover.split('-')[0] * cols + +hover.split('-')[1]]?.mag.toFixed(1)}`) : null,
  );
}

function ThreeDLayersDemo() {
  const [hover, setHover] = useState<number | null>(null);
  const bars = [
    { label: 'Q1', value: 60, color: '#3b82f6' }, { label: 'Q2', value: 85, color: '#10b981' },
    { label: 'Q3', value: 45, color: '#f59e0b' }, { label: 'Q4', value: 70, color: '#ef4444' },
    { label: 'Q5', value: 90, color: '#8b5cf6' }, { label: 'Q6', value: 55, color: '#ec4899' },
  ];
  const maxV = 100, barW = 30, gap = 12, baseY = 140, depth = 10;
  return createElement('svg', { width: bars.length * (barW + gap) + 40, height: 170 },
    ...bars.map((b, i) => {
      const x = 20 + i * (barW + gap), h = (b.value / maxV) * 100, y = baseY - h;
      return createElement('g', { key: i, onMouseEnter: () => setHover(i), onMouseLeave: () => setHover(null) },
        createElement('polygon', { points: `${x},${y} ${x + depth},${y - depth} ${x + barW + depth},${y - depth} ${x + barW},${y}`, fill: b.color, opacity: hover === i ? 0.9 : 0.5 }),
        createElement('polygon', { points: `${x + barW},${y} ${x + barW + depth},${y - depth} ${x + barW + depth},${baseY - depth} ${x + barW},${baseY}`, fill: b.color, opacity: hover === i ? 0.7 : 0.35 }),
        createElement('rect', { x, y, width: barW, height: h, fill: b.color, opacity: hover === i ? 1 : 0.75 }),
        createElement('text', { x: x + barW / 2, y: baseY + 14, textAnchor: 'middle', fontSize: 10, fill: '#475569' }, b.label),
        hover === i ? createElement('text', { x: x + barW / 2, y: y - depth - 4, textAnchor: 'middle', fontSize: 10, fill: '#1e293b', fontWeight: 600 }, `${b.value}`) : null,
      );
    }),
  );
}
