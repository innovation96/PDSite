import React from 'react';
import {Howl} from 'howler';
import Event from '../../events';
import dispatcher from '../../dispatcher';

var _sound = null;
var _playingTimeTimer = null;

function MMSSFromSeconds(totalSec) {
  totalSec = Math.round(totalSec);
  var minutes = parseInt(totalSec / 60, 10) % 60;
  var seconds = totalSec % 60;
  return (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds  < 10 ? '0' + seconds : seconds);
}

const Player = React.createClass({
  getInitialState() {
    return {
      isPlaying: false,
      audioList: [],
      audioIndex: -1,
      timeElapsed: 0,
      timeRemaining: 0,
      timeTotal: 0,
    };
  },

  componentDidMount() {
    dispatcher.on(Event.PUSH_AUDIO, data => {
      var audioList = this.state.audioList;
      audioList.push(data);
      this.setState({ audioList: audioList });
    });

    dispatcher.on(Event.UNSHIFT_AUDIO, data => {
      var audioList = this.state.audioList;
      audioList.unshift(data);
      this.setState({ audioList: audioList });
    });

    dispatcher.on(Event.INSERT_AUDIO, data => {
      var audioList = this.state.audioList;
      for (var i = 0; i < audioList.length; i++) {
        if (audioList[i].key === data.prevKey) break;
      }
      audioList.splice(i, 0, {
        key: data.key,
        timeTotal: data.timeTotal,
        url: data.url
      });
      this.setState({ audioList: audioList });
    });

    dispatcher.on(Event.PAGE_AUDIO_TRACK_CHANGE, (data) => {
      var index = -1;
      this.state.audioList.every((audioObj, i) => {
        if (audioObj.key === data.key) {
          index = i;
          return false;
        }

        return true;
      });

      if (~index) {
        if (this.state.audioIndex === index) {
          this.playPauseAudio();
        }
        else {
          this.setState({ isPlaying: true });
          this.playAudioAtIndex(index);
        }
      }
    });
  },

  render() {
    var playPauseBtnClass = this.state.isPlaying ? 'pause-button' : 'play-button';
    var playPauseBtnText = this.state.isPlaying ? 'Pause' : 'Play';
    var prevBtnDisabledClass = this.state.audioIndex === 0 ? 'disabled' : '';
    var nextBtnDisabledClass = this.state.audioIndex + 1 === this.state.audioList.length ? 'disabled' : '';

    return (
    <div className="fixed-player clearfix">
      <div className="player-wrapper">
        <div className="player-component player-control">
          <button className={'player-button prev-button ' + prevBtnDisabledClass} onClick={this.playPrevAudio}>Prev</button>
          <button className={'player-button play-pause-button ' + playPauseBtnClass} onClick={this.playPauseAudio}>{playPauseBtnText}</button>
          <button className={'player-button next-button ' + nextBtnDisabledClass} onClick={this.playNextAudio}>Next</button>
        </div>
        <div className="player-component player-progress">
          <span className="elapsed-time">{MMSSFromSeconds(this.state.timeElapsed)}</span>
          <span className="remaining-time">{MMSSFromSeconds(this.state.timeRemaining)}</span>
          <div className="progress-bar-wrapper">
            <div className="progress-bar" style={{width: this.state.timeTotal === 0 ? '0' : Math.round(this.state.timeElapsed/this.state.timeTotal * 100) + '%'}}></div>
          </div>
        </div>
        <div className="player-component track-info">
          <a href="#" className="avatar-small-tiny">
            <img src="/images/jwt_avatar.jpg" width="35" height="35" />
          </a>
          <div className="player-tag">
            <a href="#" className="username">billyshawz</a> → <a href="#" className="tag">#politics</a>
          </div>
        </div>
      </div>
    </div>
    );
  },

  playPauseAudio(e) {
    if (e) e.preventDefault();
    if (this.state.audioList.length === 0) return;

    var isPlaying = !this.state.isPlaying;
    this.setState({ isPlaying: isPlaying });

    if (this.state.audioIndex === -1) {
      this.playAudioAtIndex(0);
      return;
    }

    if (isPlaying) {
      if (_sound) _sound.play();
      this.syncTime();
    }
    else {
      if (_sound) _sound.pause();
      this.desyncTime();
    }
  },

  playAudioAtIndex(index) {
    if (_sound) {
      _sound.stop();
      _sound.unload();
    }

    _sound = new Howl({
      urls: [this.state.audioList[index].url],
      autoplay: true,
      onplay: () => {
        this.syncTime();
        dispatcher.emit(Event.PLAYER_AUDIO_PLAYING_STATE_CHANGE, {
          key: this.state.audioList[index].key,
          isPlaying: true
        });
      },
      onpause: () => {
        console.log(index, 'paused');

        dispatcher.emit(Event.PLAYER_AUDIO_PLAYING_STATE_CHANGE, {
          key: this.state.audioList[index].key,
          isPlaying: false
        });
      },
      onend: () => {
        // TODO: looks like onend disregards pause. Maybe it's due to the cross domain issue?
        console.log(index, 'ended');

        this.desyncTime();
        dispatcher.emit(Event.PLAYER_AUDIO_PLAYING_STATE_CHANGE, {
          key: this.state.audioList[index].key,
          isPlaying: false
        });

        if (++index < this.state.audioList.length) {
          this.playAudioAtIndex(index);
        }
      }
    });

    this.setState({
      audioIndex: index,
      timeElapsed: 0,
      timeRemaining: this.state.audioList[index].timeTotal,
      timeTotal: this.state.audioList[index].timeTotal
    });

    dispatcher.emit(Event.PLAYER_AUDIO_TRACK_CHANGE, {
      key: this.state.audioList[index].key
    });
  },

  playPrevAudio(e) {
    e.preventDefault();

    var index = this.state.audioIndex;
    if (index > 0) {
      this.playAudioAtIndex(--index);
    }
  },

  playNextAudio(e) {
    e.preventDefault();

    var index = this.state.audioIndex;
    var length = this.state.audioList.length;
    if (++index < length) {
      this.playAudioAtIndex(index);
    }
  },

  syncTime() {
    if (_sound.pos()) {
      this.setState({
        timeElapsed: _sound.pos(),
        timeRemaining: this.state.audioList[this.state.audioIndex].timeTotal - _sound.pos()
      });
    }

    _playingTimeTimer = setTimeout(() => {
      this.syncTime();
    }, 1000);
  },

  desyncTime() {
    clearTimeout(_playingTimeTimer);
  }
});

export default Player;
