import html from 'nanohtml';
import { tags, byTag, colors } from './nodes';
import range from 'lodash/range';
import flatten from 'lodash/flatten';
import { isoLines } from 'marchingsquares'

var CELL = 5;

var toPath = ( line, scale ) => line.map( ([ x, y ], i ) => `${ i === 0 ? 'M' : 'L' } ${ x * scale[ 0 ] } ${ y * scale[ 1 ] }` ).join(' ')

var renderBlob = nodes => {
    var cells = [ Math.floor( window.innerWidth / CELL ), Math.floor( window.innerHeight / CELL ) ];
    var cellSize = [ window.innerWidth / cells[ 0 ], window.innerHeight / cells[ 1 ] ];
    var grid = range( 0, cells[ 1 ] ).map(
        row => range( 0, cells[ 0 ] ).map( col => {
            var x = col * cellSize[ 0 ];
            var y = row * cellSize[ 1 ];
            var cx = x + cellSize[ 0 ] / 2;
            var cy = y + cellSize[ 1 ] / 2;
            return nodes.some( n => {
                var dx = n.x - cx;
                var dy = n.y - cy;
                return ( dx ** 2 + dy ** 2 ) < n.r ** 2;
            })
        })
    );
    // debugger;
    // console.log( isoLines( grid, 1 ) );
    return html`
        <g>
            ${ isoLines( grid, .5, { noFrame: true } ).map( line => html`
                <path d="${ toPath( line, cellSize ) }"></path>
            `) }
            <!-- ${ flatten( grid )
                .filter( n => n.intersects )
                .map( cell => html`
                    <rect
                        x="${ cell.x }"
                        y="${ cell.y }"
                        width="${ cellSize[ 0 ] }"
                        height="${ cellSize[ 1 ] }"
                    ></rect>
                `) } -->
        </g>
    `
}

export default ( nodes, cx, cy ) => html`
    <svg>
        ${ tags.map( tag => html`
            <g stroke="${ colors[ tag ].toRgbString() }" fill="none">
                ${ renderBlob( byTag[ tag ].map( node => ({ x: node.x + cx, y: node.y + cy, r: 60 }))) }
            </g>
        `) }
    </svg>
`