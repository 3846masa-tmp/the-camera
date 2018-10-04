import React from 'react';
import { hot } from 'react-hot-loader';

import CameraPage from '~/components/camera/CameraPage';
import PreviewPage from '~/components/preview/PreviewPage';
import saveAs from '~/helpers/saveAs';

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
    this.setState({
      page: 'preview',
      photo: blob,
    });
  };

  /** @param {Blob} blob */
  onSave = (blob) => {
    saveAs(blob, `${Date.now()}.jpg`);
    this.setState({
      page: 'camera',
      photo: null,
    });
  };

  render() {
    const { page, photo } = this.state;
    switch (page) {
      case 'camera': {
        return <CameraPage onTakePhoto={this.onTakePhoto} />;
      }
      case 'preview': {
        return <PreviewPage original={photo} onSave={this.onSave} />;
      }
    }
  }
}

export default hot(module)(App);
