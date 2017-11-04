
const md = require('@gerhobbelt/markdown-it')();
//const anchor = require('@gerhobbelt/markdown-it-anchor');
const anchor = require('../');

md.use(anchor, {
  level: 1,
  // slugify: string => string,
  permalink: false,
  // renderPermalink: (slug, opts, state, permalink) => {},
  permalinkClass: 'header-anchor',
  permalinkSymbol: '¶',
  permalinkBefore: false
});

const src = `# First header

Lorem ipsum.

## Next section!

This is totaly awesome.`;

console.log(md.render(src));
