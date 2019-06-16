import React, { useState, useEffect } from 'react';
import Venn from '../Venn/Venn.jsx';
import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import tinycolor from 'tinycolor2';
import COLORS from '~/colors';

var load = () => fetch('/work.json')
    .then( r => r.json() )
    .then( work => {
        work = work.map( ( project, i ) => ({ ...project, i }) );
        var tags = uniq( flatten( work.map( ({ tags }) => tags ) ) )
        var byTag = Object.fromEntries( tags.map( tag => [
            tag,
            work.filter( n => n.tags.includes( tag ) )
        ]))
        var colors = Object.fromEntries( tags.map( ( tag, i ) => [
            tag,
            tinycolor( COLORS[ i ] )
        ]))
        return { work, tags, byTag, colors }
    })
    
var Home = () => {
    var [ data, setData ] = useState( null );
    useEffect( () => {
        load().then( data => setData( data ) );
    }, [] )
    if ( !data ) return null;
    return <Venn data={ data }/>
}

export default Home;