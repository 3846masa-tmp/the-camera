import React from 'react';

import styles from './styles.css';
import Layout from '~/components/common/Layout';
import CameraView from '~/components/camera/CameraView';
import CameraController from '~/components/camera/CameraController';
import takePhotoFromStream from '~/helpers/takePhotoFromStream';
import saveAs from '~/helpers/saveAs';
import getConstraintsWithFacingMode from '~/helpers/getConstraintsWithFacingMode';

/**
 * @typedef State
 * @property {MediaStream} stream
 * @property {Record<string, *>} constraints
 * @property {'user' | 'environment'} facingMode
 */

class CameraPage extends React.Component {
  /** @type {State} */
  state = {
    stream: null,
    constraints: {},
    facingMode: null,
  };

  componentDidMount() {
    this.initialize();
  }

  /** @param {State} prevState */
  componentDidUpdate(_prevProps, prevState) {
    if (this.state.facingMode !== prevState.facingMode) {
      this.updateStream();
    }
  }

  async initialize() {
    const constraints = {
      user: await getConstraintsWithFacingMode('user'),
      environment: await getConstraintsWithFacingMode('environment'),
    };
    const facingMode = constraints.environment ? 'environment' : 'user';
    this.setState({ constraints, facingMode });
  }

  async updateStream() {
    this.closeStream();
    const { constraints, facingMode } = this.state;
    if (constraints[facingMode]) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: constraints[facingMode].recommended,
      });
      this.setState({ stream });
    }
  }

  closeStream() {
    const { stream } = this.state;
    if (stream) {
      for (const track of stream.getTracks()) {
        track.stop();
      }
    }
  }

  onClickShutter = async () => {
    const { stream } = this.state;
    const blob = await takePhotoFromStream(stream);
    saveAs(blob, `${Date.now()}.jpg`);
  };

  get canToggleFacingMode() {
    const { constraints } = this.state;
    return constraints.user && constraints.environment;
  }

  onClickToggleFacingMode = () => {
    if (this.canToggleFacingMode) {
      this.setState(({ facingMode: current }) => ({
        facingMode: current === 'user' ? 'environment' : 'user',
      }));
    }
  };

  render() {
    const { stream } = this.state;
    return (
      <Layout>
        <CameraView srcObject={stream} />
        <CameraController
          onClickShutter={this.onClickShutter}
          onClickToggleFacingMode={this.onClickToggleFacingMode}
          disabledToggleButton={!this.canToggleFacingMode}
        />
      </Layout>
    );
  }
}

export default CameraPage;
