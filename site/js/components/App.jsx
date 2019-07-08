import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from './Home';
import Work from './Work';
import { DataProvider } from './Data';
import { SimulationProvider } from './Simulation';

var App = () => (
    <DataProvider>
        <SimulationProvider>
            <Router>
                <Route path="/" component={ Home } />
                <Route path="/:page" component={ Work }/>
            </Router>
        </SimulationProvider>
    </DataProvider>
)

export default App;