import ReactDOM from 'react-dom/client';
import React from 'react';
import {  BrowserRouter as Router} from "react-router-dom";

import './index.css';

import {App} from './Containers';
const root=ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Router>
            <App></App>
        </Router>
    </React.StrictMode>
)