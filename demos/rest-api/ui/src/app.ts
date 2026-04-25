import { createElement, Fragment } from 'specifyjs';
import { useState, useEffect, useCallback } from 'specifyjs/hooks';
import { createRoot } from 'specifyjs/dom';

const API = '/api';

interface Bookmark {
  id: number;
  title: string;
  url: string;
  tags: string;
}

function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookmarks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/bookmarks`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setBookmarks(data);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addBookmark = useCallback(async (title: string, url: string, tags: string) => {
    try {
      const res = await fetch(`${API}/bookmarks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, url, tags }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fetchBookmarks();
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  }, [fetchBookmarks]);

  const deleteBookmark = useCallback(async (id: number) => {
    try {
      await fetch(`${API}/bookmarks/${id}`, { method: 'DELETE' });
      setBookmarks((prev: Bookmark[]) => prev.filter((b) => b.id !== id));
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  }, []);

  return { bookmarks, loading, error, fetchBookmarks, addBookmark, deleteBookmark };
}

function AddForm(props: { onAdd: (t: string, u: string, tags: string) => void }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = useCallback(() => {
    if (!title.trim() || !url.trim()) return;
    props.onAdd(title.trim(), url.trim(), tags.trim());
    setTitle('');
    setUrl('');
    setTags('');
  }, [title, url, tags, props.onAdd]);

  return createElement(
    'div', { className: 'add-form' },
    createElement('input', {
      type: 'text', placeholder: 'Title', value: title,
      onInput: (e: Event) => setTitle((e.target as HTMLInputElement).value),
    }),
    createElement('input', {
      type: 'url', placeholder: 'https://...', value: url,
      onInput: (e: Event) => setUrl((e.target as HTMLInputElement).value),
    }),
    createElement('input', {
      type: 'text', placeholder: 'Tags (comma-separated)', value: tags,
      onInput: (e: Event) => setTags((e.target as HTMLInputElement).value),
    }),
    createElement('button', { onClick: handleSubmit, className: 'add-btn' }, 'Add Bookmark'),
  );
}

function BookmarkList(props: { bookmarks: Bookmark[]; onDelete: (id: number) => void }) {
  return createElement(
    'div', { className: 'bookmark-list' },
    ...props.bookmarks.map((b) =>
      createElement('div', { key: b.id, className: 'bookmark-card' },
        createElement('div', { className: 'bookmark-header' },
          createElement('a', { href: b.url, target: '_blank', rel: 'noopener' }, b.title),
          createElement('button', {
            className: 'delete-btn', onClick: () => props.onDelete(b.id),
          }, '\u00d7'),
        ),
        createElement('div', { className: 'bookmark-url' }, b.url),
        b.tags ? createElement('div', { className: 'bookmark-tags' },
          ...b.tags.split(',').map((tag) =>
            createElement('span', { key: tag.trim(), className: 'tag' }, tag.trim()),
          ),
        ) : null,
      ),
    ),
  );
}

function App() {
  const { bookmarks, loading, error, fetchBookmarks, addBookmark, deleteBookmark } = useBookmarks();

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return createElement(
    'div', { className: 'app' },
    createElement('h1', null, 'REST API Bookmarks'),
    createElement('p', { className: 'subtitle' }, 'SpecifyJS UI \u2194 Go REST API'),
    error ? createElement('div', { className: 'error' }, `Error: ${error}`) : null,
    createElement(AddForm, { onAdd: addBookmark }),
    loading
      ? createElement('div', { className: 'loading' }, 'Loading...')
      : createElement(BookmarkList, { bookmarks, onDelete: deleteBookmark }),
    createElement('footer', null,
      createElement('span', null, `${bookmarks.length} bookmarks`),
      createElement('button', { onClick: fetchBookmarks, className: 'refresh-btn' }, 'Refresh'),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
