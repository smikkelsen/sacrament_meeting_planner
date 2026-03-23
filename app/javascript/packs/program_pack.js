import React from 'react'
import { createRoot } from 'react-dom/client'
import App from '../program/app';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('programs-content');
    if (container) {
        const root = createRoot(container);
        root.render(<App name="React" />);
    }
});