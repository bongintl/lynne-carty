import React, { createContext, useEffect, useContext } from 'react';
import * as d3force from 'd3-force';
import { useData } from '../Data';
import intersection from 'lodash/intersection';
import isEqual from 'lodash/isEqual';
import useWindowSize from '~/hooks/useWindowSize';
import useIsMobile from '~/hooks/useIsMobile';
import forceCenter from './forceCenter';
import forceBounds from './forceBounds';
import forceGather from './forceGather';
import { sum } from '~/utils/math';
import useInitRef from '~/hooks/useInitRef';

var SimulationContext = createContext();

export var useSimulation = () => useContext( SimulationContext );

export var useTick = ( onUpdate, deps = [] ) => {
    var simulation = useSimulation();
    useEffect( () => {
        var event = `tick.${ Math.random() }`;
        simulation.on( event, () => onUpdate( simulation ) )
        return () => simulation.on( event, null );
    }, [ simulation, ...deps ] );
}

export var useNodes = ( onUpdate, deps = [] ) => {
    useTick( simulation => onUpdate( simulation.nodes() ), deps )
}

export var useNode = ( index, onUpdate, deps ) => {
    useNodes( nodes => {
        nodes[ index ] && onUpdate( nodes[ index ] )
    }, deps );
}

var createLinks = projects => {
    var links = [];
    for ( var i = 0; i < projects.length; i++ ) {
        for ( var j = i; j < projects.length; j++ ) {
            var tags1 = projects[ i ].tags;
            var tags2 = projects[ j ].tags;
            var strength = intersection( tags1, tags2 ).length;
            if ( isEqual( tags1, tags2 ) ) strength *= 2;
            if ( strength > 0 ) links.push({ source: i, target: j, strength });
        }
    }
    return links;
}

var useForce = ( simulation, name, force, deps = [] ) => {
    useEffect( () => {
        var f = force();
        if ( !f ) return;
        simulation.force( name, f );
        return () => simulation.force( name, null );
    }, [ simulation, name, force, ...deps ] )
}

export var SimulationProvider = ({ children }) => {
    var { projects } = useData();
    var windowSize = useWindowSize();
    var isMobile = useIsMobile();
    var filledArea = sum( projects.map( p => Math.PI * p.size ** 2 ) );
    var windowArea = Math.PI * ( Math.min( windowSize[ 0 ], windowSize[ 1 ] ) / 2 ) ** 2
    var targetFilledArea = windowArea / 2;
    var scale = isMobile ? 35 : Math.sqrt( targetFilledArea / filledArea );
    var simulation = useInitRef( () => (
        d3force.forceSimulation(
            projects.map( ( p, i ) => ({ x: windowSize[ 0 ] / 2, y: windowSize[ 1 ] / 2, r: 0, index: i }) )
        )
            .velocityDecay( 0.2 )
            .force( "collide",
                d3force.forceCollide()
                    .radius( n => n.r )
                    .strength( 1 )
                    .iterations( 5 )
            )
    ))
    useEffect( () => {
        simulation.alphaDecay( isMobile ? 0.05 : 0 )
    }, [ simulation, isMobile ])
    useEffect( () => {
        var nodes = simulation.nodes();
        nodes.forEach( ( node, i ) => {
            node.r = projects[ i ].size * scale;
        })
        simulation.nodes( nodes );
    }, [ simulation, projects, scale ] );
    useForce( simulation, 'links',
        () => {
            if ( isMobile ) return null;
            return d3force.forceLink( createLinks( projects ) )
                .distance( ({ source, target }) => ( source.r + target.r ) * 2 )
                .strength( link => link.strength * 0.007 );
        },
        [ isMobile, projects ]
    )
    useForce( simulation, 'center',
        () => !isMobile && forceCenter({ x: windowSize[ 0 ] / 2, y: windowSize[ 1 ] / 2 }),
        [ isMobile, windowSize ]
    )
    useForce( simulation, 'bounds',
        () => forceBounds({
            min: { x: 0, y: 0 },
            max: { x: windowSize[ 0 ], y: isMobile ? Infinity : windowSize[ 1 ] }
        }),
        [ isMobile, windowSize ]
    )
    useForce( simulation, 'gather',
        () => !isMobile && forceGather(
            { x: windowSize[ 0 ] / 2, y: windowSize[ 1 ] / 2 },
            Math.min( windowSize[ 0 ], windowSize[ 1 ] ) / 2
        ),
        [ isMobile, windowSize ]
    )
    useForce( simulation, 'gravity',
        () => isMobile && d3force.forceY( 0 ).strength( 0.001 ),
        [ isMobile ]
    )
    return (
        <SimulationContext.Provider value={ simulation }>
            { children }
        </SimulationContext.Provider>
    )
}