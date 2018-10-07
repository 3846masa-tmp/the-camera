import React from 'react';
import styles from './styles.css';

/**
 * @typedef Props
 * @property {'user' | 'environment'} [facingMode]
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
    const { facingMode } = this.props;
    const className = [styles.base, facingMode === 'user' && styles.flip].filter((c) => !!c).join('\x20');
    return (
      <div className={className}>
        <video muted autoPlay playsInline ref={this.videoRef} className={styles.video} />
      </div>
    );
  }
}

export default CameraView;
