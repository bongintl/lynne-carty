precision highp float;

uniform vec2 resolution;
uniform vec2 positions[ MAX_BALLS ];
uniform float radius;
uniform vec3 color;
uniform int count;

float sample ( vec2 coord ) {
    float x = coord.x;
    float y = coord.y;
    float v = 0.0;
    for ( int i = 0; i < MAX_BALLS; i++ ) {
        vec2 position = positions[ i ];
        position.y = resolution.y - position.y;
        float dx = position.x - x;
        float dy = position.y - y;
        v += radius * radius / ( dx*dx + dy*dy );
        if ( i == count - 1 ) break;
    }
    return v;
}

float edge () {
    vec2 px = vec2( .5 );
    float up = step( 1., sample( gl_FragCoord.xy + vec2( 0., px.y ) ) );
    float down = step( 1., sample( gl_FragCoord.xy + vec2( 0., -px.y ) ) );
    float left = step( 1., sample( gl_FragCoord.xy + vec2( -px.x, 0. ) ) );
    float right = step( 1., sample( gl_FragCoord.xy + vec2( px.x, 0. ) ) );
    if ( up == down && up == left && up == right ) {
        return 0.;
    } else {
        return 1.;
    }
}

void main () {
    float v = sample( gl_FragCoord.xy );
    float alpha = step( 1., v ) * .5;
    vec4 fill = vec4( color * alpha, alpha );
    float edge = edge();
    vec4 stroke = vec4( vec3( 0. ), 1. );
    // gl_FragColor = mix( fill, stroke, edge );
    gl_FragColor = vec4( color, 1. ) * edge;
    // if (v > 1.0) {
    //     gl_FragColor = vec4(v, 0., 0.0, 1.0);
    // } else {
    //     gl_FragColor = vec4(v, 0.0, 0.0, 1.0);
    // }
    // gl_FragColor = vec4( vec3( alpha ), 1. );
    // alpha = alpha > 1. ? 1. : 0.;
    // gl_FragColor = vec4( color * alpha, alpha );
}