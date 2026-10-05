// prerender.js
// Injects the server-rendered app into dist/index.html so crawlers and link
// previews see the full content without running JavaScript.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const PLACEHOLDER = '<div id="root"></div>';
const indexFile = path.resolve('dist/index.html');
const serverEntry = path.resolve('dist-ssr/entry-server.js');

const { render } = await import(pathToFileURL(serverEntry).href);
const html = fs.readFileSync(indexFile, 'utf8');
if (!html.includes(PLACEHOLDER)) throw new Error(`${PLACEHOLDER} not found in dist/index.html`);

fs.writeFileSync(indexFile, html.replace(PLACEHOLDER, `<div id="root">${render()}</div>`));
fs.rmSync(path.resolve('dist-ssr'), { recursive: true, force: true });
console.log('Prerendered dist/index.html');
