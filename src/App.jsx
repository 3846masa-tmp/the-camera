import React from 'react';
import { hot } from 'react-hot-loader';

import CameraPage from '~/components/camera/CameraPage';

class App extends React.Component {
  state = {
    page: 'camera',
  };

  render() {
    const { page } = this.state;
    switch (page) {
      case 'camera': {
        return <CameraPage />;
      }
    }
  }
}

export default hot(module)(App);
