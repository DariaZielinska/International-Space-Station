import React from 'react'
import ReactDOM from 'react-dom'
import './scss/main.scss'
import Fullpage from './js/Fullpage'

document.addEventListener('DOMContentLoaded', function(){
    ReactDOM.render(<Fullpage/>, document.getElementById('app'))
});

