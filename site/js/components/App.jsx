import React, { useState } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from './Home';
import Page from './Page';

var App = () => {
    var [ view, setView ] = useState( 'tags' );
    return (
        <Router>
            <Route path="/" exact render={ () => <Home view={ view } setView={ setView }/> }/>
            <Route path="/:page" component={ Page }/>
        </Router>
    )
}

export default App;