import React from 'react';
import $ from 'jquery';
import settings from '../../settings';
import Event from '../../events';
import dispatcher from '../../dispatcher';
import Reply from './reply';

function idIndexAtSource(id, source) {
  var index = -1;

  source.every((item, i) => {
    if (item._id === id) {
      index = i;
      return false;
    }
    return true;
  });

  return index;
}

function alterRepliesStructure(target, source) {
  var id = '';
  var index = -1;
  for (var i = 0; i < target.replies.length; i++) {
    id = target.replies[i];
    index = idIndexAtSource(id, source);
    if (~index) {
      target.replies.splice(i, 1, source.splice(index, 1)[0]);
      alterRepliesStructure(target.replies[i], source);
    }
  }
}

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
    dispatcher.on(Event.PLAYER_AUDIO_TRACK_CHANGE, this.syncAudioTrack);
    dispatcher.on(Event.PLAYER_AUDIO_PLAYING_STATE_CHANGE, this.syncAudioPlayingState);
    // dispatcher.on(Event.PLAYER_AUDIO_PROGRESS_CHANGE, this.syncAudioProgress);

    if (this.props.from === 'talk') {
      this.fetchReplies();
    }
    else {
      this.setState({
        data: {
          replies: JSON.parse(JSON.stringify(this.props.replies))
        }
      });
    }
  },

  componentWillUnmount() {
    dispatcher.removeListener(Event.PLAYER_AUDIO_TRACK_CHANGE, this.syncAudioTrack);
    dispatcher.removeListener(Event.PLAYER_AUDIO_PLAYING_STATE_CHANGE, this.syncAudioPlayingState);
    // dispatcher.removeListener(Event.PLAYER_AUDIO_PROGRESS_CHANGE, this.syncAudioProgress);
  },

  render() {
    var replies = this.state.data.replies;

    return (
    <div>
      {replies.map(reply => (<Reply key={reply._id} reply={reply} playPauseAudio={this.playPauseAudio} />))}
    </div>
    );
  },

  fetchReplies() {
    $.ajax({
      url: settings.apiBase + 'replies',

      // TODO: for now just limit to ids.length for simplicity.
      // need to do pagination in the future.
      data: 'populate=creator&limit=' + this.props.ids.length + '&ids=' + this.props.ids.join(','),

      dataType: 'json',
      success: this.didFetchReplies,
      error: this.didFailFetchingReplies
    });
  },

  didFetchReplies(data) {
    var replies = data.data.replies;

    replies.forEach((reply, i) => {
      var audio = reply.answer.aws;
      audio.isPlaying = false;

      var dispatchData = {
        key: audio.key,
        timeTotal: audio.len,
        url: audio.url,
        user: {
          _id: reply.creator._id,
          profilePicture: reply.creator.profilePicture,
          name: reply.creator.name
        },
        channels: this.props.channels
      };

      // TODO: We don't fetch data when from==='reply' anymore, this if block
      // may be safely removed sometime later. For now I just want to keep it
      // in case we update data fetching login again. Also I assume that
      // nested replies are returned in sequence.
      if (this.props.from === 'reply') {
        if (i === 0) dispatchData.prevKey = this.props.prevAudioKey;
        else dispatchData.prevKey = replies[i - 1].answer.aws.key;
        dispatcher.emit(Event.INSERT_AUDIO, dispatchData);
      }
      else {
        dispatcher.emit(Event.PUSH_AUDIO, dispatchData);
      }

    });

    for (let i = 0; i < replies.length; i++) {
      let reply = replies[i];

      if (reply.replies.length) {
        alterRepliesStructure(reply, replies);
      }
    }

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
        reply.answer.aws.shouldReset = true;
      }
    });
    this.setState({ data: d });
  },

  syncAudioPlayingState(data) {
    var d = this.state.data;
    d.replies.every(reply => {
      if (reply.answer.aws.key === data.key) {
        reply.answer.aws.isPlaying = data.isPlaying;
        reply.answer.aws.shouldReset = false;
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
