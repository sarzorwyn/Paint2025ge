const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const { test } = require('node:test');
const { compressSync, strToU8 } = require('fflate');
require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  module._compile(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, filename);
};
const { parseStateFromUrl, getStateQuery } = require('../src/handler/parseStateFromUrl.ts');
const encode = (value) => Buffer.from(compressSync(strToU8(JSON.stringify(value)))).toString('base64');

test('shared map and NCMP state round trip', () => {
  const areas = new Map([['JE', 'WP'], ['WJ', null]]);
  const ncmps = new Map([['WP', 2]]);
  const query = getStateQuery(areas, ncmps);
  assert.deepEqual(parseStateFromUrl(query.get('partyAreas'), 'partyAreas'), areas);
  assert.deepEqual(parseStateFromUrl(query.get('ncmpCount'), 'ncmpCount'), ncmps);
});
test('rejects unknown keys, prototype keys and invalid parties', () => {
  for (const value of [{bad: 'WP'}, {JE: 'unknown'}, {JE: 5}, JSON.parse('{"__proto__":"WP"}'), [], null]) {
    assert.equal(parseStateFromUrl(encode(value), 'partyAreas'), null);
  }
});
test('rejects seat counts that could exhaust SVG generation', () => {
  for (const value of [{WP: 1e100}, {WP: -1}, {WP: 0.5}, {WP: '12'}, {unknown: 1}, {WP: 12, PSP: 1}]) {
    assert.equal(parseStateFromUrl(encode(value), 'ncmpCount'), null);
  }
});
test('rejects malformed, oversized and highly compressed input', () => {
  for (const value of ['invalid!', 'a'.repeat(8193), encode({JE: 'x'.repeat(1000000)})]) {
    assert.equal(parseStateFromUrl(value, 'partyAreas'), null);
  }
});
