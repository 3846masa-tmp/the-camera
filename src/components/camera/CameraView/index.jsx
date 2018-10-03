import React from 'react';
import styles from './styles.css';

const FULLHD_IMAGE_SRC = 'https://picsum.photos/1080/1920';

class CameraView extends React.Component {
  render() {
    return (
      <div className={styles.base}>
        <img src={FULLHD_IMAGE_SRC} className={styles.video} />
      </div>
    );
  }
}

export default CameraView;