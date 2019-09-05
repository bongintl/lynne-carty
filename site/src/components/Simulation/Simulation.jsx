import React, { createContext, useEffect, useCallback, useContext } from 'react';
import * as d3force from 'd3-force';
import { useData } from '../Data';
import useWindowSize from '~/hooks/useWindowSize';
import forceCenter from './forceCenter';
import forceSort from './forceSort';
import forceBounds from './forceBounds';
import forceGather from './forceGather';
import forceStir from './forceStir';
import { sum } from '~/utils/math';
import vec2 from '~/utils/vec2';
import useInitRef from '~/hooks/useInitRef';

var SimulationContext = createContext();

export var useSimulation = () => useContext( SimulationContext );

export var useTick = onUpdate => {
    var simulation = useSimulation();
    useEffect( () => {
        var event = `tick.${ Math.random() }`;
        simulation.on( event, () => onUpdate( simulation ) )
        onUpdate( simulation );
        return () => simulation.on( event, null );
    }, [ simulation, onUpdate ] );
}

export var useNode = index => useSimulation().nodes()[ index ];

export var useNodeUpdate = ( index, onUpdate ) => {
    var onTick = useCallback(
        simulation => {
            var nodes = simulation.nodes();
            if ( nodes[ index ] ) onUpdate( nodes[ index ] )
        },
        [ index, onUpdate ]
    )
    useTick( onTick );
}

var useForce = ( simulation, name, force, deps = [] ) => {
    useEffect( () => {
        var f = force();
        if ( !f ) return;
        simulation.force( name, f );
        simulation.restart()
        return () => simulation.force( name, null );
    }, [ simulation, name, force, ...deps ] )
}

var getTagInitialPosition = ( tag, tags, windowSize ) => {
    var t = tags.indexOf( tag ) / tags.length;
    var a = t * Math.PI * 2;
    var c = vec2( windowSize[ 0 ] / 2, windowSize[ 1 ] / 2 );
    var r = Math.min( windowSize[ 0 ], windowSize[ 1 ] ) / 2;
    var d = vec2( Math.sin( a ), Math.cos( a ) );
    return vec2.add( c, vec2.scale( d, r ) );
}

var getInitialPosition = ( project, tags, windowSize ) => (
    vec2.add(
        vec2.mean( project.tags.map( tag => getTagInitialPosition( tag, tags, windowSize ) ) ),
        vec2( Math.random() * 10, Math.random() * 10 )
    )
)

export var SimulationProvider = ({ children }) => {
    var data = useData();
    var { projects } = data;
    var windowSize = useWindowSize();
    var filledArea = sum( projects.map( p => Math.PI * p.size ** 2 ) );
    var windowArea = Math.PI * ( Math.min( windowSize[ 0 ], windowSize[ 1 ] ) / 2 ) ** 2
    var targetFilledArea = windowArea / 2.5;
    var scale = Math.sqrt( targetFilledArea / filledArea );
    var simulation = useInitRef( () => (
        d3force.forceSimulation(
            projects.map( ( project, i ) => ({
                ...getInitialPosition( project, Object.keys( data.byTag ), windowSize ),
                r: project.size * scale,
                index: i
            }) )
        )
        .velocityDecay( 0.1 )
        .alphaDecay( 0 )
    ))
    useEffect( () => {
        var nodes = simulation.nodes();
        nodes.forEach( ( node, i ) => {
            node.r = projects[ i ].size * scale;
        })
        simulation.nodes( nodes );
    }, [ simulation, projects, scale ] );
    useForce( simulation, 'sort',
        () => forceSort( data ),
        [ projects ]
    )
    useForce( simulation, 'center',
        () => forceCenter({ x: windowSize[ 0 ] / 2, y: windowSize[ 1 ] / 2 }),
        [ windowSize ]
    )
    useForce( simulation, 'bounds',
        () => forceBounds({
            min: { x: 0, y: 0 },
            max: { x: windowSize[ 0 ], y: windowSize[ 1 ] }
        }),
        [ windowSize ]
    )
    useForce( simulation, 'collide',
        () => d3force.forceCollide()
            .radius( n => n.r )
            .strength( 1 )
            .iterations( 5 ),
        []
    )
    useForce( simulation, 'gather',
        () => forceGather(
            { x: windowSize[ 0 ] / 2, y: windowSize[ 1 ] / 2 },
            Math.min( windowSize[ 0 ], windowSize[ 1 ] ) * .4
        ),
        [ windowSize ]
    )
    useForce( simulation, 'stir',
        () => forceStir(
            { x: windowSize[ 0 ] / 2, y: windowSize[ 1 ] / 2 },
            Math.min( windowSize[ 0 ], windowSize[ 1 ] ) * .6
        ),
        [ windowSize ]
    )
    return (
        <SimulationContext.Provider value={ simulation }>
            { children }
        </SimulationContext.Provider>
    )
}