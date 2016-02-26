import React from 'react';
import settings from '../../settings';
import TalkList from '../talk/talkList';

const HomePage = React.createClass({
  render() {
    return (
    <div className="page-body pundit-talk">
      <TalkList url={settings.apiBase + 'talks'} />
    </div>
    );
  }
});

export default HomePage;