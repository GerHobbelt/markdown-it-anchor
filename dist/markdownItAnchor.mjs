/*! markdown-it-anchor 5.3.0-19 https://github.com//GerHobbelt/markdown-it-anchor @license UNLICENSE */

const slugify = s => encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-'));

const position = {
  'false': 'push',
  'true': 'unshift'
};

const permalinkHref = slug => `#${slug}`;

const permalinkAttrs = slug => ({});

function renderPermalink(slug, opts, state, idx) {
  const space = () => Object.assign(new state.Token('text', '', 0), {
    content: ' '
  });

  const linkTokens = [Object.assign(new state.Token('link_open', 'a', 1), {
    attrs: [['class', opts.permalinkClass], ['href', opts.permalinkHref(slug, state)], ...Object.entries(opts.permalinkAttrs(slug, state))]
  }), Object.assign(new state.Token('html_block', '', 0), {
    content: opts.permalinkSymbol
  }), new state.Token('link_close', 'a', -1)]; // `push` or `unshift` according to position option.
  // Space is at the opposite side.

  if (opts.permalinkSpace) {
    linkTokens[position[!opts.permalinkBefore]](space());
  }

  state.tokens[idx + 1].children[position[opts.permalinkBefore]](...linkTokens);
}

function uniqueSlug(slug, slugs, failOnNonUnique) {
  // If first slug, return as is.
  let key = slug;
  let n = 2;

  if (slugs.has(key) && failOnNonUnique) {
    throw new Error(`The ID attribute '${slug}' defined by user or other markdown-it plugin is not unique. Please fix it in your markdown to continue.`);
  }

  while (slugs.has(key)) {
    // Duplicate slug, add a `-2`, `-3`, etc. to keep ID unique.
    key = `${slug}-${n++}`;
  } // Mark this slug as used in the environment.


  slugs.set(key, true);
  return key;
}

const isLevelSelectedNumber = selection => level => level <= selection;

const isLevelSelectedArray = selection => level => selection.includes(level);

const anchor = (md, opts) => {
  opts = Object.assign({}, anchor.defaults, opts);
  md.core.ruler.push('anchor', state => {
    const slugs = new Map();
    const tokens = state.tokens;
    const isLevelSelected = Array.isArray(opts.level) ? isLevelSelectedArray(opts.level) : isLevelSelectedNumber(opts.level);
    let htoks = tokens.filter(token => token.type === 'heading_open');
    htoks.forEach(token => {
      // Before we do anything, we must collect all previously defined ID attributes to ensure we won't generate any duplicates:
      let slug = token.attrGet('id');

      if (slug != null) {
        // mark existing slug/ID as unique, at least.
        // IFF it collides, FAIL!
        slug = uniqueSlug(slug, slugs, true);
      }
    });
    htoks.filter(token => isLevelSelected(Number(token.tag.substr(1)))).forEach(token => {
      // Aggregate the next token children text.
      const idx = tokens.indexOf(token);
      const title = tokens[idx + 1].children.filter(child_token => child_token.type === 'text' || child_token.type === 'code_inline').reduce((acc, t) => acc + t.content, '');
      let slug = token.attrGet('id');

      if (slug == null) {
        slug = uniqueSlug(opts.slugify(title), slugs, false);
        token.attrSet('id', slug);
      }

      if (opts.permalink) {
        opts.renderPermalink(slug, opts, state, idx);
      }

      if (opts.callback) {
        opts.callback(token, {
          slug,
          title
        });
      }
    });
  });
};

anchor.defaults = {
  level: 6,
  // **max** level or array of levels
  slugify,
  permalink: false,
  renderPermalink,
  permalinkClass: 'header-anchor',
  permalinkSpace: true,
  permalinkSymbol: '¶',
  permalinkBefore: false,
  permalinkHref,
  permalinkAttrs
};
module.exports = anchor;
//# sourceMappingURL=markdownItAnchor.mjs.map
