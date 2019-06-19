import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from './Home';
import Page from './Page';

var App = () => (
    <Router>
        <Route path="/" exact component={ Home }/>
        <Route path="/:page" component={ Page }/>
    </Router>
)

export default App;