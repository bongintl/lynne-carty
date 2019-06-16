import React, { useState, useLayoutEffect } from 'react';
import * as d3force from 'd3-force';
import intersection from 'lodash/intersection';
import isEqual from 'lodash/isEqual';
import useWindowSize from '~/hooks/useWindowSize';
import VennShader from './VennShader.jsx';

var sum = xs => xs.reduce( ( a, b ) => a + b, 0 );
var mean = xs => sum( xs ) / xs.length;

var useSimulation = ( work, radius, initialPositions ) => {
    var [ nodes, setNodes ] = useState( () => work.map( ( project, i ) => ({
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
                var tags1 = work[ i ].tags;
                var tags2 = work[ j ].tags;
                var strength = intersection( tags1, tags2 ).length;
                if ( isEqual( tags1, tags2 ) ) strength *= 2;
                if ( strength > 0 ) links.push({ source: n1, target: n2, strength });
            }
        }
        var simulation = d3force.forceSimulation( nodes )
            .velocityDecay( 0.2 )
            .force( 'links',
                d3force.forceLink( links )
                    .distance( ({ source, target }) => source.r + target.r )
                    .strength( ({ source, target, strength }) => {
                        var d = Math.sqrt( Math.pow( source.x - target.x, 2 ) + Math.pow( source.y - target.y, 2 ) );
                        return strength * d * 0.00001;
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
    }, [ work ] );
    var cx = windowSize[ 0 ] / 2 - mean( nodes.map( n => n.x ) );
    var cy = windowSize[ 1 ] / 2 - mean( nodes.map( n => n.y ) );
    return nodes.map( n => ({ x: n.x + cx, y: n.y + cy }) );
}


var Venn = ({
    data,
    initialPositions = data.work.map( () => ({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }) )
}) => {
    var radius = 40;
    var positions = useSimulation( data.work, radius, initialPositions );
    return (
        <React.Fragment>
            <VennShader data={ data } radius={ radius } positions={ positions }/>
            { positions.map( ({ x, y }, i ) => {
                var project = data.work[ i ];
                return (
                    <img
                        className="thumbnail"
                        key={ `node_${ i }` }
                        src={ project.thumbnail }
                        style={ {
                            transform: `
                                translate(-50%, -50%)
                                translate( ${ x }px, ${ y }px )
                            `
                        } }
                    />
                )
            })}
        </React.Fragment>
    )
    
}

export default Venn;