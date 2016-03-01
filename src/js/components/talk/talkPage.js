import React from 'react';
import { Link } from 'react-router';
import settings from '../../settings';

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
        reposts: [],
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
  },

  render() {
    var talk = this.state.talk;
    var channelJsx = null;
    if (talk.channels.length) {
      channelJsx = (
         <span>→ <a href="#" className="tag">#{talk.channels[0].name}</a></span>
      );
    }

    return (
    <div>
      <div className="pundit-talk-header">
        <div className="pundit-header-tag">
          <Link to={'/users/' + talk.user._id} className="username">{talk.user.name}</Link> {channelJsx}
          <p>{talk.likers.length} Likes, {talk.reposts.length} Posts</p>
        </div>
        <div className="pundit-header-bar">
          <img src="images/talk_actions_container.png" height="52" width="158" />
        </div>
      </div>
      <div className="page-body pundit-reply">
        <Link className="pundit-avatar avatar-medium" to={'/users/' + talk.user._id}><img src={talk.user.profilePicture} width="60" height="60" /></Link>
        <div className="pundit-wrapper">
          <div className="pundit-details">
            <div className="pundit-tag">
              <Link to={'/users/' + talk.user._id} className="username">{talk.user.name}</Link>
            </div>
            <div className="pundit-audio">
              <button className="play-pause-button pause-button">Pause</button>
              <div className="audio-wave"></div>
            </div>
            <div className="pundit-subject">
              <p>{talk.title}</p>
              <img src="images/link_small_icon.png" width="15" height="15" />
              <a href={talk.url} className="pundit-link">{talk.url}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  },

  didFetchTalks(data) {
    this.setState({
      talk: {
        _id: data.talk._id,
        title: data.talk.title,
        url: data.talk.shortUrl,
        likers: data.talk.likers,
        reposts: data.talk.reposts,
        audio: data.talk.audioIntroduction,
        user: data.talk.user,
        channels: data.talk.channels
      }
    });
  },

  didFailFetchingTalks($xhr, status, error) {
    console.error(error);
  }
});

export default TalkPage;
