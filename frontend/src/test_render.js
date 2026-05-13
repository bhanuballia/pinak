import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';

// We can't render App easily because it uses browser APIs.
// Let's just create a test to render OracleViewer directly.
