import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from './Home';
import Project from './Project';

var App = () => (
    <Router>
        <Home/>
        <Route path=":view/:project" component={ Project }/>
    </Router>
)

export default App;