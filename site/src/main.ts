// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import { createElement, setComponentIdsEnabled } from 'specifyjs';
import { createRoot } from 'specifyjs/dom';
import { App } from './app';

setComponentIdsEnabled(true);

if (typeof window !== 'undefined') {
  (window as Record<string, unknown>).__SPECIFYJS_BUILD__ = '0.0.1-20260426';
}

const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
