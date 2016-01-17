import { equal } from 'assert';
import mit from 'markdown-it';
import ghostUpload from './';

const md = mit().use(ghostUpload);

equal(
  md.render('![]()'),
  '<section class="js-drop-zone image-uploader">' +
  '<div class="description">Add image of <strong></strong></div>' +
  '<input data-url="upload" class="js-fileupload main fileupload" type="file" name="uploadimage">' +
  '</section>\n'
);

equal(
  md.render('![A fine image]()'),
  '<section class="js-drop-zone image-uploader">' +
  '<div class="description">Add image of <strong>A fine image</strong></div>' +
  '<input data-url="upload" class="js-fileupload main fileupload" type="file" name="uploadimage">' +
  '</section>\n'
);

equal(
  md.render('![A fine image]()'),
  '<section class="js-drop-zone image-uploader">' +
  '<div class="description">Add image of <strong>A fine image</strong></div>' +
  '<input data-url="upload" class="js-fileupload main fileupload" type="file" name="uploadimage">' +
  '</section>\n'
);

equal(
  md.render('![](https://me.com/image.jpg)'),
  '<section class="js-drop-zone image-uploader">' +
  '<img class="js-upload-target" src="https://me.com/image.jpg"/>' +
  '<div class="description">Add image of <strong></strong></div>' +
  '<input data-url="upload" class="js-fileupload main fileupload" type="file" name="uploadimage">' +
  '</section>\n'
);

equal(
  md.render('![A fine image](https://me.com/image.jpg)'),
  '<section class="js-drop-zone image-uploader">' +
  '<img class="js-upload-target" src="https://me.com/image.jpg"/>' +
  '<div class="description">Add image of <strong>A fine image</strong></div>' +
  '<input data-url="upload" class="js-fileupload main fileupload" type="file" name="uploadimage">' +
  '</section>\n'
);
