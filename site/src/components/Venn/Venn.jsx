import React, { useCallback, useContext, useMemo } from 'react'
import GL, { GLContext } from './GL';
import createBuffer from 'gl-buffer';
import createVAO from 'gl-vao';
import createShader from 'gl-shader';
import frag from './venn.frag.glsl'
import tinycolor from 'tinycolor2';
import { useData } from '../Data';
import { useNodes } from '../Simulation';
import useWindowSize from '~/hooks/useWindowSize';

var backgroundColor = (() => {
    var color = window.getComputedStyle( document.documentElement ).backgroundColor;
    var { r, g, b } = tinycolor( color ).toRgb();
    return [ r / 255, g / 255, b / 255, 1 ];
})()

var vert = `
    precision highp float;
    attribute vec2 position;
    void main () {
        gl_Position = vec4( position, 0., 1. );
    }
`

var groupLayers = ( positions, byTag, colors ) => (
    Object.entries( byTag ).map( ([ tag, idxs ]) => ({
        color: colors[ tag ],
        positions: idxs.map( i => positions[ i ] )
    }))
)

var VennShader = ({ scale }) => {
    var { byTag, colors } = useData();
    var gl = useContext( GLContext );
    var triangle = useMemo( () => {
        var position = createBuffer( gl, new Float32Array([
            -1, -1,
            -1, 3,
            3, -1
        ]))
        return createVAO( gl, [{
            buffer: position,
            type: gl.FLOAT,
            size: 2
        }]);
    }, [ gl ] )
    var shader = useMemo( () => {
        var counts = Object.values( byTag ).map( a => a.length );
        var maxUniforms = gl.getParameter( gl.MAX_FRAGMENT_UNIFORM_VECTORS );
        var min = Math.min( ...counts )
        var max = Math.min( maxUniforms, Math.max( ...counts ) )
        return createShader( gl, vert, `
            #define MIN ${ min }
            #define MAX ${ max }
            ${ frag }`
        )
    }, [ gl, byTag ] )
    var draw = useCallback( nodes => {
        gl.clearColor( ...backgroundColor );
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT );
        gl.enable( gl.BLEND );
        gl.disable( gl.DEPTH_TEST );
        gl.blendEquation( gl.FUNC_ADD );
        gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
        shader.bind();
        triangle.bind();
        gl.enable( gl.SCISSOR_TEST );
        shader.uniforms.resolution = [ gl.canvas.width, gl.canvas.height ];
        // shader.uniforms.power = Number( power );
        var extend = Math.min( gl.canvas.width, gl.canvas.height ) * .15;
        groupLayers( nodes, byTag, colors ).forEach( ({ color, positions }) => {
            shader.uniforms.count = positions.length;
            var scaledPositions = positions.map( ({ x, y, r }) => ({ x: x * scale, y: y * scale, r: r * scale }))
            scaledPositions.forEach( ({ x, y, r }, i ) => {
                shader.uniforms.positions[ i ] = [ x, y ]
                shader.uniforms.radii[ i ] = r;
            })
            var { r, g, b } = color.toRgb();
            shader.uniforms.color = [ r / 255, g / 255, b / 255 ];
            var xs = scaledPositions.map( p => p.x );
            var ys = scaledPositions.map( p => p.y );
            var minX = Math.floor( Math.min( ...xs ) ) - extend;
            var minY = Math.floor( Math.min( ...ys ) ) - extend;
            var maxX = Math.floor( Math.max( ...xs ) ) + extend;
            var maxY = Math.floor( Math.max( ...ys ) ) + extend;
            gl.scissor( minX, gl.canvas.height - maxY, maxX - minX, maxY - minY );
            gl.drawArrays( gl.TRIANGLES, 0, 3 );
        })
        gl.disable( gl.SCISSOR_TEST );
    }, [ byTag, colors, gl, shader, triangle, scale ])
    useNodes( nodes => draw( nodes ) )
    return null;
}

var Venn = ({ scale = 1, ...rest }) => {
    var windowSize = useWindowSize();
    return (
        <GL size={[ windowSize[ 0 ] * scale, windowSize[ 1 ] * scale ]} { ...rest }>
            <VennShader scale={ scale }/>
        </GL>
    )
}

export default Venn