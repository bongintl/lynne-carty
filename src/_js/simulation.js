import html from 'nanohtml';
import * as d3force from 'd3-force';
import intersection from 'lodash/intersection';
import isEqual from 'lodash/isEqual';

var slider = html`
    <input type="range" min="0" max="1" step="0.01" style="position: fixed" value=0.5>
`
// document.body.appendChild( slider );

export default nodes => {
    var links = [];
    for ( var i = 0; i < nodes.length; i++ ) {
        for ( var j = i; j < nodes.length; j++ ) {
            var n1 = nodes[ i ];
            var n2 = nodes[ j ];
            intersection( n1.tags, n2.tags ).forEach(() => {
                links.push({ source: n1, target: n2 })
            })
        }
    }
    var linkForce = d3force.forceLink( links )
        .distance( ({ source, target }) => source.r + target.r )
        .strength( ({ source, target }) => {
            var d = Math.sqrt( Math.pow( source.x - target.x, 2 ) + Math.pow( source.y - target.y, 2 ) );
            var f = d * .00001;
            var intersections = intersection( source.tags, target.tags ).length
            f *= intersections / Math.min( source.tags.length, target.tags.length )
            if ( isEqual( source.tags, target.tags ) ) f *= 2;
            if ( intersections.length === 0 ) f = -.00001
            return f * slider.value;
        })
    
    return d3force.forceSimulation( nodes )
        .velocityDecay(0.2)
        .force('links', linkForce )
        // .force("cx", d3force.forceX( 0 ).strength(0.02))
        // .force("cy", d3force.forceY( 0 ).strength(0.02))
        .force("collide", d3force.forceCollide().radius(function(d) { return d.r + 0.5; }).strength(0.5).iterations(2))
        .on( 'tick', () => {
            nodes.forEach( n => {
                n.x = Math.max( Math.min( window.innerWidth - n.r ), n.r );
                n.y = Math.max( Math.min( window.innerHeight - n.r ), n.r );
            })
        })
}