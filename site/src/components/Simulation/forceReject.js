import vec2 from '~/utils/vec2';

var apply = ( node, force ) => {
    node.vx += force.x;
    node.vy += force.y;
}

export default ({ projects, byTag }) => {
    var nodes;
    var pairs;
    var strength = 0.00001;
    var force = () => {
        nodes.forEach( ( node, i ) => {
            Object.values( byTag ).forEach( ([ tag, idxs ]) => {
                if ( node.tags.includes( tag ) ) return;
                idxs.forEach( idx => {
                    if ( i === idx ) return;
                    var node2 = nodes[ idx ];
                    
                })
            })
        })
    }
    force.initialize = ns => {
        nodes = ns;
        // pairs = [];
        // for ( var i = 0; i < projects.length; i++ ) {
        //     for ( var j = i + 1; j < projects.length; j++ ) {
        //         var tags1 = projects[ i ].tags;
        //         var tags2 = projects[ j ].tags;
        //         if ( intersection( tags1, tags2 ).length === 0 ) {
        //             pairs.push([ nodes[ i ], nodes[ j ] ]);
        //         }
        //     }
        // }
    }
    return force;
}