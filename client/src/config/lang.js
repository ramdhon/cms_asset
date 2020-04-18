const fs = require('fs');
const path = require('path');

const lang_dir = path.join(__dirname, './lang.csv');
const raw = fs.readFileSync(lang_dir, 'utf8');
const rawSplitted = raw.split('');
const line_separator = rawSplitted.find((ch) => ch === '\n') || rawSplitted.find((ch) => ch === '\r\n') || rawSplitted.find((ch) => ch === '\r');

const lines = raw.split(line_separator);
const lang = {};
let keys = [];

lines.forEach((line, id) => {
  const items = line.split(',');
  if (id === 0) {
    keys = items;
  } else {
    if (!lang[items[0]]) {
      lang[items[0]] = {};
      items.forEach((item, idy) => {
        if (idy > 0) {
          lang[items[0]][keys[idy]] = item;
        }
      })
    }
  }
})

const output_dir = path.join(__dirname, './output.json');
fs.writeFileSync(output_dir, JSON.stringify(lang, null, 2));

module.exports = lang;