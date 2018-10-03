import React from 'react';
import styles from './styles.css';

/**
 * @typedef Props
 * @property {() => void} onClickShutter
 */
/** @type {React.SFC<Props>} */
const CameraController = (props) => {
  const { onClickShutter } = props;
  return (
    <div className={styles.base}>
      <button className={styles.shutterButton} onClick={onClickShutter} />
    </div>
  );
};

export default CameraController;
