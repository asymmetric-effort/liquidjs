# FileUpload

File upload component with drag-and-drop support. Features a drop zone with drag-over highlight, file list display with remove buttons, and file size validation.

## Import

```ts
import { FileUpload } from '@aspect/form/file-upload';
import type { FileUploadProps } from '@aspect/form/file-upload';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onChange` | `(files: File[]) => void` | required | Change handler. Receives the current array of selected files |
| `accept` | `string` | `undefined` | Accepted file types (e.g., `'image/*,.pdf'`) |
| `multiple` | `boolean` | `false` | Allow multiple file selection |
| `maxSize` | `number` | `undefined` | Maximum file size in bytes |
| `disabled` | `boolean` | `false` | Disabled state |
| `label` | `string` | `undefined` | Label text |
| `helpText` | `string` | `undefined` | Help text below the component |

## Usage

```ts
import { createElement } from 'specifyjs';
import { FileUpload } from '@aspect/form/file-upload';

// Basic file upload
const basic = createElement(FileUpload, {
  label: 'Attachment',
  onChange: (files) => setFiles(files),
});

// Image upload with size limit
const images = createElement(FileUpload, {
  label: 'Photos',
  accept: 'image/*',
  multiple: true,
  maxSize: 5 * 1024 * 1024, // 5 MB
  onChange: (files) => setPhotos(files),
  helpText: 'Upload one or more images',
});

// Single PDF upload
const pdf = createElement(FileUpload, {
  label: 'Document',
  accept: '.pdf',
  maxSize: 10 * 1024 * 1024, // 10 MB
  onChange: (files) => setDocument(files),
});
```

## Features

- Drag-and-drop zone with a dashed border and centered upload icon and text.
- Drag-over state highlights the zone with a blue border and light blue background.
- Click-to-browse triggers a hidden file input for standard file picker dialog.
- File size validation with configurable `maxSize`. Files exceeding the limit produce an error message with a human-readable size display.
- Human-readable file size formatting (B, KB, MB, GB).
- File list displayed below the drop zone with file name, size, and a remove button for each file.
- Multiple mode appends new files to the existing list. Single mode replaces the file.
- The hidden file input is reset after each selection so the same file can be re-selected.
- Accepted file types are displayed as secondary text in the drop zone.
- Max size constraint is displayed as secondary text in the drop zone.
- Error state changes the drop zone border to red.

## Accessibility

- The drop zone uses `role="button"` with `aria-label="Upload files"`.
- The drop zone is keyboard-focusable via `tabIndex`.
- Each file's remove button has `aria-label="Remove {filename}"` for screen reader identification.
- The hidden file input has `tabIndex: -1` to keep it out of the tab order.
- The component is wrapped in a FormFieldWrapper for label, help text, and error display.
- Error messages use `role="alert"` via the wrapper.
