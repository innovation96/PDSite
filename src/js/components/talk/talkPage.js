import React from 'react';

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
  render() {
    return (
    <div>
      <div className="pundit-talk-header">
        <div className="pundit-header-tag">
          <a href="#" className="username">billyshawz</a> → <a href="#" className="tag">#healthyliving</a>
          <p>15 Likes, 3 Posts</p>
        </div>
        <div className="pundit-header-bar">
          <img src="images/talk_actions_container.png" height="52" width="158" />
        </div>
      </div>
      <div className="page-body pundit-reply">
        <a className="pundit-avatar avatar-medium" href="#"><img src="images/yeh_avatar.jpg" width="60" height="60" /></a>
        <div className="pundit-wrapper">
          <div className="pundit-details">
            <div className="pundit-tag">
              <a href="#" className="username">username</a>
            </div>
            <div className="pundit-audio">
              <button className="play-pause-button pause-button">Pause</button>
              <div className="audio-wave"></div>
            </div>
            <div className="pundit-subject">
              <p>How many licks does it take to get to the center of a tootsie pop? Is it a lot?</p>
              <img src="images/link_small_icon.png" width="15" height="15" />
              <a href="#" className="pundit-link">http://techcrunch.com/2016/02/05/...</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
});

export default TalkPage;
