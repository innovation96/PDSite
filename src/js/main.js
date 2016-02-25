import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import Header from './components/header/header';
import Player from './components/player/player';
import HomePage from './components/home/homePage';
import ChannelPage from './components/channel/channelPage';
import TalkPage from './components/talk/talkPage';

const App = React.createClass({
  render() {
    return (
      <div>
        <Header />
        {this.props.children}
        <Player />
      </div>
    );
  }
});

render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={HomePage} />
      <Route path="channel" component={ChannelPage} />
      <Route path="talk" component={TalkPage} />
    </Route>
  </Router>
), document.getElementById('punditApp'));