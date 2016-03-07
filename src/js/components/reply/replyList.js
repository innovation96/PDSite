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

  componentWillMount() {
    this.fetchReplies(this.props, true);
  },

  componentDidMount() {
    dispatcher.on(Event.PLAYER_AUDIO_TRACK_CHANGE, this.syncAudioTrack);
    dispatcher.on(Event.PLAYER_AUDIO_PLAYING_STATE_CHANGE, this.syncAudioPlayingState);
    dispatcher.on(Event.PLAYER_AUDIO_PROGRESS_CHANGE, this.syncAudioProgress);
  },

  componentWillUnmount() {
    dispatcher.removeListener(Event.PLAYER_AUDIO_TRACK_CHANGE, this.syncAudioTrack);
    dispatcher.removeListener(Event.PLAYER_AUDIO_PLAYING_STATE_CHANGE, this.syncAudioPlayingState);
    dispatcher.removeListener(Event.PLAYER_AUDIO_PROGRESS_CHANGE, this.syncAudioProgress);
  },

  componentWillReceiveProps(nextProps) {
    this.fetchReplies(nextProps);
  },

  render() {
    return (
    <div>
      {this.state.data.replies.map(reply => (<Reply key={reply._id} reply={reply} playPauseAudio={this.playPauseAudio} />))}
    </div>
    );
  },

  fetchReplies(props, isForce) {
    if (props.ids.length > 0) {
      // When play/pause UI state update triggers, we don't want
      // to redo ajax call. Check the length for sure.
      if (isForce || props.ids.length !== this.props.ids.length) {
        $.ajax({
          url: settings.apiBase + 'replies',
          data: 'populate=creator&ids=' + props.ids.join(','),
          dataType: 'json',
          success: this.didFetchReplies,
          error: this.didFailFetchingReplies
        });
      }
    }
  },

  didFetchReplies(data) {
    data.data.replies.forEach((reply, i) => {
      var audio = reply.answer.aws;
      audio.isPlaying = false;

      var dispatchData = {
        key: audio.key,
        timeTotal: audio.len,
        url: audio.url
      };

      if (this.props.from === 'reply') {
        if (i === 0) dispatchData.prevKey = this.props.prevAudioKey;
        else dispatchData.prevKey = data.data.replies[i - 1].answer.aws.key;
        dispatcher.emit(Event.INSERT_AUDIO, dispatchData);
      }
      else {
        dispatcher.emit(Event.PUSH_AUDIO, dispatchData);
      }

    });

    // TODO: this way causes more ajax calles to fetch
    // nested replies. Maybe we can organize some replies
    // data first and do another ajax call before setState?
    this.setState(data);
  },

  didFailFetchingReplies($xhr, status, error) {
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
