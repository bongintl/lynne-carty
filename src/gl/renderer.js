var createShader = require('gl-shader');
var createBuffer = require('gl-buffer');
var createVAO = require('gl-vao');

var vert = `
    precision highp float;
    attribute vec2 position;
    uniform vec2 resolution;
    uniform vec2 offset;
    uniform vec2 size;
    void main () {
        vec2 p = mix( offset, offset + size, position * .5 + .5 );
        gl_Position = vec4( p * 2. - 1., 0., 1. );
    }
`

module.exports = ( gl, frag ) => {
    
    var shader = createShader( gl, vert, frag );

    var position = createBuffer( gl, new Float32Array([
        -1, -1,
        -1, 1,
        1, 1,
        -1, -1,
        1, 1,
        1, -1
    ]))
    var geometry = createVAO( gl, [{
        buffer: position,
        type: gl.FLOAT,
        size: 2
    }]);
    
    gl.enable( gl.BLEND );
    gl.disable( gl.DEPTH_TEST );
    gl.blendEquation( gl.FUNC_ADD );
    gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
    
    shader.bind();
    geometry.bind();
    
    shader.uniforms.offset = [ 0, 0 ];
    shader.uniforms.size = [ 1, 1 ];
    
    return {
        uniforms: shader.uniforms,
        clear: () => gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT ),
        draw: () => {
            gl.drawArrays( gl.TRIANGLES, 0, 6 );
        },
    }
}