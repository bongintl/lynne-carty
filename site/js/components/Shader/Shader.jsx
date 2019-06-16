import React, { createRef } from 'react';

var vertexShader = `
    precision highp float;
    attribute vec2 position;
    void main () {
        gl_Position = vec4( position, 0., 1. );
    }
`

var GL = ({ size, ...rest }) => {
    var ref = createRef();
    return <canvas ref={ ref } { ...rest }/>
}