import React from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap'
import App from '../template/app';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('templates-content');
    if (container) {
        const root = createRoot(container);
        root.render(<App name="React" />);
    }
});