import { useState, useLayoutEffect } from 'react';
import * as d3force from 'd3-force';
import intersection from 'lodash/intersection';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import useWindowSize from '~/hooks/useWindowSize';

var sum = xs => xs.reduce( ( a, b ) => a + b, 0 );
var mean = xs => sum( xs ) / xs.length;
var clamp = ( x, min, max ) => Math.max( Math.min( x, max ), min );

// var forceGroup = groups => {
//     var nodes;
//     var strength = .2;
//     var force = alpha => {
//         groups.forEach( is => {
//             var ns = is.map( i => nodes[ i ] );
//             var cx = mean( ns.map( n => n.x ) );
//             var cy = mean( ns.map( n => n.y ) );
//             ns.forEach( node => {
//                 node.x += ( cx - node.x ) * strength;
//                 node.y += ( cy - node.y ) * strength;
//             })
//         })
//     }
//     force.initialize = ns => nodes = ns;
//     return force;
// }

export default ( data, radius, initialPositions ) => {
    var [ nodes, setNodes ] = useState( () => cloneDeep( initialPositions ) );
    var windowSize = useWindowSize();
    useLayoutEffect( () => {
        var links = [];
        for ( var i = 0; i < nodes.length; i++ ) {
            for ( var j = i; j < nodes.length; j++ ) {
                var n1 = nodes[ i ];
                var n2 = nodes[ j ];
                var tags1 = data.projects[ i ].tags;
                var tags2 = data.projects[ j ].tags;
                var strength = intersection( tags1, tags2 ).length;
                if ( isEqual( tags1, tags2 ) ) strength *= 2;
                if ( strength > 0 ) links.push({ source: n1, target: n2, strength });
            }
        }
        var simulation = d3force.forceSimulation( nodes )
            .alphaDecay( 0.005 )
            .velocityDecay( 0.2 )
            .force( 'links',
                d3force.forceLink( links )
                    .distance( radius * 2 )
                    .strength( ({ source, target, strength }) => {
                        // var d = Math.sqrt( Math.pow( source.x - target.x, 2 ) + Math.pow( source.y - target.y, 2 ) );
                        // return strength * d * 0.000003;
                        return strength * .002;
                    })
            )
            // .force( 'group', forceGroup( Object.values( data.byTag ) ) )
            .force( "collide",
                d3force.forceCollide()
                    .radius( radius )
                    .strength( 0.5 )
                    .iterations( 5 )
            )
            .on( 'tick', () => {
                var cx = mean( nodes.map( n => n.x ) );
                var cy = mean( nodes.map( n => n.y ) );
                var hw = windowSize[ 0 ] / 2;
                var hh = windowSize[ 1 ] / 2;
                nodes.forEach( n => {
                    n.x = clamp( n.x, cx - hw + radius, cx + hw - radius );
                    n.y = clamp( n.y, cy - hh + radius, cy + hh - radius );
                })
                setNodes([ ...nodes ]);
            })
        
        return () => {
            simulation.on( 'tick', null );
            simulation.stop();
        }
    }, [ data, windowSize, radius ] );
    var cx = windowSize[ 0 ] / 2 - mean( nodes.map( n => n.x ) );
    var cy = windowSize[ 1 ] / 2 - mean( nodes.map( n => n.y ) );
    return nodes.map( n => ({ x: n.x + cx, y: n.y + cy }) );
}