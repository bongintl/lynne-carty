import vec2 from '~/utils/vec2';

export default ( center, radius ) => {
    var nodes;
    var strength = .02;
    var force = () => {
        nodes.forEach( n => {
            var d = vec2.sub( n, center );
            var dist = vec2.len( d );
            var f = Math.max( dist - radius, 0 );
            if ( f === 0 ) return;
            var dir = vec2.normalize( d );
            var v = vec2.scale( dir, f * -1 * strength );
            n.vx += v.x;
            n.vy += v.y;
        })
    }
    force.initialize = ns => nodes = ns;
    return force;
}