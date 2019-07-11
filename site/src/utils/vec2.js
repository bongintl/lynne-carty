import { mean, lerp } from './math';

var vec2 = ( x = 0, y = 0 ) => ({ x, y });
vec2.add = ( a, b ) => vec2( a.x + b.x, a.y + b.y );
vec2.sub = ( a, b ) => vec2( a.x - b.x, a.y - b.y );
vec2.scale = ( v, s ) => vec2( v.x * s, v.y * s );
vec2.len = v => Math.sqrt( v.x * v.x + v.y * v.y );
vec2.lerp = ( a, b, t ) => vec2( lerp( a.x, b.x, t ), lerp( a.y, b.y, t ) );
vec2.copy = ( a, b ) => { a.x = b.x; a.y = b.y };
vec2.normalize = ( v, length = vec2.len( v ) ) => vec2( v.x / length, v.y / length );
vec2.mean = vs => vec2( mean( vs.map( v => v.x ) ), mean( vs.map( v => v.y ) ) );
vec2.isZero = v => v.x === 0 && v.y === 0;
export default vec2;