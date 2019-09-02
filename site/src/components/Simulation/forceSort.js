import intersection from 'lodash/intersection';
import vec2 from '~/utils/vec2';

var apply = ( node, force ) => {
    node.vx += force.x;
    node.vy += force.y;
}

export default data => {
    var nodes;
    var forces = [];
    var attractStrength = .0000000003;
    var repelStrength = 2000000;
    var d = new Float32Array( 2 );
    var force = () => {
        for ( var i = 0; i < forces.length; i++ ) {
            var force = forces[ i ];
            var a = force[ 0 ];
            var b = force[ 1 ];
            var strength = force[ 2 ];
            d[ 0 ] = b.x - a.x;
            d[ 1 ] = b.y - a.y;
            var dist2 = d[ 0 ] * d[ 0 ] + d[ 1 ] * d[ 1 ];
            var minDist = a.r + b.r
            if ( dist2 <= minDist * minDist ) continue;
            var dist = Math.sqrt( dist2 );
            var dist3 = dist * dist * dist;
            var f = strength > 0
                ? strength * dist3 * attractStrength
                : strength * ( 1 / dist3 ) * repelStrength;
            d[ 0 ] /= dist;
            d[ 1 ] /= dist;
            a.vx += d[ 0 ] * f * .5;
            a.vy += d[ 1 ] * f * .5;
            b.vx += d[ 0 ] * f * -.5;
            b.vx += d[ 1 ] * f * -.5;
        }
    }
    force.initialize = ns => {
        nodes = ns;
        forces = [];
        for ( var i = 0; i < nodes.length; i++ ) {
            for ( var j = i; j < nodes.length; j++ ) {
                var tags1 = data.projects[ i ].tags;
                var tags2 = data.projects[ j ].tags;
                var intersect = intersection( tags1, tags2 );
                var strength = intersect.length;
                if ( strength === 0 ) strength = -1;
                forces.push( [ nodes[ i ], nodes[ j ], strength ] )
            }
        }
    }
    return force;
}