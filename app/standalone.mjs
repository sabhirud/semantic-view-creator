import { readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
const read = name => readFile(new URL(`./dist/${name}`, import.meta.url), 'utf8');
const [html, css, model, app] = await Promise.all(['index.html', 'style.css', 'model.js', 'app.js'].map(read));
const script = model.replace(/^export /gm, '') + '\n' + app.replace(/^import .*?;\r?\n/, '');
const check = spawnSync(process.execPath, ['--input-type=module', '--check'], { input: script, encoding: 'utf8' });
if (check.status !== 0) throw new Error(check.stderr || String(check.error));
const output = html
  .replace('<link rel="stylesheet" href="/style.css">', `<style>${css.replace(/^@import[^;]+;/, '')}</style>`)
  .replace('<script type="module" src="/app.js"></script>', `<script type="module">${script.replace(/<\/script/gi, '<\\/script')}</script>`);
const destination = new URL('../Semantic-View-Studio.html', import.meta.url);
await writeFile(destination, output);
console.log(`Standalone preview saved: ${destination.pathname}`);
