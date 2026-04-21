import { createElement, Fragment } from 'liquidjs';
import { useState, useEffect, useCallback, useMemo } from 'liquidjs/hooks';
import { createRoot } from 'liquidjs/dom';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
}

// --- GraphQL helpers ---

function gql(query: string): { query: string; execute: () => Promise<any> } {
  return {
    query,
    execute: () =>
      fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      }).then((r) => r.json()),
  };
}

const CONTACTS_QUERY = `{
  contacts {
    id name email phone department
  }
}`;

function contactByIdQuery(id: number): string {
  return `{
  contact(id: ${id}) {
    id name email phone department
  }
}`;
}

function addContactMutation(c: Omit<Contact, 'id'>): string {
  return `mutation {
  addContact(input: { name: "${c.name}", email: "${c.email}", phone: "${c.phone}", department: "${c.department}" }) {
    id name email phone department
  }
}`;
}

function deleteContactMutation(id: number): string {
  return `mutation {
  deleteContact(id: ${id}) {
    id name
  }
}`;
}

// --- Hooks ---

function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState('');

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const op = gql(CONTACTS_QUERY);
    setLastQuery(op.query);
    try {
      const json = await op.execute();
      if (json.errors) throw new Error(json.errors[0].message);
      setContacts(json.data.contacts);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addContact = useCallback(async (c: Omit<Contact, 'id'>) => {
    const q = addContactMutation(c);
    setLastQuery(q);
    try {
      const json = await gql(q).execute();
      if (json.errors) throw new Error(json.errors[0].message);
      await fetchContacts();
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  }, [fetchContacts]);

  const deleteContact = useCallback(async (id: number) => {
    const q = deleteContactMutation(id);
    setLastQuery(q);
    try {
      const json = await gql(q).execute();
      if (json.errors) throw new Error(json.errors[0].message);
      setContacts((prev: Contact[]) => prev.filter((c) => c.id !== id));
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  }, []);

  return { contacts, loading, error, lastQuery, fetchContacts, addContact, deleteContact };
}

// --- Components ---

function QueryInspector(props: { query: string }) {
  if (!props.query) return null;
  return createElement(
    'div', { className: 'query-inspector' },
    createElement('div', { className: 'query-inspector-label' }, 'Last GraphQL Query'),
    createElement('pre', null, props.query),
  );
}

function SearchBar(props: { value: string; onInput: (v: string) => void }) {
  return createElement('input', {
    type: 'text',
    className: 'search-bar',
    placeholder: 'Search contacts by name, email, or department...',
    value: props.value,
    onInput: (e: Event) => props.onInput((e.target as HTMLInputElement).value),
  });
}

function AddContactForm(props: { onAdd: (c: Omit<Contact, 'id'>) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');

  const handleSubmit = useCallback(() => {
    if (!name.trim() || !email.trim()) return;
    props.onAdd({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      department: department.trim(),
    });
    setName('');
    setEmail('');
    setPhone('');
    setDepartment('');
  }, [name, email, phone, department, props.onAdd]);

  return createElement(
    'div', { className: 'add-form' },
    createElement('input', {
      type: 'text', placeholder: 'Name *', value: name,
      onInput: (e: Event) => setName((e.target as HTMLInputElement).value),
    }),
    createElement('input', {
      type: 'email', placeholder: 'Email *', value: email,
      onInput: (e: Event) => setEmail((e.target as HTMLInputElement).value),
    }),
    createElement('input', {
      type: 'tel', placeholder: 'Phone', value: phone,
      onInput: (e: Event) => setPhone((e.target as HTMLInputElement).value),
    }),
    createElement('input', {
      type: 'text', placeholder: 'Department', value: department,
      onInput: (e: Event) => setDepartment((e.target as HTMLInputElement).value),
    }),
    createElement('button', { onClick: handleSubmit, className: 'add-btn' }, 'Add Contact'),
  );
}

function ContactCard(props: { contact: Contact; onDelete: (id: number) => void }) {
  const c = props.contact;
  return createElement(
    'div', { className: 'contact-card' },
    createElement('div', { className: 'contact-header' },
      createElement('div', { className: 'contact-avatar' }, c.name.charAt(0).toUpperCase()),
      createElement('div', { className: 'contact-info' },
        createElement('div', { className: 'contact-name' }, c.name),
        createElement('div', { className: 'contact-dept' }, c.department),
      ),
      createElement('button', {
        className: 'delete-btn',
        onClick: () => props.onDelete(c.id),
        title: 'Delete contact',
      }, '\u00d7'),
    ),
    createElement('div', { className: 'contact-details' },
      createElement('div', { className: 'contact-detail' },
        createElement('span', { className: 'detail-label' }, 'Email'),
        createElement('span', null, c.email),
      ),
      createElement('div', { className: 'contact-detail' },
        createElement('span', { className: 'detail-label' }, 'Phone'),
        createElement('span', null, c.phone),
      ),
    ),
  );
}

function ContactList(props: { contacts: Contact[]; onDelete: (id: number) => void }) {
  if (props.contacts.length === 0) {
    return createElement('div', { className: 'empty-state' }, 'No contacts found.');
  }
  return createElement(
    'div', { className: 'contact-grid' },
    ...props.contacts.map((c) =>
      createElement(ContactCard, { key: c.id, contact: c, onDelete: props.onDelete }),
    ),
  );
}

function App() {
  const { contacts, loading, error, lastQuery, fetchContacts, addContact, deleteContact } = useContacts();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const filtered = useMemo(() => {
    if (!search.trim()) return contacts;
    const term = search.toLowerCase();
    return contacts.filter(
      (c: Contact) =>
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.department.toLowerCase().includes(term),
    );
  }, [contacts, search]);

  return createElement(
    'div', { className: 'app' },
    createElement('h1', null, 'Contact Directory'),
    createElement('p', { className: 'subtitle' }, 'LiquidJS UI \u2194 Go GraphQL API'),
    error ? createElement('div', { className: 'error' }, `Error: ${error}`) : null,
    createElement(QueryInspector, { query: lastQuery }),
    createElement(SearchBar, { value: search, onInput: setSearch }),
    createElement(AddContactForm, { onAdd: addContact }),
    loading
      ? createElement('div', { className: 'loading' }, 'Loading...')
      : createElement(ContactList, { contacts: filtered, onDelete: deleteContact }),
    createElement('footer', null,
      createElement('span', null, `${filtered.length} of ${contacts.length} contacts`),
      createElement('button', { onClick: fetchContacts, className: 'refresh-btn' }, 'Refresh'),
    ),
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
