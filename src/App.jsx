import React from 'react';
import { hot } from 'react-hot-loader';

import CameraPage from '~/components/camera/CameraPage';
import getConstraintsWithFacingMode from '~/helpers/getConstraintsWithFacingMode';
import saveAs from '~/helpers/saveAs';
import getGeolocation from '~/helpers/getGeolocation';

class App extends React.Component {
  state = {
    page: 'camera',
    constraints: {},
    facingMode: null,
    zoom: 1,
  };

  componentDidMount() {
    this.initialize();
  }

  async initialize() {
    await getGeolocation();
    const constraints = {
      user: await getConstraintsWithFacingMode('user'),
      environment: await getConstraintsWithFacingMode('environment'),
    };
    const facingMode = constraints.environment ? 'environment' : 'user';
    this.setState({ constraints, facingMode });
  }

  get canToggleFacingMode() {
    const { constraints } = this.state;
    return constraints.user && constraints.environment;
  }

  /** @param {Blob} blob */
  onTakePhoto = (blob) => {
    saveAs(blob, `${Date.now()}.jpg`);
  };

  onClickToggleFacingMode = () => {
    if (this.canToggleFacingMode) {
      this.setState(({ facingMode: current }) => ({
        facingMode: current === 'user' ? 'environment' : 'user',
        zoom: 1,
      }));
    }
  };

  /** @param {React.FormEvent<HTMLInputElement>} ev */
  onChangeZoom = (ev) => {
    const value = ev.target.value;
    this.setState({ zoom: value });
  };

  render() {
    const { page, constraints, facingMode, zoom } = this.state;
    switch (page) {
      case 'camera': {
        return (
          <CameraPage
            constraints={constraints}
            facingMode={facingMode}
            zoom={zoom}
            onTakePhoto={this.onTakePhoto}
            onChangeZoom={this.onChangeZoom}
            onClickToggleFacingMode={this.onClickToggleFacingMode}
          />
        );
      }
    }
  }
}

export default hot(module)(App);
