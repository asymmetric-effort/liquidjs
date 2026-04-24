import { createElement } from 'liquidjs';
import { createRoot } from 'liquidjs/dom';
import { App } from './app';

const root = createRoot(document.getElementById('root')!);
root.render(createElement(App, null));
