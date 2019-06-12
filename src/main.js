import html from 'nanohtml';
import morph from 'nanomorph';
import createShader from './gl/blobs';
// import renderShapes from './shapes'

import createSimulation from './simulation';
import { nodes, tags, byTag, colors } from './nodes';

var shader = createShader();
document.body.appendChild( shader.canvas );

var container = document.querySelector('main');
var sum = xs => xs.reduce( ( a, b ) => a + b, 0 );
var mean = xs => sum( xs ) / xs.length;
var center = xs => {
    var min = Math.min( ...xs )
    var max = Math.max( ...xs );
    return ( min + max ) / 2;
}
// var filter = null;
var setFilter = filter => imgs.forEach( ( img, i ) => {
    var match = filter === null || nodes[ i ].tags.includes( filter );
    img.style.display = match ? '' : 'none';
})
var labels = {
    "AD": "ART DIRECTION",
    "LYNNE": "LYNNE CARTY"
}
document.body.appendChild( html`
    <ul class="legend">
        ${ tags.map( tag => html`
            <li
                onmouseenter=${ () => setFilter( tag ) }
                onmouseleave=${ () => setFilter( null ) }
                style="--color: ${ colors[ tag ].toRgbString() }"
            >
                ${ labels[ tag ] || tag }
            </li>
        `) }
    </ul>
` )
var imgs = nodes.map( n => html`
    <img
        class="thumbnail"
        id="node_${ n.id }"
        src="${ n.src }"
    >
`)
imgs.forEach( img => document.body.appendChild( img ) );
var update = ( img, position ) => {
    img.style.transform = `
        translate(-50%, -50%)
        translate( ${ position[ 0 ] }px, ${ position[ 1 ] }px )
    `
}

var render = () => {
    var cx = window.innerWidth / 2 - mean( nodes.map( n => n.x ) );
    var cy = window.innerHeight / 2 - mean( nodes.map( n => n.y ) );
    nodes
        // .filter( n => filter === null || n.tags.includes( filter ) )
        .forEach( ( n, i ) => update( imgs[ i ], [ cx + n.x, cy + n.y ] ) )
    // morph( container, html`
    //     <main>
    //         ${ nodes
    //             .filter( n => filter === null || n.tags.includes( filter ) )
    //             .map( ( n, i ) => html`
    //             <img
    //                 class="thumbnail"
    //                 id="node_${ i }"
    //                 src="${ n.src }"
    //                 style="
    //                     transform:
    //                         translate(-50%, -50%)
    //                         translate( ${ cx + n.x }px, ${ cy + n.y }px )
    //                 "
    //             >
    //                 <img >
    //             </div>
    //         `) }
    //     </main>
    // ` )
    shader.render( nodes, cx, cy );
}

createSimulation( nodes ).on( 'tick', render );
