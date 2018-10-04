import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchPlus, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './styles.css';

/**
 * @typedef Props
 * @property {() => void} onClickShutter
 * @property {() => void} onClickToggleFacingMode
 * @property {(ev: any) => void} onChangeZoom
 * @property {*} zoomRangeOptions
 * @property {boolean} [disabledToggleButton]
 */
/** @type {React.SFC<Props>} */
const CameraController = (props) => {
  const { onClickShutter, onClickToggleFacingMode, onChangeZoom, zoomRangeOptions, disabledToggleButton } = props;

  return (
    <div className={styles.base}>
      {zoomRangeOptions && (
        <div className={styles.zoomRangeWrapper}>
          <FontAwesomeIcon className={styles.buttonIcon} icon={faSearchPlus} />
          <input
            type="range"
            className={styles.zoomRange}
            onInput={onChangeZoom}
            defaultValue={1}
            min={zoomRangeOptions.min}
            max={zoomRangeOptions.max}
            step={zoomRangeOptions.step}
          />
        </div>
      )}
      <button className={styles.shutterButton} onClick={onClickShutter} />
      <button className={styles.facingModeButton} disabled={disabledToggleButton} onClick={onClickToggleFacingMode}>
        <FontAwesomeIcon className={styles.buttonIcon} icon={faSyncAlt} />
      </button>
    </div>
  );
};

export default CameraController;
