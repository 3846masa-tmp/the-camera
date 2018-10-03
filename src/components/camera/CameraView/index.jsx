import React from 'react';
import styles from './styles.css';

/**
 * @typedef Props
 * @property {MediaStream} [srcObject]
 */
/** @extends {React.Component<Props>} */
class CameraView extends React.Component {
  videoRef = React.createRef();

  setSrcObject() {
    const videoElem = this.videoRef.current;
    videoElem.srcObject = this.props.srcObject;
  }

  componentDidMount() {
    this.setSrcObject();
  }

  /** @param {Props} prevProps */
  componentDidUpdate(prevProps) {
    if (this.props.srcObject !== prevProps.srcObject) {
      this.setSrcObject();
    }
  }

  render() {
    return (
      <div className={styles.base}>
        <video muted autoPlay playsInline ref={this.videoRef} className={styles.video} />
      </div>
    );
  }
}

export default CameraView;
