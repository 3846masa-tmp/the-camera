import React from 'react';

import Layout from '~/components/common/Layout';
import PreviewView from '~/components/preview/PreviewView';
import PreviewController from '~/components/preview/PreviewControlll';
import * as filters from '~/filters';
import EXIF from '~/helpers/EXIF';

/**
 * @typedef Props
 * @property {Blob} original
 * @property {(blob: Blob) => void} onSave
 */

/**
 * @typedef State
 * @property {string | null} filterName
 * @property {Blob} filtered
 * @property {string} src
 */

/** @extends {React.Component<Props, State>} */
class PreviewPage extends React.Component {
  /** @type {State} */
  state = {
    filterName: null,
    filtered: null,
    src: null,
    loading: false,
  };

  componentDidMount() {
    this.updateFilteredBlob(this.props.original);
  }

  /** @param {State} prevState */
  componentDidUpdate(prevProps, prevState) {
    if (this.props.original !== prevProps.original) {
      this.updateFilteredBlob(this.props.original);
    }
    if (this.state.filtered !== prevState.filtered) {
      this.updateBlobUrl();
    }
    if (this.state.filterName !== prevState.filterName) {
      this.applyFilter();
    }
  }

  async applyFilter() {
    const { original } = this.props;
    const { filterName } = this.state;

    if (!filters[filterName]) {
      this.updateFilteredBlob(original);
      return;
    }
    this.setState({ loading: true });
    this.updateFilteredBlob(await filters[filterName](original));
    this.setState({ loading: false });
  }

  updateBlobUrl() {
    if (this.state.src) {
      URL.revokeObjectURL(this.state.src);
    }
    this.setState({
      src: URL.createObjectURL(this.state.filtered),
    });
  }

  /** @param {Blob} blob */
  updateFilteredBlob = (blob) => {
    this.setState({ filtered: blob });
  };

  onSave = async () => {
    const { original, onSave } = this.props;
    const { filtered } = this.state;
    if (original !== filtered) {
      const inserted = await EXIF.copyEXIF(original, filtered);
      onSave(inserted);
    } else {
      onSave(original);
    }
  };

  /** @param {string} name */
  onClickFilterButton = (name) => {
    this.setState(({ filterName: current }) => ({
      filterName: name !== current ? name : null,
    }));
  };

  render() {
    const { src, filterName, loading } = this.state;
    return (
      <Layout>
        <PreviewView src={src} />
        <PreviewController
          loading={loading}
          filterName={filterName}
          onSave={this.onSave}
          onClickFilterButton={this.onClickFilterButton}
        />
      </Layout>
    );
  }
}

export default PreviewPage;
