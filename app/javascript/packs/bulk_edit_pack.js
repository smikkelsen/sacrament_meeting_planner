import React from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap'
import App from '../bulk_edit/app';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('bulk-edit-content');
    if (container) {
        const root = createRoot(container);
        root.render(<App name="React" />);
    }
});