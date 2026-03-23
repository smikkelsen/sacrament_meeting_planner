import React from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap'
import App from '../bulletin/app';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('bulletin-content');
    if (container) {
        const root = createRoot(container);
        root.render(<App name="React" />);
    }
});