import React from 'react';
import {Link} from 'react-router';

const Reply = React.createClass({
  // TODO: Line 29 should also have the following markup. But it looks like the info is not a channel.
  // → <Link to={'/channels/' + this.props.talk.channels[0]._id} className="tag">#{this.props.talk.channels[0].name}</Link>
  render() {
    var reply = this.props.reply;
    var playPauseBtnClass = reply.answer.aws.isPlaying ? 'pause-button' : 'play-button';
    var playPauseBtnText = reply.answer.aws.isPlaying ? 'Pause' : 'Play';

    return (
    <div className="page-body pundit-reply">
      <Link className="pundit-avatar avatar-medium" to={'/users/' + reply.creator._id}><img src={reply.creator.profilePicture} width="60" height="60" /></Link>
      <div className="pundit-wrapper">
        <div className="pundit-details">
          <div className="pundit-tag">
            <Link to={'/users/' + reply.creator._id} className="username">{reply.creator.name}</Link>
          </div>
          <div className="pundit-audio">
            <button className={'play-pause-button ' + playPauseBtnClass} data-audio-key={reply.answer.aws.key} onClick={this.props.playPauseAudio}>{playPauseBtnText}</button>
            {/*<div className="audio-wave">{wavesurfer}</div>*/}
          </div>
          <div className="pundit-subject">
            <p>{reply.text}</p>
            {/*<img src="images/link_small_icon.png" width="15" height="15" />
            <a href={reply.url} className="pundit-link">{reply.url}</a>*/}
          </div>
        </div>
      </div>
    </div>
    );
  }
});

export default Reply;