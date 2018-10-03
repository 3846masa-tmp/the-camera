import React from 'react';

import styles from './styles.css';
import Layout from '~/components/common/Layout';
import CameraView from '~/components/camera/CameraView';

class CameraPage extends React.Component {
  render() {
    return (
      <Layout>
        <CameraView />
      </Layout>
    );
  }
}

export default CameraPage;
