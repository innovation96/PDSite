import $ from 'jquery';
import Handlebars from 'handlebars';

var templateHTML = `
<div class="overlay-fullpage-bg">
  <div class="centered-overlay upload-form">
    <div class="upload-drop-area">
      <h2 class="title">Drag & Drop Audio File Here to Share</h2>
      <h3 class="subtitle">Tease your latest comedy routine.</h3>
      <button class="action-button-hollow-blue file-button">Choose File...</button>
    </div>
    <p class="description">PUNDIT supports .mp3, .wav, .mp4 files.</p>
  </div>
</div>
`;

class PreUploadOverlay {
  constructor() {
    this._impression = false;
    this._template = Handlebars.compile(templateHTML);
    this.bind();
    this.html = this._template();
  }

  destroy() {

  }

  bind() {

  }

  unbind() {

  }

  show() {
    if (this._impression) {

    }
    else {
      $(document.body).append(this.html);
      this._impression = true;
    }
  }
}

export default PreUploadOverlay;
