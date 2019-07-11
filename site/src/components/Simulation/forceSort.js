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
    var force = () => {
        for ( var [ a, b, strength ] of forces ) {
            var d = vec2.sub( b, a );
            var dist = vec2.len( d );
            if ( dist <= a.r + b.r ) continue;
            var f = strength > 0
                ? strength * ( dist ** 3 ) * attractStrength
                : strength * ( 1 / ( dist ** 3 ) ) * repelStrength;
            var dir = vec2.normalize( d, dist );
            apply( a, vec2.scale( dir, .5 * f ) )
            apply( b, vec2.scale( dir, -.5 * f ) )
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