import { clamp } from '~/utils/math';

export default bounds => {
    var nodes;
    var force = () => {
        if ( !bounds ) return;
        nodes.forEach( n => {
            var left = n.x - n.r;
            n.vx += Math.max( bounds.min.x - left, 0 );
            var right = n.x + n.r;
            n.vx += Math.min( bounds.max.x - right, 0 );
            var top = n.y - n.r;
            n.vy += Math.max( bounds.min.y - top, 0 );
            var bottom = n.y + n.r;
            n.vy += Math.min( bounds.max.y - bottom, 0 );
            n.x = clamp( n.x, bounds.min.x, bounds.max.x );
            n.y = clamp( n.y, bounds.min.y, bounds.max.y );
        })
    }
    force.initialize = ns => nodes = ns;
    force.bounds = b => {
        bounds = b;
        return force;
    };
    return force;
}