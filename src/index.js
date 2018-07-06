import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

var rootEl = document.getElementById('root')

ReactDOM.render(<App />, rootEl);
if (module.hot) {
    // Whenever a new version of App.js is available
    module.hot.accept('./App', function () {
      // Require the new version and render it instead
        var NextApp = require('./App')
        ReactDOM.render(<NextApp />, rootEl)
    })
}

registerServiceWorker();
