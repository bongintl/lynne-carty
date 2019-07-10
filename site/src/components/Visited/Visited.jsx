import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

var VisitedContext = createContext();

export var useVisit = ( url, visiting ) => {
    var { visit } = useContext( VisitedContext );
    useEffect( () => {
        if ( visiting ) visit( url )
    }, [ visiting ] );
}

export var useVisited = url => {
    var { isVisited } = useContext( VisitedContext );
    return isVisited( url );
}

export var VisitedProvider = ({ children }) => {
    var [ visited, setVisited ] = useState({});
    var isVisited = useCallback( url => url in visited );
    var visit = url => setVisited( visited => ({ ...visited, [ url ]: true }));
    return (
        <VisitedContext.Provider value={{ isVisited, visit }}>
            { children }
        </VisitedContext.Provider>
    )
}