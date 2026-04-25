// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import { createElement } from 'specifyjs';
import { createRoot } from 'specifyjs/dom';
import { App } from './app';

// SpecifyJS v0.0.1 — Declarative TypeScript UI Framework
const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
