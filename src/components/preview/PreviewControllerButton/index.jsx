import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './styles.css';

/**
 * @typedef Props
 * @property {*} icon
 * @property {string} name
 * @property {boolean} active
 * @property {boolean} disabled
 * @property {(name: string) => void} onClick
 */

/** @extends {React.Component<Props>} */
class PreviewControllerButton extends React.Component {
  onClick = () => {
    const { onClick, name } = this.props;
    onClick(name);
  };

  render() {
    const { icon, active, disabled } = this.props;
    return (
      <button className={styles.base} onClick={this.onClick} disabled={disabled} data-active={active}>
        <FontAwesomeIcon className={styles.buttonIcon} icon={icon} />
      </button>
    );
  }
}

export default PreviewControllerButton;
