import React, { useState } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from '../Home';
import Work from '../Projects';
import { DataProvider } from '../Data';
import { VisitedProvider } from '../Visited';
import { SimulationProvider } from '../Simulation';

var basename = document.querySelector('base').href;

var App = () => {
    return (
        <Router basename={ basename }>
            <DataProvider>
                <VisitedProvider>
                    <SimulationProvider>
                        <Route path="/" exact component={ Home } />
                        <Route path="/:page" component={ Work }/>
                    </SimulationProvider>
                </VisitedProvider>
            </DataProvider>
        </Router>
    )
}

export default App;