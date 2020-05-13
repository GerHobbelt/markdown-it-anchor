'use strict';

/*eslint-env mocha*/


const { equal } = require('assert');
const md = require('@gerhobbelt/markdown-it');
const attrs = require('@gerhobbelt/markdown-it-attrs');
const anchor = require('../');


describe('markdown-it-anchor', function () {
  it('renders default ID attributes', function () {
    equal(
      md().use(anchor).render('# H1\n\n## H2'),
      '<h1 id="h1">H1</h1>\n<h2 id="h2">H2</h2>\n'
    );
  });

  it('renders user-defined ID attributes as-is', function () {
    equal(
      md().use(attrs).use(anchor).render('# H1 {id=bubblegum}\n\n## H2 {id=shoelaces}'),
      '<h1 id="bubblegum">H1</h1>\n<h2 id="shoelaces">H2</h2>\n'
    );
  });

  it('only renders ID attributes for H1 when options.level = 1', function () {
    equal(
      md().use(anchor, { level: 1 }).render('# H1\n\n## H2'),
      '<h1 id="h1">H1</h1>\n<h2>H2</h2>\n'
    );
  });

  it('only renders ID attributes for heading levels set in options.level = [...]', function () {
    equal(
      md().use(anchor, { level: [ 2, 4 ] }).render('# H1\n\n## H2\n\n### H3\n\n#### H4\n\n##### H5'),
      '<h1>H1</h1>\n<h2 id="h2">H2</h2>\n<h3>H3</h3>\n<h4 id="h4">H4</h4>\n<h5>H5</h5>\n'
    );
  });

  it('renders permalinks when options.permalink is set', function () {
    equal(
      md().use(anchor, { permalink: true }).render('# H1'),
      '<h1 id="h1">H1 <a class="header-anchor" href="#h1">¶</a></h1>\n'
    );
  });

  it('renders permalinks with custom options.permalinkClass', function () {
    equal(
      md().use(anchor, { permalink: true, permalinkClass: 'test' }).render('# H1'),
      '<h1 id="h1">H1 <a class="test" href="#h1">¶</a></h1>\n'
    );
  });

  it('renders permalinks with custom options.permalinkSymbol', function () {
    equal(
      md().use(anchor, { permalink: true, permalinkSymbol: 'P' }).render('# H1'),
      '<h1 id="h1">H1 <a class="header-anchor" href="#h1">P</a></h1>\n'
    );
  });

  it('renders permalinks with custom HTML defined in options.permalinkSymbol', function () {
    equal(
      md().use(anchor, { permalink: true, permalinkSymbol: '<i class="icon"></i>' }).render('# H1'),
      '<h1 id="h1">H1 <a class="header-anchor" href="#h1"><i class="icon"></i></a></h1>\n'
    );
  });

  it('renders unique IDs', function () {
    equal(
      md().use(anchor).render('# Title\n\n## Title'),
      '<h1 id="title">Title</h1>\n<h2 id="title-2">Title</h2>\n'
    );
  });

  it('renders permalink before heading when options.permalinkBefore is set', function () {
    equal(
      md().use(anchor, { permalink: true, permalinkBefore: true }).render('# H1'),
      '<h1 id="h1"><a class="header-anchor" href="#h1">¶</a> H1</h1>\n'
    );
  });

  it('renders permalinks for all heading levels which have an ID attribute', function () {
    equal(
      md().use(anchor, { level: 1, permalink: true }).render('# H1\n\n## H2'),
      '<h1 id="h1">H1 <a class="header-anchor" href="#h1">¶</a></h1>\n<h2>H2</h2>\n'
    );

    equal(
      md().use(anchor, { level: 2, permalink: true }).render('# H1\n\n## H2\n\n### H3'),
      '<h1 id="h1">H1 <a class="header-anchor" href="#h1">¶</a></h1>\n<h2 id="h2">H2 <a class="header-anchor" href="#h2">¶</a></h2>\n<h3>H3</h3>\n'
    );

    equal(
      md({ html: true }).use(anchor, { permalink: true }).render('# <span>H1</span>'),
      '<h1 id="h1"><span>H1</span> <a class="header-anchor" href="#h1">¶</a></h1>\n'
    );
  });

  it('produces legible ID for heading with inline code', function () {
    equal(
      md().use(anchor).render('#### `options`'),
      '<h4 id="options"><code>options</code></h4>\n'
    );
  });

  it('callback registers every processed header', function () {
    const calls = [];
    const callback = (token, info) => calls.push({ token, info });

    equal(
      md().use(anchor, { callback }).render('# First Heading\n\n## Second Heading'),
      '<h1 id="first-heading">First Heading</h1>\n<h2 id="second-heading">Second Heading</h2>\n'
    );

    equal(calls.length, 2);
    equal(calls[0].token.tag, 'h1');
    equal(calls[0].info.title, 'First Heading');
    equal(calls[0].info.slug, 'first-heading');
    equal(calls[1].token.tag, 'h2');
    equal(calls[1].info.title, 'Second Heading');
    equal(calls[1].info.slug, 'second-heading');
  });

  it('renders custom permalink HREFs if options.permalinkHref is set up', function () {
    equal(
      md().use(anchor, {
        permalinkHref: (slug, state) => `${state.env.path}#${slug}`,
        permalink: true
      }).render('# H1', { path: 'file.html' }),
      '<h1 id="h1">H1 <a class="header-anchor" href="file.html#h1">¶</a></h1>\n'
    );
  });

  it('renders permalink space', function () {
    equal(
      md({ html: true }).use(anchor, { permalink: true, permalinkSpace: false }).render('# H1'),
      '<h1 id="h1">H1<a class="header-anchor" href="#h1">¶</a></h1>\n'
    );
  });

  it('does not render permalinks when options are set but options.permalink = false', function () {
    equal(
      md({ html: true }).use(anchor, { permalink: false, permalinkSpace: false }).render('# H1'),
      '<h1 id="h1">H1</h1>\n'
    );
  });

  it('renders permalink attributes as set in the options', function () {
    equal(
      md()
    .use(anchor, { permalink: true, permalinkAttrs: (slug, state) => ({ 'aria-label': `permalink to ${slug}`, title: 'permalink' }) })
    .render('# My title'),
      '<h1 id="my-title">My title <a class="header-anchor" href="#my-title" aria-label="permalink to my-title" title="permalink">¶</a></h1>\n'
    );
  });

  it('throws an error when input contains duplicate IDs', function () {
    equal(
      (() => {
        try {
          return md().use(attrs).use(anchor).render('# H1 {id=bubblegum}\n\n## H2 {id=bubblegum}');
        } catch (ex) {
          return ex.message;
        }
      })(),
      "The ID attribute 'bubblegum' defined by user or other markdown-it plugin is not unique. Please fix it in your markdown to continue."
    );
  });

  it('renders unique IDs which take user-specified IDs into account', function () {
    equal(
      md().use(attrs).use(anchor).render('# H1 {id=h2}\n\n## H2'),
      '<h1 id="h2">H1</h1>\n<h2 id="h2-2">H2</h2>\n'
    );
  });

  it('catch edge case: detect any user-specified ID and prevent collision in a auto-generated preceding heading', function () {
    equal(
      md().use(attrs).use(anchor).render('# H1\n\n## H2 {id=h1}'),
      '<h1 id="h1-2">H1</h1>\n<h2 id="h1">H2</h2>\n'
    );
  });

  it('create IDs in order', function () {
    equal(
      md().use(attrs).use(anchor).render('# header\n\n## header\n\n## header 2'),
      '<h1 id="header">header</h1>\n<h2 id="header-2">header</h2>\n<h2 id="header-2-2">header 2</h2>\n'
    );
  });
});
