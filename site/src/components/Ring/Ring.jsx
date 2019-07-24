import React, { useMemo } from 'react';

var Ring = ({ color, radius }) => {
    var offset = useMemo( () => {
        var x = Math.random() * 2 - 1;
        var y = Math.random() * 2 - 1;
        return `
            translate( -50%, -50% )
            translate( ${ x * 2 }px, ${ y * 2 }px )
        `
    }, [] );
    var style = {
        borderColor: color,
        transform: offset,
        width: radius * 2 + 'px',
        height: radius * 2 + 'px'
    }
    return (
        <div className="ring" style={ style }/>
    )
}

export default Ring;