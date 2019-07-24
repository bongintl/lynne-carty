precision highp float;

uniform vec2 resolution;
uniform vec2 positions[ MAX ];
uniform float radii[ MAX ];
uniform vec3 color;
uniform int count;
uniform float power;

float sample ( vec2 coord ) {
    float x = coord.x;
    float y = coord.y;
    float v = 0.;
    for ( int i = 0; i < MAX; i++ ) {
        vec2 position = positions[ i ];
        float radius = radii[ i ];
        position.y = resolution.y - position.y;
        float dx = position.x - x;
        float dy = position.y - y;
        v += radius * radius / ( dx*dx + dy*dy );
        if ( i == count - 1 ) break;
    }
    return v;
}

float edge ( vec2 coord ) {
    vec2 px = vec2( .5 );
    float up = step( 1., sample( coord + vec2( 0., px.y ) ) );
    float down = step( 1., sample( coord + vec2( 0., -px.y ) ) );
    float left = step( 1., sample( coord + vec2( -px.x, 0. ) ) );
    float right = step( 1., sample( coord + vec2( px.x, 0. ) ) );
    if ( up == down && up == left /* && up == right */ ) {
        return 0.;
    } else {
        return 1.;
    }
}

void main () {
    gl_FragColor = vec4( color, 1. ) * edge( gl_FragCoord.xy );
}