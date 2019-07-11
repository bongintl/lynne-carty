import vec2 from '~/utils/vec2';
import mapValues from 'lodash/mapValues';
import without from 'lodash/without';

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

export default data => {
    var nodes;
    var nodesByTag;
    var nodesWithoutTag;
    // var baseStrength = .0002;
    var force = () => {
        Object.entries( nodesByTag ).forEach( ([ tag, nodes ]) => {
            var center = vec2.mean( nodes );
            nodes.forEach( node => {
                attract( center, node, 3 );
            })
            nodesWithoutTag[ tag ].forEach( node => {
                attract( center, node, -.2 );
            })
        })
    }
    force.initialize = ns => {
        nodes = ns;
        nodesByTag = mapValues( data.byTag, idxs => idxs.map( i => nodes[ i ] ) );
        nodesWithoutTag = mapValues( nodesByTag, ns => without( nodes, ...ns ) );
    }
    return force;
}