import { createElement, Fragment } from 'liquidjs';
import { useState, useEffect, useCallback } from 'liquidjs/hooks';
import { createRoot } from 'liquidjs/dom';

// ─── Binary Protocol Codec ────────────────────────────────────────────────────
// Wire format per task:
//   [4B] ID (uint32 BE) | [1B] Status | [1B] Priority
//   [2B] TitleLen (uint16 BE) | [NB] Title (UTF-8)
//   [2B] DescLen  (uint16 BE) | [NB] Description (UTF-8)
// Task list: [4B] Count (uint32 BE) | repeated Task

const STATUS_PENDING = 0;
const STATUS_IN_PROGRESS = 1;
const STATUS_DONE = 2;

const STATUS_LABELS: Record<number, string> = {
  [STATUS_PENDING]: 'Pending',
  [STATUS_IN_PROGRESS]: 'In Progress',
  [STATUS_DONE]: 'Done',
};

interface Task {
  id: number;
  title: string;
  description: string;
  status: number;
  priority: number;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function encodeTask(task: Task): ArrayBuffer {
  const titleBytes = encoder.encode(task.title);
  const descBytes = encoder.encode(task.description);
  const totalLen = 4 + 1 + 1 + 2 + titleBytes.length + 2 + descBytes.length;
  const buf = new ArrayBuffer(totalLen);
  const view = new DataView(buf);
  const bytes = new Uint8Array(buf);
  let offset = 0;

  view.setUint32(offset, task.id); offset += 4;
  view.setUint8(offset, task.status); offset += 1;
  view.setUint8(offset, task.priority); offset += 1;
  view.setUint16(offset, titleBytes.length); offset += 2;
  bytes.set(titleBytes, offset); offset += titleBytes.length;
  view.setUint16(offset, descBytes.length); offset += 2;
  bytes.set(descBytes, offset);

  return buf;
}

function decodeTaskList(buf: ArrayBuffer): Task[] {
  const view = new DataView(buf);
  const bytes = new Uint8Array(buf);
  let offset = 0;

  const count = view.getUint32(offset); offset += 4;
  const tasks: Task[] = [];

  for (let i = 0; i < count; i++) {
    const id = view.getUint32(offset); offset += 4;
    const status = view.getUint8(offset); offset += 1;
    const priority = view.getUint8(offset); offset += 1;
    const titleLen = view.getUint16(offset); offset += 2;
    const title = decoder.decode(bytes.slice(offset, offset + titleLen)); offset += titleLen;
    const descLen = view.getUint16(offset); offset += 2;
    const description = decoder.decode(bytes.slice(offset, offset + descLen)); offset += descLen;

    tasks.push({ id, title, description, status, priority });
  }

  return tasks;
}

function decodeTask(buf: ArrayBuffer): Task {
  const view = new DataView(buf);
  const bytes = new Uint8Array(buf);
  let offset = 0;

  const id = view.getUint32(offset); offset += 4;
  const status = view.getUint8(offset); offset += 1;
  const priority = view.getUint8(offset); offset += 1;
  const titleLen = view.getUint16(offset); offset += 2;
  const title = decoder.decode(bytes.slice(offset, offset + titleLen)); offset += titleLen;
  const descLen = view.getUint16(offset); offset += 2;
  const description = decoder.decode(bytes.slice(offset, offset + descLen)); offset += descLen;

  return { id, title, description, status, priority };
}

function formatHexDump(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  const parts: string[] = [];
  for (let i = 0; i < bytes.length; i++) {
    parts.push(bytes[i].toString(16).padStart(2, '0'));
  }
  return parts.join(' ');
}

// ─── Data Hook ────────────────────────────────────────────────────────────────

function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRawBytes, setLastRawBytes] = useState<ArrayBuffer | null>(null);
  const [lastByteCount, setLastByteCount] = useState(0);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/proto/tasks');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = await res.arrayBuffer();
      setLastRawBytes(buf);
      setLastByteCount(buf.byteLength);
      const decoded = decodeTaskList(buf);
      setTasks(decoded);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = useCallback(async (title: string, description: string, priority: number) => {
    try {
      const task: Task = { id: 0, title, description, status: STATUS_PENDING, priority };
      const body = encodeTask(task);
      const res = await fetch('/proto/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-protobuf' },
        body,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fetchTasks();
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  }, [fetchTasks]);

  const updateTaskStatus = useCallback(async (task: Task, newStatus: number) => {
    try {
      const updated = { ...task, status: newStatus };
      const body = encodeTask(updated);
      const res = await fetch(`/proto/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-protobuf' },
        body,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fetchTasks();
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  }, [fetchTasks]);

  const deleteTask = useCallback(async (id: number) => {
    try {
      const res = await fetch(`/proto/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) throw new Error(`HTTP ${res.status}`);
      setTasks((prev: Task[]) => prev.filter((t) => t.id !== id));
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  }, []);

  return { tasks, loading, error, lastRawBytes, lastByteCount, fetchTasks, addTask, updateTaskStatus, deleteTask };
}

// ─── Components ───────────────────────────────────────────────────────────────

function AddTaskForm(props: { onAdd: (title: string, desc: string, priority: number) => void }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState(3);

  const handleSubmit = useCallback(() => {
    if (!title.trim()) return;
    props.onAdd(title.trim(), desc.trim(), priority);
    setTitle('');
    setDesc('');
    setPriority(3);
  }, [title, desc, priority, props.onAdd]);

  return createElement(
    'div', { className: 'add-form' },
    createElement('input', {
      type: 'text', placeholder: 'Task title', value: title,
      onInput: (e: Event) => setTitle((e.target as HTMLInputElement).value),
    }),
    createElement('input', {
      type: 'text', placeholder: 'Description', value: desc,
      onInput: (e: Event) => setDesc((e.target as HTMLInputElement).value),
    }),
    createElement('select', {
      value: String(priority),
      onChange: (e: Event) => setPriority(parseInt((e.target as HTMLSelectElement).value, 10)),
    },
      createElement('option', { value: '1' }, 'P1'),
      createElement('option', { value: '2' }, 'P2'),
      createElement('option', { value: '3' }, 'P3'),
      createElement('option', { value: '4' }, 'P4'),
      createElement('option', { value: '5' }, 'P5'),
    ),
    createElement('button', { onClick: handleSubmit, className: 'add-btn' }, 'Add'),
  );
}

function TaskCard(props: { task: Task; onStatusChange: (task: Task, status: number) => void; onDelete: (id: number) => void }) {
  const { task, onStatusChange, onDelete } = props;

  const statusButtons: ReturnType<typeof createElement>[] = [];
  if (task.status !== STATUS_PENDING) {
    statusButtons.push(
      createElement('button', { key: 'pending', onClick: () => onStatusChange(task, STATUS_PENDING) }, 'Pending')
    );
  }
  if (task.status !== STATUS_IN_PROGRESS) {
    statusButtons.push(
      createElement('button', { key: 'progress', onClick: () => onStatusChange(task, STATUS_IN_PROGRESS) }, 'Start')
    );
  }
  if (task.status !== STATUS_DONE) {
    statusButtons.push(
      createElement('button', { key: 'done', onClick: () => onStatusChange(task, STATUS_DONE) }, 'Done')
    );
  }

  return createElement('div', { className: 'task-card' },
    createElement('div', { className: 'task-title' }, task.title),
    task.description
      ? createElement('div', { className: 'task-desc' }, task.description)
      : null,
    createElement('div', { className: 'task-meta' },
      createElement('span', { className: `priority priority-${task.priority}` }, `P${task.priority}`),
      createElement('div', { className: 'task-actions' },
        ...statusButtons,
        createElement('button', { className: 'delete-btn', onClick: () => onDelete(task.id) }, 'X'),
      ),
    ),
  );
}

function Column(props: {
  title: string;
  className: string;
  tasks: Task[];
  onStatusChange: (task: Task, status: number) => void;
  onDelete: (id: number) => void;
}) {
  return createElement('div', { className: `column ${props.className}` },
    createElement('div', { className: 'column-header' },
      createElement('span', null, props.title),
      createElement('span', { className: 'count' }, String(props.tasks.length)),
    ),
    ...props.tasks.map((t) =>
      createElement(TaskCard, {
        key: t.id,
        task: t,
        onStatusChange: props.onStatusChange,
        onDelete: props.onDelete,
      })
    ),
  );
}

function BytesPanel(props: { rawBytes: ArrayBuffer | null; byteCount: number; taskCount: number }) {
  const hexStr = props.rawBytes ? formatHexDump(props.rawBytes) : '(no data yet)';
  const jsonSize = props.rawBytes
    ? new TextEncoder().encode(JSON.stringify({ note: 'equivalent JSON would be larger' })).length
    : 0;

  return createElement('div', { className: 'bytes-panel' },
    createElement('h3', null, 'Raw Binary Wire Data'),
    createElement('div', { className: 'bytes-display' }, hexStr),
    createElement('div', { className: 'bytes-stats' },
      createElement('span', null, `${props.byteCount} bytes over the wire`),
      createElement('span', null, `${props.taskCount} tasks decoded`),
      createElement('span', null, `Content-Type: application/x-protobuf`),
    ),
  );
}

function App() {
  const { tasks, loading, error, lastRawBytes, lastByteCount, fetchTasks, addTask, updateTaskStatus, deleteTask } = useTasks();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const pending = tasks.filter((t: Task) => t.status === STATUS_PENDING);
  const inProgress = tasks.filter((t: Task) => t.status === STATUS_IN_PROGRESS);
  const done = tasks.filter((t: Task) => t.status === STATUS_DONE);

  return createElement(
    'div', { className: 'app' },
    createElement('h1', null, 'Task Tracker'),
    createElement('p', { className: 'subtitle' }, 'LiquidJS UI with Protobuf-like binary protocol over HTTP'),
    error ? createElement('div', { className: 'error' }, `Error: ${error}`) : null,
    createElement(AddTaskForm, { onAdd: addTask }),
    createElement(BytesPanel, { rawBytes: lastRawBytes, byteCount: lastByteCount, taskCount: tasks.length }),
    loading
      ? createElement('div', { className: 'loading' }, 'Loading...')
      : createElement('div', { className: 'board' },
          createElement(Column, {
            title: 'Pending',
            className: 'col-pending',
            tasks: pending,
            onStatusChange: updateTaskStatus,
            onDelete: deleteTask,
          }),
          createElement(Column, {
            title: 'In Progress',
            className: 'col-progress',
            tasks: inProgress,
            onStatusChange: updateTaskStatus,
            onDelete: deleteTask,
          }),
          createElement(Column, {
            title: 'Done',
            className: 'col-done',
            tasks: done,
            onStatusChange: updateTaskStatus,
            onDelete: deleteTask,
          }),
        ),
    createElement('footer', null,
      createElement('span', null, `${tasks.length} tasks total`),
      createElement('button', { onClick: fetchTasks, className: 'refresh-btn' }, 'Refresh'),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
