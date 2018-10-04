import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './styles.css';

/**
 * @typedef Props
 * @property {() => void} onClickShutter
 * @property {() => void} onClickToggleFacingMode
 * @property {boolean} [disabledToggleButton]
 */
/** @type {React.SFC<Props>} */
const CameraController = (props) => {
  const { onClickShutter, onClickToggleFacingMode, disabledToggleButton } = props;
  return (
    <div className={styles.base}>
      <button className={styles.shutterButton} onClick={onClickShutter} />
      <button className={styles.facingModeButton} disabled={disabledToggleButton} onClick={onClickToggleFacingMode}>
        <FontAwesomeIcon className={styles.buttonIcon} icon={faSyncAlt} />
      </button>
    </div>
  );
};

export default CameraController;
