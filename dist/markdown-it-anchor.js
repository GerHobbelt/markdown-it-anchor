/*! markdown-it-anchor 5.2.7-16 https://github.com//GerHobbelt/markdown-it-anchor @license MIT */

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.markdownitAnchor = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

const slugify = (s) => encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-'));

const position = {
  'false': 'push',
  'true': 'unshift'
};

const permalinkHref = slug => `#${slug}`;
const permalinkAttrs = slug => ({});

function renderPermalink(slug, opts, state, idx) {
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
}

function uniqueSlug(slug, slugs, failOnNonUnique) {
  let key = slug;

  // Mark this slug as used in the environment.
  let n = (slugs.has(key) ? slugs.get(key) : 0) + 1;
  slugs.set(key, n);

  // First slug, return as is.
  if (n === 1) {
    return slug;
  }
  if (failOnNonUnique) {
    throw new Error(`Slug/ID '${slug}' defined by user or other markdown-it plugin is not unique. Please fix this ID duplication.`);
  }

  // Duplicate slug, add a `-2`, `-3`, etc. to keep ID unique.
  return `${slug}-${n}`;
}

const isLevelSelectedNumber = selection => level => level <= selection;
const isLevelSelectedArray = selection => level => selection.includes(level);

const anchor = (md, opts) => {
  opts = Object.assign({}, anchor.defaults, opts);

  md.core.ruler.push('anchor', state => {
    const slugs = new Map();
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
          slug = uniqueSlug(opts.slugify(title), slugs, false);
        } else {
          // mark existing slug/ID as unique, at least.
          // IFF it collides, FAIL!
          slug = uniqueSlug(slug, slugs, true);
        }
        token.attrSet('id', slug);

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

module.exports = anchor;

},{}]},{},[1])(1)
});
