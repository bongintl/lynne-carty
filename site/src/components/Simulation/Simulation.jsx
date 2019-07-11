import React, { createContext, useEffect, useContext } from 'react';
import * as d3force from 'd3-force';
import { useData } from '../Data';
import intersection from 'lodash/intersection';
import isEqual from 'lodash/isEqual';
import useWindowSize from '~/hooks/useWindowSize';
import useIsMobile from '~/hooks/useIsMobile';
import forceCenter from './forceCenter';
import forceSort from './forceSort';
import forceRepel from './forceRepel';
import forceGroup from './forceGroup';
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

var countLinks = links => {
    var count = [];
    links.forEach( ({ source, target }) => {
        count[ source ] = ( count[ source ] || 0 ) + 1;
        count[ target ] = ( count[ target ] || 0 ) + 1;
    })
    return count;
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
    var data = useData();
    var { projects } = data;
    var windowSize = useWindowSize();
    var isMobile = useIsMobile();
    var filledArea = sum( projects.map( p => Math.PI * p.size ** 2 ) );
    var windowArea = Math.PI * ( Math.min( windowSize[ 0 ], windowSize[ 1 ] ) / 2 ) ** 2
    var targetFilledArea = windowArea / 2.5;
    var scale = isMobile ? 35 : Math.sqrt( targetFilledArea / filledArea );
    var simulation = useInitRef( () => (
        d3force.forceSimulation(
            projects.map( ( p, i ) => ({ x: windowSize[ 0 ] * Math.random(), y: windowSize[ 1 ] * Math.random(), r: 0, index: i }) )
        ).velocityDecay( 0.2 )
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
    // useForce( simulation, 'links',
    //     () => {
    //         if ( isMobile ) return null;
    //         var links = createLinks( projects );
    //         var count = countLinks( links );
    //         return d3force.forceLink( createLinks( projects ) )
    //             .distance( ({ source, target }) => ( source.r + target.r ) * 2 )
    //             .strength( ({ source, target, strength }) => {
    //                 var bias = 1 / Math.min( count[ source.index ], count[ target.index ] );
    //                 return bias * strength * ( 200 / links.length );
    //             });
    //     },
    //     [ isMobile, projects ]
    // )
    useForce( simulation, 'sort',
        () => !isMobile && forceSort( data ),
        [ projects ]
    )
    // useForce( simulation, 'repel',
    //     () => !isMobile && forceRepel( data ),
    //     [ projects ]
    // )
    // useForce( simulation, 'group',
    //     () => !isMobile && forceGroup( data ),
    //     [ projects ]
    // )
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
    useForce( simulation, 'collide',
        () => d3force.forceCollide()
            .radius( n => n.r )
            .strength( 1 )
            .iterations( 5 ),
        []
    )
    useForce( simulation, 'gather',
        () => !isMobile && forceGather(
            { x: windowSize[ 0 ] / 2, y: windowSize[ 1 ] / 2 },
            Math.min( windowSize[ 0 ], windowSize[ 1 ] ) / 2
        ),
        [ isMobile, windowSize ]
    )
    // useForce( simulation, 'gravity',
    //     () => isMobile && d3force.forceY( 0 ).strength( 0.001 ),
    //     [ isMobile ]
    // )
    return (
        <SimulationContext.Provider value={ simulation }>
            { children }
        </SimulationContext.Provider>
    )
}