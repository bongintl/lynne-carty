precision highp float;

uniform vec2 resolution;
uniform vec2 positions[ MAX ];
uniform float radii[ MAX ];
uniform vec3 color;
uniform int count;
uniform float power;

float smin( float a, float b, float k ) {
    float h = max( k-abs(a-b), 0.0 )/k;
    return min( a, b ) - h*h*k*(1.0/4.0);
}

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
        v += radius / sqrt( dx*dx + dy*dy );
        v += radius - radius;
        if ( i == count - 1 ) break;
    }
    return v;
}




vec3 normal ( vec2 coord ) {
    // float s11 = sample( coord );
    float s01 = sample( coord + vec2( -1., 0. ) );
    float s21 = sample( coord + vec2( 1., 0. ) );
    float s10 = sample( coord + vec2( 0., -1. ) );
    float s12 = sample( coord + vec2( 0., 1. ) );
    vec3 va = normalize( vec3( 2., 0., s21 - s01 ) );
    vec3 vb = normalize( vec3( 0., 2., s12 - s10 ) );
    return cross( va,vb );
}

void main () {
    gl_FragColor = vec4( ( normal( gl_FragCoord.xy ) * 2. + .5 ).xy, 0., 1. );
}