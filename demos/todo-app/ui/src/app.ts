import { createElement, Fragment } from 'liquidjs';
import { useState, useRef, useEffect, useCallback, useMemo } from 'liquidjs/hooks';
import { createRoot } from 'liquidjs/dom';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

type Filter = 'all' | 'active' | 'completed';

function TodoItem(props: {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const { todo, onToggle, onDelete } = props;
  return createElement(
    'li',
    {
      className: `todo-item ${todo.completed ? 'completed' : ''}`,
      'data-testid': `todo-${todo.id}`,
    },
    createElement(
      'label',
      { className: 'todo-label' },
      createElement('input', {
        type: 'checkbox',
        checked: todo.completed,
        onChange: () => onToggle(todo.id),
      }),
      createElement('span', { className: 'todo-text' }, todo.text),
      createElement('time', { className: 'todo-time' }, todo.createdAt),
    ),
    createElement(
      'button',
      { className: 'delete-btn', onClick: () => onDelete(todo.id) },
      '\u00d7',
    ),
  );
}

function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [darkMode, setDarkMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null as unknown as HTMLInputElement);
  const nextId = useRef(1);

  useEffect(() => {
    const saved = localStorage.getItem('liquidjs-todos');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTodos(parsed);
        nextId.current = parsed.reduce((max: number, t: Todo) => Math.max(max, t.id + 1), 1);
      } catch {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('liquidjs-todos', JSON.stringify(todos));
    document.title = `LiquidJS Todo (${todos.filter((t) => !t.completed).length} active)`;
  }, [todos]);

  const addTodo = useCallback(() => {
    const input = inputRef.current;
    if (!input || !input.value.trim()) return;
    setTodos((prev: Todo[]) => [
      ...prev,
      {
        id: nextId.current++,
        text: input.value.trim(),
        completed: false,
        createdAt: new Date().toLocaleTimeString(),
      },
    ]);
    input.value = '';
    input.focus();
  }, []);

  const toggleTodo = useCallback((id: number) => {
    setTodos((prev: Todo[]) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, []);

  const deleteTodo = useCallback((id: number) => {
    setTodos((prev: Todo[]) => prev.filter((t) => t.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev: Todo[]) => prev.filter((t) => !t.completed));
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter((t) => !t.completed);
      case 'completed':
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const remaining = useMemo(() => todos.filter((t) => !t.completed).length, [todos]);
  const hasCompleted = useMemo(() => todos.some((t) => t.completed), [todos]);

  return createElement(
    'div',
    { className: `app ${darkMode ? 'dark' : 'light'}` },
    createElement(
      'header',
      null,
      createElement('h1', null, 'LiquidJS Todo'),
      createElement(
        'button',
        { className: 'theme-btn', onClick: () => setDarkMode((d: boolean) => !d) },
        darkMode ? '\u2600\ufe0f Light' : '\ud83c\udf19 Dark',
      ),
    ),
    createElement(
      'div',
      { className: 'add-bar' },
      createElement('input', {
        type: 'text',
        placeholder: 'What needs to be done?',
        ref: inputRef,
        onKeyDown: (e: Event) => {
          if ((e as KeyboardEvent).key === 'Enter') addTodo();
        },
      }),
      createElement('button', { className: 'add-btn', onClick: addTodo }, 'Add'),
    ),
    createElement(
      'nav',
      { className: 'filters' },
      ...(['all', 'active', 'completed'] as Filter[]).map((f) =>
        createElement(
          'button',
          {
            key: f,
            className: `filter-btn ${filter === f ? 'active' : ''}`,
            onClick: () => setFilter(f),
          },
          f[0].toUpperCase() + f.slice(1),
        ),
      ),
    ),
    createElement(
      'ul',
      { className: 'todo-list' },
      ...filteredTodos.map((todo) =>
        createElement(TodoItem, { key: todo.id, todo, onToggle: toggleTodo, onDelete: deleteTodo }),
      ),
    ),
    filteredTodos.length === 0
      ? createElement('p', { className: 'empty' }, filter === 'all' ? 'No todos yet. Add one above!' : `No ${filter} todos.`)
      : null,
    createElement(
      'footer',
      null,
      createElement('span', null, `${remaining} item${remaining !== 1 ? 's' : ''} left`),
      hasCompleted ? createElement('button', { className: 'clear-btn', onClick: clearCompleted }, 'Clear completed') : null,
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(TodoApp, null));
