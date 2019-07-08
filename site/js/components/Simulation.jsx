import React, { createContext, useContext, useMemo } from 'react';
import { useData } from './Data';

var SimulationContext = createContext();

export var useSimulation = () => useContext( SimulationContext );

export var SimulationProvider = ({ children }) => {
    var { projects } = useData();
    var positions = projects.map( p => ({ x: 0, y: 0, r: 30 }) );
    return (
        <SimulationContext.Provider value={ positions }>
            { children }
        </SimulationContext.Provider>
    )
}