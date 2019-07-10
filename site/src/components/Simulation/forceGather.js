export default ( center, radius ) => {
    var nodes;
    var strength = .1;
    var force = () => {
        nodes.forEach( n => {
            var d = { x: n.x - center.x, y: n.y - center.y }
            var dist = Math.sqrt( d.x * d.x + d.y * d.y );
            var f = Math.max( dist - radius, 0 );
            // debugger
            if ( f === 0 ) return;
            var dir = { x: d.x / dist, y: d.y / dist };
            n.vx += dir.x * f * -1 * strength;
            n.vy += dir.y * f * -1 * strength;
        })
    }
    force.initialize = ns => nodes = ns;
    return force;
}