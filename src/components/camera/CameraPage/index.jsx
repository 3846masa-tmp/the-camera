import React from 'react';

import styles from './styles.css';
import Layout from '~/components/common/Layout';
import CameraView from '~/components/camera/CameraView';
import CameraController from '~/components/camera/CameraController';
import takePhotoFromStream from '~/helpers/takePhotoFromStream';
import saveAs from '~/helpers/saveAs';

/**
 * @typedef State
 * @property {MediaStream} stream
 */

class CameraPage extends React.Component {
  /** @type {State} */
  state = {
    stream: null,
  };

  componentDidMount() {
    this.updateStream();
  }

  async updateStream() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: 'environment' },
      },
    });
    this.setState({ stream });
  }

  onClickShutter = async () => {
    const { stream } = this.state;
    const blob = await takePhotoFromStream(stream);
    saveAs(blob, `${Date.now()}.jpg`);
  };

  render() {
    const { stream } = this.state;
    return (
      <Layout>
        <CameraView srcObject={stream} />
        <CameraController onClickShutter={this.onClickShutter} />
      </Layout>
    );
  }
}

export default CameraPage;
