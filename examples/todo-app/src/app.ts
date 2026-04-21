import { createElement, Fragment } from '../../../src/index';
import { useState, useRef, useEffect, useCallback, useMemo } from '../../../src/hooks/index';
import { createRoot } from '../../../src/dom/create-root';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

type Filter = 'all' | 'active' | 'completed';

function TodoItem(props: {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const { todo, onToggle, onDelete } = props;

  return createElement('li', {
    className: `todo-item ${todo.completed ? 'completed' : ''}`,
    'data-testid': `todo-${todo.id}`,
  },
    createElement('label', { className: 'todo-label' },
      createElement('input', {
        type: 'checkbox',
        checked: todo.completed,
        onChange: () => onToggle(todo.id),
        'data-testid': `toggle-${todo.id}`,
      }),
      createElement('span', {
        className: 'todo-text',
        style: todo.completed ? { textDecoration: 'line-through', opacity: '0.6' } : {},
      }, todo.text),
    ),
    createElement('button', {
      className: 'delete-btn',
      onClick: () => onDelete(todo.id),
      'data-testid': `delete-${todo.id}`,
    }, '×'),
  );
}

function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const inputRef = useRef<HTMLInputElement>(null as unknown as HTMLInputElement);
  const nextId = useRef(1);

  useEffect(() => {
    document.title = `Todos (${todos.filter(t => !t.completed).length} remaining)`;
  }, [todos]);

  const addTodo = useCallback(() => {
    const input = inputRef.current;
    if (!input || !input.value.trim()) return;

    const text = input.value.trim();
    setTodos((prev: Todo[]) => [
      ...prev,
      { id: nextId.current++, text, completed: false },
    ]);
    input.value = '';
    input.focus();
  }, []);

  const toggleTodo = useCallback((id: number) => {
    setTodos((prev: Todo[]) =>
      prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t),
    );
  }, []);

  const deleteTodo = useCallback((id: number) => {
    setTodos((prev: Todo[]) => prev.filter(t => t.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev: Todo[]) => prev.filter(t => !t.completed));
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active': return todos.filter(t => !t.completed);
      case 'completed': return todos.filter(t => t.completed);
      default: return todos;
    }
  }, [todos, filter]);

  const remaining = useMemo(() => todos.filter(t => !t.completed).length, [todos]);

  const handleKeyDown = useCallback((e: Event) => {
    if ((e as KeyboardEvent).key === 'Enter') addTodo();
  }, [addTodo]);

  return createElement('div', { className: 'todo-app', id: 'todo-app' },
    createElement('h1', null, 'Todo List'),

    createElement('div', { className: 'add-todo' },
      createElement('input', {
        type: 'text',
        placeholder: 'What needs to be done?',
        ref: inputRef,
        onKeyDown: handleKeyDown,
        'data-testid': 'todo-input',
        id: 'todo-input',
      }),
      createElement('button', {
        onClick: addTodo,
        'data-testid': 'add-btn',
        id: 'add-btn',
      }, 'Add'),
    ),

    createElement('div', { className: 'filters', 'data-testid': 'filters' },
      ...(['all', 'active', 'completed'] as Filter[]).map(f =>
        createElement('button', {
          key: f,
          className: `filter-btn ${filter === f ? 'active' : ''}`,
          onClick: () => setFilter(f),
          'data-testid': `filter-${f}`,
        }, f.charAt(0).toUpperCase() + f.slice(1)),
      ),
    ),

    createElement('ul', { className: 'todo-list', 'data-testid': 'todo-list' },
      ...filteredTodos.map(todo =>
        createElement(TodoItem, {
          key: todo.id,
          todo,
          onToggle: toggleTodo,
          onDelete: deleteTodo,
        }),
      ),
    ),

    createElement('div', { className: 'footer' },
      createElement('span', { 'data-testid': 'remaining' }, `${remaining} items left`),
      todos.some(t => t.completed)
        ? createElement('button', {
            onClick: clearCompleted,
            'data-testid': 'clear-completed',
          }, 'Clear completed')
        : null,
    ),
  );
}

// Mount the app
const rootEl = document.getElementById('root');
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(createElement(TodoApp, null));
}

export { TodoApp };
