import { mean } from '~/utils/math';

export default ( center = null ) => {
    var nodes;
    var force = () => {
        if ( !center ) return;
        var cx = mean( nodes.map( n => n.x ) );
        var cy = mean( nodes.map( n => n.y ) );
        var dx = center.x - cx;
        var dy = center.y - cy;
        nodes.forEach( n => {
            n.x += dx;
            n.y += dy;
        })
    }
    force.initialize = ns => nodes = ns;
    force.center = c => {
        center = c;
        return force;
    };
    return force;
}