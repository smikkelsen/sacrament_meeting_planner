import React from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap'
import App from '../hymn/app';

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Looking for hymns-content');
    const container = document.getElementById('hymns-content');
    console.log('Container found:', container);

    if (container) {
        console.log('Mounting React app...');
        const root = createRoot(container);
        root.render(<App name="React" />);
        console.log('React app mounted!');
    } else {
        console.error('hymns-content div not found!');
    }
});