import React from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import { AppView } from './components/AppView';

function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/app" component={AppView} />
      </Router>
    </div>
  );
}

export default App;