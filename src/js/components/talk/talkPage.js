import React from 'react';
import { Link } from 'react-router';
import Wavesurfer from 'react-wavesurfer';
import settings from '../../settings';
import Event from '../../events';
import dispatcher from '../../dispatcher';
import ReplyList from '../reply/replyList';

// Backup DOM elements. Its position is between line 50 and 51,
// below this guy: <a href="#" className="pundit-link">http://techcrunch.com/2016/02/05/...</a>
/*
              <!-- <div className="pundit-preview">
                <a href="#"><img src="/images/jwt_avatar.jpg" alt="Pundit preview image" className="pundit-preview-image" width="150" height="150"></a>
                <div className="center-box pundit-preview-description">
                  <b className="center-hack"></b>
                  <div className="center-body">
                    <a href="#"><p className="pundit-preview-title">John Stewart Returns to Daily Show to Scold Congress</p></a>
                    <a href="#"><p className="pundit-preview-origin">The Daily Beast</p></a>
                  </div>
                </div>
              </div>
              <div className="pundit-actions">
                <button className="action-button-white pundit-share-button">Share</button><button className="action-button-white pundit-like-button">Like</button>
                <span className="pundit-note-description">6 Notes</span>
                <button className="action-button-white-borderless pundit-mark-button">ᐧᐧᐧ</button>
              </div> -->
*/

