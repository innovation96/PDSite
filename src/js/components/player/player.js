import React from 'react';
import { Link } from 'react-router';
import Event from '../../events';
import dispatcher from '../../dispatcher';

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
        url: data.url,
        user: data.user,
        channels: data.channels
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
    var playerComponent = null;

    if (this.state.audioIndex === -1) {
      prevBtnDisabledClass = 'disabled';
      nextBtnDisabledClass = 'disabled';
    }
    else {
      let audio = this.state.audioList[this.state.audioIndex];
      let channelJsx = null;
      if (audio.channels.length) {
        channelJsx = (
          <span>→ <a href="#" className="tag">#{audio.channels[0].name}</a></span>
        );
      }

      playerComponent = (
        <div className="player-component track-info">
          <audio
            src={audio.url}
            ref={(ref) => this.audio = ref}
            autoPlay={true}
            onEnded={this.onAudioEnd}
            onPlaying={this.onAudioPlaying}
            onPause={this.onAudioPause}>
          </audio>
          <Link to={'/users/' + audio.user._id} className="avatar-small-tiny">
            <img src={audio.user.profilePicture} width="35" height="35" />
          </Link>
          <div className="player-tag">
            <Link to={'/users/' + audio.user._id} className="username">{audio.user.name}</Link> {channelJsx}
          </div>
        </div>
      );
    }

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
            <div className="progress-bar" style={{width: this.state.timeTotal === 0 ? '0' : this.state.timeElapsed/this.state.timeTotal*100 + '%'}}></div>
          </div>
        </div>
        {playerComponent}
      </div>
    </div>
    );
  },

  onAudioEnd(e) {
    var index = this.state.audioIndex;
    this.desyncTime();
    dispatcher.emit(Event.PLAYER_AUDIO_PLAYING_STATE_CHANGE, {
      key: this.state.audioList[index].key,
      isPlaying: false
    });

    if (++index < this.state.audioList.length) {
      this.playAudioAtIndex(index);
    }

    this.setState({ isPlaying: false });
  },

  onAudioPause(e) {
    var index = this.state.audioIndex;
    this.emitPauseEventForIndex(index);
  },

  onAudioPlaying(e) {
    var index = this.state.audioIndex;
    this.syncTime();
    dispatcher.emit(Event.PLAYER_AUDIO_PLAYING_STATE_CHANGE, {
      key: this.state.audioList[index].key,
      isPlaying: true
    });
    this.setState({ isPlaying: true });
  },

  playPauseAudio(e) {
    if (e) e.preventDefault();
    if (this.state.audioList.length === 0) return;

    var isPlaying = !this.state.isPlaying;

    if (this.state.audioIndex === -1) {
      this.playAudioAtIndex(0);
      return;
    }

    if (isPlaying) {
      this.audio.play();
    }
    else {
      this.audio.pause();
    }
  },

  playAudioAtIndex(index) {
    this.setState({
      audioIndex: index,
      timeElapsed: 0,
      timeRemaining: this.state.audioList[index].timeTotal,
      timeTotal: this.state.audioList[index].timeTotal
    });

    // dispatcher.emit(Event.PLAYER_AUDIO_TRACK_CHANGE, {
    //   key: this.state.audioList[index].key
    // });
  },

  playPrevAudio(e) {
    e.preventDefault();

    var index = this.state.audioIndex;
    this.emitPauseEventForIndex(index);
    if (index > 0) {
      this.playAudioAtIndex(--index);
    }
  },

  playNextAudio(e) {
    e.preventDefault();

    var index = this.state.audioIndex;
    var length = this.state.audioList.length;
    this.emitPauseEventForIndex(index);
    if (index > -1 && ++index < length) {
      this.playAudioAtIndex(index);
    }
  },

  emitPauseEventForIndex(index) {
    dispatcher.emit(Event.PLAYER_AUDIO_PLAYING_STATE_CHANGE, {
      key: this.state.audioList[index].key,
      isPlaying: false
    });
    this.setState({ isPlaying: false });
    this.desyncTime();
  },

  syncTime() {
    if (this.audio) {
      this.setState({
        timeElapsed: this.audio.currentTime,
        timeRemaining: this.state.audioList[this.state.audioIndex].timeTotal - this.audio.currentTime
      });
    }

    this._playingTimeTimer = requestAnimationFrame(() => {
      this.syncTime();
    });
  },

  desyncTime() {
    cancelAnimationFrame(this._playingTimeTimer);
  }
});

export default Player;
