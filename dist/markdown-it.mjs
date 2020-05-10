const slugify = (s) => encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-'));

const position = {
  'false': 'push',
  'true': 'unshift'
};

const hasProp = Object.prototype.hasOwnProperty;

const permalinkHref = slug => `#${slug}`;
const permalinkAttrs = slug => ({});

const renderPermalink = (slug, opts, state, idx) => {
  const space = () => Object.assign(new state.Token('text', '', 0), { content: ' ' });

  const linkTokens = [
    Object.assign(new state.Token('link_open', 'a', 1), {
      attrs: [
        [ 'class', opts.permalinkClass ],
        [ 'href', opts.permalinkHref(slug, state) ],
        ...Object.entries(opts.permalinkAttrs(slug, state))
      ]
    }),
    Object.assign(new state.Token('html_block', '', 0), { content: opts.permalinkSymbol }),
    new state.Token('link_close', 'a', -1)
  ];

  // `push` or `unshift` according to position option.
  // Space is at the opposite side.
  if (opts.permalinkSpace) {
    linkTokens[position[!opts.permalinkBefore]](space());
  }
  state.tokens[idx + 1].children[position[opts.permalinkBefore]](...linkTokens);
};

const uniqueSlug = (slug, slugs) => {
  // Mark this slug as used in the environment.
  slugs[slug] = (hasProp.call(slugs, slug) ? slugs[slug] : 0) + 1;

  // First slug, return as is.
  if (slugs[slug] === 1) {
    return slug;
  }

  // Duplicate slug, add a `-2`, `-3`, etc. to keep ID unique.
  return `${slug}-${slugs[slug]}`;
};

const isLevelSelectedNumber = selection => level => level <= selection;
const isLevelSelectedArray = selection => level => selection.includes(level);

const anchor = (md, opts) => {
  opts = Object.assign({}, anchor.defaults, opts);

  md.core.ruler.push('anchor', state => {
    const slugs = {};
    const tokens = state.tokens;

    const isLevelSelected = Array.isArray(opts.level)
      ? isLevelSelectedArray(opts.level)
      : isLevelSelectedNumber(opts.level);

    tokens
      .filter(token => token.type === 'heading_open')
      .filter(token => isLevelSelected(Number(token.tag.substr(1))))
      .forEach(token => {
        // Aggregate the next token children text.
        const title = tokens[tokens.indexOf(token) + 1]
          .children
          .filter(child_token => child_token.type === 'text' || child_token.type === 'code_inline')
          .reduce((acc, t) => acc + t.content, '');

        let slug = token.attrGet('id');

        if (slug == null) {
          slug = uniqueSlug(opts.slugify(title), slugs);
          token.attrPush([ 'id', slug ]);
        }

        if (opts.permalink) {
          opts.renderPermalink(slug, opts, state, tokens.indexOf(token));
        }

        if (opts.callback) {
          opts.callback(token, { slug, title });
        }
      });
  });
};

anchor.defaults = {
  level: 6,
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

var markdownItAnchor = anchor;

export default markdownItAnchor;
