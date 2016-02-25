import React from 'react';

const Player = React.createClass({
  render() {
    return (
    <div className="fixed-player clearfix">
      <div className="player-wrapper">
        <div className="player-component player-control">
          <button className="player-button prev-button">Prev</button>
          <button className="player-button play-pause-button pause-button">Pause</button>
          <button className="player-button next-button">Next</button>
        </div>
        <div className="player-component player-progress">
          <span className="elapsed-time">0:10</span>
          <span className="remaining-time">0:30</span>
          <div className="progress-bar-wrapper">
            <div className="progress-bar" style={{width: '30%'}}></div>
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
  }
});

export default Player;
