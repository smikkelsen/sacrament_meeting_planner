import React from 'react'
import ReactDOM from 'react-dom'
import App from '../program/app';

document.addEventListener('DOMContentLoaded', () => {
    const node = document.getElementById('programComponentData')
    const currentUser = JSON.parse(node.getAttribute('current_user'))
    ReactDOM.render(
        <App name="React" currentUser={currentUser} />,
        document.getElementById('body-content'),
    );
})

