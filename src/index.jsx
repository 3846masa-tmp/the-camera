import '~/development';
import React from 'react';
import ReactDOM from 'react-dom';

import '~/global.css';
import App from '~/App';

ReactDOM.render(<App />, document.getElementById('app'));

if ('serviceWorker' in navigator) {
  const swSrc = '/service-worker.js';
  navigator.serviceWorker
    .register(swSrc)
    .then((registration) => {
      console.log('ServiceWorker registration successful, scope is:', registration.scope);
    })
    .catch((error) => {
      console.error(error);
    });
}
