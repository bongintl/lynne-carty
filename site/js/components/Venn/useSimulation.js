import { useState, useLayoutEffect } from 'react';
import * as d3force from 'd3-force';
import intersection from 'lodash/intersection';
import isEqual from 'lodash/isEqual';
import useWindowSize from '~/hooks/useWindowSize';

var sum = xs => xs.reduce( ( a, b ) => a + b, 0 );
var mean = xs => sum( xs ) / xs.length;

export default ( projects, radius, initialPositions ) => {
    var [ nodes, setNodes ] = useState( () => projects.map( ( project, i ) => ({
        x: initialPositions[ i ].x,
        y: initialPositions[ i ].y,
        r: radius
    })));
    var windowSize = useWindowSize();
    useLayoutEffect( () => {
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
        var simulation = d3force.forceSimulation( nodes )
            .alphaDecay( 0 )
            .velocityDecay( 0.2 )
            .force( 'links',
                d3force.forceLink( links )
                    .distance( ({ source, target }) => source.r + target.r )
                    .strength( ({ source, target, strength }) => {
                        var d = Math.sqrt( Math.pow( source.x - target.x, 2 ) + Math.pow( source.y - target.y, 2 ) );
                        // return strength;
                        // return Math.pow( strength, d * .00000000000005 )
                        return strength * d * 0.0000000005;
                    })
            )
            .force( "collide",
                d3force.forceCollide()
                    .radius( n => n.r )
                    .strength( 0.5 )
                    .iterations( 2 )
            )
            .on( 'tick', () => {
                setNodes([ ...nodes ]);
            })
        return () => {
            simulation.on( 'tick', null );
            simulation.stop();
        }
    }, [ projects ] );
    var cx = windowSize[ 0 ] / 2 - mean( nodes.map( n => n.x ) );
    var cy = windowSize[ 1 ] / 2 - mean( nodes.map( n => n.y ) );
    return nodes.map( n => ({ x: n.x + cx, y: n.y + cy }) );
}