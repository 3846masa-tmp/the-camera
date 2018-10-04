import React from 'react';

import styles from './styles.css';
import Layout from '~/components/common/Layout';
import CameraView from '~/components/camera/CameraView';
import CameraController from '~/components/camera/CameraController';
import takePhotoFromStream from '~/helpers/takePhotoFromStream';

/**
 * @typedef Props
 * @property {Record<string, *>} constraints
 * @property {'user' | 'environment'} facingMode
 * @property {number} zoom
 * @property {(blob: Blob) => void} onTakePhoto
 * @property {() => void} onClickToggleFacingMode
 * @property {(ev: any) => void} onChangeZoom
 */

/**
 * @typedef State
 * @property {MediaStream} stream
 */

/** @extends {React.Component<Props, State>} */
class CameraPage extends React.Component {
  /** @type {State} */
  state = {
    stream: null,
  };

  componentDidMount() {
    this.initialize();
  }

  componentDidUpdate(prevProps) {
    if (this.props.facingMode !== prevProps.facingMode) {
      this.updateStream();
    }
    if (this.props.zoom !== prevProps.zoom) {
      this.updateZoom();
    }
  }

  componentWillUnmount() {
    this.closeStream();
  }

  async initialize() {
    await this.updateStream();
    await this.updateZoom();
  }

  async updateStream() {
    this.closeStream();
    const { constraints, facingMode } = this.props;
    if (constraints[facingMode]) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: constraints[facingMode].recommended,
      });
      this.setState({ stream });
    }
  }

  async updateZoom() {
    const { zoom } = this.props;
    const { stream } = this.state;
    if (stream && zoom) {
      const videoTrack = stream.getVideoTracks()[0];
      await videoTrack.applyConstraints({
        advanced: [{ zoom }],
      });
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
    this.props.onTakePhoto(blob);
  };

  get canToggleFacingMode() {
    const { constraints } = this.props;
    return constraints.user && constraints.environment;
  }

  get zoomRangeOptions() {
    const { constraints, facingMode } = this.props;
    if (constraints[facingMode]) {
      return constraints[facingMode].capabilities.zoom;
    }
    return {};
  }

  render() {
    const { onClickToggleFacingMode, onChangeZoom } = this.props;
    const { stream } = this.state;
    return (
      <Layout>
        <CameraView srcObject={stream} />
        <CameraController
          onClickShutter={this.onClickShutter}
          onClickToggleFacingMode={onClickToggleFacingMode}
          onChangeZoom={onChangeZoom}
          zoomRangeOptions={this.zoomRangeOptions}
          disabledToggleButton={!this.canToggleFacingMode}
        />
      </Layout>
    );
  }
}

export default CameraPage;
