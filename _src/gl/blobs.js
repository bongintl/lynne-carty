import createRenderer from './renderer';
import frag from './frag.glsl'
import { byTag, tags, colors } from '../nodes';
import tinycolor from 'tinycolor2';


var getBackgroundColor = () => {
    var color = window.getComputedStyle( document.documentElement ).backgroundColor;
    var { r, g, b } = tinycolor( color ).toRgb();
    return [ r / 255, g / 255, b / 255, 1 ];
}

export default () => {
    var canvas = document.createElement( 'canvas' );
    var gl = canvas.getContext( 'webgl', { alpha: false } );
    gl.clearColor( ...getBackgroundColor() )
    var MAX_BALLS = Math.min(
        gl.getParameter( gl.MAX_FRAGMENT_UNIFORM_VECTORS ),
        Object.values( byTag ).reduce( ( max, nodes ) => Math.max( max, nodes.length ), 0 )
    ) 
    var shader = createRenderer( gl, frag.replace( /MAX_BALLS/g, MAX_BALLS ) );
    var render = ( nodes, cx, cy ) => {
        shader.clear();
        gl.enable( gl.SCISSOR_TEST );
        var radius = nodes[ 0 ].r;
        shader.uniforms.radius = radius;
        tags.forEach( ( tag, i ) => {
            var nodes = byTag[ tag ];
            shader.uniforms.count = nodes.length;
            nodes.forEach( ( node, i ) => {
                shader.uniforms.positions[ i ] = [ cx + node.x, cy + node.y ];
            })
            var { r, g, b } = colors[ tag ].toRgb();
            shader.uniforms.color = [ r / 255, g / 255, b / 255 ];
            var xs = nodes.map( n => cx + n.x );
            var ys = nodes.map( n => cy + n.y );
            var minX = Math.floor( Math.min( ...xs ) ) - radius * 4;
            var minY = Math.floor( Math.min( ...ys ) ) - radius * 4;
            var maxX = Math.floor( Math.max( ...xs ) ) + radius * 4;
            var maxY = Math.floor( Math.max( ...ys ) ) + radius * 4;
            gl.scissor( minX, canvas.height - maxY, maxX - minX, maxY - minY );
            shader.draw();
        })
        gl.disable( gl.SCISSOR_TEST );
    }
    var onResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport( 0, 0, canvas.width, canvas.height )
        shader.uniforms.resolution = [ canvas.width, canvas.height ];
    }
    onResize();
    window.addEventListener( 'resize', onResize )
    return { canvas, render };
}