import $ from 'jquery';
import Handlebars from 'handlebars';

var templateHTML = `
<div class="overlay-fullpage-bg">
  <div class="centered-overlay edit-pundit-overlay">
    <form action="/" id="editPunditForm" class="edit-pundit-form">
      <h2 class="title">Keep it short and sweet!</h2>
      <h3 class="subtitle">Drag the markers to trim your audio to 1 minute or less.</h3>
      <div class="audio-section">
        <div class="control-button">
          <button class="play-pause-button play-button">Play</button>
        </div>
        <div class="audio-adjust">
          <div class="audio-wave"></div>
          <div class="audio-selected"></div>
          <div class="audio-adjust-slider audio-start">
            <span class="time">00:00</span>
            <span class="label">START</span>
            <button class="slider start-slider"></button>
          </div>
          <div class="audio-adjust-slider audio-end">
            <span class="time">00:59</span>
            <span class="label">END</span>
            <button class="slider end-slider"></button>
          </div>
        </div>
      </div>
      <div class="pundit-detail">
        <input type="text" class="pundit-caption" placeholder="Add a Caption">
        <input type="text" class="pundit-channel" placeholder="tag a #channel">
        <!-- TODO: Channel drop down list here -->
      </div>
      <button type="submit" class="action-button-blue submit-button">Post</button>
      <button class="action-button-gray cancel-button">Cancel</button>
    </form>
  </div>
</div>
`;

class PostUploadOverlay {
  constructor() {
    this._impression = false;
    this._isDragging = false;
    this._$draggingEl = null;
    this._startX = 0;
    this._leftmost = Number.NEGATIVE_INFINITY;
    this._rightmost = Number.POSITIVE_INFINITY;

    this._template = Handlebars.compile(templateHTML);
    this.html = this._template();
    this.$el = $(this.html);
  }

  destroy() {
    this.unbind();
    this.$el.remove();
    this.$el = null;
  }

  bind() {
    var leftSlider = this.$el.find('.audio-start .slider');
    var rightSlider = this.$el.find('.audio-end .slider');
    leftSlider
      .on('click', this._preventDefault)
      .on('mousedown', this._startDragging.bind(this));
    rightSlider
      .on('click', this._preventDefault)
      .on('mousedown', this._startDragging.bind(this));

    $(document)
      .on('mousemove', this._dragging.bind(this))
      .on('mouseup', this._stopDragging.bind(this));
  }

  unbind() {
    var leftSlider = this.$el.find('.audio-start .slider');
    var rightSlider = this.$el.find('.audio-end .slider');
    leftSlider.off('mousedown').off('click');
    rightSlider.off('mousedown').off('click');
    $(document).off('mousemove').off('mouseup');
  }

  show() {
    if (this._impression) {

    }
    else {
      $(document.body).append(this.$el);
      this._impression = true;
      this.bind();
    }
  }

  _startDragging(e) {
    e.preventDefault();

    this._isDragging = true;
    this._$draggingEl = $(e.target);
    this._$selectedAudioEl = this.$el.find('.audio-selected');

    this._startLeftXOffset = this._$selectedAudioEl.offset().left - e.pageX;
    this._startRightXOffset = -this._startLeftXOffset - this._$selectedAudioEl.width();

    var $draggingArea = this.$el.find('.audio-adjust');
    this._leftmost = $draggingArea.offset().left;
    this._rightmost = $draggingArea.width() + this._leftmost;
  }

  _dragging(e) {
    if (this._isDragging) {
      let $slider = this._$draggingEl;
      let isLeft = $slider.hasClass('start-slider');
      let $counterpart = isLeft ? this.$el.find('.audio-end .slider') : this.$el.find('.audio-start .slider');

      if (isLeft) {
        let left = e.pageX - this._leftmost + this._startLeftXOffset;
        if (left < 0) left = 0;
        let width = $counterpart.parent().position().left - left;

        $slider.parent().css('left', left);
        this._$selectedAudioEl.css({ left, width });
      }
      else {
        let left = e.pageX - this._leftmost - this._startRightXOffset;
        if (e.pageX > this._rightmost) {
          left = this._rightmost - this._leftmost;
        }
        let width = left - $counterpart.parent().position().left;

        $slider.parent().css('left', left);
        this._$selectedAudioEl.css('width', width);
      }
    }
  }

  _stopDragging(e) {
    this._isDragging = false;
  }

  _preventDefault(e) {
    e.preventDefault();
  }
}

export default PostUploadOverlay;
