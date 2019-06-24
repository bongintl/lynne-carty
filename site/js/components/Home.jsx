import React, { useState, useEffect, useMemo, useRef } from 'react';
import Tags from './Tags.jsx';
import Time from './Time.jsx';
import Color from './Color.jsx';
import tinycolor from 'tinycolor2';
import getColor from '~/utils/getColor';
import useFetch from '~/hooks/useFetch';
import useWindowSize from '~/hooks/useWindowSize';
import mapValues from 'lodash/mapValues';
import isEqual from 'lodash/isEqual';

var useCSSProperty = property => {
    var windowSize = useWindowSize();
    return useMemo( () => (
        parseFloat( getComputedStyle( document.documentElement ).getPropertyValue( property ) )
    ), [ windowSize ] );
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

var Nav = ({ setView  }) => (
    <nav>
        <a onClick={ () => setView( 'tags' ) }>🖼</a>
        <a onClick={ () => setView( 'time' ) }>🗓</a>
        <a onClick={ () => setView( 'color' ) }>🌈</a>
    </nav>
)
    
var Home = ({ view, setView }) => {
    var data = useData();
    var radius = useCSSProperty( '--radius' );
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

// var useNow = ( running = true ) => {
//     var [ now, setNow ] = useState( Date.now() );
//     useEffect( () => {
//         if ( !running ) return;
//         var frame = requestAnimationFrame( () => setNow( Date.now() ) );
//         return () => cancelAnimationFrame( frame );
//     }, [ now, running ] )
//     return now;
// }

// var usePrev = ( value, initial = value ) => {
//     var ref = useRef( initial );
//     var prev = ref.current;
//     ref.current = value;
//     return prev;
// }

// var useDeltaTime = ( running = true ) => {
//     var now = useNow( running );
//     var then = usePrev( now );
//     return now - then;
// }

// var lerp = ( a, b, t ) => a + ( b - a ) * t;

// var useInterpolator = ( target, t = .1, step = 1000/60 ) => {
//     var value = useRef( target );
//     var dT = useDeltaTime( value.current !== target );
//     var steps = Math.ceil( dT / step );
//     for ( var i = 0; i < steps; i++ ) {
//         value.current = lerp( value.current, target, t );
//     }
//     return value.current;
// }

// var round = ( x, eps = .000001 ) => {
//     var int = Math.round( x );
//     return Math.abs( x - int ) < eps ? int : x;
// }

// var Home = ({ view, setView }) => {
//     var data = useData();
//     var viewMix = {
//         tags: round( useInterpolator( view === 'tags' ? 1 : 0 ) ),
//         time: round( useInterpolator( view === 'time' ? 1 : 0 ) ),
//         color: round( useInterpolator( view === 'color' ? 1 : 0 ) )
//     }
//     return <Nav setView={ setView }/>;
// }

export default Home;