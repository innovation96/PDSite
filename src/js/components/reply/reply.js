import React from 'react';
import {Link} from 'react-router';
import Wavesurfer from 'react-wavesurfer';
import ReplyList from './replyList';

const Reply = React.createClass({
  // TODO: Line 29 should also have the following markup. But it looks like the info is not a channel.
  // → <Link to={'/channels/' + this.props.talk.channels[0]._id} className="tag">#{this.props.talk.channels[0].name}</Link>
  render() {
    var reply = this.props.reply;

    var wavesurfer = null;
    if (reply.answer.aws.url) {
      wavesurfer = (
        <Wavesurfer
          ref={(ref) => this.wavesurfer = ref}
          audioFile={reply.answer.aws.url}
          pos={0}
          playing={reply.answer.aws.isPlaying}
          onReady={this.onAudioReady}
          options={{
            height: 65,
            barWidth: 3,
            cursorWidth: 0,
            progressColor: '#08a1bf',
            waveColor: '#DFE0E0',
            interact: false
          }} />
      );
    }

    if (reply.answer.aws.shouldReset && this.wavesurfer.state.pos > 0) {
      // It is bad to update state inside render. But the pos prop of wavesurfer
      // doesn't work. So I have to do it here. And in order to make it run after
      // render method, use setTimeout 0 here.
      setTimeout(() => {
        this.wavesurfer._wavesurfer.pause();
        this.wavesurfer._wavesurfer.seekTo(0);
      }, 0);
    }

    var replyList = null;
    if (reply.replies.length) {
      replyList = (
        <ReplyList ids={[]} replies={reply.replies} from="reply" prevAudioKey={reply.answer.aws.key} />
      );
    }

    var playPauseBtnClass = reply.answer.aws.isPlaying ? 'pause-button' : 'play-button';
    var playPauseBtnText = reply.answer.aws.isPlaying ? 'Pause' : 'Play';

    return (
    <div className="page-body pundit-reply pundit-sub-reply">
      <div className="pundit-wrapper">
        <div className="pundit-details">
        <div className="pundit-avatar-reply avatar-small" to={'/users/' + reply.creator._id}><img src={reply.creator.profilePicture} width="60" height="60" /></div>
          <div className="pundit-tag">
            <div to={'/users/' + reply.creator._id} className="username">{reply.creator.username}</div>
          </div>
          <div className="pundit-audio">
            <button className={'play-pause-button ' + playPauseBtnClass} data-audio-key={reply.answer.aws.key} onClick={this.props.playPauseAudio}>{playPauseBtnText}</button>
            <div className="audio-wave-reply">{wavesurfer}</div>
            <div className="wave-overlay"></div>
          </div>
          <div className="pundit-subject">
            <p>{reply.text}</p>
            <div className="pundit-actions">
              <button className="pundit-like-button" onClick={this.props.onLike}><h5 className="reply-like-count">{reply.likers.length} Likes</h5></button>
              <button className="pundit-subreply-button" onClick={this.props.onSubreply}><h5 className="subreply-count">Replies</h5></button>
            </div>
            {/*<img src="images/link_small_icon.png" width="15" height="15" />
            <a href={reply.url} className="pundit-link">{reply.url}</a>*/}
          </div>
        </div>
        {replyList}
      </div>
    </div>
    );
  },

  onAudioReady(e) {
    e.wavesurfer.setVolume(0);
  }
});

export default Reply;
