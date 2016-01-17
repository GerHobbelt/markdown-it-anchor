export default function(md) {
  var uriRegex = /^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i,
      pathRegex = /^(\/)?([^\/\0]+(\/)?)+$/i;

  function imageUploader(state) {
    // do not process first and last token
    for (var i=1, l=state.tokens.length; i < (l - 1); ++i) {
      var token = state.tokens[i];

      // inline token
      if (token.type !== 'inline') { continue; }
      // inline token have 1 child
      if (!token.children || token.children.length !== 1) { continue; }
      // child is image
      if (token.children[0].type !== 'image') { continue; }
      // prev token is paragraph open
      if (i !== 0 && state.tokens[i - 1].type !== 'paragraph_open') { continue; }
      // next token is paragraph close
      if (i !== (l - 1) && state.tokens[i + 1].type !== 'paragraph_close') { continue; }

      var open = state.tokens[i - 1];
      var close = state.tokens[i + 1];
      open.attrPush(['class', 'js-drop-zone image-uploader']);
      open.type = 'image_uploader_open';
      open.tag = 'section';
      close.type = 'image_uploader_close';
      close.tag = 'section';

      var imageToken = token.children[0];

      var src = imageToken.attrs[imageToken.attrIndex('src')][1],
          alt = imageToken.content;

      var image = '';

      if (src && (src.match(uriRegex) || src.match(pathRegex))) {
        image = '<img class="js-upload-target" src="' + src + '"/>';
      }

      token.children = [];
      var htmlToken = new state.Token('html_block', '', 0);

      htmlToken.content = image +
        '<div class="description">Add image of <strong>' + alt + '</strong></div>' +
        '<input data-url="upload" class="js-fileupload main fileupload" type="file" name="uploadimage">';

      token.children.push(htmlToken);
    }
  }

  md.core.ruler.push('image_uploader', imageUploader);
}
