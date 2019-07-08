import React, { createContext, useContext, useMemo } from 'react';
import tinycolor from 'tinycolor2'
import useFetch from '~/hooks/useFetch';

var DataContext = createContext();

export var useData = () => useContext( DataContext );

export var DataProvider = ({ children }) => {
    var data = useFetch( './home.json' );
    var transformedData = useMemo(() => {
        if ( data === null ) return null;
        var { projects, tags } = data;
        projects = projects.map( ( project, i ) => ({ ...project, i }) )
        return {
            projects,
            tags: tags.map( ({ name }) => name ),
            byTag: Object.fromEntries( tags.map( tag => [
                tag.name,
                projects
                    .map( ( project, i ) => ({ project, i }) )
                    .filter( ({ project }) => project.tags.includes( tag.name ) )
                    .map(( { project, i }) => i )
            ])),
            colors: Object.fromEntries( tags.map( tag => [
                tag.name,
                tinycolor( tag.color )
            ]))
        }
    }, [ data ] );
    return (
        <DataContext.Provider value={ transformedData }>
            { data === null ? null : children }
        </DataContext.Provider>
    )
}