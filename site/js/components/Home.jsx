import React, { useState, useEffect, useMemo } from 'react';
import Tags from './Tags.jsx';
import Time from './Time.jsx';
import Color from './Color.jsx';
import tinycolor from 'tinycolor2';
import getColor from '~/utils/getColor';
import useFetch from '~/hooks/useFetch';
import useWindowSize from '~/hooks/useWindowSize';

var useCSSProperty = property => {
    var windowSize = useWindowSize();
    return useMemo( () => (
        parseFloat( getComputedStyle( document.documentElement ).getPropertyValue( property ) )
    ), [ windowSize ] );
}

var useRadius = () => {
    
}
    
var useData = () => {
    var data = useFetch( '/home.json' );
    var [ projectColors, setProjectColors ] = useState( null );
    useEffect( () => {
        if ( !data ) return;
        Promise.all( data.projects
            .map( project => getColor( project.pixel ) )
        ).then( setProjectColors )
    }, [ data ] )
    return useMemo(() => {
        if ( data === null || projectColors === null ) return null;
        var { projects, tags } = data;
        projects = projects.map( ( project, i ) => ({
            ...project,
            i,
            color: projectColors[ i ]
        }) )
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
    }, [ data, projectColors ] );
}
    
var views = {
    tags: Tags,
    time: Time,
    color: Color
}
    
var Home = ({ view, setView }) => {
    var data = useData();
    var radius = useRadius();
    if ( !data ) return null;
    var View = views[ view ];
    return (
        <React.Fragment>
            <nav>
                <a onClick={ () => setView( 'tags' ) }>🖼</a>
                <a onClick={ () => setView( 'time' ) }>🗓</a>
                <a onClick={ () => setView( 'color' ) }>🌈</a>
            </nav>
            <View data={ data } radius={ radius }/>
        </React.Fragment>
    )
}

export default Home;