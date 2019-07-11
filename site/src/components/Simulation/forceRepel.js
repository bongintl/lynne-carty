import vec2 from '~/utils/vec2';
import intersection from 'lodash/intersection';

var apply = ( node, force ) => {
    node.vx += force.x;
    node.vy += force.y;
}

var attract = ( source, target, strength ) => {
    var d = vec2.sub( source, target );
    if ( vec2.isZero( d ) ) return;
    var dir = vec2.normalize( d );
    apply( target, vec2.scale( dir, strength ) );
}

export default ({ projects }) => {
    var nodes;
    var pairs;
    var strength = 0.00001;
    var force = () => {
        pairs.forEach( ([ a, b ]) => {
            var d = vec2.sub( a, b );
            if ( vec2.isZero( d ) ) return;
            var dir = vec2.normalize( d );
            var dist = vec2.len( d );
            apply( a, vec2.scale( dir, dist * .5 * strength ) )
            apply( b, vec2.scale( dir, dist * -.5 * strength ) )
        })
        // repelMap.forEach()
        // for ( var i = 0; i < nodes.length; i++ ) {
        //     for ( var j = i; j < nodes.length; j++ ) {
        //         var a = nodes[ i ];
        //         var b = nodes[ j ];
        //         var tags1 = tags[ i ];
        //         var tags2 = tags[ j ];
        //         var strength = intersection( tags1, tags2 ).length * baseStrength;
        //         if ( isEqual( tags1, tags2 ) ) strength *= 10;
        //         // if ( strength === 0 ) strength = baseStrength * -.5;
        //         var minDist = a.r + b.r;
        //         var d = vec2.sub( b, a );
        //         var dist = vec2.len( d ) - minDist;
        //         if ( dist <= 0 ) continue;
        //         var dir = vec2.normalize( d );
        //         apply( a, vec2.scale( dir, dist * .5 * strength ) )
        //         apply( b, vec2.scale( dir, dist * -.5 * strength ) )
        //         // if ( strength > 0 ) links.push({ source: i, target: j, strength });
        //     }
        // }
    }
    force.initialize = ns => {
        nodes = ns;
        pairs = [];
        for ( var i = 0; i < projects.length; i++ ) {
            for ( var j = i + 1; j < projects.length; j++ ) {
                var tags1 = projects[ i ].tags;
                var tags2 = projects[ j ].tags;
                if ( intersection( tags1, tags2 ).length === 0 ) {
                    pairs.push([ nodes[ i ], nodes[ j ] ]);
                }
            }
        }
    }
    return force;
}