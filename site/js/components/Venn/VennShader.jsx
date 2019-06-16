import React, { createContext, useRef, useState, useLayoutEffect, useContext, useMemo } from 'react'
import createBuffer from 'gl-buffer';
import createVAO from 'gl-vao';
import createShader from 'gl-shader';
import frag from '~/gl/frag.glsl'
import tinycolor from 'tinycolor2';
import useWindowSize from '~/hooks/useWindowSize';

var GLContext = createContext();

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

var GL = ({ size, children, ...rest }) => {
    var ref = useRef();
    var [ gl, setGL ] = useState( null );
    useLayoutEffect( () => {
        setGL( ref.current.getContext( 'webgl' ) );
    }, [ ref.current ] );
    useLayoutEffect( () => {
        if ( !gl ) return;
        gl.viewport( 0, 0, size[ 0 ], size[ 1 ] );
    }, [ ref.current, size ] );
    return (
        <GLContext.Provider value={ gl }t>
            <canvas ref={ ref } width={ size[ 0 ] } height={ size[ 1 ] } { ...rest }/>
            { gl && children }
        </GLContext.Provider>
    )
}

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
    // var maxNodes
    var shader = useMemo( () => (
        createShader( gl, vert, frag )
    ), [ gl ] )
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
            var minX = Math.floor( Math.min( ...xs ) ) - radius * 4;
            var minY = Math.floor( Math.min( ...ys ) ) - radius * 4;
            var maxX = Math.floor( Math.max( ...xs ) ) + radius * 4;
            var maxY = Math.floor( Math.max( ...ys ) ) + radius * 4;
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