import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';

import PreUploadOverlay from './pundit-pre-upload';
import PostUploadOverlay from './pundit-post-upload';

var preUploadOverlay = null;
var postUploadOverlay = null;

function bind() {
  $('.page-header .upload-button').on('click', showUploadPundit);
}

function showUploadPundit() {
  if (!preUploadOverlay) {
    preUploadOverlay = new PreUploadOverlay();
  }
  preUploadOverlay.show();
}

bind();