const TalkPage = React.createClass({
  getInitialState() {
    return {
      talk: {
        _id: '',
        title: '',
        url: '',
        likers: [],
        replies: [],
        audio: {},
        user: {},
        channels: []
      }
    };
  },

  componentDidMount() {
    $.ajax({
      url: settings.apiBase + 'talks/' + this.props.params.id,
      data: 'populate=user,channels',
      dataType: 'json',
      success: this.didFetchTalks,
      error: this.didFailFetchingTalks
    });

    dispatcher.on(Event.PLAYER_AUDIO_TRACK_CHANGE, this.syncAudioTrack);
    dispatcher.on(Event.PLAYER_AUDIO_PLAYING_STATE_CHANGE, this.syncAudioPlayingState);
    // dispatcher.on(Event.PLAYER_AUDIO_PROGRESS_CHANGE, this.syncAudioProgress);
  },

  componentWillUnmount() {
    dispatcher.removeListener(Event.PLAYER_AUDIO_TRACK_CHANGE, this.syncAudioTrack);
    dispatcher.removeListener(Event.PLAYER_AUDIO_PLAYING_STATE_CHANGE, this.syncAudioPlayingState);
    // dispatcher.removeListener(Event.PLAYER_AUDIO_PROGRESS_CHANGE, this.syncAudioProgress);
  },

  render() {
    var talk = this.state.talk;
    var channelJsx = null;
    if (talk.channels.length) {
      channelJsx = (
         <span>→ <a href="#" className="tag">#{talk.channels[0].name}</a></span>
      );
    }

    var wavesurfer = null;
    if (talk.audio.url) {
      wavesurfer = (
        <Wavesurfer
          ref={(ref) => this.wavesurfer = ref}
          audioFile={talk.audio.url}
          pos={0}
          playing={talk.audio.isPlaying}
          onReady={this.onAudioReady}
          options={{
            height: 65,
            barWidth: 3,
            cursorWidth: 0,
            progressColor: '#08A1BF',
            waveColor: '#DFE0E0',
            normalize: true,
            interact: false
          }} />
      );
    }

    var replyList = null;
    if (talk.replies.length > 0) {
      replyList = <ReplyList ids={talk.replies} from="talk" channels={talk.channels} prevAudioKey={talk.audio.key} />;
    }

    var playPauseBtnClass = talk.audio.isPlaying ? 'pause-button' : 'play-button';
    var playPauseBtnText = talk.audio.isPlaying ? 'Pause' : 'Play';

    return (

    <div className="talk-page">
      <div>
          {/*<div className="pundit-header-tag">
            <Link to={'/users/' + talk.user._id} className="username">{talk.user.name}</Link> {channelJsx}
            <p>{talk.likers.length} Likes, {talk.replies.length} Posts</p>
          </div>
           <div className="pundit-header-bar">
            <img src="images/talk_actions_container.png" height="52" width="158" />
          </div> */}

        <div className="pundit-talk-header">
          <div className="pundit-talk-banner" style={{backgroundImage: 'url(' + talk.user.profilePicture + ')'}}></div>
          <h3 className="title"><span className="pundit-talk-description">Talk with <strong>{talk.user.username}</strong> about <strong>{channelJsx}</strong></span></h3>
          <p className="pundit-point-count">15 Points</p>
          <ul className="pundit-talk-participant-list">
            <li className="pundit-talk-participant"><a className="avatar-small-tiny" href="#"><img src="images/yeh_avatar.jpg" width="40" height="40" /></a></li>
            <li className="pundit-talk-participant"><a className="avatar-small-tiny" href="#"><img src="images/jwt_avatar.jpg" width="40" height="40" /></a></li>
            <li className="pundit-talk-participant"><a className="avatar-small-tiny" href="#"><img src="images/yeh_avatar.jpg" width="40" height="40" /></a></li>
            <li className="pundit-talk-participant"><a className="avatar-small-tiny" href="#"><img src="images/jwt_avatar.jpg" width="40" height="40" /></a></li>
            <li className="pundit-talk-participant"><a className="avatar-small-tiny" href="#"><img src="images/jwt_avatar.jpg" width="40" height="40" /></a></li>
            <li className="pundit-talk-participant"><a className="avatar-small-tiny" href="#"><img src="images/yeh_avatar.jpg" width="40" height="40" /></a></li>
            <li className="pundit-talk-participant"><a className="avatar-small-tiny" href="#"><img src="images/jwt_avatar.jpg" width="40" height="40" /></a></li>
            <li className="pundit-talk-participant"><a className="avatar-small-tiny" href="#"><img src="images/yeh_avatar.jpg" width="40" height="40" /></a></li>
          </ul>
        </div>
        <div className="page-body pundit-reply">
          <div className="pundit-wrapper">
            <div className="pundit-details">
            <div className="pundit-avatar avatar-small" to={'/users/' + talk.user._id}><img src={talk.user.profilePicture} width="50" height="50" /></div>
              <div className="pundit-tag">
                <div to={'/users/' + talk.user._id} className="username">{talk.user.username} {channelJsx}</div>
              </div>
              <div className="pundit-audio">
              <button className={'play-pause-button ' + playPauseBtnClass} onClick={this.playPauseAudio}>{playPauseBtnText}</button>
                <div className="audio-wave">{wavesurfer}</div>
                <div className="wave-overlay"></div>
              </div>
              <div className="pundit-subject">
                <h3>{talk.title}</h3>
                {/* <img src="images/link_small_icon.png" width="15" height="15" />
                <a href={talk.url} className="pundit-link">{talk.url}</a>
                Pundit links are to be incorporated with the title text. */}
                <div className="pundit-actions">
                  <button className="pundit-like-button"></button><h5 className="like-count">{talk.likers.length} Likes</h5>
                </div>
              </div>
            </div>
          </div>
          <form action="#" className="reply-input">
            <input type="text" className="reply-input-box" placeholder={'Reply to ' + talk.user.username} />
            <button className="hvr-back-pulse post-reply send-reply-button">Send</button>
          </form>
          <h4 className="reply-count">{talk.replies.length} Replies</h4>
        </div>
      </div>
      {replyList}
    </div>
    );
  },

  didFetchTalks(data) {
    data.talk.audioIntroduction = data.talk.audioIntroduction || {};
    data.talk.audioIntroduction.isPlaying = false;

    this.setState({
      talk: {
        _id: data.talk._id,
        title: data.talk.title,
        url: data.talk.shortUrl,
        likers: data.talk.likers,
        replies: data.talk.replies,
        audio: data.talk.audioIntroduction,
        user: data.talk.user,
        channels: data.talk.channels
      }
    });

    dispatcher.emit(Event.UNSHIFT_AUDIO, {
      key: data.talk.audioIntroduction.key,
      timeTotal: data.talk.audioIntroduction.len,
      url: data.talk.audioIntroduction.url,
      user: {
        _id: data.talk.user._id,
        profilePicture: data.talk.user.profilePicture,
        name: data.talk.user.name
      },
      channels: data.talk.channels
    });
  },

  didFailFetchingTalks($xhr, status, error) {
    console.error(error);
  },

  playPauseAudio(e) {
    e.preventDefault();
    dispatcher.emit(Event.PAGE_AUDIO_TRACK_CHANGE, {
      key: this.state.talk.audio.key
    });
  },

  syncAudioTrack(data) {
    if (data.key !== this.state.talk.audio.key) {
      let talk = this.state.talk;
      let audio = talk.audio;
      audio.isPlaying = false;
      this.setState({ talk: talk });
      if (this.wavesurfer.state.pos > 0) {
        this.wavesurfer._wavesurfer.pause();
        this.wavesurfer._wavesurfer.seekTo(0);
      }
    }
  },

  syncAudioPlayingState(data) {
    var talk = this.state.talk;
    var audio = talk.audio;
    if (data.key === this.state.talk.audio.key) {
      audio.isPlaying = data.isPlaying;
      this.setState({ talk: talk });
    }
    else {
      audio.isPlaying = false;
      this.setState({ talk: talk });
      if (this.wavesurfer.state.pos > 0) {
        this.wavesurfer._wavesurfer.pause();
        this.wavesurfer._wavesurfer.seekTo(0);
      }
    }
  },

  syncAudioProgress(data) {

  },

  onAudioReady(e) {
    e.wavesurfer.setVolume(0);
  }
});

export default TalkPage;
