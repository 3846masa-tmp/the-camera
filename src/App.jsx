import React from 'react';
import { hot } from 'react-hot-loader';

import CameraPage from '~/components/camera/CameraPage';

/**
 * @typedef State
 * @property {Blob | null} photo
 * @property {string} page
 */

class App extends React.Component {
  /** @type {State} */
  state = {
    photo: null,
    page: 'camera',
  };

  /** @param {Blob} blob */
  onTakePhoto = (blob) => {
    this.setState({ photo: blob });
  };

  render() {
    const { page } = this.state;
    switch (page) {
      case 'camera': {
        return <CameraPage onTakePhoto={this.onTakePhoto} />;
      }
    }
  }
}

export default hot(module)(App);
