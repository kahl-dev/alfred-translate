'use strict';
const alfy = require('alfy');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const url = `https://${process.env.from +
  process.env.to}.dict.cc/?s=${alfy.input}`;
fetch(url)
  .then(res => res.text())
  .then(data => {
    const $ = cheerio.load(data);

    $('dfn, .td7nl div, .td7nl a[style]').remove();

    let items = [];
    $('tbody tr[id]').map(function(tr) {
      items.push(
        $(this)
          .find('.td7nl')
          .map(function(content) {
            return $(this).text();
          })
          .toArray()
      );
    });

    items = items.map(item => ({
      title: item[0].trim(),
      subtitle: `${item[0].trim()} => ${item[1].trim()}`,
      arg: url,
    }));

    if (!items.length) items.push({ title: 'No translation data found' });

    alfy.output(items);
  })
  .catch(console.log);
