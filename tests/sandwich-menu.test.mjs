import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { runInNewContext } from "node:vm";

const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const menuSource = source.match(/const menuItems = ([\s\S]*?) as const;/)?.[1];
assert.ok(menuSource, "The menu data must exist");
const sandwiches = runInNewContext(`(${menuSource}).brunch`);

test("the five artisan sandwiches replace the old menu in both languages", () => {
  assert.deepEqual(Array.from(sandwiches, (item) => item.ro), ["Taglio", "Fiamma", "Velluto", "Divino", "Brizza"]);
  for (const item of sandwiches) {
    assert.equal(item.en, item.ro);
    assert.equal(item.price.replace(/ lei$/, " RON"), "34 RON");
    assert.match(item.noteRo, /^Schiacciata, /);
    assert.match(item.noteEn, /^Schiacciata, /);
    assert.doesNotMatch(item.noteRo, /\d+\s*g\b/);
  }
  assert.doesNotMatch(source, /ro: "(?:Cotto|Chorizzino|Toscana)"/);
  assert.match(source, /brunch: "Sandvișuri"/);
  assert.match(source, /brunch: "Sandwiches"/);
});

test("sandwich ingredients follow the supplied photograph", () => {
  const expected = [
    ["porchetta", "spianata picante", "cremă de brânză", "miere"],
    ["rucola", "mozzarella", "cremă de brânză", "chorizo", "trufe"],
    ["cotto", "rucola", "cremă de brânză", "pesto"],
    ["mortadella", "trufe", "cremă de brânză"],
    ["ardei copt", "whipped feta", "mascarpone", "rucola"],
  ];
  sandwiches.forEach((item, index) => assert.equal(item.noteRo, ["Schiacciata", ...expected[index]].join(", ")));
  assert.doesNotMatch(sandwiches[4].noteEn, /ham|salami|chorizo|porchetta|mortadella/);
});
