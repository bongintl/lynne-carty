import React, { useState, useEffect } from 'react';
import Venn from '../Venn/Venn.jsx';
import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import tinycolor from 'tinycolor2';
import COLORS from '~/colors';

var load = () => fetch('/work.json')
    .then( r => r.json() )
    .then( ({ projects, tags }) => ({
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
    }))
    
var Home = () => {
    var [ data, setData ] = useState( null );
    useEffect( () => {
        load().then( data => setData( data ) );
    }, [] )
    console.log( data )
    if ( !data ) return null;
    return <Venn data={ data }/>
}

export default Home;