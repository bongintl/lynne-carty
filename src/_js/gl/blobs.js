import createRenderer from './renderer';
import frag from './frag.glsl'
import { byTag, tags, colors } from '../nodes';

export default () => {
    var canvas = document.createElement( 'canvas' );
    var gl = canvas.getContext( 'webgl' );
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var MAX_BALLS = Math.min(
        gl.getParameter( gl.MAX_FRAGMENT_UNIFORM_VECTORS ),
        Object.values( byTag ).reduce( ( max, nodes ) => Math.max( max, nodes.length ), 0 )
    ) 
    var shader = createRenderer( gl, frag.replace( /MAX_BALLS/g, MAX_BALLS ) );
    gl.disable(gl.DEPTH_TEST)
    gl.enable(gl.BLEND);
    gl.blendEquation( gl.FUNC_ADD );
    gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
    // gl.blendFunc( gl.SRC_ALPHA, gl.DST_ALPHA );
    var resize = ( width, height ) => {
        canvas.width = width;
        canvas.height = height;
        shader.uniforms.resolution = [ canvas.width, canvas.height ];
        gl.viewport( 0, 0, width, height )
    }
    var render = ( nodes, cx, cy ) => {
        shader.clear();
        shader.uniforms.radius = nodes[ 0 ].r;
        tags.forEach( ( tag, i ) => {
            shader.uniforms.count = byTag[ tag ].length;
            byTag[ tag ].forEach( ( node, i ) => {
                shader.uniforms.positions[ i ] = [ cx + node.x, cy + node.y ];
            })
            var { r, g, b } = colors[ tag ].toRgb();
            shader.uniforms.color = [ r / 255, g / 255, b / 255 ];
            shader.draw();
        })
    }
    return { canvas, resize, render };
}