import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import Backendless from 'backendless';

Backendless.initApp('https://naturaltray.backendless.app')

ReactDOM.render(<App />, document.getElementById('root'));
