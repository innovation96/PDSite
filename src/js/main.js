import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import Event from './events';
import dispatcher from './dispatcher';

import Header from './components/header/header';
import Player from './components/player/player';
import HomePage from './components/home/homePage';
import ChannelPage from './components/channel/channelPage';
import TalkPage from './components/talk/talkPage';
import UserPage from './components/user/userPage';
import DownloadModal from './components/modals/download';

const App = React.createClass({
  getInitialState: function() {
    return { modalIsOpen: false };
  },

  componentDidMount() {
    dispatcher.on(Event.OPEN_MODAL, this.openModal);
  },

  render() {
    return (
      <div>
        <Header />
        {this.props.children}
        <Player />
        <DownloadModal isOpen={this.state.modalIsOpen} closeModal={this.closeModal} />
      </div>
    );
  },

  openModal(e) {
    this.setState({ modalIsOpen: true });
  },

  closeModal(e) {
    this.setState({ modalIsOpen: false });
  }
});

render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={HomePage} />
      <Route path="channel/:id" component={ChannelPage} />
      <Route path="talks/:id" component={TalkPage} />
      <Route path="users/:id" component={UserPage} />
    </Route>
  </Router>
), document.getElementById('punditApp'));
