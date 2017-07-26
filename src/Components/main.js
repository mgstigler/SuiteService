import React from 'react';
import ReactDOM from 'react-dom';
import Container from './Container';
 
document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(
    React.createElement(Container),
    document.getElementById('mount')
  );
});