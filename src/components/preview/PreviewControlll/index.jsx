import React from 'react';
import { faAdjust, faCameraRetro, faPalette, faSmileWink, faSave } from '@fortawesome/free-solid-svg-icons';
import styles from './styles.css';
import PreviewControllerButton from '~/components/preview/PreviewControllerButton';

/**
 * @typedef Props
 * @property {string} filterName
 * @property {boolean} loading
 * @property {() => void} onSave
 * @property {(name: string) => void} onClickFilterButton
 */
/** @type {React.SFC<Props>} */
class PreviewController extends React.Component {
  buttons = [
    { icon: faAdjust, name: 'grayScale' },
    { icon: faCameraRetro, name: 'retro' },
    { icon: faSave, name: 'save' },
    { icon: faPalette, name: 'ink' },
    { icon: faSmileWink, name: 'funny' },
  ];

  onClick = (filterName) => {
    if (filterName === 'save') {
      this.props.onSave();
    } else {
      this.props.onClickFilterButton(filterName);
    }
  };

  render() {
    const { loading, filterName } = this.props;

    return (
      <div className={styles.base}>
        {this.buttons.map((props) => (
          <PreviewControllerButton
            {...props}
            key={props.name}
            active={props.name === filterName}
            disabled={loading}
            onClick={this.onClick}
          />
        ))}
      </div>
    );
  }
}

export default PreviewController;
