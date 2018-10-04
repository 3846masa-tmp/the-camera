import React from 'react';
import styles from './styles.css';

/**
 * @typedef Props
 * @property {string} [src]
 */
/** @extends {React.SFC<Props>} */
const PreviewView = (props) => (
  <div className={styles.base}>
    <img src={props.src} className={styles.image} />
  </div>
);

export default PreviewView;
