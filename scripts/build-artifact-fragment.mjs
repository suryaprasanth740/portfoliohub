// Turns the single-file `npm run build:artifact` output (a complete HTML
// document with everything inlined) into a body-only fragment suitable for
// the Artifact publish tool, which wraps whatever it's given in its own
// <html>/<head>/<body> skeleton. Run after `npm run build:artifact`.
import { readFileSync, writeFileSync } from 'node:fs';

const html = readFileSync('dist-artifact/index.artifact.html', 'utf8');

const scriptOpenTag = '<script type="module" crossorigin>';
const styleOpenTag = '<style rel="stylesheet" crossorigin>';

const scriptOpenIdx = html.indexOf(scriptOpenTag);
const styleOpenIdx = html.indexOf(styleOpenTag, scriptOpenIdx);
const scriptCloseIdx = html.lastIndexOf('</script>', styleOpenIdx);
const styleCloseIdx = html.indexOf('</style>', styleOpenIdx);

if (scriptOpenIdx === -1 || styleOpenIdx === -1 || scriptCloseIdx === -1 || styleCloseIdx === -1) {
  throw new Error('Could not locate inlined <script>/<style> tags — did vite-plugin-singlefile output change?');
}

// A couple of bundled parser libraries (HTML entity/charset decoding
// tables) embed the literal U+FFFD replacement character as a string
// value. It's valid JS, but publish tooling flags raw replacement
// characters in a source file, so swap it for the equivalent JS escape —
// same runtime value, no raw byte in the file.
const js = html
  .slice(scriptOpenIdx + scriptOpenTag.length, scriptCloseIdx)
  .replaceAll('�', '\\uFFFD')
const css = html.slice(styleOpenIdx + styleOpenTag.length, styleCloseIdx)

const fragment = `<div id="root"></div>
<style>
${css}
</style>
<script type="module">
${js}
</script>
`;

writeFileSync('dist-artifact/fragment.html', fragment);
console.log(`Wrote dist-artifact/fragment.html (${(fragment.length / 1024).toFixed(0)} KB)`);
