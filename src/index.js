import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import FlowChart from './FlowChart';


import * as serviceWorker from './serviceWorker';

ReactDOM.render(<FlowChart/>, document.getElementById('root'));
serviceWorker.unregister();
