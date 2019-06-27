import { useState, useLayoutEffect, useMemo, useCallback, useRef } from 'react';
import * as d3force from 'd3-force';
import intersection from 'lodash/intersection';
import isEqual from 'lodash/isEqual';
import useWindowSize from './useWindowSize';

var sum = xs => xs.reduce( ( a, b ) => a + b, 0 );
var mean = xs => sum( xs ) / xs.length;
var clamp = ( x, min, max ) => Math.max( Math.min( x, max ), min );

var forceBounds = () => {
    var nodes, size;
    var force = alpha => {
        var cx = mean( nodes.map( n => n.x ) );
        var cy = mean( nodes.map( n => n.y ) );
        var hw = size[ 0 ] / 2;
        var hh = size[ 1 ] / 2;
        nodes.forEach( n => {
            // if ( n.x < cx - hw + n.r || n.x > cx + hw + n.r ) {
            //     n.vx = -n.vx
            // }
            // if ( n.y < cy - hh + n.r || n.y > cy + hh + n.r ) {
            //     n.vy = -n.vy
            // }
            n.x = clamp( n.x, cx - hw + n.r, cx + hw - n.r );
            n.y = clamp( n.y, cy - hh + n.r, cy + hh - n.r );
        })
    }
    force.initialize = ns => nodes = ns;
    force.size = s => {
        size = s;
        return force;
    };
    return force;
}

export default function useSimulation ( projects, running = true ) {
    var windowSize = useWindowSize();
    var [ nodes, setNodes ] = useState( () => projects.map( project => ({
        x: Math.random() * windowSize[ 0 ],
        y: Math.random() * windowSize[ 1 ],
        r: 30 * ( project.size || 1 )
    })));
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
    }, [ projects ] );
    useLayoutEffect( () => {
        if ( !running ) return;
        var simulation = d3force.forceSimulation( nodes )
            .alphaDecay( 0.003 )
            .velocityDecay( 0.2 )
            .force( 'links',
                d3force.forceLink( links )
                    .distance( ({ source, target }) => source.r + target.r )
                    .strength( ({ source, target, strength }) => {
                        return strength * .002;
                    })
            )
            .force( "collide",
                d3force.forceCollide()
                    .radius( n => n.r )
                    .strength( 0.5 )
                    .iterations( 5 )
            )
            .force( 'bounds',
                forceBounds()
                    .size( windowSize )
            )
            .on( 'tick', () => {
                setNodes([ ...nodes ]);
            })
        
        return () => {
            simulation.on( 'tick', null );
            simulation.stop();
        }
    }, [ projects, windowSize, running ] );
    var cx = windowSize[ 0 ] / 2 - mean( nodes.map( n => n.x ) );
    var cy = windowSize[ 1 ] / 2 - mean( nodes.map( n => n.y ) );
    return nodes.map( n => ({ x: n.x + cx, y: n.y + cy, r: n.r }) );
}