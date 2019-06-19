import React, { useState, useEffect } from 'react';
import Thumbnail from './Thumbnail';
import useWindowSize from '~/hooks/useWindowSize';
import chunk from 'lodash/chunk';
import range from 'lodash/range';
import flatten from 'lodash/flatten';

var useScrollTop = () => {
    var [ scrollTop, setScrollTop ] = useState( window.pageYOffset )
    useEffect( () => {
        var onScroll = () => setScrollTop( window.pageYOffset );
        window.addEventListener( 'scroll', onScroll );
        return () => window.removeEventListener( 'scroll', onScroll );
    })
    return scrollTop;
}

var useWave = ( n, radius ) => {
    var [ ww, wh ] = useWindowSize();
    return range( 0, n ).map( i => {
        var y = radius * 2 + i * radius * 2;
        var t = ( y - radius * 2 ) / ( wh - radius * 2 );
        var a = t * Math.PI;
        var x = ww / 2 + Math.sin( a ) * Math.min( 300, ww / 2 * .9 );
        return { x, y }
    })
}

var Wave = ({ data, radius }) => {
    // var scrollTop = useScrollTop();
    var items = flatten( chunk( data.projects, 10 ).map( ( projects, i ) => [
        ...String( 2019 - i ).split('').map( number => ({ type: 'number', number, year: 2019 - i }) ),
        ...projects.map( project => ({ type: 'project', project }) )
    ]))
    var positions = useWave( items.length, radius );
    return items.map( ( item, i ) => {
        switch ( item.type ) {
            case 'project':
                return (
                    <Thumbnail
                        key={ item.project.url }
                        project={ item.project }
                        position={ positions[ i ] }
                    />
                )
            case 'number':
                return (
                    <div
                        className="year-number"
                        key={ `${ item.year }_${ i }` }
                        style={ {
                            transform: `
                                translate(-50%, -50%)
                                translate( ${ positions[ i ].x }px, ${ positions[ i ].y }px )
                            `
                        } }
                    >{ item.number }</div>
                )
        }
    })
    return data.projects.map( ( project, i ) => (
        <Thumbnail
            key={ project.url }
            project={ project }
            position={ positions[ i ] }
        />
    ))
}

export default Wave;