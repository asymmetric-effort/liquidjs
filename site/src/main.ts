// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import { createElement } from 'specifyjs';
import { createRoot } from 'specifyjs/dom';
import { App } from './app';

const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
