import html from 'nanohtml';
import { tags, byTag, colors } from './nodes';
import convexHull from 'convex-hull';

var toPath = points => points.map(
    ([ x, y ], i ) => `${ i === 0 ? 'M' : 'L' } ${ x } ${ y }`
).join(' ')

var median = xs => {
    var min = Math.min( ...xs )
    var max = Math.max( ...xs );
    return ( min + max ) / 2;
}

var clockwiseSort = points => {
    var c = [
        median( points.map( n => n[ 0 ] ) ),
        median( points.map( n => n[ 1 ] ) )
    ]
    points.forEach( p => {
        var [ x, y ] = p.position;
        p.angle = Math.atan2( y - c[ 1 ], x - c[ 0 ] );
    });
    return points.sort( ( a, b ) => a.angle - b.angle );
}

var renderShape = ( positions, radius ) => {
    debugger
    var groups = positions.reduce( ( groups, p ) => {
        var group = groups.find( group => group.some( p2 => {
            var dx = p[ 0 ] - p2[ 0 ];
            var dy = p[ 1 ] - p2[ 1 ];
            return dx ** 2 + dy ** 2 < ( radius * 2 ) ** 2;
        }))
        if ( group ) {
            group.push( p );
        } else {
            groups.push([ p ]);
        }
        return groups;
    }, [] );
    var paths = groups.map( points => {
        var hull = convexHull( points ).map( ([ i ]) => points[ i ] );
        return hull;
    })
    return html`
        <g>
            ${ paths.map( points => html`
                <path d="${ toPath( points ) }"></path>
            `)}
        </g>
    `
}

export default ( nodes, cx, cy ) => html`
    <svg>
        ${ tags.map( tag => html`
            <g fill="${ colors[ tag ].toRgbString() }" stroke="none">
                ${ renderShape( byTag[ tag ].map( node => [ node.x + cx, node.y + cy ], 60 )) }
            </g>
        `) }
    </svg>
`