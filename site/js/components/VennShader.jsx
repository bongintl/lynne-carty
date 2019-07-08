import React, { useState, useLayoutEffect, useContext, useMemo } from 'react'
import GL, { GLContext } from './GL';
import createBuffer from 'gl-buffer';
import createVAO from 'gl-vao';
import createShader from 'gl-shader';
import frag from '~/gl/venn.frag.glsl'
import tinycolor from 'tinycolor2';
import { useData } from './Data';
import { useSimulation } from './Simulation';
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

var Renderer = ({ layers }) => {
    var [ power, setPower ] = useState( 1 );
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
        Math.max( ...layers.map( layer => layer.positions.length ) )
    ), [ gl, layers ] )
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
        shader.uniforms.resolution = [ gl.canvas.width, gl.canvas.height ];
        shader.uniforms.power = Number( power );
        var extend = Math.min( gl.canvas.width, gl.canvas.height ) * .2;
        layers.forEach( ({ color, positions }) => {
            shader.uniforms.count = positions.length;
            positions.forEach( ({ x, y, r }, i ) => {
                shader.uniforms.positions[ i ] = [ x, y ];
                shader.uniforms.radii[ i ] = r;
            })
            var { r, g, b } = color.toRgb();
            shader.uniforms.color = [ r / 255, g / 255, b / 255 ];
            var xs = positions.map( p => p.x );
            var ys = positions.map( p => p.y );
            var minX = Math.floor( Math.min( ...xs ) ) - extend;
            var minY = Math.floor( Math.min( ...ys ) ) - extend;
            var maxX = Math.floor( Math.max( ...xs ) ) + extend;
            var maxY = Math.floor( Math.max( ...ys ) ) + extend;
            gl.scissor( minX, gl.canvas.height - maxY, maxX - minX, maxY - minY );
            gl.drawArrays( gl.TRIANGLES, 0, 3 );
        })
        gl.disable( gl.SCISSOR_TEST );
    }, [ gl, layers, gl.canvas.width, gl.canvas.height ] )
    return null;
    // return <input type="range" min="0" max="1" step=".01" onChange={ e => setPower( Number( e.target.value ) ) } style={{ position: 'fixed' }}/>
}

var VennShader = () => {
    var windowSize = useWindowSize();
    var { byTag, colors } = useData();
    var positions = useSimulation();
    var layers = Object.entries( byTag ).map( ([ tag, idxs ]) => ({
        color: colors[ tag ],
        positions: idxs.map( i => positions[ i ] )
    }))
    return (
        <GL size={ windowSize }>
            <Renderer layers={ layers }/>
        </GL>
    )
}

export default VennShader