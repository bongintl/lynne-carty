import React, { useMemo } from 'react';
import { Link } from "react-router-dom";
import useWindowSize from '../hooks/useWindowSize';
import useIsMobile from '../hooks/useIsMobile';

var offsets = {};
var getOffset = key => {
    if ( !offsets[ key ] ) {
        var x = Math.random() * 2 - 1;
        var y = Math.random() * 2 - 1;
        console.log( x, y );
        offsets[ key ] = `translate( ${ x * 7 }%, ${ y * 7 }% )`
    }
    return offsets[ key ];
}

var Ring = ({ color }) => {
    var offset = useMemo( () => {
        var x = Math.random() * 2 - 1;
        var y = Math.random() * 2 - 1;
        return `translate( ${ x * 5 }%, ${ y * 5 }% )`
    }, [] );
    return (
        <div
            className="thumbnail__ring"
            style={{ borderColor: color, transform: offset }}
        />
    )
}

var Thumbnail = ({ project, x, y, r, colors }) => (
    <Link
        to={ project.url }
        className="thumbnail"
        style={{
            width: r * 2 + 'px',
            height: r * 2 + 'px',
            transform: `
                translate( -50%, -50% )
                translate( ${ x }px, ${ y }px )
            `
        }}
    >
        { useIsMobile() && project.tags.map( tag => (
            <Ring key={ tag } color={ colors[ tag ] }/>
        )) }
        <img src={ project.thumbnail }/>
    </Link>
)

export default Thumbnail;