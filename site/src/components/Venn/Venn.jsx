import React, { useCallback, useContext, useMemo } from 'react'
import GL, { GLContext } from './GL';
import createBuffer from 'gl-buffer';
import createVAO from 'gl-vao';
import createFBO from 'gl-fbo';
import createShader from 'gl-shader';
import vennShaderSrc from './venn.frag.glsl'
import outlineShaderSrc from './outline.frag.glsl'
import tinycolor from 'tinycolor2';
import { useData } from '../Data';
import { useTick } from '../Simulation';
import useWindowSize from '~/hooks/useWindowSize';

var backgroundColor = (() => {
    var color = window.getComputedStyle( document.documentElement ).backgroundColor;
    var { r, g, b } = tinycolor( color ).toRgb();
    return [ r / 255, g / 255, b / 255, 1 ];
})()
var transparentColor = [ 0, 0, 0, 0 ];

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

var VennShader = ({ scale, transparent }) => {
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
    var vennShader = useMemo( () => {
        var counts = Object.values( byTag ).map( a => a.length );
        var maxUniforms = gl.getParameter( gl.MAX_FRAGMENT_UNIFORM_VECTORS );
        var min = Math.min( ...counts )
        var max = Math.min( maxUniforms, Math.max( ...counts ) )
        return createShader( gl, vert, `
            #define MIN ${ min }
            #define MAX ${ max }
            ${ vennShaderSrc }`
        )
    }, [ gl, byTag ] )
    var outlineShader = useMemo( () => createShader( gl, vert, outlineShaderSrc ), [ gl ])
    var fbo = useMemo( () => createFBO( gl, 1, 1 ), [ gl ] );
    var draw = useCallback( nodes => {
        gl.bindFramebuffer( gl.FRAMEBUFFER, null );
        gl.clearColor( ...( transparent ? transparentColor : backgroundColor ) );
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT );
        gl.disable( gl.DEPTH_TEST );
        gl.blendEquation( gl.FUNC_ADD );
        gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
        triangle.bind();
        // gl.enable( gl.SCISSOR_TEST );
        var resolution = [ gl.canvas.width, gl.canvas.height ];
        vennShader.bind();
        vennShader.uniforms.resolution = resolution;
        outlineShader.bind();
        outlineShader.uniforms.resolution = resolution;
        fbo.shape = resolution;
        var extend = Math.min( gl.canvas.width, gl.canvas.height ) * .1;
        groupLayers( nodes, byTag, colors ).forEach( ({ color, positions }) => {
            vennShader.bind();
            vennShader.uniforms.count = positions.length;
            var scaledPositions = positions.map(
                ({ x, y, r }) => ({ x: x * scale, y: y * scale, r: r * scale })
            )
            scaledPositions.forEach( ({ x, y, r }, i ) => {
                vennShader.uniforms.positions[ i ] = [ x, y ]
                vennShader.uniforms.radii[ i ] = r;
            })
            var { r, g, b } = color.toRgb();
            // var xs = scaledPositions.map( p => p.x );
            // var ys = scaledPositions.map( p => p.y );
            var minX = Math.floor( Math.min( ...scaledPositions.map( p => p.x - p.r * 4 ) ) );
            var minY = Math.floor( Math.min( ...scaledPositions.map( p => p.y - p.r * 4 ) ) );
            var maxX = Math.floor( Math.max( ...scaledPositions.map( p => p.x + p.r * 4 ) ) );
            var maxY = Math.floor( Math.max( ...scaledPositions.map( p => p.y + p.r * 4 ) ) );
            fbo.bind();
            // gl.bindFramebuffer( gl.FRAMEBUFFER, null );
            gl.clearColor( 0, 0, 0, 0 );
            gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT |  gl.STENCIL_BUFFER_BIT );
            gl.disable( gl.BLEND );
            gl.enable( gl.SCISSOR_TEST );
            gl.scissor( minX, gl.canvas.height - maxY, maxX - minX, maxY - minY );
            gl.drawArrays( gl.TRIANGLES, 0, 3 );

            // gl.disable( gl.SCISSOR_TEST );
            gl.enable( gl.BLEND );
            outlineShader.bind();
            outlineShader.uniforms.color = [ r / 255, g / 255, b / 255 ];
            outlineShader.uniforms.distance = fbo.color[ 0 ].bind();
            gl.bindFramebuffer( gl.FRAMEBUFFER, null );
            gl.drawArrays( gl.TRIANGLES, 0, 3 );

        })
        gl.disable( gl.SCISSOR_TEST );
    }, [ byTag, colors, gl, vennShader, outlineShader, triangle, scale ])
    useTick( simulation => draw( simulation.nodes() ) )
    return null;
}

var Venn = ({ scale = 1, transparent, ...rest }) => {
    var windowSize = useWindowSize();
    var size = useMemo(
        () => [ windowSize[ 0 ] * scale, windowSize[ 1 ] * scale ],
        [ windowSize, size ]
    );
    return (
        <GL size={ size } alpha={ transparent } { ...rest }>
            <VennShader scale={ scale } transparent={ transparent }/>
        </GL>
    )
}

export default Venn