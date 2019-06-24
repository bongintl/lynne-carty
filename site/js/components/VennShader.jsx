import React, { useLayoutEffect, useContext, useMemo } from 'react'
import GL, { GLContext } from './GL';
import createBuffer from 'gl-buffer';
import createVAO from 'gl-vao';
import createShader from 'gl-shader';
import frag from '~/gl/venn.frag.glsl'
import tinycolor from 'tinycolor2';
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

var vert = `
    precision highp float;
    attribute vec2 position;
    void main () {
        gl_Position = vec4( position, 0., 1. );
    }
`

var Renderer = ({ positions, radius, data }) => {
    var { byTag, tags, colors } = data;
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
    var maxNodes = useMemo( () => Math.min(
        gl.getParameter( gl.MAX_FRAGMENT_UNIFORM_VECTORS ),
        Math.max( ...Object.values( byTag ).map( ts => ts.length ) )
    ), [ data ] )
    var shader = useMemo( () => (
        createShader( gl, vert, `#define MAX ${ maxNodes }\n` + frag )
    ), [ gl, maxNodes ] )
    useLayoutEffect( () => {
        gl.clearColor( ...backgroundColor );
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT );
        gl.enable( gl.BLEND );
        gl.disable( gl.DEPTH_TEST );
        gl.blendEquation( gl.FUNC_ADD );
        gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
        shader.bind();
        triangle.bind();
        gl.enable( gl.SCISSOR_TEST );
        shader.uniforms.radius = radius;
        shader.uniforms.resolution = [ gl.canvas.width, gl.canvas.height ];
        tags.forEach( tag => {
            var ps = byTag[ tag ].map( i => positions[ i ] );
            shader.uniforms.count = ps.length;
            ps.forEach( ( position, i ) => {
                shader.uniforms.positions[ i ] = [ position.x, position.y ];
            })
            var { r, g, b } = colors[ tag ].toRgb();
            shader.uniforms.color = [ r / 255, g / 255, b / 255 ];
            var xs = ps.map( n => n.x );
            var ys = ps.map( n => n.y );
            var minX = Math.floor( Math.min( ...xs ) ) - radius * 5;
            var minY = Math.floor( Math.min( ...ys ) ) - radius * 5;
            var maxX = Math.floor( Math.max( ...xs ) ) + radius * 5;
            var maxY = Math.floor( Math.max( ...ys ) ) + radius * 5;
            gl.scissor( minX, gl.canvas.height - maxY, maxX - minX, maxY - minY );
            gl.drawArrays( gl.TRIANGLES, 0, 3 );
        })
        gl.disable( gl.SCISSOR_TEST );
    }, [ gl, positions, radius, data, gl.canvas.width, gl.canvas.height ] )
    return null;
}

var VennShader = ({ positions, radius, data }) => {
    var windowSize = useWindowSize();
    return (
        <GL size={ windowSize }>
            <Renderer positions={ positions } radius={ radius } data={ data }/>
        </GL>
    )
}

export default VennShader