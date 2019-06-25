import { useState, useLayoutEffect, useMemo, useCallback, useRef } from 'react';
import * as d3force from 'd3-force';
import intersection from 'lodash/intersection';
import isEqual from 'lodash/isEqual';
import useWindowSize from '~/hooks/useWindowSize';
import useDeltaTime from '~/hooks/useDeltaTime';

var useRefFn = fn => {
    var ref = useRef( null );
    if ( ref.current === null ) ref.current = fn();
    return ref;
}

var sum = xs => xs.reduce( ( a, b ) => a + b, 0 );
var mean = xs => sum( xs ) / xs.length;
var clamp = ( x, min, max ) => Math.max( Math.min( x, max ), min );

var forceBounds = size => {
    var nodes;
    var force = alpha => {
        var cx = mean( nodes.map( n => n.x ) );
        var cy = mean( nodes.map( n => n.y ) );
        var hw = size[ 0 ] / 2;
        var hh = size[ 1 ] / 2;
        nodes.forEach( n => {
            n.x = clamp( n.x, cx - hw + n.r, cx + hw - n.r );
            n.y = clamp( n.y, cy - hh + n.r, cy + hh - n.r );
        })
    }
    force.initialize = ns => nodes = ns;
    return force;
}


var useD3Simulation = nodes => {
    var [ simulation ] = useState( () => {
        var sim = d3force.forceSimulation().stop();
        sim.useForce = bindUseForce( sim );
        return sim;
    });
    useLayoutEffect( () => {
        simulation.nodes( nodes )
    }, [ simulation, nodes ] )
    return simulation;
}

var bindUseForce = simulation => {
    return function useForce ( name, create ) {
        var force = useMemo( create, [] )
        var useParam = useCallback( bindUseForceParam( force ), [ force ] )
        useLayoutEffect( () => {
            var n = name;
            simulation.force( n, force );
            () => simulation.force( n, null );
        }, [ simulation, name, force ] );
        return { force, useParam };
    }
}

var bindUseForceParam = force => {
    return function useParam ( name, value ) {
        useLayoutEffect( () => {
            force[ name ]( value )
        }, [ force, name, value ] )
    }
}

export default function useSimulation (
    projects,
    running = true,
    {
        linkStrength = .002
    } = {}
) {
    
    var windowSize = useWindowSize();
    
    var nodes = useRefFn( () => projects.map( p => ({
        x: Math.random() * windowSize[ 0 ],
        y: Math.random() * windowSize[ 1 ],
        r: Math.random() < .1 ? 80 : 40
    }))).current;
    
    var links = useMemo( () => {
        var links = [];
        for ( var i = 0; i < nodes.length; i++ ) {
            for ( var j = i; j < nodes.length; j++ ) {
                var n1 = nodes[ i ];
                var n2 = nodes[ j ];
                var tags1 = projects[ i ].tags;
                var tags2 = projects[ j ].tags;
                var strength = intersection( tags1, tags2 ).length;
                if ( isEqual( tags1, tags2 ) ) strength *= 2;
                if ( strength > 0 ) links.push({ source: n1, target: n2, strength });
            }
        }
        return links;
    }, [ nodes, projects ] );
    
    var simulation = useD3Simulation( nodes );
    
    var forceLinks = simulation.useForce( 'links', d3force.forceLink );
    forceLinks.useParam( 'links', links );
    forceLinks.useParam( 'distance',
        useCallback( ({ source, target }) => source.r + target.r, [] )
    );
    forceLinks.useParam( 'strength',
        useCallback( ({ strength }) => strength * linkStrength, [ linkStrength ] )
    );
    
    var forceCollide = simulation.useForce( 'collide', d3force.forceCollide );
    forceCollide.useParam( 'radius', useCallback( n => n.r, [] ) )
    forceCollide.useParam( 'strength', .5 )
    forceCollide.useParam( 'iterations', 3 )
    
    var dT = useDeltaTime( running );
    var step = 1000 / 60

    // console.log( Math.min( Math.ceil( dT / step ), 10 ) )
    // simulation.tick( Math.min( Math.ceil( dT / step ), 10 ) );
    if ( running ) simulation.tick();
    
    
    // var simulation = useRefFn( () => d3force.forceSimulation().stop() );
    // var forceLinks = useForce( simulation, 'links', () => d3force.forceLink( links ) );
    // useForceParam( forceLinks, 'distance', ({ source, target }) => source.r + target.r )
    
    // var forceLinks = useRefFn( () => (
    //     d3force.forceLink( links )
    //         .distance(  )
    // ))
    // useLayoutEffect( () => (
    //     forceLinks.strength(
    //         ({ source, target, strength }) => strength * linkStrength
    //     )
    // ), [ forceLinks, linkStrength ] )
    
    
    
    // useEffect( () => {
        
    // }, [ nodes ] )
    
    // // var [ nodes, setNodes ] = useState( () => projects.map( p => ({
    // //     x: Math.random() * windowSize[ 0 ],
    // //     y: Math.random() * windowSize[ 1 ],
    // //     r: Math.random() < .1 ? 80 : 40
    // // })));
    // debugger
    // var links = useMemo( () => {
    //     var links = [];
    //     for ( var i = 0; i < nodes.length; i++ ) {
    //         for ( var j = i; j < nodes.length; j++ ) {
    //             var n1 = nodes[ i ];
    //             var n2 = nodes[ j ];
    //             var tags1 = projects[ i ].tags;
    //             var tags2 = projects[ j ].tags;
    //             var strength = intersection( tags1, tags2 ).length;
    //             if ( isEqual( tags1, tags2 ) ) strength *= 2;
    //             if ( strength > 0 ) links.push({ source: n1, target: n2, strength });
    //         }
    //     }
    //     return links;
    // }, [ projects ] );
    // useLayoutEffect( () => {
    //     var simulation = d3force.forceSimulation( nodes )
    //         .alphaDecay( 0.0005 )
    //         // .velocityDecay( 0.2 )
    //         .force( 'links',
    //             d3force.forceLink( links )
    //                 .distance( ({ source, target }) => source.r + target.r )
    //                 .strength( ({ source, target, strength }) => {
    //                     return strength * .002;
    //                 })
    //         )
    //         .force( "collide",
    //             d3force.forceCollide()
    //                 .radius( n => n.r )
    //                 .strength( 0.5 )
    //                 .iterations( 5 )
    //         )
    //         .on( 'tick', () => {
    //             var cx = mean( nodes.map( n => n.x ) );
    //             var cy = mean( nodes.map( n => n.y ) );
    //             var hw = windowSize[ 0 ] / 2;
    //             var hh = windowSize[ 1 ] / 2;
    //             nodes.forEach( n => {
    //                 n.x = clamp( n.x, cx - hw + n.r, cx + hw - n.r );
    //                 n.y = clamp( n.y, cy - hh + n.r, cy + hh - n.r );
    //             })
    //             setNodes([ ...nodes ]);
    //         })
        
    //     return () => {
    //         simulation.on( 'tick', null );
    //         simulation.stop();
    //     }
    // }, [ projects, windowSize ] );
    
    var cx = windowSize[ 0 ] / 2 - mean( nodes.map( n => n.x ) );
    var cy = windowSize[ 1 ] / 2 - mean( nodes.map( n => n.y ) );
    return nodes.map( n => ({ x: n.x + cx, y: n.y + cy, r: n.r }) );
}