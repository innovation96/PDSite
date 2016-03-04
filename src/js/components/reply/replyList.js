import React from 'react';
import $ from 'jquery';
import settings from '../../settings';
import Event from '../../events';
import dispatcher from '../../dispatcher';
import Reply from './reply';

const ReplyList = React.createClass({
  getInitialState() {
    return {
      meta: { limit: 10, page: 1, total: 0, pages: 1 },
      data: {
        replies: []
      },
      error: null
    };
  },

  componentDidMount() {
    $.ajax({
      url: settings.apiBase + 'talks/' + this.props.talkId + '/replies',
      dataType: 'json',
      success: this.didFetchReplies,
      error: this.didFailFetchingReplies
    });

    dispatcher.on(Event.PLAYER_AUDIO_TRACK_CHANGE, this.syncAudioTrack);
    dispatcher.on(Event.PLAYER_AUDIO_PLAYING_STATE_CHANGE, this.syncAudioPlayingState);
    dispatcher.on(Event.PLAYER_AUDIO_PROGRESS_CHANGE, this.syncAudioProgress);
  },

  componentWillUnmount() {
    dispatcher.removeListener(Event.PLAYER_AUDIO_TRACK_CHANGE, this.syncAudioTrack);
    dispatcher.removeListener(Event.PLAYER_AUDIO_PLAYING_STATE_CHANGE, this.syncAudioPlayingState);
    dispatcher.removeListener(Event.PLAYER_AUDIO_PROGRESS_CHANGE, this.syncAudioProgress);
  },

  render() {
    return (
    <div>
      {this.state.data.replies.map(reply => (<Reply key={reply._id} reply={reply} playPauseAudio={this.playPauseAudio} />))}
    </div>
    );
  },

  didFetchReplies: function(data) {
    // TODO: Nested replies and user data

    data.data.replies.forEach(reply => {
      var audio = reply.answer.aws;
      audio.isPlaying = false;
      dispatcher.emit(Event.PUSH_AUDIO, {
        key: audio.key,
        timeTotal: audio.len,
        url: audio.url
      });
    });

    this.setState(data);
  },

  didFailFetchingReplies: function($xhr, status, error) {
    console.error(error);
  },

  playPauseAudio(e) {
    dispatcher.emit(Event.PAGE_AUDIO_TRACK_CHANGE, {
      key: e.target.getAttribute('data-audio-key')
    });
  },

  syncAudioTrack(data) {
    var d = this.state.data;
    d.replies.forEach(reply => {
      if (reply.answer.aws.key !== data.key) {
        reply.answer.aws.isPlaying = false;
      }
    });
    this.setState({ data: d });
  },

  syncAudioPlayingState(data) {
    var d = this.state.data;
    d.replies.every(reply => {
      if (reply.answer.aws.key === data.key) {
        reply.answer.aws.isPlaying = data.isPlaying;
        return false;
      }

      return true;
    });
    this.setState({ data: d });
  },

  syncAudioProgress(data) {

  }
});

export default ReplyList;
