precision highp float;

uniform vec2 resolution;
uniform sampler2D distance;
uniform vec3 color;

float sample ( vec2 coord ) {
    return texture2D( distance, coord / resolution ).a;
}

float edge ( vec2 coord ) {
    float center = sample( coord );
    float up = sample( coord + vec2( 0., 1. ) );
    float down = sample( coord + vec2( 0., -1. ) );
    float left = sample( coord + vec2( -1., 0. ) );
    float right = sample( coord + vec2( 1., 0. ) );
    if ( up > center || down > center || right > center || left > center ) {
        return 1.;
    } else {
        return 0.;
    }
}

void main () {
    gl_FragColor = vec4( color, edge( gl_FragCoord.xy ) );
}