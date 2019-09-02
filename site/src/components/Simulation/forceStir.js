import vec2 from '~/utils/vec2';

export default ( center, radius ) => {
    var nodes;
    var strength = .002;
    var force = () => {
        var now = Date.now();
        var a = ( now / 5000 ) * Math.PI * 2;
        var p = vec2.scale( vec2( Math.cos( a ), Math.sin( a ) ), radius );
        nodes.forEach( n => {
            var d = vec2.sub( n, p );
            var dist = vec2.len( d );
            var f = Math.max( dist - radius, 0 );
            if ( f === 0 ) return;
            var dir = vec2.normalize( d );
            var v = vec2.scale( dir, f * strength );
            n.vx += v.x;
            n.vy += v.y;
        })
    }
    force.initialize = ns => nodes = ns;
    return force;
}