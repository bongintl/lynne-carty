import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from './Home';
import Work from './Work';
import DataContext from './DataContext';
import useData from '../hooks/useData';

var App = () => {
    var data = useData();
    if ( data === null ) return 'Loading';
    return (
        <DataContext.Provider value={ data }>
            <Router>
                <Route path="/" component={ Home } />
                <Route path="/:page" component={ Work }/>
            </Router>
        </DataContext.Provider>
    )
}

export default App;