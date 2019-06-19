import React, { useState, useEffect, useMemo } from 'react';
import Venn from './Venn.jsx';
import Wave from './Wave.jsx';
import Color from './Color.jsx';
import tinycolor from 'tinycolor2';

import useWindowSize from '~/hooks/useWindowSize';

var useRadius = () => {
    var windowSize = useWindowSize();
    return useMemo( () => (
        parseFloat( getComputedStyle( document.documentElement ).getPropertyValue('--radius') )
    ), [ windowSize ] );
}

var load = () => fetch('/work.json')
    .then( r => r.json() )
    .then( ({ projects, tags }) => {
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
    })
    
var views = {
    venn: Venn,
    wave: Wave,
    color: Color
}
    
var Home = () => {
    var [ view, setView ] = useState('venn');
    var [ data, setData ] = useState( null );
    var radius = useRadius();
    useEffect( () => {
        load().then( setData );
    }, [] )
    console.log( data )
    if ( !data ) return null;
    var View = views[ view ];
    return (
        <React.Fragment>
            <nav>
                <a onClick={ () => setView( 'venn' ) }>🖼</a>
                <a onClick={ () => setView( 'wave' ) }>🗓</a>
                <a onClick={ () => setView( 'color' ) }>🌈</a>
            </nav>
            <View data={ data } radius={ radius }/>
        </React.Fragment>
    )
}

export default Home;