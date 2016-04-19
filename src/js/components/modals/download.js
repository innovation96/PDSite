import React from 'react';
import Modal from 'react-modal';
Modal.setAppElement(document.getElementById('punditApp'));

const customStyle = {
  overlay: {
    zIndex: 99999,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  content: {
    bottom: '90px'
  }
};

const DownloadModal = React.createClass({
  render() {
    return (
    <Modal isOpen={this.props.isOpen} onRequestClose={this.props.closeModal} style={customStyle}>
      <h2>This is a modal view</h2>
      <h3>Put the download App instructions here</h3>
    </Modal>
    );
  }
});

export default DownloadModal;