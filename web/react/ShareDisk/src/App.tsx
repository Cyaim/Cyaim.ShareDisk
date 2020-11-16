import React from 'react';
import './App.css';
import MainLayout from './components/MainLayout/MainLayout';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import NotFound from './components/NotFound/NotFound';

function App() {
  return (
    <Router>
      <Switch>
        <>
        <div className="App">
          <Route exact path='/' component={ MainLayout } />
          <Route path='/dashboard' component={ Dashboard }/>
        </div>
        </>
        <Route path='*' component={ NotFound }/>
      </Switch>
    </Router>
  );
}

export default App;
