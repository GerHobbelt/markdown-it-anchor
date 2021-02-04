
import uslug from 'uslug';

import markdown_it from '@gerhobbelt/markdown-it';
const md = markdown_it();
//import anchor from '@gerhobbelt/markdown-it-anchor';
import anchor from '../index.js';

md.use(anchor, {
  level: 2,
  slugify: s => uslug(s),
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
