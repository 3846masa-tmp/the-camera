import React from 'react';

import styles from './styles.css';
import Layout from '~/components/common/Layout';
import CameraView from '~/components/camera/CameraView';
import CameraController from '~/components/camera/CameraController';
import takePhotoFromStream from '~/helpers/takePhotoFromStream';
import getConstraintsWithFacingMode from '~/helpers/getConstraintsWithFacingMode';
import getGeolocation from '~/helpers/getGeolocation';

/**
 * @typedef Props
 * @property {(blob: Blob) => void} onTakePhoto
 */

/**
 * @typedef State
 * @property {MediaStream} stream
 * @property {Record<string, *>} constraints
 * @property {'user' | 'environment'} facingMode
 * @property {number} zoom
 */

/** @extends {React.Component<Props, State>} */
class CameraPage extends React.Component {
  /** @type {State} */
  state = {
    stream: null,
    constraints: {},
    facingMode: null,
    zoom: 1,
  };

  componentDidMount() {
    this.initialize();
  }

  /** @param {State} prevState */
  componentDidUpdate(_prevProps, prevState) {
    if (this.state.facingMode !== prevState.facingMode) {
      this.updateStream();
    }
    if (this.state.zoom !== prevState.zoom) {
      this.updateZoom();
    }
  }

  componentWillUnmount() {
    this.closeStream();
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

  async updateZoom() {
    const { stream, zoom } = this.state;
    const videoTrack = stream.getVideoTracks()[0];
    await videoTrack.applyConstraints({
      advanced: [{ zoom }],
    });
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
    this.props.onTakePhoto(blob);
  };

  get canToggleFacingMode() {
    const { constraints } = this.state;
    return constraints.user && constraints.environment;
  }

  get zoomRangeOptions() {
    const { constraints, facingMode } = this.state;
    if (constraints[facingMode]) {
      return constraints[facingMode].capabilities.zoom;
    }
    return {};
  }

  onClickToggleFacingMode = () => {
    if (this.canToggleFacingMode) {
      this.setState(({ facingMode: current }) => ({
        facingMode: current === 'user' ? 'environment' : 'user',
      }));
    }
  };

  /** @param {React.FormEvent<HTMLInputElement>} ev */
  onChangeZoom = (ev) => {
    const value = ev.target.value;
    this.setState({ zoom: value });
  };

  render() {
    const { stream } = this.state;
    return (
      <Layout>
        <CameraView srcObject={stream} />
        <CameraController
          onClickShutter={this.onClickShutter}
          onClickToggleFacingMode={this.onClickToggleFacingMode}
          onChangeZoom={this.onChangeZoom}
          zoomRangeOptions={this.zoomRangeOptions}
          disabledToggleButton={!this.canToggleFacingMode}
        />
      </Layout>
    );
  }
}

export default CameraPage;
